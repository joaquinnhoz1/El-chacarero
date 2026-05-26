// Root app: hash route + tweaks panel + theme palette switcher.

const PALETTES = {
  campo: {
    label: "Campo (default)",
    "--bg": "#f3ecdc", "--bg-alt": "#ebe1ca", "--paper": "#fbf6e8",
    "--ink": "#2a1e14", "--ink-2": "#4d3a29", "--muted": "#8a7868",
    "--line": "#d9cbb0", "--line-strong": "#b7a285",
    "--brick": "#b4452a", "--brick-dark": "#8c2f1a",
    "--olive": "#5a6936", "--mustard": "#d4a24a", "--wine": "#6b2a2a",
  },
  parrilla: {
    label: "Parrilla (oscuro)",
    "--bg": "#1a120b", "--bg-alt": "#241810", "--paper": "#2c1f14",
    "--ink": "#fbf6e8", "--ink-2": "#e8dcc4", "--muted": "#a08b73",
    "--line": "#3d2c1f", "--line-strong": "#5c4530",
    "--brick": "#d46239", "--brick-dark": "#a8421f",
    "--olive": "#8aa05a", "--mustard": "#e8b95e", "--wine": "#9c3a3a",
  },
  mercado: {
    label: "Mercado (vibrante)",
    "--bg": "#fdf8ee", "--bg-alt": "#f5ecd8", "--paper": "#ffffff",
    "--ink": "#2d2218", "--ink-2": "#52402f", "--muted": "#8c7960",
    "--line": "#e8dcc4", "--line-strong": "#c8b896",
    "--brick": "#c5421a", "--brick-dark": "#9c2e0f",
    "--olive": "#4a7d3a", "--mustard": "#f0b134", "--wine": "#7a2828",
  },
  alma: {
    label: "Almacén (sobrio)",
    "--bg": "#e9e3d3", "--bg-alt": "#dccfb5", "--paper": "#f3eddd",
    "--ink": "#1c1a14", "--ink-2": "#3a342a", "--muted": "#776e5e",
    "--line": "#c4b69a", "--line-strong": "#a39477",
    "--brick": "#7c3a1f", "--brick-dark": "#5a2810",
    "--olive": "#3e5527", "--mustard": "#b8893a", "--wine": "#4f2424",
  },
};

const applyPalette = (id) => {
  const p = PALETTES[id] || PALETTES.campo;
  Object.entries(p).forEach(([k, v]) => {
    if (k.startsWith("--")) document.documentElement.style.setProperty(k, v);
  });
};

const App = () => {
  const [route, setRoute] = useHashRoute();
  const [t, setTweak] = useTweaks(window.__TWEAK_DEFAULTS__ || {});

  useEffect(() => {
    applyPalette(t.palette);
  }, [t.palette]);

  const isAdmin = route.startsWith("/admin");

  return (
    <ToastProvider>
      {isAdmin ? (
        <AdminApp onExit={() => setRoute("/")} />
      ) : (
        <Catalog tweaks={t} />
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Estilo">
          <TweakSelect
            label="Paleta"
            value={t.palette}
            onChange={(v) => setTweak("palette", v)}
            options={Object.entries(PALETTES).map(([id, p]) => ({ value: id, label: p.label }))}
          />
          <TweakRadio
            label="Densidad"
            value={t.density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "dense", label: "Densa" },
              { value: "comfy", label: "Cómoda" },
            ]}
          />
          <TweakToggle
            label="Mostrar hero"
            value={t.showHero}
            onChange={(v) => setTweak("showHero", v)}
          />
          <TweakRadio
            label="Tarjeta"
            value={t.cardStyle}
            onChange={(v) => setTweak("cardStyle", v)}
            options={[
              { value: "framed", label: "Enmarcada" },
              { value: "soft", label: "Suave" },
            ]}
          />
        </TweakSection>
        <TweakSection label="Acciones">
          <TweakButton
            label="Abrir panel admin"
            onClick={() => (window.location.hash = "#/admin")}
          />
          <TweakButton
            label="Restablecer datos"
            secondary
            onClick={() => {
              if (confirm("¿Restablecer todos los datos a los iniciales?")) STORE.resetAll();
            }}
          />
        </TweakSection>
      </TweaksPanel>
    </ToastProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Hide splash
setTimeout(() => {
  const s = document.getElementById("splash");
  if (s) { s.style.opacity = "0"; setTimeout(() => s.remove(), 300); }
}, 80);
