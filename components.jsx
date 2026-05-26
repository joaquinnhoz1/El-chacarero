// Shared primitives: hooks, icons, modal, product image placeholder.
// All exports attached to window for cross-script use.

const { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } = React;

// ----- Hook: subscribe to STORE state -----
function useStore() {
  const [, force] = useState(0);
  useEffect(() => STORE.subscribe(() => force((n) => n + 1)), []);
  return STORE.state;
}

// ----- Hook: hash route -----
function useHashRoute() {
  const get = () => (window.location.hash || "#/").slice(1) || "/";
  const [route, setRoute] = useState(get());
  useEffect(() => {
    const on = () => setRoute(get());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return [route, (r) => (window.location.hash = "#" + r)];
}

// ----- Icons (inline SVG) -----
const Icon = ({ name, size = 18, stroke = 1.6, ...rest }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    cart: <><path d="M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 8H6" /><circle cx="10" cy="21" r="1.2" /><circle cx="17" cy="21" r="1.2" /></>,
    bag: <><path d="M5 8h14l-1.2 12.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <><path d="M5 12h14" /></>,
    close: <><path d="M6 6l12 12M18 6 6 18" /></>,
    chevron: <><path d="m9 6 6 6-6 6" /></>,
    chevronDown: <><path d="m6 9 6 6 6-6" /></>,
    edit: <><path d="M4 20h4l11-11-4-4L4 16v4Z" /><path d="m13 6 4 4" /></>,
    trash: <><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="m6 7 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-7 7" /></>,
    upload: <><path d="M12 4v12M6 10l6-6 6 6" /><path d="M4 20h16" /></>,
    whatsapp: <><path d="M20.5 12a8.5 8.5 0 1 0-15.6 4.6L4 21l4.6-1.2A8.5 8.5 0 0 0 20.5 12Z" /><path d="M8.5 9c.2 1.5 1 3 2.3 4.3 1.3 1.3 2.8 2 4.3 2.2.5 0 1-.4 1.2-.9l.3-.7c0-.2 0-.5-.2-.7l-1.5-.7c-.2-.1-.5 0-.7.2l-.4.4a6 6 0 0 1-2.6-2.6l.4-.4c.2-.2.3-.5.2-.7l-.7-1.5a.7.7 0 0 0-.7-.2l-.7.3c-.5.2-.9.7-.9 1.2Z" fill="currentColor" stroke="none"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></>,
    pin: <><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" /><circle cx="12" cy="9" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3" /></>,
    star: <><path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 16.8 6.6 19.6l1-6L3.3 9.4l6-.9L12 3Z" /></>,
    filter: <><path d="M4 5h16M7 12h10M10 19h4" /></>,
    grid: <><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></>,
    back: <><path d="M19 12H5M12 19l-7-7 7-7" /></>,
    check: <><path d="m5 12 5 5 9-11" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>,
    logout: <><path d="M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="M10 17 5 12l5-5M5 12h12" /></>,
    sort: <><path d="m7 4 0 16M7 4 4 7M7 4l3 3M17 20l0-16M17 20l-3-3M17 20l3-3" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 7 9-7" /></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2.2Z" /></>,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths[name] || null}
    </svg>
  );
};

