// E-commerce layout mockup — Shop, Cart, Checkout pages.
// ALL interactive elements have tabIndex={-1} — inside aria-hidden LayoutPreview.

interface Props {
  activePage: number
  onPageChange: (page: number) => void
}

const PAGES = ['Shop', 'Cart', 'Checkout']

const CATEGORIES = ['All', 'Clothing', 'Electronics', 'Home', 'Sport']

const PRODUCTS = [
  { id: 1, name: 'Merino Wool Tee', price: '$48', badge: 'New', color: '#E8E4DC' },
  { id: 2, name: 'Slim Chino', price: '$89', badge: null, color: '#C4B9A8' },
  { id: 3, name: 'Canvas Tote', price: '$36', badge: 'Sale', color: '#D4C5B0' },
  { id: 4, name: 'Leather Belt', price: '$55', badge: null, color: '#8B7355' },
  { id: 5, name: 'Oxford Shirt', price: '$74', badge: 'New', color: '#C8D5E8' },
  { id: 6, name: 'Denim Jacket', price: '$128', badge: null, color: '#7A8FA6' },
]

const CART_ITEMS = [
  { name: 'Merino Wool Tee', size: 'M', qty: 1, price: '$48', color: '#E8E4DC' },
  { name: 'Canvas Tote', size: 'One size', qty: 2, price: '$72', color: '#D4C5B0' },
  { name: 'Oxford Shirt', size: 'L', qty: 1, price: '$74', color: '#C8D5E8' },
]

