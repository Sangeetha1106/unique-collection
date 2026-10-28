/**
 * UNIQUE COLLECTION - Cart & Wishlist Module
 * Handles client-side cart storage (localStorage), item updates, totals, and badge counts.
 */

(function () {
  'use strict';

  const CART_STORAGE_KEY = 'unique_collection_cart';
  const WISHLIST_STORAGE_KEY = 'unique_collection_wishlist';
  const ORDERS_STORAGE_KEY = 'unique_collection_orders';
  const LAST_ORDER_STORAGE_KEY = 'unique_collection_last_order';
  const BUY_NOW_STORAGE_KEY = 'unique_collection_buynow';

  const CartService = {
    /**
     * Retrieve current cart items from localStorage
     * @returns {Array} List of cart item objects
     */
    getItems: function () {
      try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.error('Error loading cart data from localStorage', err);
        return [];
      }
    },

    /**
     * Save cart items array to localStorage
     * @param {Array} items
     */
    saveItems: function (items) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        this.updateCartBadges();
      } catch (err) {
        console.error('Error saving cart data to localStorage', err);
      }
    },

    /**
     * Retrieve active Buy Now item from sessionStorage/localStorage
     * @returns {Object|null}
     */
    getBuyNowItem: function () {
      try {
        const rawSession = sessionStorage.getItem(BUY_NOW_STORAGE_KEY);
        if (rawSession) return JSON.parse(rawSession);
      } catch (err) {}
      try {
        const rawLocal = localStorage.getItem(BUY_NOW_STORAGE_KEY);
        if (rawLocal) return JSON.parse(rawLocal);
      } catch (err) {}
      return null;
    },

    /**
     * Set active Buy Now item
     * @param {Object} item
     */
    setBuyNowItem: function (item) {
      try {
        sessionStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(item));
      } catch (err) {}
      try {
        localStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(item));
      } catch (err) {}
    },

    /**
     * Clear Buy Now item after purchase or when leaving flow
     */
    clearBuyNowItem: function () {
      try {
        sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
      } catch (err) {}
      try {
        localStorage.removeItem(BUY_NOW_STORAGE_KEY);
      } catch (err) {}
    },

    /**
     * Add product to cart with chosen size, quantity & color variation
     * @param {Object} product
     * @param {string} [size='Standard']
     * @param {number} [quantity=1]
     * @param {string} [color='']
     * @returns {boolean} Whether item was successfully added
     */
    addItem: function (product, size, quantity, color) {
      if (!product || !product.id) return false;

      const maxStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : 15;
      if (product.inStock === false || maxStock === 0) {
        this.showToast(`Sorry, "${product.name}" is currently out of stock.`, 'info');
        return false;
      }

      const chosenSize = size || product.defaultSize || 'Standard';
      const chosenColor = (color || product.color || '').trim();
      const normChosenColor = chosenColor.toLowerCase();
      const qty = parseInt(quantity, 10) || 1;

      const items = this.getItems();
      const existingIndex = items.findIndex(item => 
        item.id === product.id && 
        item.size === chosenSize && 
        ((item.color || '').trim().toLowerCase()) === normChosenColor
      );

      if (existingIndex > -1) {
        const currentQty = items[existingIndex].quantity || 0;
        if (currentQty >= maxStock) {
          this.showToast(`Maximum available stock reached (${maxStock} units).`, 'info');
          return false;
        }
        const updatedQty = Math.min(currentQty + qty, maxStock);
        items[existingIndex].quantity = updatedQty;
        items[existingIndex].maxStock = maxStock;
      } else {
        const itemImg = (Array.isArray(product.images) && product.images.length > 0) ? product.images[0] : (product.image || '');
        items.push({
          id: product.id,
          name: product.name,
          category: product.category,
          price: Number(product.price),
          originalPrice: Number(product.originalPrice || product.price),
          image: itemImg,
          size: chosenSize,
          color: chosenColor,
          quantity: Math.min(qty, maxStock),
          maxStock: maxStock,
          addedAt: new Date().toISOString()
        });
      }

      this.saveItems(items);
      const variantStr = [chosenSize, chosenColor].filter(Boolean).join(' • ');
      this.showToast(`"${product.name}" (${variantStr}) added to your cart!`, 'success');
      return true;
    },

    /**
     * Update quantity of an item in cart
     * Enforces minimum 1 and maximum available stock
     * @param {string|number} itemId
     * @param {string} size
     * @param {number} value New quantity or delta
     * @param {boolean} [isDelta=false] If true, adds value to current quantity
     * @param {string} [color=null] Optional color match
     * @returns {number} Updated quantity
     */
    updateQuantity: function (itemId, size, value, isDelta = false, color = null) {
      const items = this.getItems();
      const normColor = color !== null && color !== undefined ? color.trim().toLowerCase() : null;
      const item = items.find(i => {
        if (i.id !== itemId || i.size !== size) return false;
        if (normColor !== null) {
          return ((i.color || '').trim().toLowerCase()) === normColor;
        }
        return true;
      });
      if (!item) return 1;

      const maxStock = typeof item.maxStock === 'number' ? item.maxStock : 15;
      let newQty = isDelta ? (item.quantity || 1) + Number(value) : parseInt(value, 10);

      if (isNaN(newQty) || newQty < 1) {
        newQty = 1;
      }

      if (newQty > maxStock) {
        newQty = maxStock;
        this.showToast(`Maximum available stock is ${maxStock} units`, 'info');
      }

      item.quantity = newQty;
      this.saveItems(items);
      return newQty;
    },

    /**
     * Dedicated Buy Now flow: stores only the selected product and redirects directly to checkout.
     * Does NOT touch or pollute the customer's regular shopping cart.
     * @param {Object} product
     * @param {string} [size='Standard']
     * @param {number} [quantity=1]
     * @param {string} [color='']
     */
    buyNow: function (product, size, quantity, color) {
      if (!product) return;
      if (product.inStock === false) {
        this.showToast(`Sorry, "${product.name}" is currently out of stock.`, 'info');
        return;
      }

      const chosenSize = size || product.defaultSize || (product.sizes && product.sizes[0]) || 'Standard';
      const chosenColor = color || (product.colors && product.colors[0]) || product.color || '';
      const chosenQty = Number(quantity) > 0 ? Number(quantity) : 1;

      const buyNowItem = {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        discount: product.discount || null,
        image: product.image,
        size: chosenSize,
        color: chosenColor,
        quantity: chosenQty,
        category: product.category || ''
      };

      this.setBuyNowItem(buyNowItem);

      const isSubPage = window.location.pathname.includes('/pages/') || 
                        window.location.href.includes('/pages/');
      const checkoutUrl = isSubPage ? 'checkout.html?mode=buynow' : 'pages/checkout.html?mode=buynow';
      window.location.href = checkoutUrl;
    },

    /**
     * Remove item from cart by identifier, size, and optional color
     * @param {string|number} itemId
     * @param {string} [size]
     * @param {string} [color]
     */
    removeItem: function (itemId, size, color) {
      let items = this.getItems();
      const normColor = color !== null && color !== undefined ? color.trim().toLowerCase() : null;
      const matchFn = (item) => {
        if (item.id !== itemId) return false;
        if (size && item.size !== size) return false;
        if (normColor !== null) {
          return ((item.color || '').trim().toLowerCase()) === normColor;
        }
        return true;
      };
      const removedItem = items.find(matchFn);
      items = items.filter(item => !matchFn(item));
      this.saveItems(items);
      const name = removedItem ? `"${removedItem.name}"` : 'Item';
      this.showToast(`${name} removed from your cart`, 'info');
    },

    /**
     * Clear all items from cart
     */
    clearCart: function () {
      this.saveItems([]);
      this.showToast('Shopping cart cleared', 'info');
    },

    /**
     * Calculate cart subtotal (sum of unit price * quantity)
     * @returns {number}
     */
    getSubtotal: function () {
      const items = this.getItems();
      return items.reduce((total, item) => total + (Number(item.price) * (item.quantity || 1)), 0);
    },

    /**
     * Calculate cart original MRP total
     * @returns {number}
     */
    getOriginalTotal: function () {
      const items = this.getItems();
      return items.reduce((total, item) => total + (Number(item.originalPrice || item.price) * (item.quantity || 1)), 0);
    },

    /**
     * Calculate total savings off MRP
     * @returns {number}
     */
    getSavings: function () {
      return Math.max(0, this.getOriginalTotal() - this.getSubtotal());
    },

    /**
     * Calculate shipping fee (Free for ₹999+)
     * @param {number} [subtotal]
     * @returns {number}
     */
    getShippingFee: function (subtotal) {
      const amt = typeof subtotal === 'number' ? subtotal : this.getSubtotal();
      if (amt === 0) return 0;
      return amt >= 999 ? 0 : 99;
    },

    /**
     * Get total quantity of items in cart
     * @returns {number}
     */
    getItemCount: function () {
      const items = this.getItems();
      return items.reduce((total, item) => total + (item.quantity || 1), 0);
    },

    /**
     * Update all cart badge DOM elements on the current page
     */
    updateCartBadges: function () {
      const count = this.getItemCount();
      const badges = document.querySelectorAll('.cart-count-badge');
      badges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
          badge.classList.remove('hidden');
          badge.classList.add('badge-bounce');
          setTimeout(() => badge.classList.remove('badge-bounce'), 400);
        } else {
          badge.classList.remove('hidden');
        }
      });
    },

    /* =========================================================================
       WISHLIST FUNCTIONALITY
       ========================================================================= */
    getWishlist: function () {
      try {
        const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.error('Error loading wishlist data', err);
        return [];
      }
    },

    saveWishlist: function (items) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
        this.updateWishlistBadges();
      } catch (err) {
        console.error('Error saving wishlist', err);
      }
    },

    isWishlisted: function (productId) {
      const list = this.getWishlist();
      return list.some(item => item.id === productId);
    },

    toggleWishlist: function (product) {
      if (!product || !product.id) return false;
      let list = this.getWishlist();
      const exists = list.some(item => item.id === product.id);

      if (exists) {
        list = list.filter(item => item.id !== product.id);
        this.saveWishlist(list);
        this.showToast(`Removed "${product.name}" from Wishlist`, 'info');
        return false;
      } else {
        list.push({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          addedAt: new Date().toISOString()
        });
        this.saveWishlist(list);
        this.showToast(`Added "${product.name}" to Wishlist!`, 'success');
        return true;
      }
    },

    getWishlistCount: function () {
      return this.getWishlist().length;
    },

    updateWishlistBadges: function () {
      const count = this.getWishlistCount();
      const badges = document.querySelectorAll('.wishlist-count-badge');
      badges.forEach(badge => {
        badge.textContent = count;
      });
    },

    /* =========================================================================
       ORDER & CHECKOUT FUNCTIONALITY (STEP 5 & 6)
       ========================================================================= */
    getOrders: function (userFilter) {
      try {
        const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
        const orders = raw ? JSON.parse(raw) : [];
        if (!userFilter) return orders;

        return orders.filter(o => {
          if (typeof userFilter === 'string') {
            const filterLower = userFilter.toLowerCase();
            return (o.userId === userFilter) ||
                   (o.userEmail && o.userEmail.toLowerCase() === filterLower) ||
                   (o.customer && o.customer.email && o.customer.email.toLowerCase() === filterLower);
          }
          if (userFilter && typeof userFilter === 'object') {
            const userId = userFilter.id;
            const userEmail = (userFilter.email || '').toLowerCase();
            return (userId && o.userId === userId) ||
                   (userEmail && o.userEmail && o.userEmail.toLowerCase() === userEmail) ||
                   (userEmail && o.customer && o.customer.email && o.customer.email.toLowerCase() === userEmail);
          }
          return true;
        });
      } catch (err) {
        console.error('Error loading orders from localStorage', err);
        return [];
      }
    },

    saveOrders: function (orders) {
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } catch (err) {
        console.error('Error saving orders to localStorage', err);
      }
    },

    getLastOrder: function () {
      try {
        const raw = localStorage.getItem(LAST_ORDER_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (err) {
        console.error('Error loading last order', err);
        return null;
      }
    },

    getOrderById: function (orderId) {
      if (!orderId) return null;
      const orders = this.getOrders();
      return orders.find(o => o.orderId === orderId) || null;
    },

    createOrder: function (customerData, customItems) {
      const isCustomCheckout = Array.isArray(customItems) && customItems.length > 0;
      const items = isCustomCheckout ? customItems : this.getItems();
      
      if (!items || items.length === 0) {
        this.showToast('Your order has no items to process.', 'info');
        return null;
      }

      // Step 6: Link with authenticated user session if present
      const currentUser = (window.AuthService && window.AuthService.getCurrentUser)
        ? window.AuthService.getCurrentUser()
        : null;

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const timestamp = Date.now().toString().slice(-6);
      const orderId = `UC-${timestamp}-${randomSuffix}`;

      let subtotal = 0;
      let savings = 0;
      let itemCount = 0;

      items.forEach(item => {
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        itemCount += qty;
        subtotal += price * qty;
        if (item.originalPrice && Number(item.originalPrice) > price) {
          savings += (Number(item.originalPrice) - price) * qty;
        }
      });

      const shippingFee = this.getShippingFee(subtotal);
      const total = subtotal + shippingFee;

      const newOrder = {
        orderId: orderId,
        userId: currentUser ? currentUser.id : null,
        userEmail: currentUser ? currentUser.email : (customerData.email || null),
        orderDate: new Date().toISOString(),
        orderDateFormatted: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customer: {
          fullName: customerData.fullName,
          mobile: customerData.mobile,
          email: customerData.email,
          address: customerData.address,
          locality: customerData.locality,
          city: customerData.city,
          state: customerData.state,
          pincode: customerData.pincode,
          landmark: customerData.landmark || ''
        },
        paymentMethod: customerData.paymentMethod || 'Cash on Delivery',
        items: items.map(item => ({ ...item })),
        itemCount: itemCount,
        subtotal: subtotal,
        shippingFee: shippingFee,
        savings: savings,
        total: total,
        isDemo: false,
        isBuyNow: isCustomCheckout
      };

      // 1. Save to orders list and last order
      const orders = this.getOrders();
      orders.unshift(newOrder);
      this.saveOrders(orders);

      try {
        localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(newOrder));
      } catch (e) {
        console.error('Failed to set last order', e);
      }

      // 2. Clear items: If Buy Now, clear only the temporary Buy Now item; preserve the regular cart!
      if (isCustomCheckout) {
        this.clearBuyNowItem();
      } else {
        this.saveItems([]);
      }

      return newOrder;
    },

    /* =========================================================================
       TOAST NOTIFICATION HELPER
       ========================================================================= */
    showToast: function (message, type = 'info') {
      let toastContainer = document.getElementById('toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
        <span class="toast-message">${message}</span>
      `;

      toastContainer.appendChild(toast);

      // Trigger enter animation
      const raf = window.requestAnimationFrame || ((cb) => setTimeout(cb, 16));
      raf(() => {
        if (toast && toast.classList) toast.classList.add('toast-visible');
      });

      // Remove after 3 seconds
      setTimeout(() => {
        if (toast && toast.classList) toast.classList.remove('toast-visible');
        setTimeout(() => {
          if (toast && toast.parentElement) toast.parentElement.removeChild(toast);
        }, 300);
      }, 3000);
    }
  };

  // Expose to global window object
  window.CartService = CartService;

  // Initialize badges once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    CartService.updateCartBadges();
    CartService.updateWishlistBadges();
  });
})();