// ----- Product image (placeholder when no upload) -----
const ProductImage = ({ product, size = "md", className = "" }) => {
  const store = STORE.state;
  const cat = store.categories.find((c) => c.id === product.category);
  const color = cat?.color || "#8C5A2B";

  // Hash to pick a sub-pattern for visual variety
  const hash = useMemo(() => {
    let h = 0;
    for (let i = 0; i < (product.id || product.name || "").length; i++) {
      h = ((h << 5) - h + (product.id || product.name).charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }, [product.id, product.name]);

  if (product.image) {
    return <img src={product.image} alt={product.name} className={"product-img " + className} loading="lazy" />;
  }

  // Typographic placeholder w/ stripes/diagonals derived from hash
  const patternId = `pat-${product.id}`;
  const variant = hash % 4;
  const initials = (product.name || "??").split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div
      className={"product-img placeholder " + className}
      style={{ background: color, color: "#fbf6e8" }}
      role="img"
      aria-label={product.name}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}>
        <defs>
          <pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform={`rotate(${[20, -20, 45, 0][variant]})`}>
            {variant === 0 && <line x1="0" y1="0" x2="0" y2="14" stroke="#fbf6e8" strokeWidth="1.5" />}
            {variant === 1 && <circle cx="7" cy="7" r="1.5" fill="#fbf6e8" />}
            {variant === 2 && <path d="M0 7 L7 0 L14 7 L7 14 Z" fill="none" stroke="#fbf6e8" strokeWidth="1" />}
            {variant === 3 && <path d="M0 7 L14 7" stroke="#fbf6e8" strokeWidth="1" />}
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#${patternId})`} />
      </svg>
      <div className="placeholder-mark">{initials}</div>
      <div className="placeholder-label">{cat?.name || ""}</div>
    </div>
  );
};

// ----- Modal -----
const Modal = ({ open, onClose, children, size = "md", title, ariaLabel }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-label={ariaLabel || title}>
      <div className={"modal modal-" + size} onClick={(e) => e.stopPropagation()}>
        {title !== undefined && (
          <div className="modal-header">
            <h3 style={{ fontSize: 18 }}>{title}</h3>
            <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Cerrar">
              <Icon name="close" />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

// ----- Drawer (right side) -----
const Drawer = ({ open, onClose, children, title, width = 420 }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  return (
    <>
      <div className={"drawer-backdrop " + (open ? "open" : "")} onClick={onClose} />
      <aside className={"drawer " + (open ? "open" : "")} style={{ width }} role="dialog" aria-label={title}>
        <div className="drawer-header">
          <h3 style={{ fontSize: 18 }}>{title}</h3>
          <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </>
  );
};

// ----- Toast -----
const ToastContext = createContext(() => {});
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, kind: opts.kind || "info" }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts.duration || 2400);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={"toast toast-" + t.kind}>
            <Icon name={t.kind === "success" ? "check" : t.kind === "error" ? "close" : "star"} size={16} />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
const useToast = () => useContext(ToastContext);

// ----- Image upload helper -----
const ImageUpload = ({ value, onChange, aspect = "1/1", label = "Subir foto" }) => {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await STORE.readImage(file, 900);
      onChange(dataUrl);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };
  return (
    <div className="img-upload" style={{ aspectRatio: aspect }}>
      {value ? (
        <>
          <img src={value} alt="" />
          <div className="img-upload-actions">
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => fileRef.current?.click()}>
              <Icon name="upload" size={14} /> Cambiar
            </button>
            <button type="button" className="btn btn-sm btn-danger" onClick={() => onChange(null)}>
              <Icon name="trash" size={14} /> Quitar
            </button>
          </div>
        </>
      ) : (
        <button type="button" className="img-upload-empty" onClick={() => fileRef.current?.click()} disabled={busy}>
          <Icon name="image" size={28} />
          <span>{busy ? "Procesando..." : label}</span>
          <span className="img-upload-hint">JPG / PNG · se ajusta a 900px</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
    </div>
  );
};

// ----- Empty state -----
const EmptyState = ({ icon = "bag", title, hint, action }) => (
  <div className="empty">
    <div className="empty-icon"><Icon name={icon} size={32} /></div>
    <h4 style={{ fontSize: 18, marginBottom: 4 }}>{title}</h4>
    {hint && <p style={{ color: "var(--muted)", margin: 0, fontSize: 14 }}>{hint}</p>}
    {action}
  </div>
);

// Expose
Object.assign(window, {
  useStore, useHashRoute, Icon, ProductImage, Modal, Drawer,
  ToastContext, ToastProvider, useToast, ImageUpload, EmptyState,
});