function ShopPage() {
  return (
    <div className="ecom-shop">
      <aside className="ecom-sidebar">
        <p className="ecom-sidebar__heading">Categories</p>
        <ul className="ecom-sidebar__list">
          {CATEGORIES.map((cat, i) => (
            <li key={cat}>
              <button
                className={`ecom-sidebar__item${i === 0 ? ' ecom-sidebar__item--active' : ''}`}
                tabIndex={-1}
                aria-hidden="true"
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
        <div className="ecom-sidebar__filter">
          <p className="ecom-sidebar__heading">Price</p>
          <div className="ecom-price-range">
            <div className="ecom-price-range__track">
              <div className="ecom-price-range__fill" />
            </div>
            <div className="ecom-price-range__labels">
              <span>$0</span>
              <span>$200</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="ecom-product-area">
        <div className="ecom-sort-bar">
          <p className="ecom-sort-bar__count">24 products</p>
          <select className="ecom-sort-bar__select" tabIndex={-1} aria-hidden="true">
            <option>Sort: Featured</option>
          </select>
        </div>
        <div className="ecom-grid">
          {PRODUCTS.map(product => (
            <div key={product.id} className="ecom-product-card">
              <div
                className="ecom-product-card__image"
                style={{ background: product.color }}
                aria-hidden="true"
              />
              {product.badge && (
                <span className="ecom-product-card__badge">{product.badge}</span>
              )}
              <div className="ecom-product-card__info">
                <p className="ecom-product-card__name">{product.name}</p>
                <div className="ecom-product-card__footer">
                  <p className="ecom-product-card__price">{product.price}</p>
                  <button
                    className="ecom-product-card__add"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CartPage() {
  return (
    <div className="ecom-cart">
      <div className="ecom-cart__items">
        <p className="ecom-cart__heading">Your Cart (3)</p>
        {CART_ITEMS.map(item => (
          <div key={item.name + item.size} className="ecom-cart-item">
            <div
              className="ecom-cart-item__thumb"
              style={{ background: item.color }}
              aria-hidden="true"
            />
            <div className="ecom-cart-item__info">
              <p className="ecom-cart-item__name">{item.name}</p>
              <p className="ecom-cart-item__meta">Size: {item.size}</p>
              <div className="ecom-cart-item__qty-row">
                <button className="ecom-qty-btn" tabIndex={-1} aria-hidden="true">−</button>
                <span className="ecom-qty-value">{item.qty}</span>
                <button className="ecom-qty-btn" tabIndex={-1} aria-hidden="true">+</button>
              </div>
            </div>
            <div className="ecom-cart-item__right">
              <p className="ecom-cart-item__price">{item.price}</p>
              <button className="ecom-cart-item__remove" tabIndex={-1} aria-hidden="true">✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="ecom-order-summary">
        <p className="ecom-order-summary__heading">Order Summary</p>
        <div className="ecom-order-summary__rows">
          <div className="ecom-summary-row"><span>Subtotal</span><span>$194</span></div>
          <div className="ecom-summary-row"><span>Shipping</span><span>Free</span></div>
          <div className="ecom-summary-row"><span>Tax (8%)</span><span>$15.52</span></div>
          <div className="ecom-summary-row ecom-summary-row--total">
            <span>Total</span><span>$209.52</span>
          </div>
        </div>
        <button className="ecom-btn-checkout" tabIndex={-1} aria-hidden="true">
          Proceed to Checkout
        </button>
        <button className="ecom-btn-continue" tabIndex={-1} aria-hidden="true">
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

function CheckoutPage() {
  return (
    <div className="ecom-checkout">
      <div className="ecom-checkout__form">
        <p className="ecom-checkout__section-title">Shipping</p>
        <div className="ecom-form-grid">
          <div className="ecom-form-field">
            <label className="ecom-form-label">First name</label>
            <div className="ecom-form-input" aria-hidden="true">Aria</div>
          </div>
          <div className="ecom-form-field">
            <label className="ecom-form-label">Last name</label>
            <div className="ecom-form-input" aria-hidden="true">Chen</div>
          </div>
          <div className="ecom-form-field ecom-form-field--full">
            <label className="ecom-form-label">Address</label>
            <div className="ecom-form-input" aria-hidden="true">123 Market Street</div>
          </div>
          <div className="ecom-form-field">
            <label className="ecom-form-label">City</label>
            <div className="ecom-form-input" aria-hidden="true">San Francisco</div>
          </div>
          <div className="ecom-form-field">
            <label className="ecom-form-label">Zip</label>
            <div className="ecom-form-input" aria-hidden="true">94105</div>
          </div>
        </div>

        <p className="ecom-checkout__section-title">Payment</p>
        <div className="ecom-payment-methods">
          {['Card', 'Apple Pay', 'PayPal'].map((method, i) => (
            <button
              key={method}
              className={`ecom-payment-method${i === 0 ? ' ecom-payment-method--active' : ''}`}
              tabIndex={-1}
              aria-hidden="true"
            >
              {method}
            </button>
          ))}
        </div>
        <div className="ecom-form-grid">
          <div className="ecom-form-field ecom-form-field--full">
            <label className="ecom-form-label">Card number</label>
            <div className="ecom-form-input ecom-form-input--card" aria-hidden="true">
              •••• •••• •••• 4242
            </div>
          </div>
          <div className="ecom-form-field">
            <label className="ecom-form-label">Expiry</label>
            <div className="ecom-form-input" aria-hidden="true">12/27</div>
          </div>
          <div className="ecom-form-field">
            <label className="ecom-form-label">CVC</label>
            <div className="ecom-form-input" aria-hidden="true">•••</div>
          </div>
        </div>
      </div>

      <div className="ecom-order-summary ecom-order-summary--compact">
        <p className="ecom-order-summary__heading">Order (3 items)</p>
        {CART_ITEMS.map(item => (
          <div key={item.name} className="ecom-summary-item">
            <span>{item.name}</span>
            <span>{item.price}</span>
          </div>
        ))}
        <div className="ecom-summary-divider" />
        <div className="ecom-summary-row ecom-summary-row--total">
          <span>Total</span><span>$209.52</span>
        </div>
        <button className="ecom-btn-checkout" tabIndex={-1} aria-hidden="true">
          Place Order
        </button>
      </div>
    </div>
  )
}

const PAGE_COMPONENTS = [ShopPage, CartPage, CheckoutPage]

export function EcommerceLayout({ activePage, onPageChange }: Props) {
  const PageComponent = PAGE_COMPONENTS[activePage] ?? ShopPage

  return (
    <div className="ecom-layout">
      {/* Top nav — page names as primary nav */}
      <header className="ecom-header">
        <div className="ecom-header__brand">
          <span className="ecom-header__logo" aria-hidden="true">◉</span>
          <span className="ecom-header__name">Maison</span>
        </div>
        <div className="ecom-header__nav">
          {PAGES.map((page, i) => (
            <button
              key={page}
              className={`ecom-header__nav-link${activePage === i ? ' ecom-header__nav-link--active' : ''}`}
              onClick={() => onPageChange(i)}
              tabIndex={-1}
            >
              {page}
            </button>
          ))}
        </div>
        <div className="ecom-header__actions">
          <button className="ecom-header__icon-btn" tabIndex={-1} aria-hidden="true">⊙</button>
          <button
            className="ecom-header__icon-btn"
            onClick={() => onPageChange(1)}
            tabIndex={-1}
          >
            ◫ 3
          </button>
        </div>
      </header>

      {/* Page content */}
      <div className="ecom-body" role="tabpanel">
        <PageComponent />
      </div>
    </div>
  )
}
