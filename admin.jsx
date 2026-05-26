// Admin panel: login + tabs (Productos, Categorías, Negocio).

// ----- Login -----
const AdminLogin = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const inputRef = useRef();
  useEffect(() => { inputRef.current?.focus(); }, []);
  const submit = (e) => {
    e.preventDefault();
    if (STORE.login(password)) {
      onSuccess();
    } else {
      setErr("Contraseña incorrecta");
      setPassword("");
    }
  };
  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="brand" style={{ marginBottom: 6 }}>
          El Chacarero
          <small>Panel de administración</small>
        </div>
        <p className="muted" style={{ marginTop: 16, marginBottom: 22, fontSize: 14 }}>
          Ingresá la contraseña para gestionar productos, fotos y precios.
        </p>
        <form onSubmit={submit}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Contraseña</label>
            <div style={{ position: "relative" }}>
              <Icon name="lock" size={16} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErr(""); }}
                placeholder="••••••••"
                style={{ paddingLeft: 34, width: "100%" }}
              />
            </div>
            {err && <span style={{ color: "var(--brick-dark)", fontSize: 13, marginTop: 4 }}>{err}</span>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: 12 }}>
            Ingresar
          </button>
        </form>
        <div className="divider"></div>
        <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
          <strong>Demo:</strong> la contraseña es <code style={{ background: "var(--bg-alt)", padding: "1px 6px", borderRadius: 3 }}>chacarero</code>
        </div>
        <button onClick={onCancel} className="btn btn-ghost" style={{ width: "100%", marginTop: 14, fontSize: 13 }}>
          <Icon name="back" size={14} /> Volver al catálogo
        </button>
      </div>
    </div>
  );
};

