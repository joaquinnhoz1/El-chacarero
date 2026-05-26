// Public catalog: hero, category filter, search, product grid, detail modal, cart drawer, WhatsApp checkout.

const CART_KEY = "chacarero_cart_v1";

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
};
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

function useCart() {
  const [cart, setCart] = useState(loadCart);
  useEffect(() => saveCart(cart), [cart]);
  const add = (productId, qty = 1) => {
    setCart((c) => {
      const i = c.findIndex((x) => x.id === productId);
      if (i >= 0) {
        const next = [...c];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...c, { id: productId, qty }];
    });
  };
  const setQty = (productId, qty) =>
    setCart((c) =>
      qty <= 0
        ? c.filter((x) => x.id !== productId)
        : c.map((x) => (x.id === productId ? { ...x, qty } : x))
    );
  const remove = (productId) => setCart((c) => c.filter((x) => x.id !== productId));
  const clear = () => setCart([]);
  return { cart, add, setQty, remove, clear };
}

// ----- Hero -----
const Hero = ({ business }) => (
  <section className="hero">
    <div className="container">
      <div className="hero-grid">
        <div>
          <h1>
            Indumentaria <em>de campo</em><br /> con tradición.
          </h1>
          <p>
            {business.tagline}. Boinas, fajas, cuchillos artesanales, mates, sombreros y todo lo necesario para vestirse y vivir el campo. Hacemos envíos a todo el país.
          </p>
          <div className="hero-meta">
            <span><Icon name="pin" size={16} /> {business.address}</span>
            <span><Icon name="clock" size={16} /> {business.hours}</span>
            <span><Icon name="whatsapp" size={16} /> {business.whatsappDisplay}</span>
          </div>
        </div>
        <div>
          <div className="hero-stamp">
            <div className="label">Desde</div>
            <div className="big">1987</div>
            <div className="label">Productos del campo</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ----- Topbar -----
const Topbar = ({ query, setQuery, cartCount, onOpenCart, onGoHome }) => (
  <header className="topbar">
    <div className="container">
      <div className="topbar-inner">
        <div className="brand" onClick={onGoHome}>
          El Chacarero
          <small>Regionales · Saladillo</small>
        </div>
        <div className="topbar-search">
          <Icon name="search" size={16} className="icon" />
          <input
            type="search"
            placeholder="Buscar boina, cuchillo, mate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="topbar-actions">
          <button className="cart-btn" onClick={onOpenCart} aria-label="Ver carrito">
            <Icon name="bag" size={18} />
            <span>Carrito</span>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </div>
  </header>
);

// ----- Category strip -----
const CategoryStrip = ({ categories, active, setActive, counts, sort, setSort, total, view, setView }) => (
  <>
    <div className="container">
      <nav className="cat-strip" aria-label="Categorías">
        <button
          className={"cat-chip " + (active === "all" ? "active" : "")}
          onClick={() => setActive("all")}
        >
          Todo <span className="count">{Object.values(counts).reduce((a, b) => a + b, 0)}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={"cat-chip " + (active === c.id ? "active" : "")}
            onClick={() => setActive(c.id)}
          >
            <span className="dot" style={{ background: c.color }} />
            {c.name}
            <span className="count">{counts[c.id] || 0}</span>
          </button>
        ))}
      </nav>
    </div>
    <div className="container">
      <div className="toolbar">
        <div className="toolbar-info">
          <strong>{total}</strong> {total === 1 ? "producto" : "productos"}
        </div>
        <div className="toolbar-controls">
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Destacados primero</option>
            <option value="name">Nombre A–Z</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
          <div className="view-toggle" role="tablist">
            <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Vista grilla">
              <Icon name="grid" size={16} />
            </button>
            <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="Vista lista">
              <Icon name="list" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);

// ----- Product card -----
const ProductCard = ({ product, category, onClick, onAdd }) => (
  <article
    className={"pcard" + (product.inStock ? "" : " out-of-stock")}
    onClick={onClick}
    role="button"
    tabIndex={0}
  >
    <div className="pcard-badges">
      {product.featured && product.inStock && (
        <span className="pcard-badge featured">
          <Icon name="star" size={11} /> Destacado
        </span>
      )}
      {!product.inStock && <span className="pcard-badge out">Sin stock</span>}
    </div>
    <div className="pcard-media">
      <ProductImage product={product} />
    </div>
    <div className="pcard-body">
      <div className="pcard-cat">{category?.name || "—"}</div>
      <h3 className="pcard-name">{product.name}</h3>
      <div className="pcard-foot">
        <div>
          <div className="pcard-price">{STORE.formatPrice(product.price)}</div>
          <div className="pcard-unit">por {STORE.formatUnit(product.unit)}</div>
        </div>
        {product.inStock && (
          <button
            className="pcard-add"
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            aria-label={"Agregar " + product.name}
          >
            <Icon name="plus" size={18} />
          </button>
        )}
      </div>
    </div>
  </article>
);

