/**
 * UNIQUE COLLECTION - Main Application Script
 * Orchestrates homepage, shop, and category listing interactions:
 * navigation, search filtering, dynamic catalog rendering,
 * price/size/color filtering, sorting, pagination, and modals.
 */

(function () {
  'use strict';

  // Global state
  let currentQuickViewProduct = null;
  let activeQuickViewSize = 'Standard';

  // Path resolution helper for relative links
  function isSubPage() {
    const p = (window.location.pathname || '').toLowerCase().replace(/\\/g, '/');
    const h = (window.location.href || '').toLowerCase().replace(/\\/g, '/');
    return p.includes('/pages/') || h.includes('/pages/');
  }

  function getPageUrl(pageFileName) {
    return isSubPage() ? pageFileName : `pages/${pageFileName}`;
  }

  function getRootUrl(fileName) {
    if (!fileName || typeof fileName !== 'string') return '';
    if (fileName.startsWith('http://') || fileName.startsWith('https://') || fileName.startsWith('//') || fileName.startsWith('data:')) {
      return fileName;
    }
    const cleanPath = fileName.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
    return isSubPage() ? `../${cleanPath}` : cleanPath;
  }

  /* =========================================================================
     1. Initialization on DOMContentLoaded
     ========================================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initNavDropdowns();
    initMobileNav();
    initSearchDrawer();
    initQuickViewModal();
    initNewsletterForm();

    // Homepage specific initializers
    if (document.getElementById('hero-slider')) {
      initHeroSlider();
    }
    if (document.getElementById('clothing-category-grid')) {
      renderCategoryGrids();
    }
    if (document.getElementById('new-arrivals-grid') || 
        document.getElementById('best-sellers-grid') || 
        document.getElementById('trending-grid')) {
      renderFeaturedProductSections();
    }

    // Shop with Styles page initializer (Reference Image 2)
    if (document.getElementById('shop-styles-grid')) {
      initShopWithStyles();
    }

    // Shop & Category listing page initializer
    if (document.getElementById('listing-products-grid')) {
      initListingPage();
    }

    // Step 4: Product Details page initializer
    if (document.getElementById('product-details-root')) {
      initProductDetailsPage();
    }

    // Step 4: Shopping Bag / Cart page initializer
    if (document.getElementById('cart-content-root')) {
      initCartPage();
    }

    // Step 5: Checkout page initializer
    if (document.getElementById('checkout-form')) {
      initCheckoutPage();
    }

    // Step 5: Order Confirmation page initializer
    if (document.getElementById('confirmation-content-root')) {
      initOrderConfirmationPage();
    }

    // Step 5 & 6: My Orders page initializer
    if (document.getElementById('my-orders-root')) {
      initMyOrdersPage();
    }

    // Step 6: Customer Login page initializer
    if (document.getElementById('login-form')) {
      initLoginPage();
    }

    // Step 6: Customer Registration page initializer
    if (document.getElementById('register-form')) {
      initRegisterPage();
    }

    // Step 6: User Profile page initializer
    if (document.getElementById('profile-edit-form')) {
      initProfilePage();
    }

    // Step 7: Wishlist page initializer
    if (document.getElementById('wishlist-root')) {
      initWishlistPage();
    }

    // Refresh wishlist & cart badges
    if (window.CartService) {
      window.CartService.updateCartBadges();
      window.CartService.updateWishlistBadges();
    }
  });

  /* =========================================================================
     2. Header Scroll Elevation
     ========================================================================= */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* =========================================================================
     3. Mobile Navigation Drawer & Accordions
     ========================================================================= */
  function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const closeBtn = document.getElementById('drawer-close-btn');

    if (!toggleBtn || !overlay) return;

    function openDrawer() {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDrawer();
    });

    // Mobile accordions for category dropdowns
    const accordionTriggers = document.querySelectorAll('.mobile-accordion-toggle');
    accordionTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const subMenu = document.getElementById(targetId);
        if (subMenu) {
          subMenu.classList.toggle('open');
          const icon = btn.querySelector('.mobile-chevron');
          if (icon) {
            icon.textContent = subMenu.classList.contains('open') ? '▲' : '▼';
          }
        }
      });
    });

    // Close drawer when any mobile nav link is clicked
    const drawerLinks = overlay.querySelectorAll('a:not(.mobile-accordion-toggle)');
    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  /* =========================================================================
     3b. Desktop & Tablet Dropdown Navigation Controller
     ========================================================================= */
  function initNavDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    dropdownItems.forEach(item => {
      const toggleLink = item.querySelector('.nav-link');
      const dropdown = item.querySelector('.nav-dropdown');

      if (!toggleLink || !dropdown) return;

      // Click to toggle on desktop & touch laptops
      toggleLink.addEventListener('click', (e) => {
        const isOpen = item.classList.contains('dropdown-open');

        // Close other dropdowns
        dropdownItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('dropdown-open');
            const otherLink = other.querySelector('.nav-link');
            if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
          }
        });

        if (!isOpen) {
          e.preventDefault(); // First click reveals dropdown
          item.classList.add('dropdown-open');
          toggleLink.setAttribute('aria-expanded', 'true');
        } else {
          // Second click navigates to parent category page
          item.classList.remove('dropdown-open');
          toggleLink.setAttribute('aria-expanded', 'false');
        }
      });

      // Mouse leave closes dropdown smoothly
      item.addEventListener('mouseleave', () => {
        item.classList.remove('dropdown-open');
        toggleLink.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item.has-dropdown')) {
        dropdownItems.forEach(item => {
          item.classList.remove('dropdown-open');
          const toggleLink = item.querySelector('.nav-link');
          if (toggleLink) toggleLink.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  /* =========================================================================
     4. Interactive Search Bar in Header
     ========================================================================= */
  function initSearchDrawer() {
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchForm = document.getElementById('header-search-form');
    const searchInput = document.getElementById('header-search-input');

    if (!searchToggleBtn || !searchOverlay) return;

    function openSearch() {
      searchOverlay.classList.add('active');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 150);
      }
    }

    function closeSearch() {
      searchOverlay.classList.remove('active');
      if (searchInput) searchInput.value = '';
      hideSearchResults();
    }

    searchToggleBtn.addEventListener('click', openSearch);
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        closeSearch();
      }
    });

    // Handle Search Submission
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput ? searchInput.value.trim() : '';
        if (document.getElementById('search-results-section')) {
          executeHomepageSearch(query);
        } else {
          // If on subpage, navigate to shop page with search query
          window.location.href = `${getPageUrl('shop.html')}?search=${encodeURIComponent(query)}`;
        }
      });
    }

    if (searchInput && document.getElementById('search-results-section')) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (query.length >= 2) {
          executeHomepageSearch(query);
        } else if (query.length === 0) {
          hideSearchResults();
        }
      });
    }
  }

  function executeHomepageSearch(query) {
    if (!window.ProductService) return;
    const results = window.ProductService.searchProducts(query);
    const searchResultsSection = document.getElementById('search-results-section');
    const resultsContainer = document.getElementById('search-results-grid');
    const querySpan = document.getElementById('search-query-display');
    const countSpan = document.getElementById('search-count-display');

    if (!searchResultsSection || !resultsContainer) return;

    searchResultsSection.style.display = 'block';
    if (querySpan) querySpan.textContent = `"${query}"`;
    if (countSpan) countSpan.textContent = `${results.length} item${results.length === 1 ? '' : 's'} found`;

    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #fff; border-radius: 8px; border: 1px solid var(--color-border);">
          <p style="font-size: 1.1rem; color: var(--color-dark); margin-bottom: 8px;">No demonstration products found matching "${query}".</p>
          <p style="font-size: 0.9rem; color: var(--color-text-muted);">Try searching for "churidar", "lehenga", "ring", "bangles", "gold chain", or "kada".</p>
        </div>
      `;
    } else {
      results.forEach(product => {
        resultsContainer.appendChild(createProductCardElement(product));
      });
    }

    searchResultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function hideSearchResults() {
    const searchResultsSection = document.getElementById('search-results-section');
    if (searchResultsSection) {
      searchResultsSection.style.display = 'none';
    }
  }

  /* =========================================================================
     4b. Hero Banner Dual-Slide Showcase
     ========================================================================= */
  function initHeroSlider() {
    const slider = document.getElementById('hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-slider-prev');
    const nextBtn = document.getElementById('hero-slider-next');

    if (slides.length <= 1) return;

    let currentSlide = 0;
    let timer = null;
    const intervalTime = 5500; // 5.5s autoplay

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
        dots[currentSlide].setAttribute('aria-selected', 'false');
      }

      currentSlide = (index + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-selected', 'true');
      }
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      timer = setInterval(nextSlide, intervalTime);
    }

    function stopAutoPlay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startAutoPlay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
        startAutoPlay();
      });
    });

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe support for mobile
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      stopAutoPlay();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) nextSlide();
        else prevSlide();
      }
      startAutoPlay();
    }, { passive: true });

    startAutoPlay();
  }

  /* =========================================================================
     5. Homepage Category Grids & Featured Sections
     ========================================================================= */
  function renderCategoryGrids() {
    if (!window.ProductService) return;
    const categories = window.ProductService.getCategories();

    const clothingContainer = document.getElementById('clothing-category-grid');
    if (clothingContainer) {
      clothingContainer.innerHTML = '';
      categories.filter(c => c.group === 'clothing').forEach(cat => {
        clothingContainer.appendChild(createCategoryCardElement(cat));
      });
    }

    const antiTarnishContainer = document.getElementById('anti-tarnish-category-grid');
    if (antiTarnishContainer) {
      antiTarnishContainer.innerHTML = '';
      categories.filter(c => c.group === 'anti-tarnish').forEach(cat => {
        antiTarnishContainer.appendChild(createCategoryCardElement(cat));
      });
    }

    const goldPlatedContainer = document.getElementById('gold-plated-category-grid');
    if (goldPlatedContainer) {
      goldPlatedContainer.innerHTML = '';
      categories.filter(c => c.group === 'gold-plated').forEach(cat => {
        goldPlatedContainer.appendChild(createCategoryCardElement(cat));
      });
    }
  }

  function createCategoryCardElement(cat) {
    const card = document.createElement('div');
    card.className = 'category-card';
    const catUrl = `${getPageUrl('category.html')}?cat=${encodeURIComponent(cat.slug)}`;
    const catImg = (cat.image && !cat.image.startsWith('http')) ? getRootUrl(cat.image) : cat.image;
    card.innerHTML = `
      <a href="${catUrl}" class="category-card-link-wrapper" aria-label="Explore ${cat.name}">
        <div class="category-img-wrap">
          <img src="${catImg}" alt="${cat.name} - UNIQUE COLLECTION" loading="lazy">
        </div>
      </a>
      <div class="category-info">
        <div>
          <h3 class="category-name"><a href="${catUrl}" style="color: inherit; text-decoration: none;">${cat.name}</a></h3>
          <p style="font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.4; margin-bottom: 8px;">${cat.description || ''}</p>
        </div>
        <a href="${catUrl}" class="category-explore-link">
          Explore Collection →
        </a>
      </div>
    `;
    return card;
  }

  function renderFeaturedProductSections() {
    if (!window.ProductService) return;
    const sections = [
      { id: 'new-arrivals-grid', key: 'new-arrivals' },
      { id: 'best-sellers-grid', key: 'best-sellers' },
      { id: 'trending-grid', key: 'trending' }
    ];

    sections.forEach(sec => {
      const container = document.getElementById(sec.id);
      if (container) {
        container.innerHTML = '';
        const products = window.ProductService.getProductsBySection(sec.key);
        products.forEach(prod => {
          container.appendChild(createProductCardElement(prod));
        });
      }
    });
  }

  /* =========================================================================
     6. Unified Product Card Component Builder
     ========================================================================= */
  function createProductCardElement(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    const isWishlisted = window.CartService ? window.CartService.isWishlisted(product.id) : false;
    const productUrl = `${getPageUrl('product-details.html')}?id=${product.id}`;
    const isInStock = product.inStock !== false;

    const prodImg = getRootUrl(product.image);

    card.innerHTML = `
      <div class="product-media">
        <a href="${productUrl}" class="product-media-link" aria-label="View ${product.name}">
          <img src="${prodImg}" alt="${product.name}" loading="lazy">
        </a>
        
        <button type="button" class="btn-wishlist ${isWishlisted ? 'active' : ''}" aria-label="Add to wishlist" data-id="${product.id}">
          <svg class="wishlist-icon" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      <div class="product-content">
        <span class="stock-badge-tag ${isInStock ? 'in-stock' : 'out-stock'}">
          ${isInStock ? 'In Stock' : 'Out of Stock'}
        </span>
        <span class="product-category-tag">${product.category}</span>
        <h3 class="product-name">
          <a href="${productUrl}">${product.name}</a>
        </h3>

        <div class="product-pricing">
          <span class="price-current">${window.ProductService.formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="price-original">${window.ProductService.formatPrice(product.originalPrice)}</span>` : ''}
          ${product.discount ? `<span class="price-discount-tag">${product.discount}</span>` : ''}
        </div>

        <div class="product-card-actions">
          <button type="button" class="btn-add-cart" data-id="${product.id}" ${!isInStock ? 'disabled style="opacity: 0.6; cursor: not-allowed;"' : ''}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            ${isInStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <a href="${productUrl}" class="btn-view-card" aria-label="View ${product.name}">
            View
          </a>
        </div>

        <span class="demo-tag">Demonstration Product</span>
      </div>
    `;

    // Attach Wishlist click handler
    const wishlistBtn = card.querySelector('.btn-wishlist');
    wishlistBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.CartService) {
        const added = window.CartService.toggleWishlist(product);
        if (added) {
          wishlistBtn.classList.add('active');
        } else {
          wishlistBtn.classList.remove('active');
        }
      }
    });

    // Attach Add to Cart click handler
    const addBtn = card.querySelector('.btn-add-cart');
    if (isInStock) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.CartService) {
          window.CartService.addItem(product, product.defaultSize || 'Standard', 1, product.color || '');

          addBtn.classList.add('added-success');
          addBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Added ✓
          `;
          setTimeout(() => {
            addBtn.classList.remove('added-success');
            addBtn.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Add to Cart
            `;
          }, 1500);
        }
      });
    }

    return card;
  }

  /* =========================================================================
     6b. Shop with Styles Controller (Reference Image 2)
     ========================================================================= */
  function initShopWithStyles() {
    const grid = document.getElementById('shop-styles-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.style-card');
    const tabButtons = document.querySelectorAll('.styles-tab-btn[data-style-filter]');
    const searchInput = document.getElementById('styles-search-input');
    const emptyState = document.getElementById('styles-empty-state');
    const resetSearchBtn = document.getElementById('reset-styles-search');

    let currentTab = 'all';
    let currentSearch = '';

    function filterCards() {
      let visibleCount = 0;
      cards.forEach(card => {
        const group = card.getAttribute('data-group') || '';
        const name = (card.getAttribute('data-name') || '').toLowerCase();

        const matchesTab = (currentTab === 'all') || (group === currentTab);
        const matchesSearch = !currentSearch || name.includes(currentSearch);

        if (matchesTab && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.getAttribute('data-style-filter') || 'all';
        filterCards();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim().toLowerCase();
        filterCards();
      });
    }

    if (resetSearchBtn) {
      resetSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        currentSearch = '';
        currentTab = 'all';
        tabButtons.forEach(b => {
          if (b.getAttribute('data-style-filter') === 'all') b.classList.add('active');
          else b.classList.remove('active');
        });
        filterCards();
      });
    }
  }

  /* =========================================================================
     7. Shop & Category Listing Page Controller (Filtering, Sorting, Load More)
     ========================================================================= */
  function initListingPage() {
    if (!window.ProductService) return;

    // Parse URL query parameters (supports both 'cat' and 'category')
    const urlParams = new URLSearchParams(window.location.search);
    const rawCat = urlParams.get('cat') || urlParams.get('category') || 'all';
    const initialCategoryParam = window.ProductService.normalizeCategorySlug ? window.ProductService.normalizeCategorySlug(rawCat) : rawCat;
    const initialSearchParam = urlParams.get('search') || '';
    const initialSortParam = urlParams.get('sort') || 'recommended';
    const initialFilterParam = urlParams.get('filter') || ''; // 'new', 'offers'

    // Determine category group or slug
    let initialGroup = '';
    let initialCategorySlug = 'all';

    if (['clothing', 'anti-tarnish', 'gold-plated', 'jewellery'].includes(initialCategoryParam)) {
      initialGroup = initialCategoryParam;
    } else if (initialCategoryParam !== 'all') {
      initialCategorySlug = initialCategoryParam;
    }

    // Listing Filter State
    const filterState = {
      categorySlug: initialCategorySlug,
      group: initialGroup,
      searchQuery: initialSearchParam,
      minPrice: 0,
      maxPrice: 15000,
      size: 'all',
      color: 'all',
      inStockOnly: false,
      sortBy: initialSortParam,
      pageSize: 12,
      visibleCount: 12
    };

    // Special quick filter: new arrivals or offers
    if (initialFilterParam === 'new') {
      filterState.sortBy = 'newest';
    }

    // Populate Page Header (if Category Page)
    setupCategoryHeaderInfo(initialCategoryParam);

    // Initialize Modern UI Elements (Top category navigation row, catalog search, sort)
    setupTopCategoryPills(filterState);
    setupCatalogSearch(filterState);
    setupSortDropdown(filterState);
    setupResetCatalogButton(filterState);
    setupLoadMoreButton(filterState);

    // Safe fallbacks for sidebar handlers if elements exist
    setupSidebarCategories(filterState);
    setupSidebarSizes(filterState);
    setupSidebarColors(filterState);
    setupPriceFilter(filterState);
    setupSidebarSearch(filterState);
    setupInStockToggle(filterState);
    setupClearFiltersButton(filterState);
    setupMobileFilterDrawer();

    // Initial Render
    renderFilteredProducts(filterState);
  }

  function setupCategoryHeaderInfo(categoryParam) {
    const heroTitle = document.getElementById('listing-page-title');
    const heroDesc = document.getElementById('listing-page-desc');
    const breadcrumbCurrent = document.getElementById('breadcrumb-current-page');
    const groupBadge = document.getElementById('listing-group-badge');

    if (!heroTitle) return;

    const normalized = window.ProductService.normalizeCategorySlug ? window.ProductService.normalizeCategorySlug(categoryParam) : categoryParam;

    if (!normalized || normalized === 'all') {
      heroTitle.textContent = 'All Collections';
      if (heroDesc) heroDesc.textContent = "Explore our complete showcase of handcrafted Indian ethnic wear, anti-tarnish jewellery, and gold-plated treasures.";
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'All Collections';
      if (groupBadge) groupBadge.textContent = 'Complete Store Edit';
      return;
    }

    // Check if group
    if (normalized === 'clothing' || normalized === 'collections') {
      heroTitle.textContent = "Collections";
      if (heroDesc) heroDesc.textContent = "Churidhar sets, royal lehengas, pure cotton leggings, trendy shararas, and comfort innerwear.";
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Collections";
      if (groupBadge) groupBadge.textContent = "Collections";
    } else if (normalized === 'anti-tarnish') {
      heroTitle.textContent = "Anti-Tarnish Waterproof Jewellery";
      if (heroDesc) heroDesc.textContent = "18K PVD coated titanium steel bracelets, kadas, rings, anklets, and fancy bangles that resist water and sweat.";
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Anti-Tarnish Jewellery";
      if (groupBadge) groupBadge.textContent = "Waterproof Luxury";
    } else if (normalized === 'gold-plated') {
      heroTitle.textContent = "Gold-Plated & Covering Collection";
      if (heroDesc) heroDesc.textContent = "Heritage 1-gram micro gold-plated chains, guaranteed earrings, and traditional South Indian covering bangles.";
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Gold-Plated Jewellery";
      if (groupBadge) groupBadge.textContent = "1-Year Plating Guarantee";
    } else if (normalized === 'jewellery') {
      heroTitle.textContent = "Fine Jewellery Collections";
      if (heroDesc) heroDesc.textContent = "Explore our waterproof anti-tarnish and authentic gold-covering jewellery edits.";
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Jewellery";
      if (groupBadge) groupBadge.textContent = "Jewellery Catalog";
    } else {
      // Specific Category Slug
      const categoryObj = window.ProductService.getCategoryBySlug(normalized);
      if (categoryObj) {
        heroTitle.textContent = categoryObj.name;
        if (heroDesc) heroDesc.textContent = categoryObj.description;
        if (breadcrumbCurrent) breadcrumbCurrent.textContent = categoryObj.name;
        if (groupBadge) groupBadge.textContent = categoryObj.badge || 'Category Edit';
        document.title = `${categoryObj.name} | UNIQUE COLLECTION`;
      }
    }
  }

  /* =========================================================================
     Clean Top Category Navigation Row & Search (Wild Wolven Reference Layout)
     ========================================================================= */
  function setupTopCategoryPills(filterState) {
    const container = document.getElementById('top-category-pills');
    if (!container) return;

    const categories = window.ProductService.getCategories();
    const totalAllCount = window.ProductService.getAllProducts().length;

    const isAllActive = (filterState.categorySlug === 'all' && !filterState.group);

    let html = `
      <button type="button" class="category-pill-btn ${isAllActive ? 'active' : ''}" data-slug="all">
        <span>All</span> <span class="pill-badge">${totalAllCount}</span>
      </button>
    `;

    categories.forEach(cat => {
      const count = window.ProductService.getProductsByCategory(cat.slug).length;
      const isActive = filterState.categorySlug === cat.slug;
      html += `
        <button type="button" class="category-pill-btn ${isActive ? 'active' : ''}" data-slug="${cat.slug}" title="${cat.name}">
          <span>${cat.name}</span> <span class="pill-badge">${count}</span>
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.category-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slug = btn.getAttribute('data-slug');
        container.querySelectorAll('.category-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (slug === 'all') {
          filterState.categorySlug = 'all';
          filterState.group = '';
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('cat');
            url.searchParams.delete('category');
            url.searchParams.delete('group');
            window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
          } catch (e) {}
          setupCategoryHeaderInfo('all');
        } else {
          filterState.categorySlug = slug;
          filterState.group = '';
          try {
            const url = new URL(window.location.href);
            url.searchParams.set('cat', slug);
            url.searchParams.delete('group');
            window.history.pushState({}, '', url.pathname + '?' + url.searchParams.toString());
          } catch (e) {}
          setupCategoryHeaderInfo(slug);
        }

        filterState.visibleCount = filterState.pageSize;
        renderFilteredProducts(filterState);
      });
    });
  }

  function setupCatalogSearch(filterState) {
    const searchInput = document.getElementById('catalog-search-input');
    const clearBtn = document.getElementById('catalog-search-clear');
    if (!searchInput) return;

    if (filterState.searchQuery) {
      searchInput.value = filterState.searchQuery;
      if (clearBtn) clearBtn.style.display = 'block';
    }

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      filterState.searchQuery = q;
      filterState.visibleCount = filterState.pageSize;
      if (clearBtn) {
        clearBtn.style.display = q ? 'block' : 'none';
      }
      renderFilteredProducts(filterState);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        filterState.searchQuery = '';
        filterState.visibleCount = filterState.pageSize;
        searchInput.focus();
        renderFilteredProducts(filterState);
      });
    }
  }

  function setupResetCatalogButton(filterState) {
    const resetBtn = document.getElementById('btn-reset-catalog');
    if (!resetBtn) return;

    resetBtn.addEventListener('click', () => {
      filterState.categorySlug = 'all';
      filterState.group = '';
      filterState.searchQuery = '';
      filterState.minPrice = 0;
      filterState.maxPrice = 15000;
      filterState.size = 'all';
      filterState.color = 'all';
      filterState.inStockOnly = false;
      filterState.sortBy = 'recommended';
      filterState.visibleCount = filterState.pageSize;

      const searchInput = document.getElementById('catalog-search-input');
      const clearBtn = document.getElementById('catalog-search-clear');
      if (searchInput) searchInput.value = '';
      if (clearBtn) clearBtn.style.display = 'none';

      const sortSelect = document.getElementById('listing-sort-select');
      if (sortSelect) sortSelect.value = 'recommended';

      const pillsContainer = document.getElementById('top-category-pills');
      if (pillsContainer) {
        pillsContainer.querySelectorAll('.category-pill-btn').forEach(b => {
          if (b.getAttribute('data-slug') === 'all') {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
      }

      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('cat');
        url.searchParams.delete('category');
        url.searchParams.delete('search');
        url.searchParams.delete('filter');
        window.history.pushState({}, '', url.pathname);
      } catch (e) {}

      setupCategoryHeaderInfo('all');
      renderFilteredProducts(filterState);
    });
  }

  function setupSidebarCategories(filterState) {
    const container = document.getElementById('sidebar-categories-list');
    if (!container) return;

    const categories = window.ProductService.getCategories();
    container.innerHTML = `
      <div class="filter-category-item">
        <button type="button" class="filter-category-btn ${filterState.categorySlug === 'all' && !filterState.group ? 'active' : ''}" data-slug="all">
          <span>All Categories</span>
          <span class="filter-category-count">${window.ProductService.getAllProducts().length}</span>
        </button>
      </div>
    `;

    categories.forEach(cat => {
      const count = window.ProductService.getProductsByCategory(cat.slug).length;
      const item = document.createElement('div');
      item.className = 'filter-category-item';
      item.innerHTML = `
        <button type="button" class="filter-category-btn ${filterState.categorySlug === cat.slug ? 'active' : ''}" data-slug="${cat.slug}">
          <span>${cat.name}</span>
          <span class="filter-category-count">${count}</span>
        </button>
      `;

      item.querySelector('button').addEventListener('click', () => {
        filterState.categorySlug = cat.slug;
        filterState.group = '';
        filterState.visibleCount = filterState.pageSize;

        container.querySelectorAll('.filter-category-btn').forEach(b => b.classList.remove('active'));
        item.querySelector('button').classList.add('active');

        setupCategoryHeaderInfo(cat.slug);
        renderFilteredProducts(filterState);
      });

      container.appendChild(item);
    });

    // "All Categories" button handler
    const allBtn = container.querySelector('[data-slug="all"]');
    if (allBtn) {
      allBtn.addEventListener('click', () => {
        filterState.categorySlug = 'all';
        filterState.group = '';
        filterState.visibleCount = filterState.pageSize;

        container.querySelectorAll('.filter-category-btn').forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');

        setupCategoryHeaderInfo('all');
        renderFilteredProducts(filterState);
      });
    }
  }

  function setupSidebarSizes(filterState) {
    const container = document.getElementById('sidebar-sizes-list');
    if (!container) return;

    const sizes = window.ProductService.getAvailableSizes();
    container.innerHTML = `
      <button type="button" class="size-filter-btn ${filterState.size === 'all' ? 'active' : ''}" data-size="all">All</button>
    `;

    sizes.forEach(sz => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `size-filter-btn ${filterState.size === sz ? 'active' : ''}`;
      btn.textContent = sz;
      btn.addEventListener('click', () => {
        filterState.size = filterState.size === sz ? 'all' : sz;
        filterState.visibleCount = filterState.pageSize;

        container.querySelectorAll('.size-filter-btn').forEach(b => b.classList.remove('active'));
        if (filterState.size !== 'all') {
          btn.classList.add('active');
        } else {
          container.querySelector('[data-size="all"]').classList.add('active');
        }

        renderFilteredProducts(filterState);
      });
      container.appendChild(btn);
    });

    const allBtn = container.querySelector('[data-size="all"]');
    if (allBtn) {
      allBtn.addEventListener('click', () => {
        filterState.size = 'all';
        filterState.visibleCount = filterState.pageSize;
        container.querySelectorAll('.size-filter-btn').forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');
        renderFilteredProducts(filterState);
      });
    }
  }

  function setupSidebarColors(filterState) {
    const container = document.getElementById('sidebar-colors-list');
    if (!container) return;

    const colors = window.ProductService.getAvailableColors();
    const colorHexMap = {
      'Pink': '#C76A91',
      'Gold': '#C5A15B',
      'Silver': '#c0c0c0',
      'Green': '#2d6a4f',
      'Red': '#b5264b',
      'Black': '#171316'
    };

    container.innerHTML = `
      <button type="button" class="color-filter-btn ${filterState.color === 'all' ? 'active' : ''}" data-color="all">
        <span>All</span>
      </button>
    `;

    colors.forEach(col => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `color-filter-btn ${filterState.color.toLowerCase() === col.toLowerCase() ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="color-dot" style="background-color: ${colorHexMap[col] || '#ccc'};"></span>
        <span>${col}</span>
      `;

      btn.addEventListener('click', () => {
        filterState.color = filterState.color.toLowerCase() === col.toLowerCase() ? 'all' : col;
        filterState.visibleCount = filterState.pageSize;

        container.querySelectorAll('.color-filter-btn').forEach(b => b.classList.remove('active'));
        if (filterState.color !== 'all') {
          btn.classList.add('active');
        } else {
          container.querySelector('[data-color="all"]').classList.add('active');
        }

        renderFilteredProducts(filterState);
      });

      container.appendChild(btn);
    });

    const allBtn = container.querySelector('[data-color="all"]');
    if (allBtn) {
      allBtn.addEventListener('click', () => {
        filterState.color = 'all';
        filterState.visibleCount = filterState.pageSize;
        container.querySelectorAll('.color-filter-btn').forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');
        renderFilteredProducts(filterState);
      });
    }
  }

  function setupPriceFilter(filterState) {
    const slider = document.getElementById('price-range-slider');
    const minInput = document.getElementById('price-min-input');
    const maxInput = document.getElementById('price-max-input');
    const maxDisplay = document.getElementById('price-slider-max-display');

    if (!slider || !maxInput) return;

    function applyPriceChange(newMax) {
      const val = parseInt(newMax, 10) || 15000;
      filterState.maxPrice = val;
      slider.value = val;
      maxInput.value = val;
      if (maxDisplay) maxDisplay.textContent = `₹${val.toLocaleString('en-IN')}`;
      filterState.visibleCount = filterState.pageSize;
      renderFilteredProducts(filterState);
    }

    slider.addEventListener('input', (e) => {
      applyPriceChange(e.target.value);
    });

    maxInput.addEventListener('change', (e) => {
      applyPriceChange(e.target.value);
    });

    if (minInput) {
      minInput.addEventListener('change', (e) => {
        filterState.minPrice = parseInt(e.target.value, 10) || 0;
        filterState.visibleCount = filterState.pageSize;
        renderFilteredProducts(filterState);
      });
    }
  }

  function setupSortDropdown(filterState) {
    const sortSelect = document.getElementById('listing-sort-select');
    if (!sortSelect) return;

    sortSelect.value = filterState.sortBy || 'recommended';
    sortSelect.addEventListener('change', (e) => {
      filterState.sortBy = e.target.value;
      filterState.visibleCount = filterState.pageSize;
      renderFilteredProducts(filterState);
    });
  }

  function setupSidebarSearch(filterState) {
    const input = document.getElementById('sidebar-search-input');
    if (!input) return;

    input.value = filterState.searchQuery || '';
    input.addEventListener('input', () => {
      filterState.searchQuery = input.value.trim();
      filterState.visibleCount = filterState.pageSize;
      renderFilteredProducts(filterState);
    });
  }

  function setupInStockToggle(filterState) {
    const checkbox = document.getElementById('in-stock-only-checkbox');
    if (!checkbox) return;

    checkbox.checked = filterState.inStockOnly;
    checkbox.addEventListener('change', (e) => {
      filterState.inStockOnly = e.target.checked;
      filterState.visibleCount = filterState.pageSize;
      renderFilteredProducts(filterState);
    });
  }

  function setupClearFiltersButton(filterState) {
    const clearBtn = document.getElementById('btn-clear-all-filters');
    if (!clearBtn) return;

    clearBtn.addEventListener('click', () => {
      resetFilters(filterState);
    });
  }

  function resetFilters(filterState) {
    filterState.categorySlug = 'all';
    filterState.group = '';
    filterState.searchQuery = '';
    filterState.minPrice = 0;
    filterState.maxPrice = 15000;
    filterState.size = 'all';
    filterState.color = 'all';
    filterState.inStockOnly = false;
    filterState.sortBy = 'recommended';
    filterState.visibleCount = filterState.pageSize;

    // Reset Form UI
    const searchInput = document.getElementById('sidebar-search-input');
    if (searchInput) searchInput.value = '';

    const slider = document.getElementById('price-range-slider');
    const maxInput = document.getElementById('price-max-input');
    const maxDisplay = document.getElementById('price-slider-max-display');
    if (slider) slider.value = 15000;
    if (maxInput) maxInput.value = 15000;
    if (maxDisplay) maxDisplay.textContent = '₹15,000';

    const inStockBox = document.getElementById('in-stock-only-checkbox');
    if (inStockBox) inStockBox.checked = false;

    const sortSelect = document.getElementById('listing-sort-select');
    if (sortSelect) sortSelect.value = 'recommended';

    // Reset Category Active Button
    const catContainer = document.getElementById('sidebar-categories-list');
    if (catContainer) {
      catContainer.querySelectorAll('.filter-category-btn').forEach(b => b.classList.remove('active'));
      const allBtn = catContainer.querySelector('[data-slug="all"]');
      if (allBtn) allBtn.classList.add('active');
    }

    // Reset Sizes
    const sizeContainer = document.getElementById('sidebar-sizes-list');
    if (sizeContainer) {
      sizeContainer.querySelectorAll('.size-filter-btn').forEach(b => b.classList.remove('active'));
      const allBtn = sizeContainer.querySelector('[data-size="all"]');
      if (allBtn) allBtn.classList.add('active');
    }

    // Reset Colors
    const colContainer = document.getElementById('sidebar-colors-list');
    if (colContainer) {
      colContainer.querySelectorAll('.color-filter-btn').forEach(b => b.classList.remove('active'));
      const allBtn = colContainer.querySelector('[data-color="all"]');
      if (allBtn) allBtn.classList.add('active');
    }

    renderFilteredProducts(filterState);
  }

  function setupMobileFilterDrawer() {
    const toggleBtn = document.getElementById('btn-mobile-filter-open');
    const sidebar = document.getElementById('shop-sidebar');
    const overlay = document.getElementById('mobile-filter-overlay');
    const closeBtn = document.getElementById('sidebar-close-btn');

    if (!toggleBtn || !sidebar || !overlay) return;

    function openFilterDrawer() {
      sidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeFilterDrawer() {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openFilterDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeFilterDrawer);
    overlay.addEventListener('click', closeFilterDrawer);
  }

  function setupLoadMoreButton(filterState) {
    const loadMoreBtn = document.getElementById('btn-load-more');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
      filterState.visibleCount += filterState.pageSize;
      renderFilteredProducts(filterState);
    });
  }

  function renderFilteredProducts(filterState) {
    const container = document.getElementById('listing-products-grid');
    const countDisplay = document.getElementById('listing-count-display');
    const chipsBar = document.getElementById('active-filters-bar');
    const loadMoreContainer = document.getElementById('listing-load-more-wrap');
    const loadMoreBtn = document.getElementById('btn-load-more');
    const progressText = document.getElementById('listing-progress-text');
    const emptyState = document.getElementById('empty-shop-state');

    if (!container) return;

    // Filter using ProductService
    const filtered = window.ProductService.filterProducts({
      categorySlug: filterState.categorySlug,
      group: filterState.group,
      searchQuery: filterState.searchQuery,
      minPrice: filterState.minPrice,
      maxPrice: filterState.maxPrice,
      size: filterState.size,
      color: filterState.color,
      inStockOnly: filterState.inStockOnly,
      sortBy: filterState.sortBy
    });

    const totalCount = filtered.length;
    const visibleCount = Math.min(filterState.visibleCount, totalCount);

    // Sync Category Pills active state
    const pillsContainer = document.getElementById('top-category-pills');
    if (pillsContainer) {
      const activeSlug = filterState.group ? '' : filterState.categorySlug;
      pillsContainer.querySelectorAll('.category-pill-btn').forEach(btn => {
        const slug = btn.getAttribute('data-slug');
        if (slug === activeSlug || (!activeSlug && slug === 'all')) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Update Toolbar Count
    if (countDisplay) {
      if (totalCount === 0) {
        countDisplay.innerHTML = `Showing <strong>0</strong> products`;
      } else {
        countDisplay.innerHTML = `Showing <strong>1–${visibleCount}</strong> of <strong>${totalCount}</strong> products`;
      }
    }

    // Render Active Filter Chips (if chipsBar element exists)
    renderFilterChips(chipsBar, filterState);

    // Render Grid or Empty State
    container.innerHTML = '';

    if (totalCount === 0) {
      if (emptyState) {
        emptyState.style.display = 'block';
      } else {
        container.innerHTML = `
          <div class="empty-results-box" style="grid-column: 1 / -1; padding: 60px 20px; text-align: center;">
            <div class="empty-results-icon" style="font-size: 2.5rem; margin-bottom: 12px;">✦</div>
            <h3 class="empty-results-title">No Products Match Your Criteria</h3>
            <p class="empty-results-desc" style="color: var(--color-text-muted); margin-bottom: 20px;">
              We couldn't find any items matching your selected category or search.
            </p>
            <button type="button" class="btn-primary" id="btn-empty-reset">
              View All Collections
            </button>
          </div>
        `;
        const emptyReset = document.getElementById('btn-empty-reset');
        if (emptyReset) {
          emptyReset.addEventListener('click', () => {
            const resetBtn = document.getElementById('btn-reset-catalog');
            if (resetBtn) {
              resetBtn.click();
            } else {
              resetFilters(filterState);
            }
          });
        }
      }

      if (loadMoreContainer) loadMoreContainer.style.display = 'none';
      return;
    }

    if (emptyState) {
      emptyState.style.display = 'none';
    }

    // Slice for pagination / Load More
    const pagedItems = filtered.slice(0, visibleCount);
    pagedItems.forEach(prod => {
      container.appendChild(createProductCardElement(prod));
    });

    // Handle Load More visibility
    if (loadMoreContainer && loadMoreBtn) {
      if (visibleCount < totalCount) {
        loadMoreContainer.style.display = 'flex';
        loadMoreBtn.textContent = `LOAD MORE (${totalCount - visibleCount} REMAINING)`;
        if (progressText) {
          progressText.textContent = `Showing ${visibleCount} of ${totalCount} items`;
        }
      } else {
        loadMoreContainer.style.display = 'none';
      }
    }
  }

  function renderFilterChips(chipsContainer, filterState) {
    if (!chipsContainer) return;

    const chips = [];

    if (filterState.categorySlug !== 'all') {
      const catObj = window.ProductService.getCategoryBySlug(filterState.categorySlug);
      chips.push({
        label: `Category: ${catObj ? catObj.name : filterState.categorySlug}`,
        onRemove: () => {
          filterState.categorySlug = 'all';
          const catContainer = document.getElementById('sidebar-categories-list');
          if (catContainer) {
            catContainer.querySelectorAll('.filter-category-btn').forEach(b => b.classList.remove('active'));
            const allBtn = catContainer.querySelector('[data-slug="all"]');
            if (allBtn) allBtn.classList.add('active');
          }
          renderFilteredProducts(filterState);
        }
      });
    }

    if (filterState.searchQuery) {
      chips.push({
        label: `Search: "${filterState.searchQuery}"`,
        onRemove: () => {
          filterState.searchQuery = '';
          const input = document.getElementById('sidebar-search-input');
          if (input) input.value = '';
          renderFilteredProducts(filterState);
        }
      });
    }

    if (filterState.maxPrice < 15000) {
      chips.push({
        label: `Max Price: ₹${filterState.maxPrice.toLocaleString('en-IN')}`,
        onRemove: () => {
          filterState.maxPrice = 15000;
          const slider = document.getElementById('price-range-slider');
          const maxInput = document.getElementById('price-max-input');
          const maxDisplay = document.getElementById('price-slider-max-display');
          if (slider) slider.value = 15000;
          if (maxInput) maxInput.value = 15000;
          if (maxDisplay) maxDisplay.textContent = '₹15,000';
          renderFilteredProducts(filterState);
        }
      });
    }

    if (filterState.size !== 'all') {
      chips.push({
        label: `Size: ${filterState.size}`,
        onRemove: () => {
          filterState.size = 'all';
          const sizeContainer = document.getElementById('sidebar-sizes-list');
          if (sizeContainer) {
            sizeContainer.querySelectorAll('.size-filter-btn').forEach(b => b.classList.remove('active'));
            const allBtn = sizeContainer.querySelector('[data-size="all"]');
            if (allBtn) allBtn.classList.add('active');
          }
          renderFilteredProducts(filterState);
        }
      });
    }

    if (filterState.color !== 'all') {
      chips.push({
        label: `Color: ${filterState.color}`,
        onRemove: () => {
          filterState.color = 'all';
          const colContainer = document.getElementById('sidebar-colors-list');
          if (colContainer) {
            colContainer.querySelectorAll('.color-filter-btn').forEach(b => b.classList.remove('active'));
            const allBtn = colContainer.querySelector('[data-color="all"]');
            if (allBtn) allBtn.classList.add('active');
          }
          renderFilteredProducts(filterState);
        }
      });
    }

    if (filterState.inStockOnly) {
      chips.push({
        label: `In Stock Only`,
        onRemove: () => {
          filterState.inStockOnly = false;
          const box = document.getElementById('in-stock-only-checkbox');
          if (box) box.checked = false;
          renderFilteredProducts(filterState);
        }
      });
    }

    if (chips.length === 0) {
      chipsContainer.style.display = 'none';
      chipsContainer.innerHTML = '';
      return;
    }

    chipsContainer.style.display = 'flex';
    chipsContainer.innerHTML = `<span class="active-filter-label">Active Filters:</span>`;

    chips.forEach(chip => {
      const chipEl = document.createElement('span');
      chipEl.className = 'filter-chip';
      chipEl.innerHTML = `
        ${chip.label}
        <span class="chip-remove" role="button" aria-label="Remove filter">✕</span>
      `;
      chipEl.querySelector('.chip-remove').addEventListener('click', chip.onRemove);
      chipsContainer.appendChild(chipEl);
    });
  }

  /* =========================================================================
     8. Quick View Modal Management
     ========================================================================= */
  function initQuickViewModal() {
    const modalOverlay = document.getElementById('quick-view-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (!modalOverlay) return;

    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      currentQuickViewProduct = null;
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    // Quantity Increment / Decrement
    const minusBtn = document.getElementById('qv-qty-minus');
    const plusBtn = document.getElementById('qv-qty-plus');
    const qtyInput = document.getElementById('qv-qty-input');

    if (minusBtn && plusBtn && qtyInput) {
      minusBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) qtyInput.value = val - 1;
      });

      plusBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val < 10) qtyInput.value = val + 1;
      });
    }

    // Modal Add To Bag button
    const modalAddBtn = document.getElementById('qv-add-cart-btn');
    if (modalAddBtn) {
      modalAddBtn.addEventListener('click', () => {
        if (!currentQuickViewProduct || !window.CartService) return;
        const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
        window.CartService.addItem(currentQuickViewProduct, activeQuickViewSize, qty, currentQuickViewProduct.color || '');
        closeModal();
      });
    }
  }

  function openQuickView(product) {
    currentQuickViewProduct = product;
    activeQuickViewSize = product.defaultSize || 'Standard';

    const modalOverlay = document.getElementById('quick-view-modal');
    if (!modalOverlay) return;

    const imgEl = document.getElementById('qv-image');
    const catEl = document.getElementById('qv-category');
    const titleEl = document.getElementById('qv-title');
    const priceEl = document.getElementById('qv-price');
    const origPriceEl = document.getElementById('qv-original-price');
    const discountEl = document.getElementById('qv-discount');
    const descEl = document.getElementById('qv-desc');
    const sizeContainer = document.getElementById('qv-size-selector');
    const qtyInput = document.getElementById('qv-qty-input');
    const viewFullLink = document.getElementById('qv-view-full-details');
    const modalAddBtn = document.getElementById('qv-add-cart-btn');

    if (imgEl) imgEl.src = (product.image && !product.image.startsWith('http') && !product.image.startsWith('../')) ? getRootUrl(product.image) : product.image;
    if (catEl) catEl.textContent = product.category;
    if (titleEl) titleEl.textContent = product.name;
    if (priceEl) priceEl.textContent = window.ProductService.formatPrice(product.price);
    if (origPriceEl) origPriceEl.textContent = product.originalPrice ? window.ProductService.formatPrice(product.originalPrice) : '';
    if (discountEl) discountEl.textContent = product.discount || '';
    if (descEl) descEl.textContent = product.description || 'Demonstration product for UNIQUE COLLECTION.';
    if (qtyInput) qtyInput.value = 1;
    if (viewFullLink) viewFullLink.href = `${getPageUrl('product-details.html')}?id=${product.id}`;

    // In Stock status in modal
    if (modalAddBtn) {
      if (product.inStock === false) {
        modalAddBtn.disabled = true;
        modalAddBtn.textContent = 'Out of Stock';
        modalAddBtn.style.opacity = '0.6';
      } else {
        modalAddBtn.disabled = false;
        modalAddBtn.textContent = 'Add to Cart';
        modalAddBtn.style.opacity = '1';
      }
    }

    // Populate Size Pills
    if (sizeContainer) {
      sizeContainer.innerHTML = '';
      const sizes = product.sizes || ['Standard'];
      sizes.forEach(sz => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = `size-pill ${sz === activeQuickViewSize ? 'active' : ''}`;
        pill.textContent = sz;
        pill.addEventListener('click', () => {
          activeQuickViewSize = sz;
          sizeContainer.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        });
        sizeContainer.appendChild(pill);
      });
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /* =========================================================================
     9. Newsletter Subscription Form
     ========================================================================= */
  function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const input = document.getElementById('newsletter-email');
    const feedback = document.getElementById('newsletter-feedback');

    if (!form || !input) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        if (feedback) {
          feedback.textContent = 'Please provide a valid email address.';
          feedback.style.color = '#e0245e';
          feedback.classList.add('visible');
        }
        input.focus();
        return;
      }

      input.value = '';
      if (feedback) {
        feedback.textContent = '✓ Thank you for subscribing to UNIQUE COLLECTION! Check your inbox for your 10% welcome voucher.';
        feedback.style.color = 'var(--color-success)';
        feedback.classList.add('visible');
      }

      if (window.CartService) {
        window.CartService.showToast('Subscribed to UNIQUE COLLECTION news & offers!', 'success');
      }
    });
  }

  /* =========================================================================
     10. Step 4: Product Details Page Interactive Controller
     ========================================================================= */
  function initProductDetailsPage() {
    if (!window.ProductService) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Retrieve product or default to first demo product if missing/not found
    const allProducts = window.ProductService.getAllProducts();
    let product = productId ? window.ProductService.getProductById(productId) : null;
    if (!product && allProducts.length > 0) {
      product = allProducts[0];
    }

    if (!product) return;

    // Update document title and metadata
    document.title = `${product.name} | UNIQUE COLLECTION`;

    // 1. Breadcrumbs & Back link
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    const backToShopBtn = document.getElementById('back-to-shop-btn');

    if (breadcrumbCategory) {
      breadcrumbCategory.textContent = product.category;
      breadcrumbCategory.href = `category.html?cat=${product.categorySlug}`;
    }
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = product.name;
    }
    if (backToShopBtn) {
      backToShopBtn.href = 'shop.html';
    }

    // 2. Image Gallery & Thumbnails
    const detailMainImg = document.getElementById('detail-main-img');
    const detailBadge = document.getElementById('detail-badge');
    const thumbnailsList = document.getElementById('detail-thumbnails-list');
    const galleryImages = (window.ProductService.getProductImages(product) || []).map(img => (img && !img.startsWith('http') && !img.startsWith('../')) ? getRootUrl(img) : img);

    if (detailBadge) {
      detailBadge.textContent = product.badge || 'Demo Item';
      if (product.discount) {
        detailBadge.classList.add('sale');
      }
    }

    if (detailMainImg && galleryImages.length > 0) {
      detailMainImg.src = galleryImages[0];
      detailMainImg.alt = product.name;
    }

    if (thumbnailsList) {
      thumbnailsList.innerHTML = '';
      galleryImages.forEach((imgUrl, index) => {
        const thumbBtn = document.createElement('button');
        thumbBtn.type = 'button';
        thumbBtn.className = `thumbnail-item ${index === 0 ? 'active' : ''}`;
        thumbBtn.setAttribute('aria-label', `View image angle ${index + 1}`);
        thumbBtn.innerHTML = `<img src="${imgUrl}" alt="${product.name} angle ${index + 1}">`;

        thumbBtn.addEventListener('click', () => {
          if (detailMainImg) {
            detailMainImg.src = imgUrl;
          }
          thumbnailsList.querySelectorAll('.thumbnail-item').forEach(b => b.classList.remove('active'));
          thumbBtn.classList.add('active');
        });

        thumbnailsList.appendChild(thumbBtn);
      });
    }

    // 3. Stock Status & Pricing Setup
    const maxStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : 15;
    const isInStock = product.inStock !== false && maxStock > 0;

    const detailCategory = document.getElementById('detail-category');
    const detailSku = document.getElementById('detail-sku');
    const detailStockBadge = document.getElementById('detail-stock-badge');
    const detailStockText = document.getElementById('detail-stock-text');
    const detailTitle = document.getElementById('detail-title');
    const detailRatingVal = document.getElementById('detail-rating-val');
    const detailPrice = document.getElementById('detail-price');
    const detailOriginalPrice = document.getElementById('detail-original-price');
    const detailDiscount = document.getElementById('detail-discount');
    const detailDescription = document.getElementById('detail-description');
    const detailStockLimitNote = document.getElementById('detail-stock-limit-note');

    if (detailCategory) detailCategory.textContent = product.category;
    if (detailSku) detailSku.textContent = `SKU: ${product.sku || 'UC-101'}`;
    if (detailTitle) detailTitle.textContent = product.name;
    if (detailRatingVal) detailRatingVal.textContent = product.rating || '4.8';
    if (detailDescription) detailDescription.textContent = product.description;

    if (detailStockBadge && detailStockText) {
      detailStockBadge.className = 'stock-status-pill';
      if (!isInStock) {
        detailStockBadge.classList.add('out-stock');
        detailStockText.textContent = 'Out of Stock';
      } else if (maxStock <= 5) {
        detailStockBadge.classList.add('low-stock');
        detailStockText.textContent = `Only ${maxStock} left in stock - order soon`;
      } else {
        detailStockBadge.classList.add('in-stock');
        detailStockText.textContent = `In Stock`;
      }
    }

    if (detailPrice) detailPrice.textContent = window.ProductService.formatPrice(product.price);
    if (detailOriginalPrice) {
      if (product.originalPrice) {
        detailOriginalPrice.textContent = window.ProductService.formatPrice(product.originalPrice);
        detailOriginalPrice.style.display = 'inline';
      } else {
        detailOriginalPrice.style.display = 'none';
      }
    }
    if (detailDiscount) {
      if (product.discount) {
        detailDiscount.textContent = product.discount;
        detailDiscount.style.display = 'inline-block';
      } else {
        detailDiscount.style.display = 'none';
      }
    }

    if (detailStockLimitNote) {
      detailStockLimitNote.textContent = isInStock
        ? `Max ${maxStock} units per order`
        : 'Currently unavailable';
    }

    // 4. Size Selection vs. Jewellery Variant Rules
    // Rule: Size selection for clothing products, where applicable.
    // Jewellery products should not show clothing size options unless the product has variants.
    const variantLabelTitle = document.getElementById('variant-label-title');
    const selectedVariantDisplay = document.getElementById('selected-variant-display');
    const variantOptionsList = document.getElementById('variant-options-list');

    let currentSelectedSize = product.defaultSize || (product.sizes && product.sizes[0]) || 'Standard';

    const isClothing = product.group === 'clothing';
    const hasMultipleVariants = Array.isArray(product.sizes) && product.sizes.length > 1;

    if (variantOptionsList) {
      variantOptionsList.innerHTML = '';

      if (isClothing) {
        // Clothing product: Render clothing size buttons (S, M, L, XL, etc.)
        if (variantLabelTitle) variantLabelTitle.textContent = 'Select Size:';
        if (selectedVariantDisplay) selectedVariantDisplay.textContent = currentSelectedSize;

        const sizes = product.sizes || ['S', 'M', 'L', 'XL'];
        sizes.forEach(size => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `variant-pill-btn ${size === currentSelectedSize ? 'active' : ''}`;
          btn.textContent = size;
          btn.addEventListener('click', () => {
            currentSelectedSize = size;
            if (selectedVariantDisplay) selectedVariantDisplay.textContent = size;
            variantOptionsList.querySelectorAll('.variant-pill-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          });
          variantOptionsList.appendChild(btn);
        });
      } else if (!isClothing && hasMultipleVariants) {
        // Jewellery with actual size variants (e.g. Bangles 2.4, 2.6, 2.8 or Chains 20", 24")
        if (variantLabelTitle) variantLabelTitle.textContent = 'Select Variant / Size:';
        if (selectedVariantDisplay) selectedVariantDisplay.textContent = currentSelectedSize;

        product.sizes.forEach(variant => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `variant-pill-btn ${variant === currentSelectedSize ? 'active' : ''}`;
          btn.textContent = variant;
          btn.addEventListener('click', () => {
            currentSelectedSize = variant;
            if (selectedVariantDisplay) selectedVariantDisplay.textContent = variant;
            variantOptionsList.querySelectorAll('.variant-pill-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          });
          variantOptionsList.appendChild(btn);
        });
      } else {
        // Jewellery WITHOUT clothing sizes or variants (e.g. standard/free size rings, kadas, studs)
        // Strictly avoid showing clothing size options!
        if (variantLabelTitle) variantLabelTitle.textContent = 'Fit & Sizing:';
        if (selectedVariantDisplay) selectedVariantDisplay.textContent = '';

        const staticPill = document.createElement('div');
        staticPill.className = 'variant-static-info';
        staticPill.innerHTML = `
          <span class="variant-static-tag">✦ One Standard Fit / Free Size</span>
          <span class="variant-static-sub">Hypoallergenic &amp; designed for all wrist/ear sizes</span>
        `;
        variantOptionsList.appendChild(staticPill);
        currentSelectedSize = (product.sizes && product.sizes[0]) || product.defaultSize || 'Standard';
      }
    }

    // 4b. Color / Variation Selection
    const colorSectionContainer = document.getElementById('color-section-container');
    const selectedColorDisplay = document.getElementById('selected-color-display');
    const colorOptionsList = document.getElementById('color-options-list');
    const specColor = document.getElementById('spec-color');

    const availableColors = (Array.isArray(product.colors) && product.colors.length > 0)
      ? product.colors
      : (product.color ? [product.color] : []);

    let currentSelectedColor = (availableColors.length > 0) ? availableColors[0] : (product.color || 'Standard');

    if (colorOptionsList && availableColors.length > 0) {
      colorOptionsList.innerHTML = '';
      if (selectedColorDisplay) selectedColorDisplay.textContent = currentSelectedColor;
      if (specColor) specColor.textContent = currentSelectedColor;

      // Swatch color mappings for visual representation
      const COLOR_SWATCH_MAP = {
        'dusty rose': '#d47b95',
        'sage mint': '#8fa89b',
        'powder blue': '#9bb7d4',
        'mustard gold': '#d4af37',
        'mustard yellow': '#e1ad01',
        'rust maroon': '#8b263e',
        'indigo blue': '#2832c2',
        'rani pink': '#e0115f',
        'royal emerald': '#097969',
        'emerald green': '#046307',
        'deep plum': '#4a0e4e',
        'peach gold': '#f4a460',
        'saffron yellow': '#f4c430',
        'blush coral': '#f88379',
        'royal navy': '#002366',
        'wine velvet': '#58111a',
        'bridal crimson': '#990000',
        'maroon red': '#800000',
        'hot pink': '#ff69b4',
        'black & white': '#222222',
        'maroon & navy': '#6b1724',
        'beige & black': '#d2b48c',
        'blush pink': '#e8a598',
        'coral peach': '#f77f00',
        'ruby red': '#9b111e',
        'teal green': '#008080',
        'dusty peach': '#e8998d',
        'lavender lilac': '#b57bee',
        'mint aqua': '#7fffd4',
        'nude multi-pack': '#d2a679',
        'pastel pink & beige': '#f4c2c2',
        'black & nude': '#1c1c1c',
        'blush & grey': '#b0a8a6',
        'pastel blossom pack': '#f7cad0',
        'classic dark edit': '#333333',
        '18k yellow gold': '#ffd700',
        '18k gold finish': '#e6ca65',
        '24k micro gold finish': '#ffc000',
        'antique temple gold': '#c59b27',
        'silver rhodium': '#d9d9d9',
        'artificial silver finish': '#c0c0c0',
        'antique oxidised silver': '#707070',
        'rose gold': '#b76e79',
        'rose gold & silver duo': '#d4a59a',
        'ruby red & green': '#b22222',
        'pearl white & gold': '#fbf6ea',
        'ruby & pearl': '#a81c2f',
        'ruby mugappu (gold)': '#d49b28',
        'emerald mugappu (gold)': '#187b4f',
        'red kemp & gold': '#a82020',
        'palakka green & ruby': '#1b7837'
      };

      availableColors.forEach(colName => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `color-pill-btn ${colName === currentSelectedColor ? 'active' : ''}`;
        
        const key = colName.toLowerCase().trim();
        const hex = COLOR_SWATCH_MAP[key] || '#e04c7e';
        
        btn.innerHTML = `
          <span class="color-swatch-circle" style="background-color: ${hex};"></span>
          <span>${colName}</span>
        `;

        btn.addEventListener('click', () => {
          currentSelectedColor = colName;
          if (selectedColorDisplay) selectedColorDisplay.textContent = colName;
          if (specColor) specColor.textContent = colName;
          colorOptionsList.querySelectorAll('.color-pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });

        colorOptionsList.appendChild(btn);
      });
    } else if (colorSectionContainer) {
      colorSectionContainer.style.display = 'none';
    }

    // 5. Quantity Stepper
    let currentQuantity = 1;
    const qtyInput = document.getElementById('product-qty-input');
    const btnQtyMinus = document.getElementById('btn-qty-minus');
    const btnQtyPlus = document.getElementById('btn-qty-plus');

    function updateQtyDisplay() {
      if (qtyInput) qtyInput.value = currentQuantity;
      if (btnQtyMinus) btnQtyMinus.disabled = currentQuantity <= 1 || !isInStock;
      if (btnQtyPlus) btnQtyPlus.disabled = currentQuantity >= maxStock || !isInStock;
    }

    if (btnQtyMinus) {
      btnQtyMinus.addEventListener('click', () => {
        if (!isInStock) return;
        if (currentQuantity > 1) {
          currentQuantity--;
          updateQtyDisplay();
        }
      });
    }

    if (btnQtyPlus) {
      btnQtyPlus.addEventListener('click', () => {
        if (!isInStock) return;
        if (currentQuantity < maxStock) {
          currentQuantity++;
          updateQtyDisplay();
        } else {
          if (window.CartService) {
            window.CartService.showToast(`Maximum available demo stock is ${maxStock} units`, 'info');
          }
        }
      });
    }

    updateQtyDisplay();

    // 6. Action Buttons: Add to Bag, Buy Now, Wishlist
    const btnAddToCart = document.getElementById('btn-add-to-cart');
    const btnBuyNow = document.getElementById('btn-buy-now');
    const btnWishlist = document.getElementById('btn-wishlist-toggle');

    if (!isInStock) {
      if (btnAddToCart) {
        btnAddToCart.disabled = true;
        btnAddToCart.style.opacity = '0.5';
        btnAddToCart.style.cursor = 'not-allowed';
        btnAddToCart.innerHTML = `<span>Out of Stock</span>`;
      }
      if (btnBuyNow) {
        btnBuyNow.disabled = true;
        btnBuyNow.style.opacity = '0.5';
        btnBuyNow.style.cursor = 'not-allowed';
      }
    } else {
      if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
          if (window.CartService) {
            const added = window.CartService.addItem(product, currentSelectedSize, currentQuantity, currentSelectedColor);
            if (added !== false) {
              btnAddToCart.classList.add('added-success');
              btnAddToCart.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added to Cart ✓</span>
              `;
              setTimeout(() => {
                btnAddToCart.classList.remove('added-success');
                btnAddToCart.innerHTML = `
                  <svg class="btn-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <span>Add to Cart</span>
                `;
              }, 1400);
            }
          }
        });
      }

      if (btnBuyNow) {
        btnBuyNow.addEventListener('click', () => {
          if (window.CartService) {
            window.CartService.buyNow(product, currentSelectedSize, currentQuantity, currentSelectedColor);
          }
        });
      }
    }

    if (btnWishlist) {
      const isWishlisted = window.CartService ? window.CartService.isWishlisted(product.id) : false;
      if (isWishlisted) btnWishlist.classList.add('active');

      btnWishlist.addEventListener('click', () => {
        if (window.CartService) {
          const added = window.CartService.toggleWishlist(product);
          if (added) {
            btnWishlist.classList.add('active');
          } else {
            btnWishlist.classList.remove('active');
          }
        }
      });
    }

    // 7. Simplified Product Highlights & Specifications (Category & Material only if available)
    const detailHighlightsList = document.getElementById('detail-highlights-list');
    const detailMetaSpecs = document.getElementById('detail-meta-specs');

    if (detailHighlightsList) {
      detailHighlightsList.innerHTML = '';
      // Short highlights section with only 3-4 important points
      let highlights = [];
      if (Array.isArray(product.details) && product.details.length > 0) {
        highlights = product.details.slice(0, 4);
      } else if (product.description) {
        highlights = [product.description];
      }

      highlights.forEach(h => {
        const li = document.createElement('li');
        li.textContent = h;
        detailHighlightsList.appendChild(li);
      });
    }

    if (detailMetaSpecs) {
      detailMetaSpecs.innerHTML = '';
      if (product.category) {
        const catRow = document.createElement('div');
        catRow.className = 'meta-spec-item';
        catRow.innerHTML = `<span class="meta-spec-label">Category:</span> <span class="meta-spec-val">${product.category}</span>`;
        detailMetaSpecs.appendChild(catRow);
      }
      if (product.material) {
        const matRow = document.createElement('div');
        matRow.className = 'meta-spec-item';
        matRow.innerHTML = `<span class="meta-spec-label">Material:</span> <span class="meta-spec-val">${product.material}</span>`;
        detailMetaSpecs.appendChild(matRow);
      }
      if (!product.category && !product.material) {
        detailMetaSpecs.style.display = 'none';
      } else {
        detailMetaSpecs.style.display = 'flex';
      }
    }

    // 8. Related Products (4 items from same category/group)
    const relatedGrid = document.getElementById('related-products-grid');
    if (relatedGrid && window.ProductService.getRelatedProducts) {
      relatedGrid.innerHTML = '';
      const relatedProducts = window.ProductService.getRelatedProducts(product.id, 4);
      relatedProducts.forEach(relProd => {
        relatedGrid.appendChild(createProductCardElement(relProd));
      });
    }
  }

  /* =========================================================================
     11. Step 4: Shopping Bag / Cart Page Controller
     ========================================================================= */
  function initCartPage() {
    if (!window.CartService || !window.ProductService) return;

    let appliedPromoCode = null;
    let promoDiscountPercent = 0;

    const cartContentRoot = document.getElementById('cart-content-root');
    const cartHeaderCount = document.getElementById('cart-header-count');
    const btnClearCart = document.getElementById('btn-clear-cart');
    const shippingBar = document.getElementById('cart-shipping-bar');
    const shippingBarText = document.getElementById('shipping-bar-text');
    const shippingProgressFill = document.getElementById('shipping-progress-fill');

    // Step 4 Modal elements
    const checkoutModal = document.getElementById('checkout-demo-modal');
    const btnCloseDemoModal = document.getElementById('btn-close-demo-modal');

    if (btnCloseDemoModal && checkoutModal) {
      btnCloseDemoModal.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
      });
      checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) checkoutModal.classList.remove('active');
      });
    }

    if (btnClearCart) {
      btnClearCart.addEventListener('click', () => {
        const items = window.CartService.getItems();
        if (items.length === 0) return;
        if (confirm('Are you sure you want to clear your shopping bag?')) {
          window.CartService.clearCart();
          appliedPromoCode = null;
          promoDiscountPercent = 0;
          renderCart();
        }
      });
    }

    function renderCart() {
      const items = window.CartService.getItems();
      const itemCount = window.CartService.getItemCount();
      const subtotal = window.CartService.getSubtotal();
      const savings = window.CartService.getSavings();
      const shippingFee = window.CartService.getShippingFee(subtotal);

      if (cartHeaderCount) {
        cartHeaderCount.textContent = itemCount;
      }

      // Shipping progress bar update
      if (shippingBar) {
        if (items.length === 0) {
          shippingBar.style.display = 'none';
        } else {
          shippingBar.style.display = 'block';
          if (subtotal >= 999) {
            if (shippingBarText) {
              shippingBarText.innerHTML = '<span>🎉 <strong>Congratulations!</strong> You have unlocked <strong>FREE Delivery</strong> across India!</span>';
            }
            if (shippingProgressFill) {
              shippingProgressFill.style.width = '100%';
              shippingProgressFill.style.backgroundColor = 'var(--color-success)';
            }
          } else {
            const needed = 999 - subtotal;
            const pct = Math.min(100, Math.round((subtotal / 999) * 100));
            if (shippingBarText) {
              shippingBarText.innerHTML = `<span>🚚 Add <strong>${window.ProductService.formatPrice(needed)}</strong> more for <strong>FREE Delivery</strong> across India!</span>`;
            }
            if (shippingProgressFill) {
              shippingProgressFill.style.width = `${pct}%`;
              shippingProgressFill.style.backgroundColor = 'var(--color-gold)';
            }
          }
        }
      }

      // Empty Cart View
      if (items.length === 0) {
        if (btnClearCart) btnClearCart.style.display = 'none';

        cartContentRoot.innerHTML = `
          <div class="empty-cart-container">
            <div class="empty-cart-icon-circle">
              <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h2 class="empty-cart-title">Your Shopping Bag is Empty</h2>
            <p class="empty-cart-desc">
              Looks like you haven't added any beautiful pieces yet. Discover our latest women's clothing, 2-piece and 3-piece sets, designer lehengas, and waterproof anti-tarnish jewellery.
            </p>
            <div class="empty-cart-actions">
              <a href="shop.html" class="btn-primary">
                Explore Collections →
              </a>
            </div>
          </div>
        `;
        return;
      }

      // Active Cart Layout (Items Table & Order Summary)
      if (btnClearCart) btnClearCart.style.display = 'inline-flex';

      // Promo discount calculation
      const promoDiscountAmount = promoDiscountPercent > 0 ? Math.round(subtotal * (promoDiscountPercent / 100)) : 0;
      const finalGrandTotal = Math.max(0, subtotal - promoDiscountAmount + shippingFee);

      let itemsHtml = `
        <div class="cart-layout">
          <!-- Left Column: Items List -->
          <div class="cart-items-column">
            <div class="cart-items-table-header">
              <span class="col-head-product">Product</span>
              <span class="col-head-price">Price</span>
              <span class="col-head-qty">Quantity</span>
              <span class="col-head-subtotal">Subtotal</span>
              <span class="col-head-action"></span>
            </div>

            <div class="cart-items-list">
      `;

      items.forEach(item => {
        const itemLineTotal = Number(item.price) * (item.quantity || 1);
        const maxStock = typeof item.maxStock === 'number' ? item.maxStock : 15;
        const detailsUrl = `product-details.html?id=${item.id}`;

        itemsHtml += `
          <div class="cart-item-row" data-id="${item.id}" data-size="${item.size}" data-color="${item.color || ''}">
            <div class="cart-item-media">
              <a href="${detailsUrl}">
                <img src="${getRootUrl(item.image)}" alt="${item.name}" loading="lazy">
              </a>
            </div>

            <div class="cart-item-info">
              <span class="cart-item-cat">${item.category || 'Collection'}</span>
              <h3 class="cart-item-title">
                <a href="${detailsUrl}">${item.name}</a>
              </h3>
              <div class="cart-item-variant">
                <span>Size:</span>
                <span class="cart-variant-pill">${item.size}</span>
                ${item.color ? `<span class="cart-variant-pill" style="margin-left: 6px;">Color: ${item.color}</span>` : ''}
              </div>
              <div class="cart-item-mobile-price">
                ${window.ProductService.formatPrice(item.price)}
              </div>
            </div>

            <div class="cart-item-unit-price">
              <span class="price-val">${window.ProductService.formatPrice(item.price)}</span>
              ${item.originalPrice && item.originalPrice > item.price ? `
                <span class="price-orig">${window.ProductService.formatPrice(item.originalPrice)}</span>
              ` : ''}
            </div>

            <div class="cart-item-quantity-ctrl">
              <div class="cart-qty-counter">
                <button type="button" class="btn-cart-qty-minus" data-id="${item.id}" data-size="${item.size}" data-color="${item.color || ''}" ${item.quantity <= 1 ? 'disabled' : ''} aria-label="Decrease quantity">−</button>
                <span class="cart-qty-val">${item.quantity}</span>
                <button type="button" class="btn-cart-qty-plus" data-id="${item.id}" data-size="${item.size}" data-color="${item.color || ''}" ${item.quantity >= maxStock ? 'disabled' : ''} aria-label="Increase quantity">+</button>
              </div>
              <span class="cart-stock-hint">Max: ${maxStock}</span>
            </div>

            <div class="cart-item-line-total">
              ${window.ProductService.formatPrice(itemLineTotal)}
            </div>

            <div class="cart-item-remove-cell">
              <button type="button" class="btn-cart-remove" data-id="${item.id}" data-size="${item.size}" data-color="${item.color || ''}" aria-label="Remove item">
                ✕
              </button>
            </div>
          </div>
        `;
      });

      itemsHtml += `
            </div>

            <div class="cart-actions-bar">
              <a href="shop.html" class="btn-continue-shopping">
                ← Continue Shopping
              </a>
              <span class="cart-guarantee-note">🔒 100% Authentic Quality Guaranteed</span>
            </div>
          </div>

          <!-- Right Column: Order Summary Card -->
          <div class="cart-summary-column">
            <div class="order-summary-card">
              <h3 class="summary-title">Order Summary</h3>

              <div class="summary-line-item">
                <span class="summary-label">Subtotal (${itemCount} items)</span>
                <span class="summary-value">${window.ProductService.formatPrice(subtotal)}</span>
              </div>

              ${savings > 0 ? `
                <div class="summary-line-item savings-line">
                  <span class="summary-label">Total MRP Savings</span>
                  <span class="summary-value savings-val">- ${window.ProductService.formatPrice(savings)}</span>
                </div>
              ` : ''}

              <div class="summary-line-item">
                <span class="summary-label">Standard Delivery</span>
                <span class="summary-value ${shippingFee === 0 ? 'text-free' : ''}">
                  ${shippingFee === 0 ? 'FREE' : window.ProductService.formatPrice(shippingFee)}
                </span>
              </div>

              <!-- Promo Code Demo Form -->
              <div class="summary-promo-wrap">
                <label class="promo-label" for="promo-input">Promo / Voucher Code</label>
                <div class="promo-input-row">
                  <input type="text" id="promo-input" class="promo-input-field" placeholder="Try code: UNIQUE10" value="${appliedPromoCode || ''}" ${appliedPromoCode ? 'disabled' : ''}>
                  <button type="button" id="btn-apply-promo" class="btn-promo-apply">
                    ${appliedPromoCode ? 'Remove' : 'Apply'}
                  </button>
                </div>
                <div id="promo-feedback-msg" class="promo-feedback ${appliedPromoCode ? 'success' : ''}">
                  ${appliedPromoCode ? `✓ Promo code <strong>${appliedPromoCode}</strong> applied (${promoDiscountPercent}% off)` : 'Demo coupons available: UNIQUE10 (10% OFF), FESTIVE15 (15% OFF)'}
                </div>
              </div>

              ${promoDiscountAmount > 0 ? `
                <div class="summary-line-item promo-line">
                  <span class="summary-label">Special Voucher (${appliedPromoCode})</span>
                  <span class="summary-value promo-val">- ${window.ProductService.formatPrice(promoDiscountAmount)}</span>
                </div>
              ` : ''}

              <div class="summary-divider"></div>

              <div class="summary-total-row">
                <span class="total-label">Estimated Total</span>
                <span class="total-value">${window.ProductService.formatPrice(finalGrandTotal)}</span>
              </div>
              <p class="summary-tax-note">Includes all demo taxes &amp; applicable GST.</p>

              <!-- Checkout CTA -->
              <button type="button" class="btn-proceed-checkout" id="btn-proceed-checkout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Proceed to Checkout</span>
              </button>

              <div class="summary-trust-badges">
                <div class="trust-badge-row">
                  <span>🔒 Safe &amp; Secure 256-Bit SSL Demo</span>
                </div>
                <div class="trust-badge-row">
                  <span>🔁 7-Day Easy Size Exchange</span>
                </div>
                <div class="trust-badge-row">
                  <span>💵 Cash on Delivery Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      cartContentRoot.innerHTML = itemsHtml;

      // Event Listeners for Cart Actions
      // 1. Quantity Minus
      cartContentRoot.querySelectorAll('.btn-cart-qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const size = btn.getAttribute('data-size');
          const color = btn.getAttribute('data-color') || null;
          window.CartService.updateQuantity(id, size, -1, true, color);
          renderCart();
        });
      });

      // 2. Quantity Plus
      cartContentRoot.querySelectorAll('.btn-cart-qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const size = btn.getAttribute('data-size');
          const color = btn.getAttribute('data-color') || null;
          window.CartService.updateQuantity(id, size, 1, true, color);
          renderCart();
        });
      });

      // 3. Remove Item with friendly confirmation
      cartContentRoot.querySelectorAll('.btn-cart-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const size = btn.getAttribute('data-size');
          const color = btn.getAttribute('data-color') || null;
          const items = window.CartService.getItems();
          const target = items.find(i => i.id === id && (!size || i.size === size));
          const name = target ? target.name : 'this item';
          if (confirm(`Remove "${name}" from your shopping bag?`)) {
            window.CartService.removeItem(id, size, color);
            renderCart();
          }
        });
      });

      // 4. Promo Code Form
      const promoInput = document.getElementById('promo-input');
      const btnApplyPromo = document.getElementById('btn-apply-promo');
      const promoFeedback = document.getElementById('promo-feedback-msg');

      if (btnApplyPromo) {
        btnApplyPromo.addEventListener('click', () => {
          if (appliedPromoCode) {
            // Remove promo
            appliedPromoCode = null;
            promoDiscountPercent = 0;
            window.CartService.showToast('Voucher removed', 'info');
            renderCart();
            return;
          }

          const code = promoInput ? promoInput.value.trim().toUpperCase() : '';
          if (!code) {
            if (promoFeedback) {
              promoFeedback.textContent = 'Please enter a voucher code.';
              promoFeedback.className = 'promo-feedback error';
            }
            return;
          }

          if (code === 'UNIQUE10') {
            appliedPromoCode = 'UNIQUE10';
            promoDiscountPercent = 10;
            window.CartService.showToast('10% demo discount applied!', 'success');
            renderCart();
          } else if (code === 'FESTIVE15') {
            appliedPromoCode = 'FESTIVE15';
            promoDiscountPercent = 15;
            window.CartService.showToast('15% festive demo discount applied!', 'success');
            renderCart();
          } else {
            if (promoFeedback) {
              promoFeedback.textContent = `Coupon code "${code}" is not valid. Try UNIQUE10 or FESTIVE15.`;
              promoFeedback.className = 'promo-feedback error';
            }
          }
        });
      }

      // 5. Proceed to Checkout (Step 6: Requires demo login)
      const btnProceed = document.getElementById('btn-proceed-checkout');
      if (btnProceed) {
        btnProceed.addEventListener('click', () => {
          if (window.AuthService && !window.AuthService.isAuthenticated()) {
            if (window.CartService && window.CartService.showToast) {
              window.CartService.showToast('Please sign in to proceed with checkout.', 'info');
            }
            setTimeout(() => {
              window.location.href = 'login.html?redirect=checkout.html';
            }, 300);
          } else {
            window.location.href = 'checkout.html';
          }
        });
      }
    }

    renderCart();
  }

  /* =========================================================================
     12. Step 5: Checkout Page Controller & Form Validation
     ========================================================================= */
  function initCheckoutPage() {
    if (!window.CartService || !window.ProductService) return;

    // Step 6: Guard with demo authentication
    if (window.AuthService && !window.AuthService.requireAuth('checkout.html')) {
      return;
    }

    const checkoutLayout = document.getElementById('checkout-layout');
    const emptyState = document.getElementById('checkout-empty-state');
    const form = document.getElementById('checkout-form');
    const itemsListEl = document.getElementById('checkout-items-list');
    const badgeCountEl = document.getElementById('checkout-badge-count');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const savingsRowEl = document.getElementById('checkout-savings-row');
    const savingsEl = document.getElementById('checkout-savings');
    const shippingEl = document.getElementById('checkout-shipping');
    const grandTotalEl = document.getElementById('checkout-grand-total');

    // Determine checkout mode: Dedicated Buy Now vs. Regular Cart
    const urlParams = new URLSearchParams(window.location.search);
    const isBuyNow = urlParams.get('mode') === 'buynow';
    let checkoutItems = [];

    if (isBuyNow) {
      const buyNowItem = window.CartService.getBuyNowItem();
      if (buyNowItem && buyNowItem.id) {
        checkoutItems = [buyNowItem];
      } else {
        // No valid Buy Now product available
        if (checkoutLayout) checkoutLayout.style.display = 'none';
        if (emptyState) {
          emptyState.style.display = 'block';
          const emptyTitle = emptyState.querySelector('.empty-cart-title');
          const emptyDesc = emptyState.querySelector('.empty-cart-desc');
          if (emptyTitle) emptyTitle.textContent = 'No Product Selected for Buy Now';
          if (emptyDesc) emptyDesc.textContent = 'Please choose a product from our shop to proceed with Buy Now.';
        }
        return;
      }
    } else {
      checkoutItems = window.CartService.getItems();
      if (!checkoutItems || checkoutItems.length === 0) {
        if (checkoutLayout) checkoutLayout.style.display = 'none';
        if (emptyState) {
          emptyState.style.display = 'block';
          const emptyTitle = emptyState.querySelector('.empty-cart-title');
          const emptyDesc = emptyState.querySelector('.empty-cart-desc');
          if (emptyTitle) emptyTitle.textContent = 'Your Shopping Cart is Empty';
          if (emptyDesc) emptyDesc.textContent = 'You cannot place an order with an empty cart. Please explore our collections and add items first.';
        }
        return;
      }
    }

    if (checkoutLayout) checkoutLayout.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    // 2. Render Order Summary Sidebar with checkoutItems
    let itemCount = 0;
    let subtotal = 0;
    let savings = 0;

    checkoutItems.forEach(item => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      itemCount += qty;
      subtotal += price * qty;
      if (item.originalPrice && Number(item.originalPrice) > price) {
        savings += (Number(item.originalPrice) - price) * qty;
      }
    });

    const shippingFee = window.CartService.getShippingFee(subtotal);
    const grandTotal = subtotal + shippingFee;

    if (badgeCountEl) badgeCountEl.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    if (subtotalEl) subtotalEl.textContent = window.ProductService.formatPrice(subtotal);
    
    if (savingsRowEl && savingsEl) {
      if (savings > 0) {
        savingsRowEl.style.display = 'flex';
        savingsEl.textContent = `- ${window.ProductService.formatPrice(savings)}`;
      } else {
        savingsRowEl.style.display = 'none';
      }
    }

    if (shippingEl) {
      if (shippingFee === 0) {
        shippingEl.innerHTML = '<span class="text-free">FREE</span>';
      } else {
        shippingEl.textContent = window.ProductService.formatPrice(shippingFee);
      }
    }

    if (grandTotalEl) grandTotalEl.textContent = window.ProductService.formatPrice(grandTotal);

    if (itemsListEl) {
      itemsListEl.innerHTML = '';
      checkoutItems.forEach(item => {
        const itemLine = document.createElement('div');
        itemLine.className = 'checkout-mini-item';
        const variantText = [item.size, item.color].filter(Boolean).join(' • ');
        itemLine.innerHTML = `
          <div class="mini-item-media">
            <img src="${getRootUrl(item.image)}" alt="${item.name}">
            <span class="mini-item-qty-badge">${item.quantity || 1}</span>
          </div>
          <div class="mini-item-info">
            <h4 class="mini-item-name">${item.name}</h4>
            <div class="mini-item-meta">
              <span class="mini-item-variant">${variantText || 'Standard'}</span>
              <span class="mini-item-price">${window.ProductService.formatPrice(item.price)} each</span>
            </div>
          </div>
          <div class="mini-item-total">
            ${window.ProductService.formatPrice(Number(item.price) * (Number(item.quantity) || 1))}
          </div>
        `;
        itemsListEl.appendChild(itemLine);
      });
    }

    // 3. Form input references & error message elements
    const fields = {
      name: { input: document.getElementById('cust-name'), err: document.getElementById('err-cust-name') },
      phone: { input: document.getElementById('cust-phone'), err: document.getElementById('err-cust-phone') },
      email: { input: document.getElementById('cust-email'), err: document.getElementById('err-cust-email') },
      address: { input: document.getElementById('cust-address'), err: document.getElementById('err-cust-address') },
      locality: { input: document.getElementById('cust-locality'), err: document.getElementById('err-cust-locality') },
      city: { input: document.getElementById('cust-city'), err: document.getElementById('err-cust-city') },
      state: { input: document.getElementById('cust-state'), err: document.getElementById('err-cust-state') },
      pincode: { input: document.getElementById('cust-pincode'), err: document.getElementById('err-cust-pincode') }
    };
    const landmarkInput = document.getElementById('cust-landmark');

    // Step 6: Pre-populate form fields from logged-in demo user
    const activeUser = (window.AuthService && window.AuthService.getCurrentUser)
      ? window.AuthService.getCurrentUser()
      : null;
    if (activeUser) {
      if (fields.name.input && !fields.name.input.value) fields.name.input.value = activeUser.fullName || '';
      if (fields.email.input && !fields.email.input.value) fields.email.input.value = activeUser.email || '';
      if (fields.phone.input && !fields.phone.input.value) fields.phone.input.value = (activeUser.mobile || '').replace(/\D/g, '').slice(0, 10);
    }

    // Clean inputs: Mobile (digits only, max 10), PIN code (digits only, max 6)
    if (fields.phone.input) {
      fields.phone.input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        clearFieldError('phone');
      });
    }

    if (fields.pincode.input) {
      fields.pincode.input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
        clearFieldError('pincode');
      });
    }

    // Clear error on user typing
    Object.keys(fields).forEach(key => {
      const f = fields[key];
      if (f.input) {
        f.input.addEventListener('input', () => clearFieldError(key));
        f.input.addEventListener('change', () => clearFieldError(key));
      }
    });

    // Payment card click selection
    const paymentCards = document.querySelectorAll('.payment-option-card');
    paymentCards.forEach(card => {
      card.addEventListener('click', () => {
        paymentCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    function setFieldError(fieldKey, message) {
      const f = fields[fieldKey];
      if (!f) return;
      if (f.input) f.input.classList.add('input-error');
      if (f.err) {
        f.err.textContent = message;
        f.err.classList.add('visible');
      }
    }

    function clearFieldError(fieldKey) {
      const f = fields[fieldKey];
      if (!f) return;
      if (f.input) f.input.classList.remove('input-error');
      if (f.err) {
        f.err.textContent = '';
        f.err.classList.remove('visible');
      }
    }

    function validateForm() {
      let isValid = true;
      let firstInvalidInput = null;

      // 1. Full Name
      const nameVal = fields.name.input ? fields.name.input.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        setFieldError('name', 'Please enter your full name (at least 2 letters).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = fields.name.input;
      } else {
        clearFieldError('name');
      }

      // 2. Mobile Number (10 digits, starts with 6-9)
      const phoneVal = fields.phone.input ? fields.phone.input.value.trim() : '';
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneVal || !phoneRegex.test(phoneVal)) {
        setFieldError('phone', 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = fields.phone.input;
      } else {
        clearFieldError('phone');
      }

      // 3. Email Address
      const emailVal = fields.email.input ? fields.email.input.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        setFieldError('email', 'Please enter a valid email address (e.g. name@domain.com).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = fields.email.input;
      } else {
        clearFieldError('email');
      }

      // 4. Door No & Street Address
      const addressVal = fields.address.input ? fields.address.input.value.trim() : '';
      if (!addressVal || addressVal.length < 4) {
        setFieldError('address', 'Please enter your door/flat number and street address.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = fields.address.input;
      } else {
        clearFieldError('address');
      }

      // 5. Area / Locality
      const localityVal = fields.locality.input ? fields.locality.input.value.trim() : '';
      if (!localityVal || localityVal.length < 2) {
        setFieldError('locality', 'Please enter your area or locality.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = fields.locality.input;
      } else {
        clearFieldError('locality');
      }

      // 6. City
      const cityVal = fields.city.input ? fields.city.input.value.trim() : '';
      if (!cityVal || cityVal.length < 2) {
        setFieldError('city', 'Please enter your city / town.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = fields.city.input;
      } else {
        clearFieldError('city');
      }

      // 7. State
      const stateVal = fields.state.input ? fields.state.input.value.trim() : '';
      if (!stateVal) {
        setFieldError('state', 'Please select your state.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = fields.state.input;
      } else {
        clearFieldError('state');
      }

      // 8. 6-digit Indian PIN Code
      const pincodeVal = fields.pincode.input ? fields.pincode.input.value.trim() : '';
      const pincodeRegex = /^[1-9][0-9]{5}$/;
      if (!pincodeVal || !pincodeRegex.test(pincodeVal)) {
        setFieldError('pincode', 'Please enter a valid 6-digit Indian PIN code (e.g. 600001).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = fields.pincode.input;
      } else {
        clearFieldError('pincode');
      }

      if (!isValid && firstInvalidInput) {
        firstInvalidInput.focus();
        firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return isValid;
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check again if current checkout flow has items
        if (!checkoutItems || checkoutItems.length === 0) {
          window.CartService.showToast('Your order has no items to process.', 'info');
          if (checkoutLayout) checkoutLayout.style.display = 'none';
          if (emptyState) emptyState.style.display = 'block';
          return;
        }

        const isValid = validateForm();
        if (!isValid) {
          window.CartService.showToast('Please complete all required fields correctly.', 'info');
          return;
        }

        const selectedRadio = document.querySelector('input[name="payment-method"]:checked');
        const paymentMethod = selectedRadio ? selectedRadio.value : 'Cash on Delivery';

        const customerData = {
          fullName: fields.name.input.value.trim(),
          mobile: fields.phone.input.value.trim(),
          email: fields.email.input.value.trim(),
          address: fields.address.input.value.trim(),
          locality: fields.locality.input.value.trim(),
          city: fields.city.input.value.trim(),
          state: fields.state.input.value.trim(),
          pincode: fields.pincode.input.value.trim(),
          landmark: landmarkInput ? landmarkInput.value.trim() : '',
          paymentMethod: paymentMethod
        };

        const btnPlaceOrder = document.getElementById('btn-place-order');
        if (btnPlaceOrder) {
          btnPlaceOrder.disabled = true;
          btnPlaceOrder.innerHTML = `<span>Processing Order...</span>`;
        }

        // Create order and redirect
        setTimeout(() => {
          const order = window.CartService.createOrder(customerData, isBuyNow ? checkoutItems : null);
          if (order && order.orderId) {
            window.location.href = `order-confirmation.html?orderId=${encodeURIComponent(order.orderId)}`;
          } else {
            if (btnPlaceOrder) {
              btnPlaceOrder.disabled = false;
              btnPlaceOrder.innerHTML = `<span>Place Order →</span>`;
            }
          }
        }, 500);
      });
    }
  }

  /* =========================================================================
     13. Step 5: Order Confirmation Page Controller
     ========================================================================= */
  function initOrderConfirmationPage() {
    if (!window.CartService || !window.ProductService) return;

    const contentRoot = document.getElementById('confirmation-content-root');
    if (!contentRoot) return;

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    let order = null;
    if (orderId) {
      order = window.CartService.getOrderById(orderId);
    }
    if (!order) {
      order = window.CartService.getLastOrder();
    }

    if (!order) {
      contentRoot.innerHTML = `
        <div class="empty-cart-container" style="max-width: 580px;">
          <div class="empty-cart-icon-circle">
            <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h2 class="empty-cart-title">No Order Details Found</h2>
          <p class="empty-cart-desc">
            We could not find recent order details in this browser session. If you have just arrived, feel free to explore our fashion and jewellery collections.
          </p>
          <div class="empty-cart-actions">
            <a href="shop.html" class="btn-primary">Explore Shop Catalog →</a>
          </div>
        </div>
      `;
      return;
    }

    // Render Order Confirmation Details
    const cust = order.customer || {};
    const items = order.items || [];

    let itemsRowsHtml = '';
    items.forEach(item => {
      const lineTotal = Number(item.price) * (item.quantity || 1);
      itemsRowsHtml += `
        <div class="confirm-item-row">
          <div class="confirm-item-media">
            <img src="${getRootUrl(item.image)}" alt="${item.name}">
          </div>
          <div class="confirm-item-info">
            <span class="confirm-item-cat">${item.category || 'Collection'}</span>
            <h4 class="confirm-item-name">${item.name}</h4>
            <div class="confirm-item-meta">
              <span>Size: <strong>${item.size}</strong></span>
              <span>•</span>
              <span>Qty: <strong>${item.quantity}</strong></span>
              <span>•</span>
              <span>Unit: <strong>${window.ProductService.formatPrice(item.price)}</strong></span>
            </div>
          </div>
          <div class="confirm-item-total">
            ${window.ProductService.formatPrice(lineTotal)}
          </div>
        </div>
      `;
    });

    contentRoot.innerHTML = `
      <div class="confirmation-card">
        
        <!-- Celebration Header -->
        <div class="confirmation-success-banner">
          <div class="success-ring-icon">✓</div>
          <h1 class="confirmation-title">Order Placed Successfully!</h1>
          <p class="confirmation-subtitle">
            Thank you, <strong>${cust.fullName || 'Valued Customer'}</strong>! Your demonstration order has been recorded.
          </p>
          <div class="order-id-pill">
            <span>Demo Order ID:</span>
            <strong>${order.orderId}</strong>
          </div>
        </div>

        <!-- Demo Notice Alert -->
        <div class="demo-alert-box">
          <span class="alert-icon">ℹ</span>
          <div class="alert-content">
            <strong>Frontend Demonstration Order:</strong>
            This purchase was placed in demonstration mode and saved to your browser's localStorage. No real financial transaction was executed and no physical parcel will be shipped.
          </div>
        </div>

        <!-- Order Information 2-Column Grid -->
        <div class="confirmation-details-grid">
          
          <!-- Left: Order Summary & Purchased Products -->
          <div class="confirm-left-pane">
            <div class="confirm-pane-card">
              <h3 class="pane-title">Items in Your Order (${order.itemCount || items.length})</h3>
              
              <div class="confirm-items-list">
                ${itemsRowsHtml}
              </div>

              <div class="pane-divider"></div>

              <!-- Calculation Totals -->
              <div class="confirm-cost-summary">
                <div class="confirm-cost-line">
                  <span>Subtotal</span>
                  <span>${window.ProductService.formatPrice(order.subtotal || 0)}</span>
                </div>

                ${order.savings > 0 ? `
                  <div class="confirm-cost-line text-pink">
                    <span>Total MRP Savings</span>
                    <span>- ${window.ProductService.formatPrice(order.savings)}</span>
                  </div>
                ` : ''}

                <div class="confirm-cost-line">
                  <span>Delivery Charge</span>
                  <span>${order.shippingFee === 0 ? '<strong class="text-free">FREE</strong>' : window.ProductService.formatPrice(order.shippingFee)}</span>
                </div>

                <div class="pane-divider"></div>

                <div class="confirm-cost-total">
                  <span>Final Total</span>
                  <span class="total-amount">${window.ProductService.formatPrice(order.total || 0)}</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Right: Customer & Delivery Details -->
          <div class="confirm-right-pane">
            
            <!-- Delivery Address Card -->
            <div class="confirm-pane-card">
              <h3 class="pane-title">Delivery Address</h3>
              
              <div class="address-details-box">
                <p class="addr-name">${cust.fullName || 'Customer'}</p>
                <p class="addr-line">${cust.address || ''}</p>
                <p class="addr-line">${cust.locality || ''}${cust.landmark ? `, Landmark: ${cust.landmark}` : ''}</p>
                <p class="addr-line">${cust.city || ''}, ${cust.state || ''} - <strong>${cust.pincode || ''}</strong></p>
                
                <div class="addr-contact-row">
                  <span>📞 +91 ${cust.mobile || ''}</span>
                  <span>✉ ${cust.email || ''}</span>
                </div>
              </div>
            </div>

            <!-- Order Metadata & Delivery Status -->
            <div class="confirm-pane-card" style="margin-top: 20px;">
              <h3 class="pane-title">Order Information</h3>

              <ul class="order-meta-list">
                <li>
                  <span class="meta-label">Date &amp; Time:</span>
                  <span class="meta-val">${order.orderDateFormatted || new Date().toLocaleString('en-IN')}</span>
                </li>
                <li>
                  <span class="meta-label">Payment Method:</span>
                  <span class="meta-val">${order.paymentMethod || 'Cash on Delivery'}</span>
                </li>
                <li>
                  <span class="meta-label">Delivery Timeline:</span>
                  <span class="meta-val">Estimated 3–5 Business Days</span>
                </li>
                <li>
                  <span class="meta-label">Status:</span>
                  <span class="meta-badge-success">● Confirmed</span>
                </li>
              </ul>
            </div>

            <!-- Support & Assistance -->
            <div class="confirm-support-box" style="margin-top: 20px;">
              <p>Need help with your order? Reach our client support:</p>
              <p><a href="mailto:Syedalifathima3232@gmail.com">✉ Syedalifathima3232@gmail.com</a> | <a href="tel:994160263">✆ 99416 0263</a></p>
            </div>

          </div>

        </div>

        <!-- Action CTAs -->
        <div class="confirmation-actions-row">
          <a href="shop.html" class="btn-primary">
            Continue Shopping →
          </a>
          <a href="my-orders.html" class="btn-secondary">
            View My Orders
          </a>
          <button type="button" class="btn-print-receipt" id="btn-print-receipt">
            🖨 Print Order Receipt
          </button>
        </div>

      </div>
    `;

    // Print Receipt Event
    const btnPrint = document.getElementById('btn-print-receipt');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }
  }

  /* =========================================================================
     14. Step 5: My Orders History Page Controller
     ========================================================================= */
  function initMyOrdersPage() {
    if (!window.CartService || !window.ProductService) return;

    const root = document.getElementById('my-orders-root');
    if (!root) return;

    // Step 6: Guard with demo authentication
    if (window.AuthService && !window.AuthService.requireAuth('my-orders.html')) {
      return;
    }

    const currentUser = window.AuthService.getCurrentUser();
    const orders = window.CartService.getOrders(currentUser);

    if (!orders || orders.length === 0) {
      root.innerHTML = `
        <div class="empty-cart-container" style="max-width: 600px;">
          <div class="empty-cart-icon-circle">
            <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h2 class="empty-cart-title">No Orders Yet</h2>
          <p class="empty-cart-desc">
            ${currentUser ? `Hello <strong>${currentUser.fullName}</strong>, you` : 'You'} haven't placed any orders yet under this account.
          </p>
          <div class="empty-cart-actions">
            <a href="shop.html" class="btn-primary">Explore Collections →</a>
          </div>
        </div>
      `;
      return;
    }

    let ordersHtml = `<div class="orders-history-list">`;

    orders.forEach(order => {
      const cust = order.customer || {};
      const items = order.items || [];

      let itemsSummaryHtml = '';
      items.forEach(it => {
        itemsSummaryHtml += `
          <div class="order-hist-item">
            <img src="${getRootUrl(it.image)}" alt="${it.name}" class="order-hist-img">
            <div class="order-hist-info">
              <h4 class="order-hist-name">${it.name}</h4>
              <span class="order-hist-variant">Variant: ${it.size || 'Standard'} | Qty: ${it.quantity}</span>
            </div>
            <div class="order-hist-price">
              ${window.ProductService.formatPrice(Number(it.price) * (it.quantity || 1))}
            </div>
          </div>
        `;
      });

      ordersHtml += `
        <div class="order-history-card">
          <div class="order-card-header">
            <div>
              <span class="order-card-id">Order ID: <strong>${order.orderId}</strong></span>
              <span class="order-card-date">Placed on ${order.orderDateFormatted || 'Recent'}</span>
            </div>
            <div class="order-card-status">
              <span class="status-pill-confirmed">● Confirmed</span>
            </div>
          </div>

          <div class="order-card-body">
            <div class="order-items-scroll">
              ${itemsSummaryHtml}
            </div>

            <div class="order-card-footer">
              <div class="order-footer-details">
                <span>Shipping to: <strong>${cust.fullName || 'Customer'}</strong> (${cust.city || 'India'})</span>
                <span>Payment: <strong>${order.paymentMethod || 'Cash on Delivery'}</strong></span>
              </div>
              <div class="order-footer-total">
                <span class="label">Total Amount:</span>
                <span class="amount">${window.ProductService.formatPrice(order.total || 0)}</span>
              </div>
            </div>

            <div class="order-history-actions" style="margin-top: 18px; padding-top: 14px; border-top: 1px dashed var(--color-border-light); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <a href="order-confirmation.html?orderId=${encodeURIComponent(order.orderId)}" class="btn-outline-gold" style="font-size: 0.86rem; padding: 7px 16px; border-radius: var(--radius-sm); text-decoration: none;">
                📄 View Order Receipt
              </a>
              <a href="shop.html" class="btn-secondary" style="font-size: 0.86rem; padding: 7px 16px;">
                Continue Shopping →
              </a>
            </div>
          </div>
        </div>
      `;
    });

    ordersHtml += `</div>`;
    root.innerHTML = ordersHtml;
  }

  /* =========================================================================
     15. Step 6: Customer Login Controller
     ========================================================================= */
  function initLoginPage() {
    const form = document.getElementById('login-form');
    if (!form || !window.AuthService) return;

    // If already logged in, redirect away
    if (window.AuthService.isAuthenticated()) {
      const redirectTarget = window.AuthService.getRedirectTarget('profile.html');
      window.location.href = redirectTarget;
      return;
    }

    const identifierInput = document.getElementById('login-identifier');
    const passwordInput = document.getElementById('login-password');
    const btnTogglePass = document.getElementById('btn-toggle-login-pass');
    const btnFillDemo = document.getElementById('btn-fill-demo');
    const errorIdentifier = document.getElementById('error-login-identifier');
    const errorPassword = document.getElementById('error-login-password');
    const linkToRegister = document.getElementById('link-to-register');

    // Preserve redirect param on register link and tabs
    const redirectParam = new URLSearchParams(window.location.search).get('redirect');
    if (redirectParam && linkToRegister) {
      linkToRegister.href = `register.html?redirect=${encodeURIComponent(redirectParam)}`;
    }
    const tabRegister = document.getElementById('tab-register');
    if (redirectParam && tabRegister) {
      tabRegister.href = `register.html?redirect=${encodeURIComponent(redirectParam)}`;
    }

    // Forgot password handler
    const forgotLink = document.getElementById('link-forgot-pass');
    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        const userInput = prompt('Enter your registered email address or 10-digit mobile number to reset password:');
        if (userInput && userInput.trim()) {
          const msg = `Password reset instructions sent to ${userInput.trim()}. For instant demo access, sign in with password: password123`;
          if (window.CartService && window.CartService.showToast) {
            window.CartService.showToast(msg, 'success');
          } else {
            alert(msg);
          }
        }
      });
    }

    // Autofill demo credentials
    if (btnFillDemo && identifierInput && passwordInput) {
      btnFillDemo.addEventListener('click', () => {
        identifierInput.value = 'demo@uniquecollection.com';
        passwordInput.value = 'password123';
        if (errorIdentifier) errorIdentifier.classList.remove('visible');
        if (errorPassword) errorPassword.classList.remove('visible');
        identifierInput.classList.remove('input-error');
        passwordInput.classList.remove('input-error');
        if (window.CartService && window.CartService.showToast) {
          window.CartService.showToast('Demo credentials filled!', 'info');
        }
      });
    }

    // Toggle password visibility
    if (btnTogglePass && passwordInput) {
      btnTogglePass.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        btnTogglePass.setAttribute('title', isPassword ? 'Hide password' : 'Show password');
        btnTogglePass.innerHTML = isPassword ? `
          <svg class="icon-eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        ` : `
          <svg class="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      });
    }

    // Clear error on input
    if (identifierInput) {
      identifierInput.addEventListener('input', () => {
        if (errorIdentifier) errorIdentifier.classList.remove('visible');
        identifierInput.classList.remove('input-error');
      });
    }
    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        if (errorPassword) errorPassword.classList.remove('visible');
        passwordInput.classList.remove('input-error');
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const idVal = identifierInput ? identifierInput.value.trim() : '';
      const passVal = passwordInput ? passwordInput.value : '';

      if (!idVal) {
        if (errorIdentifier) {
          errorIdentifier.textContent = 'Please enter your email address or 10-digit mobile number.';
          errorIdentifier.classList.add('visible');
        }
        if (identifierInput) identifierInput.classList.add('input-error');
        isValid = false;
      }

      if (!passVal) {
        if (errorPassword) {
          errorPassword.textContent = 'Please enter your password.';
          errorPassword.classList.add('visible');
        }
        if (passwordInput) passwordInput.classList.add('input-error');
        isValid = false;
      }

      if (!isValid) return;

      const btnSubmit = document.getElementById('btn-login-submit');
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<span>Signing In...</span>`;
      }

      setTimeout(() => {
        const result = window.AuthService.login(idVal, passVal);
        if (result.success) {
          if (window.CartService && window.CartService.showToast) {
            window.CartService.showToast(result.message || 'Login successful!', 'success');
          }
          const target = window.AuthService.getRedirectTarget('profile.html');
          setTimeout(() => {
            window.location.href = target;
          }, 350);
        } else {
          if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `<span>Sign In</span><span>→</span>`;
          }
          if (errorPassword) {
            errorPassword.textContent = result.message || 'Invalid credentials.';
            errorPassword.classList.add('visible');
          }
          if (passwordInput) passwordInput.classList.add('input-error');
          if (window.CartService && window.CartService.showToast) {
            window.CartService.showToast(result.message, 'info');
          }
        }
      }, 300);
    });
  }

  /* =========================================================================
     16. Step 6: Customer Registration Controller
     ========================================================================= */
  function initRegisterPage() {
    const form = document.getElementById('register-form');
    if (!form || !window.AuthService) return;

    if (window.AuthService.isAuthenticated()) {
      const redirectTarget = window.AuthService.getRedirectTarget('profile.html');
      window.location.href = redirectTarget;
      return;
    }

    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const mobileInput = document.getElementById('reg-mobile');
    const passInput = document.getElementById('reg-password');
    const confirmPassInput = document.getElementById('reg-confirm-password');

    const btnTogglePass = document.getElementById('btn-toggle-reg-pass');
    const btnToggleConfirmPass = document.getElementById('btn-toggle-reg-confirm-pass');

    const errorName = document.getElementById('error-reg-name');
    const errorEmail = document.getElementById('error-reg-email');
    const errorMobile = document.getElementById('error-reg-mobile');
    const errorPass = document.getElementById('error-reg-password');
    const errorConfirmPass = document.getElementById('error-reg-confirm-password');
    const linkToLogin = document.getElementById('link-to-login');

    const redirectParam = new URLSearchParams(window.location.search).get('redirect');
    if (redirectParam && linkToLogin) {
      linkToLogin.href = `login.html?redirect=${encodeURIComponent(redirectParam)}`;
    }
    const tabLogin = document.getElementById('tab-login');
    if (redirectParam && tabLogin) {
      tabLogin.href = `login.html?redirect=${encodeURIComponent(redirectParam)}`;
    }

    function setupPassToggle(btn, input) {
      if (!btn || !input) return;
      btn.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.innerHTML = isPassword ? `
          <svg class="icon-eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        ` : `
          <svg class="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      });
    }

    setupPassToggle(btnTogglePass, passInput);
    setupPassToggle(btnToggleConfirmPass, confirmPassInput);

    const mobileWrap = document.getElementById('reg-mobile-wrap');

    // Format mobile to 10 digits
    if (mobileInput) {
      mobileInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        if (errorMobile) errorMobile.classList.remove('visible');
        mobileInput.classList.remove('input-error');
        if (mobileWrap) mobileWrap.classList.remove('input-error');
      });
    }

    // Input listeners to clear error states
    [
      { el: nameInput, err: errorName },
      { el: emailInput, err: errorEmail },
      { el: passInput, err: errorPass },
      { el: confirmPassInput, err: errorConfirmPass }
    ].forEach(item => {
      if (item.el) {
        item.el.addEventListener('input', () => {
          if (item.err) item.err.classList.remove('visible');
          item.el.classList.remove('input-error');
        });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // 1. Full name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        if (errorName) {
          errorName.textContent = 'Please enter your full name (at least 2 letters).';
          errorName.classList.add('visible');
        }
        if (nameInput) nameInput.classList.add('input-error');
        isValid = false;
      }

      // 2. Mobile
      const mobileVal = mobileInput ? mobileInput.value.trim() : '';
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileVal || !mobileRegex.test(mobileVal)) {
        if (errorMobile) {
          errorMobile.textContent = 'Please enter a valid 10-digit Indian mobile number.';
          errorMobile.classList.add('visible');
        }
        if (mobileInput) mobileInput.classList.add('input-error');
        if (mobileWrap) mobileWrap.classList.add('input-error');
        isValid = false;
      }

      // 3. Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        if (errorEmail) {
          errorEmail.textContent = 'Please enter a valid email address.';
          errorEmail.classList.add('visible');
        }
        if (emailInput) emailInput.classList.add('input-error');
        isValid = false;
      }

      // 4. Password
      const passVal = passInput ? passInput.value : '';
      if (!passVal || passVal.length < 6) {
        if (errorPass) {
          errorPass.textContent = 'Password must be at least 6 characters long.';
          errorPass.classList.add('visible');
        }
        if (passInput) passInput.classList.add('input-error');
        isValid = false;
      }

      // 5. Confirm password
      const confirmVal = confirmPassInput ? confirmPassInput.value : '';
      if (!confirmVal || confirmVal !== passVal) {
        if (errorConfirmPass) {
          errorConfirmPass.textContent = 'Passwords do not match. Please verify.';
          errorConfirmPass.classList.add('visible');
        }
        if (confirmPassInput) confirmPassInput.classList.add('input-error');
        isValid = false;
      }

      if (!isValid) return;

      const btnSubmit = document.getElementById('btn-register-submit');
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<span>Creating Account...</span>`;
      }

      setTimeout(() => {
        const result = window.AuthService.register({
          fullName: nameVal,
          email: emailVal,
          mobile: mobileVal,
          password: passVal
        });

        if (result.success) {
          const target = window.AuthService.getRedirectTarget('profile.html');
          const isCheckout = target.includes('checkout');
          const welcomeMsg = isCheckout
            ? `Welcome, ${result.user.fullName}! Continuing to Checkout...`
            : `Welcome to UNIQUE COLLECTION, ${result.user.fullName}! ✨`;

          if (window.CartService && window.CartService.showToast) {
            window.CartService.showToast(welcomeMsg, 'success');
          }
          setTimeout(() => {
            window.location.href = target;
          }, 350);
        } else {
          if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `<span>Create Account</span><span>→</span>`;
          }
          if (errorEmail) {
            errorEmail.textContent = result.message;
            errorEmail.classList.add('visible');
          }
          if (emailInput) emailInput.classList.add('input-error');
          if (window.CartService && window.CartService.showToast) {
            window.CartService.showToast(result.message, 'info');
          }
        }
      }, 350);
    });
  }

  /* =========================================================================
     17. Step 6: User Profile Controller
     ========================================================================= */
  function initProfilePage() {
    if (!window.AuthService) return;

    // Guard with authentication
    if (!window.AuthService.requireAuth('profile.html')) return;

    const currentUser = window.AuthService.getCurrentUser();
    if (!currentUser) return;

    const avatarInitialsEl = document.getElementById('profile-avatar-initials');
    const displayNameEl = document.getElementById('profile-display-name');
    const displayEmailEl = document.getElementById('profile-display-email');
    const nameInput = document.getElementById('profile-name');
    const mobileInput = document.getElementById('profile-mobile');
    const emailInput = document.getElementById('profile-email');
    const statOrdersEl = document.getElementById('stat-order-count');
    const statCartEl = document.getElementById('stat-cart-count');
    const form = document.getElementById('profile-edit-form');
    const btnLogout = document.getElementById('btn-profile-logout');
    const feedbackEl = document.getElementById('profile-save-feedback');
    const errorName = document.getElementById('error-profile-name');
    const errorMobile = document.getElementById('error-profile-mobile');

    function syncUserDisplay() {
      const u = window.AuthService.getCurrentUser();
      if (!u) return;
      if (avatarInitialsEl) {
        avatarInitialsEl.textContent = (u.fullName || 'U').charAt(0).toUpperCase();
      }
      if (displayNameEl) displayNameEl.textContent = u.fullName || 'Customer';
      if (displayEmailEl) displayEmailEl.textContent = u.email || '';
      if (nameInput) nameInput.value = u.fullName || '';
      if (mobileInput) mobileInput.value = u.mobile || '';
      if (emailInput) emailInput.value = u.email || '';
    }

    syncUserDisplay();

    // Stats
    if (statOrdersEl && window.CartService) {
      const userOrders = window.CartService.getOrders(currentUser);
      statOrdersEl.textContent = userOrders ? userOrders.length : 0;
    }
    if (statCartEl && window.CartService) {
      statCartEl.textContent = window.CartService.getItemCount();
    }
    const statWishlistEl = document.getElementById('stat-wishlist-count');
    if (statWishlistEl && window.CartService) {
      statWishlistEl.textContent = window.CartService.getWishlistCount();
    }

    // Default Delivery Address Preview
    const addressContentEl = document.getElementById('profile-address-content');
    if (addressContentEl && window.CartService) {
      const userOrders = window.CartService.getOrders(currentUser);
      if (userOrders && userOrders.length > 0 && userOrders[0].customer) {
        const c = userOrders[0].customer;
        addressContentEl.innerHTML = `
          <p style="margin-bottom: 4px; font-weight: 600; color: var(--color-dark);">${c.fullName || currentUser.fullName}</p>
          <p style="margin-bottom: 4px; color: var(--color-text-muted);">${c.address || ''}, ${c.locality || ''}</p>
          <p style="margin-bottom: 0; color: var(--color-text-muted);">${c.city || ''}, ${c.state || ''} - <strong>${c.pincode || ''}</strong></p>
          <p style="margin-top: 6px; font-size: 0.85rem; color: var(--color-primary); font-weight: 500;">📞 +91 ${c.mobile || currentUser.mobile || ''}</p>
        `;
      } else {
        addressContentEl.innerHTML = `
          <p style="color: var(--color-text-muted); margin: 0; font-size: 0.9rem;">
            No saved delivery address yet. When you complete your first order at checkout, your address will appear here.
          </p>
        `;
      }
    }

    // Mobile input cleaning
    if (mobileInput) {
      mobileInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        if (errorMobile) errorMobile.classList.remove('visible');
        mobileInput.classList.remove('input-error');
      });
    }

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        if (errorName) errorName.classList.remove('visible');
        nameInput.classList.remove('input-error');
      });
    }

    // Save profile form
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const newName = nameInput ? nameInput.value.trim() : '';
        if (!newName || newName.length < 2) {
          if (errorName) {
            errorName.textContent = 'Please enter your full name (at least 2 letters).';
            errorName.classList.add('visible');
          }
          if (nameInput) nameInput.classList.add('input-error');
          isValid = false;
        }

        const newMobile = mobileInput ? mobileInput.value.trim() : '';
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!newMobile || !mobileRegex.test(newMobile)) {
          if (errorMobile) {
            errorMobile.textContent = 'Please enter a valid 10-digit Indian mobile number.';
            errorMobile.classList.add('visible');
          }
          if (mobileInput) mobileInput.classList.add('input-error');
          isValid = false;
        }

        if (!isValid) return;

        const result = window.AuthService.updateProfile({
          fullName: newName,
          mobile: newMobile
        });

        if (result.success) {
          syncUserDisplay();
          if (feedbackEl) {
            feedbackEl.style.display = 'inline-flex';
            setTimeout(() => {
              feedbackEl.style.display = 'none';
            }, 3000);
          }
          if (window.CartService && window.CartService.showToast) {
            window.CartService.showToast('Profile updated successfully!', 'success');
          }
        } else {
          if (window.CartService && window.CartService.showToast) {
            window.CartService.showToast(result.message, 'info');
          }
        }
      });
    }

    // Logout
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        window.AuthService.logout('login.html');
      });
    }
  }

  /* =========================================================================
     18. Customer Wishlist Page Controller
     ========================================================================= */
  function initWishlistPage() {
    if (!window.CartService) return;

    const wishlistRoot = document.getElementById('wishlist-root');
    const toolbar = document.getElementById('wishlist-toolbar');
    const grid = document.getElementById('wishlist-grid');
    const emptyState = document.getElementById('wishlist-empty-state');
    const countDisplay = document.getElementById('wishlist-count-display');
    const btnClear = document.getElementById('btn-clear-wishlist');

    if (!wishlistRoot) return;

    function renderWishlist() {
      const items = window.CartService.getWishlist();

      if (!items || items.length === 0) {
        if (toolbar) toolbar.style.display = 'none';
        if (grid) grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';
      if (toolbar) toolbar.style.display = 'flex';
      if (grid) grid.style.display = 'grid';

      if (countDisplay) {
        countDisplay.textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'}`;
      }

      if (grid) {
        grid.innerHTML = '';
        items.forEach(item => {
          // Look up full catalog item if available for richer data like defaultSize and originalPrice
          const fullProduct = (window.ProductService && window.ProductService.getProductById)
            ? window.ProductService.getProductById(item.id)
            : null;

          const product = fullProduct || item;
          const detailUrl = getPageUrl(`product-details.html?id=${encodeURIComponent(product.id)}`);
          const price = Number(product.price) || 0;
          const origPrice = Number(product.originalPrice || price);
          const hasDiscount = origPrice > price;
          const discountPct = hasDiscount ? Math.round(((origPrice - price) / origPrice) * 100) : 0;
          const categoryName = product.category || 'Women Fashion';
          const defaultSize = product.defaultSize || (product.sizes && product.sizes[0]) || 'Standard';

          const card = document.createElement('div');
          card.className = 'wishlist-card';
          card.innerHTML = `
            <div class="wishlist-media-wrap">
              <a href="${detailUrl}">
                <img src="${getRootUrl(product.image)}" alt="${product.name}" class="wishlist-img" loading="lazy">
              </a>
              <button type="button" class="btn-remove-wishlist-item" title="Remove from Wishlist" aria-label="Remove ${product.name} from wishlist">
                ✕
              </button>
            </div>
            <div class="wishlist-card-info">
              <span class="wishlist-item-category">${categoryName}</span>
              <h3 class="wishlist-item-title">
                <a href="${detailUrl}">${product.name}</a>
              </h3>
              <div class="wishlist-price-row">
                <span class="wishlist-price-current">${window.ProductService ? window.ProductService.formatPrice(price) : '₹' + price}</span>
                ${hasDiscount ? `<span class="wishlist-price-original">₹${origPrice}</span><span class="wishlist-discount-pill">${discountPct}% OFF</span>` : ''}
              </div>
              <div class="wishlist-actions">
                <button type="button" class="btn-wishlist-move" data-id="${product.id}">
                  <span>🛒 Move to Cart</span>
                </button>
              </div>
            </div>
          `;

          // Remove item listener
          const btnRemove = card.querySelector('.btn-remove-wishlist-item');
          if (btnRemove) {
            btnRemove.addEventListener('click', (e) => {
              e.preventDefault();
              window.CartService.toggleWishlist(product);
              renderWishlist();
            });
          }

          // Move to bag listener
          const btnMove = card.querySelector('.btn-wishlist-move');
          if (btnMove) {
            btnMove.addEventListener('click', () => {
              const added = window.CartService.addItem(product, defaultSize, 1, product.color || '');
              if (added !== false) {
                // Remove from wishlist on move to bag
                window.CartService.toggleWishlist(product);
                renderWishlist();
              }
            });
          }

          grid.appendChild(card);
        });
      }
    }

    // Clear all listener
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove all saved items from your wishlist?')) {
          window.CartService.saveWishlist([]);
          if (window.CartService.showToast) {
            window.CartService.showToast('Wishlist has been cleared.', 'info');
          }
          renderWishlist();
        }
      });
    }

    renderWishlist();
  }

})();