// ----- Product form (modal) -----
const ProductForm = ({ product, categories, onClose, onSave, onDelete }) => {
  const [draft, setDraft] = useState(() => product || {
    name: "",
    category: categories[0]?.id || "",
    price: 0,
    unit: "un",
    description: "",
    featured: false,
    inStock: true,
    image: null,
  });
  const isNew = !product?.id;

  const patch = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const save = () => {
    if (!draft.name.trim()) return;
    onSave(draft);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose} size="lg" title={isNew ? "Nuevo producto" : "Editar producto"}>
      <div className="form-grid">
        <div className="span-2">
          <ImageUpload value={draft.image} onChange={(v) => patch("image", v)} aspect="1/1" label="Subir foto del producto" />
        </div>

        <div className="field span-2">
          <label>Nombre</label>
          <input value={draft.name} onChange={(e) => patch("name", e.target.value)} placeholder="Ej: Salame chacarero" />
        </div>

        <div className="field">
          <label>Categoría</label>
          <select value={draft.category} onChange={(e) => patch("category", e.target.value)}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Unidad</label>
          <select value={draft.unit} onChange={(e) => patch("unit", e.target.value)}>
            <option value="un">por unidad</option>
            <option value="kg">por kg</option>
            <option value="docena">por docena</option>
            <option value="pack">por pack</option>
            <option value="x12">pack de 12</option>
            <option value="100g">por 100 g</option>
            <option value="500g">por 500 g</option>
          </select>
        </div>

        <div className="field">
          <label>Precio ({STORE.state.business.currency})</label>
          <input
            type="number"
            value={draft.price}
            onChange={(e) => patch("price", parseFloat(e.target.value) || 0)}
            min={0}
            step={50}
          />
        </div>

        <div className="field">
          <label>Estado</label>
          <div className="field-row" style={{ alignItems: "center", gap: 18, paddingTop: 8 }}>
            <label className="switch">
              <input type="checkbox" checked={draft.inStock} onChange={(e) => patch("inStock", e.target.checked)} />
              <span className="track"></span>
              <span>Con stock</span>
            </label>
            <label className="switch">
              <input type="checkbox" checked={draft.featured} onChange={(e) => patch("featured", e.target.checked)} />
              <span className="track"></span>
              <span>Destacado</span>
            </label>
          </div>
        </div>

        <div className="field span-2">
          <label>Descripción</label>
          <textarea
            rows={3}
            value={draft.description}
            onChange={(e) => patch("description", e.target.value)}
            placeholder="Breve descripción que verán los clientes."
          />
        </div>
      </div>

      <div className="divider"></div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div>
          {!isNew && (
            <button className="btn btn-danger" onClick={() => { if (confirm("¿Eliminar este producto?")) { onDelete(product.id); onClose(); } }}>
              <Icon name="trash" size={14} /> Eliminar
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={save} disabled={!draft.name.trim()}>
            <Icon name="check" size={14} /> {isNew ? "Crear producto" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ----- Tab: Productos -----
const AdminProducts = ({ state }) => {
  const [editing, setEditing] = useState(null); // product or {} for new
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const toast = useToast();

  const filtered = useMemo(() => {
    let list = state.products;
    if (catFilter !== "all") list = list.filter((p) => p.category === catFilter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
    return list;
  }, [state.products, catFilter, query]);

  const save = (draft) => {
    if (draft.id) {
      STORE.updateProduct(draft.id, draft);
      toast("Producto actualizado", { kind: "success" });
    } else {
      STORE.addProduct(draft);
      toast("Producto creado", { kind: "success" });
    }
  };

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Productos</h1>
          <div className="sub">{state.products.length} productos en el catálogo</div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>
          <Icon name="plus" size={14} /> Nuevo producto
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Icon name="search" size={16} className="icon" />
          <input placeholder="Buscar producto..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="all">Todas las categorías</option>
          {state.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="adm-table">
        <div className="adm-row head">
          <div></div>
          <div>Producto</div>
          <div className="cell-cat">Categoría</div>
          <div className="cell-price">Precio</div>
          <div className="cell-stock">Estado</div>
          <div style={{ textAlign: "right" }}>Acciones</div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 30 }}>
            <EmptyState icon="bag" title="Sin resultados" hint="Probá con otro filtro o creá un producto nuevo." />
          </div>
        ) : filtered.map((p) => {
          const cat = state.categories.find((c) => c.id === p.category);
          return (
            <div className="adm-row" key={p.id}>
              <div className="adm-thumb">
                <ProductImage product={p} />
              </div>
              <div>
                <h4 className="adm-name">{p.name}</h4>
                <div className="adm-desc">{p.description || "—"}</div>
              </div>
              <div className="cell-cat">
                <span className="pill" style={{ background: (cat?.color || "#ccc") + "26", color: cat?.color }}>{cat?.name || "—"}</span>
              </div>
              <div className="cell-price" style={{ fontFamily: "var(--font-head)", fontWeight: 600 }}>
                {STORE.formatPrice(p.price)} <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 12 }}>/ {STORE.formatUnit(p.unit)}</span>
              </div>
              <div className="cell-stock" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <span className={"pill " + (p.inStock ? "green" : "red")}>
                  {p.inStock ? "En stock" : "Sin stock"}
                </span>
                {p.featured && <span className="pill gold"><Icon name="star" size={10} /></span>}
              </div>
              <div className="adm-actions">
                <button className="btn btn-sm btn-ghost" onClick={() => setEditing(p)}>
                  <Icon name="edit" size={13} /> Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => { if (confirm(`¿Eliminar "${p.name}"?`)) { STORE.deleteProduct(p.id); toast("Producto eliminado"); } }}
                  aria-label="Eliminar"
                >
                  <Icon name="trash" size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <ProductForm
          product={editing.id ? editing : null}
          categories={state.categories}
          onClose={() => setEditing(null)}
          onSave={save}
          onDelete={(id) => { STORE.deleteProduct(id); toast("Producto eliminado"); }}
        />
      )}
    </>
  );
};