// ----- Quantity controls -----
const QtyControls = ({ qty, setQty, min = 1, max = 99 }) => (
  <div className="qty-controls">
    <button onClick={() => setQty(Math.max(min, qty - 1))} aria-label="Restar"><Icon name="minus" size={14} /></button>
    <input
      type="number"
      value={qty}
      min={min}
      max={max}
      onChange={(e) => setQty(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
    />
    <button onClick={() => setQty(Math.min(max, qty + 1))} aria-label="Sumar"><Icon name="plus" size={14} /></button>
  </div>
);

// ----- Product detail modal -----
const ProductDetail = ({ product, category, onClose, onAdd }) => {
  const [qty, setQty] = useState(1);
  if (!product) return null;
  return (
    <Modal open={true} onClose={onClose} size="lg" ariaLabel={product.name}>
      <div className="pdetail">
        <div className="pdetail-media">
          <ProductImage product={product} />
        </div>
        <div>
          <span className="tag">{category?.name || "—"}</span>
          <h2>{product.name}</h2>
          <div className="price">{STORE.formatPrice(product.price)} <span style={{ fontSize: 14, color: "var(--muted)", fontFamily: "var(--font-body)" }}>por {STORE.formatUnit(product.unit)}</span></div>
          <p className="desc">{product.description || "Sin descripción."}</p>
          <div className="divider"></div>
          {product.inStock ? (
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <QtyControls qty={qty} setQty={setQty} />
              <button
                className="btn btn-primary"
                onClick={() => { onAdd(product.id, qty); onClose(); }}
                style={{ flex: 1, minWidth: 200, padding: "12px 18px", fontSize: 15 }}
              >
                <Icon name="bag" size={16} /> Agregar al carrito
              </button>
            </div>
          ) : (
            <div className="pill red" style={{ padding: "8px 14px", fontSize: 13 }}>
              Sin stock actualmente. Consultanos por WhatsApp.
            </div>
          )}
          <div className="muted" style={{ marginTop: 16, fontSize: 13 }}>
            <Icon name="check" size={14} style={{ verticalAlign: "-2px", color: "var(--olive)" }} /> Envíos por correo a todo el país<br/>
            <Icon name="check" size={14} style={{ verticalAlign: "-2px", color: "var(--olive)" }} /> Retiro sin cargo en el local
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ----- Cart drawer -----
const CartDrawer = ({ open, onClose, cart, products, onSetQty, onRemove, onClear, business }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [delivery, setDelivery] = useState("retiro"); // retiro | envio
  const toast = useToast();

  const items = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.id) }))
    .filter((x) => x.product);

  const subtotal = items.reduce((s, x) => s + x.product.price * x.qty, 0);
  const count = items.reduce((s, x) => s + x.qty, 0);

  const sendWhatsApp = () => {
    if (items.length === 0) return;
    const lines = [
      `*Pedido — ${business.name}*`,
      "",
      ...items.map((i) => `• ${i.qty} x ${i.product.name} — ${STORE.formatPrice(i.product.price * i.qty)}`),
      "",
      `*Total: ${STORE.formatPrice(subtotal)}*`,
      "",
      `Cliente: ${name || "—"}`,
      `Teléfono: ${phone || "—"}`,
      delivery === "envio" ? `Envío a: ${address || "—"}` : "Retira por el local",
      notes ? `Notas: ${notes}` : "",
    ].filter(Boolean).join("\n");

    const wa = business.whatsapp.replace(/\D/g, "");
    const url = `https://wa.me/${wa}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank");
    toast("Abriendo WhatsApp...", { kind: "success" });
  };

  return (
    <Drawer open={open} onClose={onClose} title={`Tu pedido${count > 0 ? ` · ${count}` : ""}`} width={460}>
      {items.length === 0 ? (
        <EmptyState
          icon="bag"
          title="Tu carrito está vacío"
          hint="Agregá productos del catálogo para armar tu pedido."
        />
      ) : (
        <>
          <div className="cart-list">
            {items.map((i) => (
              <div className="cart-item" key={i.id}>
                <div className="cart-item-media">
                  <ProductImage product={i.product} />
                </div>
                <div>
                  <h4 className="cart-item-name">{i.product.name}</h4>
                  <div className="cart-item-meta">
                    <span>{STORE.formatPrice(i.product.price)} / {STORE.formatUnit(i.product.unit)}</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <QtyControls qty={i.qty} setQty={(q) => onSetQty(i.id, q)} min={1} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <div className="cart-item-price">{STORE.formatPrice(i.product.price * i.qty)}</div>
                  <button className="cart-item-remove" onClick={() => onRemove(i.id)} aria-label="Quitar">
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "16px 22px" }}>
            <h4 style={{ fontSize: 14, marginBottom: 10, fontFamily: "var(--font-head)" }}>Datos del pedido</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
              <input placeholder="Teléfono / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className={"btn " + (delivery === "retiro" ? "btn-dark" : "btn-ghost")}
                  style={{ flex: 1 }}
                  onClick={() => setDelivery("retiro")}
                >
                  Retiro en local
                </button>
                <button
                  type="button"
                  className={"btn " + (delivery === "envio" ? "btn-dark" : "btn-ghost")}
                  style={{ flex: 1 }}
                  onClick={() => setDelivery("envio")}
                >
                  Envío a domicilio
                </button>
              </div>
              {delivery === "envio" && (
                <input placeholder="Dirección de entrega" value={address} onChange={(e) => setAddress(e.target.value)} />
              )}
              <textarea
                placeholder="Notas o aclaraciones (opcional)"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="cart-foot">
            <div className="cart-row">
              <span className="muted">Productos</span>
              <span>{count}</span>
            </div>
            <div className="cart-row total">
              <span className="label">Total</span>
              <span className="val">{STORE.formatPrice(subtotal)}</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "13px", fontSize: 15, background: "#1f7a3d" }}
              onClick={sendWhatsApp}
              disabled={items.length === 0}
            >
              <Icon name="whatsapp" size={18} /> Enviar pedido por WhatsApp
            </button>
            <button
              className="btn btn-ghost"
              style={{ width: "100%", marginTop: 8, fontSize: 13 }}
              onClick={onClear}
            >
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </Drawer>
  );
};

// ----- Footer -----
const Footer = ({ business, onAdminClick }) => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <div className="brand">{business.name}<small>{business.tagline}</small></div>
          <p style={{ marginTop: 14, maxWidth: 380, opacity: 0.8 }}>
            {business.delivery}
          </p>
        </div>
        <div>
          <h4>Visitanos</h4>
          <p><Icon name="pin" size={14} /> {business.address}</p>
          <p style={{ opacity: 0.7, paddingLeft: 22 }}>{business.city}</p>
          <p><Icon name="clock" size={14} /> {business.hours}</p>
        </div>
        <div>
          <h4>Contacto</h4>
          <a
            href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener"
          >
            <Icon name="whatsapp" size={14} /> {business.whatsappDisplay}
          </a>
          {business.email && (
            <a href={`mailto:${business.email}`}>
              <Icon name="mail" size={14} /> {business.email}
            </a>
          )}
          <a
            href={`https://instagram.com/${business.instagram.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener"
          >
            <Icon name="instagram" size={14} /> {business.instagram}
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {business.name}. Todos los derechos reservados.</span>
        <a onClick={onAdminClick} style={{ cursor: "pointer" }}>Panel de administración</a>
      </div>
    </div>
  </footer>
);

// ----- Main Catalog Page -----
const Catalog = ({ tweaks }) => {
  const state = useStore();
  const [, setRoute] = useHashRoute();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid");
  const [detailId, setDetailId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const cartHook = useCart();
  const toast = useToast();

  // Listen to hash for ?product=ID? Not bothering — use state.

  // Filter
  const filtered = useMemo(() => {
    let list = state.products;
    if (activeCat !== "all") list = list.filter((p) => p.category === activeCat);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    list = [...list];
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else /* featured */ list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
    return list;
  }, [state.products, activeCat, query, sort]);

  const counts = useMemo(() => {
    const c = {};
    state.products.forEach((p) => { c[p.category] = (c[p.category] || 0) + 1; });
    return c;
  }, [state.products]);

  const cartCount = cartHook.cart.reduce((s, x) => s + x.qty, 0);
  const detailProduct = detailId ? state.products.find((p) => p.id === detailId) : null;
  const detailCategory = detailProduct ? state.categories.find((c) => c.id === detailProduct.category) : null;

  const handleAdd = (productId, qty = 1) => {
    cartHook.add(productId, qty);
    const p = state.products.find((x) => x.id === productId);
    toast(`${p?.name || "Producto"} agregado`, { kind: "success" });
  };

  return (
    <>
      <Topbar
        query={query}
        setQuery={setQuery}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onGoHome={() => { setActiveCat("all"); setQuery(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      />

      {tweaks.showHero && <Hero business={state.business} />}

      <CategoryStrip
        categories={state.categories}
        active={activeCat}
        setActive={setActiveCat}
        counts={counts}
        sort={sort}
        setSort={setSort}
        total={filtered.length}
        view={view}
        setView={setView}
      />

      <div className="container">
        {filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="No encontramos productos"
            hint="Probá con otra búsqueda o categoría."
          />
        ) : (
          <div className={"pgrid " + tweaks.density + (tweaks.cardStyle === "framed" ? " framed" : "") + (view === "list" ? " plist" : "")}>
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                category={state.categories.find((c) => c.id === p.category)}
                onClick={() => setDetailId(p.id)}
                onAdd={() => handleAdd(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer business={state.business} onAdminClick={() => setRoute("/admin")} />

      {detailProduct && (
        <ProductDetail
          product={detailProduct}
          category={detailCategory}
          onClose={() => setDetailId(null)}
          onAdd={handleAdd}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cartHook.cart}
        products={state.products}
        onSetQty={cartHook.setQty}
        onRemove={cartHook.remove}
        onClear={cartHook.clear}
        business={state.business}
      />
    </>
  );
};

Object.assign(window, { Catalog, useCart });