// ----- Tab: Categorías -----
const AdminCategories = ({ state }) => {
  const [editing, setEditing] = useState(null);
  const toast = useToast();

  const counts = useMemo(() => {
    const c = {};
    state.products.forEach((p) => { c[p.category] = (c[p.category] || 0) + 1; });
    return c;
  }, [state.products]);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Categorías</h1>
          <div className="sub">{state.categories.length} categorías</div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>
          <Icon name="plus" size={14} /> Nueva categoría
        </button>
      </div>

      <div className="cat-list">
        {state.categories.map((c) => (
          <div className="cat-row" key={c.id}>
            <div className="swatch" style={{ background: c.color }} />
            <div className="name">{c.name}</div>
            <span className="count">{counts[c.id] || 0} productos</span>
            <button className="btn btn-sm btn-ghost" onClick={() => setEditing(c)}>
              <Icon name="edit" size={13} /> Editar
            </button>
            <button
              className="btn btn-sm btn-danger"
              disabled={state.categories.length <= 1}
              onClick={() => {
                if (state.categories.length <= 1) return;
                if (confirm(`¿Eliminar la categoría "${c.name}"? Los productos pasarán a "${state.categories.find(x => x.id !== c.id)?.name}".`)) {
                  STORE.deleteCategory(c.id);
                  toast("Categoría eliminada");
                }
              }}
            >
              <Icon name="trash" size={13} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <CategoryForm
          category={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={(draft) => {
            if (draft.id) { STORE.updateCategory(draft.id, draft); toast("Categoría actualizada"); }
            else { STORE.addCategory(draft); toast("Categoría creada"); }
          }}
        />
      )}
    </>
  );
};

const CategoryForm = ({ category, onClose, onSave }) => {
  const [draft, setDraft] = useState(category || { name: "", color: "#8C5A2B" });
  const isNew = !category?.id;
  const COLORS = ["#B4452A", "#D4A24A", "#8C5A2B", "#5A6936", "#A56B3D", "#6B2A2A", "#2A1E14", "#4d6b8a"];
  return (
    <Modal open={true} onClose={onClose} size="md" title={isNew ? "Nueva categoría" : "Editar categoría"}>
      <div className="field" style={{ marginBottom: 14 }}>
        <label>Nombre</label>
        <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Ej: Fiambres" />
      </div>
      <div className="field">
        <label>Color</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setDraft({ ...draft, color: c })}
              style={{
                width: 32, height: 32, borderRadius: 6,
                background: c, border: "2px solid " + (draft.color === c ? "var(--ink)" : "transparent"),
                cursor: "pointer",
                boxShadow: draft.color === c ? "0 0 0 2px var(--paper) inset" : "none",
              }}
              aria-label={c}
            />
          ))}
        </div>
      </div>
      <div className="divider"></div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={() => { onSave(draft); onClose(); }} disabled={!draft.name.trim()}>
          <Icon name="check" size={14} /> {isNew ? "Crear" : "Guardar"}
        </button>
      </div>
    </Modal>
  );
};

// ----- Tab: Negocio -----
const AdminBusiness = ({ state }) => {
  const [draft, setDraft] = useState(state.business);
  const toast = useToast();
  useEffect(() => setDraft(state.business), [state.business]);

  const patch = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const save = () => {
    STORE.updateBusiness(draft);
    toast("Datos del negocio guardados", { kind: "success" });
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify(state.business);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Datos del negocio</h1>
          <div className="sub">Lo que ven los clientes en la home y el footer.</div>
        </div>
        <button className="btn btn-primary" disabled={!dirty} onClick={save}>
          <Icon name="check" size={14} /> Guardar cambios
        </button>
      </div>

      <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: 22, maxWidth: 800 }}>
        <div className="form-grid">
          <div className="field span-2">
            <label>Nombre del negocio</label>
            <input value={draft.name} onChange={(e) => patch("name", e.target.value)} />
          </div>
          <div className="field span-2">
            <label>Tagline / Bajada</label>
            <input value={draft.tagline} onChange={(e) => patch("tagline", e.target.value)} />
          </div>
          <div className="field">
            <label>Dirección</label>
            <input value={draft.address} onChange={(e) => patch("address", e.target.value)} />
          </div>
          <div className="field">
            <label>Ciudad / Provincia</label>
            <input value={draft.city} onChange={(e) => patch("city", e.target.value)} />
          </div>
          <div className="field">
            <label>WhatsApp (con código país)</label>
            <input value={draft.whatsapp} onChange={(e) => patch("whatsapp", e.target.value)} placeholder="5493415551234" />
            <span className="muted" style={{ fontSize: 11 }}>Sin + ni espacios. Ej: 5493415551234</span>
          </div>
          <div className="field">
            <label>WhatsApp para mostrar</label>
            <input value={draft.whatsappDisplay} onChange={(e) => patch("whatsappDisplay", e.target.value)} placeholder="+54 2284 65-3153" />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={draft.email || ""} onChange={(e) => patch("email", e.target.value)} placeholder="contacto@email.com" />
          </div>
          <div className="field">
            <label>Teléfono fijo</label>
            <input value={draft.phone || ""} onChange={(e) => patch("phone", e.target.value)} placeholder="+54 2284 65-3153" />
          </div>
          <div className="field">
            <label>Horarios</label>
            <input value={draft.hours} onChange={(e) => patch("hours", e.target.value)} />
          </div>
          <div className="field">
            <label>Instagram</label>
            <input value={draft.instagram} onChange={(e) => patch("instagram", e.target.value)} placeholder="@elchacarero" />
          </div>
          <div className="field">
            <label>Símbolo de moneda</label>
            <input value={draft.currency} onChange={(e) => patch("currency", e.target.value)} maxLength={4} style={{ maxWidth: 100 }} />
          </div>
          <div className="field span-2">
            <label>Texto de envíos / política</label>
            <textarea rows={2} value={draft.delivery} onChange={(e) => patch("delivery", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="divider"></div>
      <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: 22, maxWidth: 800 }}>
        <h3 style={{ fontSize: 16, marginBottom: 6 }}>Zona de peligro</h3>
        <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
          Borrar todos los datos guardados y volver al catálogo inicial. Esta acción no se puede deshacer.
        </p>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (confirm("¿Restablecer todos los datos? Se perderán los cambios.")) {
              STORE.resetAll();
              toast("Datos restablecidos");
            }
          }}
        >
          <Icon name="trash" size={14} /> Restablecer todo
        </button>
      </div>
    </>
  );
};

// ----- Admin shell -----
const AdminApp = ({ onExit }) => {
  const state = useStore();
  const [tab, setTab] = useState("products");
  const [authed, setAuthed] = useState(() => STORE.isAdmin());

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} onCancel={onExit} />;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand" onClick={onExit} style={{ cursor: "pointer" }}>
          El Chacarero
          <small>Administración</small>
        </div>
        <nav className="admin-nav">
          <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>
            <Icon name="bag" size={16} /> Productos
          </button>
          <button className={tab === "categories" ? "active" : ""} onClick={() => setTab("categories")}>
            <Icon name="filter" size={16} /> Categorías
          </button>
          <button className={tab === "business" ? "active" : ""} onClick={() => setTab("business")}>
            <Icon name="settings" size={16} /> Negocio
          </button>
        </nav>
        <div className="admin-side-foot">
          <a onClick={onExit} style={{ cursor: "pointer" }}>
            <Icon name="back" size={14} /> Ver el sitio
          </a>
          <button onClick={() => { STORE.logout(); onExit(); }}>
            <Icon name="logout" size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {tab === "products" && <AdminProducts state={state} />}
        {tab === "categories" && <AdminCategories state={state} />}
        {tab === "business" && <AdminBusiness state={state} />}
      </main>
    </div>
  );
};

Object.assign(window, { AdminApp });
