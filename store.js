// Vanilla data store with localStorage persistence + pub/sub for React.
(function () {
  const KEY = "chacarero_v3";
  const ADMIN_KEY = "chacarero_admin";
  const ADMIN_PASSWORD = "chacarero"; // demo only

  // ---------- Seed data ----------
  const DEFAULTS = {
    business: {
      name: "El Chacarero",
      tagline: "Indumentaria y artículos de campo",
      address: "Saladillo",
      city: "Buenos Aires, Argentina",
      whatsapp: "542284653153",
      whatsappDisplay: "+54 2284 65-3153",
      phone: "+54 2284 65-3153",
      email: "regionaleselchacarero@gmail.com",
      hours: "Lun a Vie 9 a 19.30 · Sáb 9 a 13",
      instagram: "@regionaleselchacarero",
      currency: "$",
      delivery: "Envíos por correo a todo el país. Retiro en local sin cargo.",
    },
    categories: [
      {
        "id": "indumentaria",
        "name": "Indumentaria",
        "color": "#5a6936"
      },
      {
        "id": "sombreros",
        "name": "Sombreros y boinas",
        "color": "#8c5a2b"
      },
      {
        "id": "accesorios",
        "name": "Accesorios",
        "color": "#d4a24a"
      },
      {
        "id": "cuchillos",
        "name": "Cuchillos y asado",
        "color": "#2a1e14"
      },
      {
        "id": "mates",
        "name": "Mates y bombillas",
        "color": "#b4452a"
      },
      {
        "id": "ninos",
        "name": "Niños",
        "color": "#6b8aaf"
      },
      {
        "id": "otros",
        "name": "Otros",
        "color": "#6b2a2a"
      }
    ],
    products: [
      {
        "id": "p001",
        "name": "Boina bordada Euskadi de hilo vuelo 26",
        "category": "sombreros",
        "price": 7500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F1f81c428-402c-4b36-b129-da5b1396cce0.jpg?alt=media"
      },
      {
        "id": "p002",
        "name": "Boina bordada Euskadi de hilo vuelo 28",
        "category": "sombreros",
        "price": 8300,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ff4069fb1-c7ac-4a62-aaa3-b3f96dfb53c6.jpg?alt=media"
      },
      {
        "id": "p003",
        "name": "Boina bordada Euskadi de hilo vuelo 32",
        "category": "sombreros",
        "price": 8050,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F8a8e2692-79a4-45f4-b96c-3976ea210c40.jpg?alt=media"
      },
      {
        "id": "p004",
        "name": "Boina de paño Labastida vuelo 32",
        "category": "sombreros",
        "price": 28500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F0add677e-4fc5-49dd-a8e2-4536db6a18a3.jpg?alt=media"
      },
      {
        "id": "p005",
        "name": "Boina de paño Labastida vuelo 35",
        "category": "sombreros",
        "price": 31500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fcab556a5-c9af-48a0-bfdc-8aca0b2f5668.jpg?alt=media"
      },
      {
        "id": "p006",
        "name": "Boina Euskadi dama bordada vuelo 26",
        "category": "sombreros",
        "price": 6500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F107445a4-4609-41d4-bbef-51377205d310.jpg?alt=media"
      },
      {
        "id": "p007",
        "name": "Boina Euskadi dama bordada vuelo 28",
        "category": "sombreros",
        "price": 7000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F36a965be-9ebb-48b1-9128-2821f909102b.jpg?alt=media"
      },
      {
        "id": "p008",
        "name": "Boina Euskadi dama bordada vuelo 32",
        "category": "sombreros",
        "price": 8050,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fa96f09e5-922b-4ce3-82f8-00d858e0f495.jpg?alt=media"
      },
      {
        "id": "p009",
        "name": "Boina Euskadi de hilo c/guarda vuelo 26",
        "category": "sombreros",
        "price": 7800,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F4a02d764-9ba1-45d1-b750-ff467d234516.jpg?alt=media"
      },
      {
        "id": "p010",
        "name": "Boina Euskadi de hilo c/guarda vuelo 28",
        "category": "sombreros",
        "price": 8700,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F1e99276e-155f-424f-88c9-a3367189fbde.jpg?alt=media"
      },
      {
        "id": "p011",
        "name": "Boina Euskadi de hilo c/guarda vuelo 32",
        "category": "sombreros",
        "price": 9400,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fe3fa4965-2db1-4e65-927e-5da7fe45b083.jpg?alt=media"
      },
      {
        "id": "p012",
        "name": "Boina Euskadi de hilo vuelo 30",
        "category": "sombreros",
        "price": 6800,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fb5fafc61-2e9c-4a5b-bf0e-bba343df2319.jpg?alt=media"
      },
      {
        "id": "p013",
        "name": "Boina Euskadi de hilo vuelo 32",
        "category": "sombreros",
        "price": 7500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F49c86c9c-f311-47cc-be26-f7294960fbdd.jpg?alt=media"
      },
      {
        "id": "p014",
        "name": "Boina Euskadi de hilo vuelo 35",
        "category": "sombreros",
        "price": 7800,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fe6461df2-3045-4357-a15f-70801207d60b.jpg?alt=media"
      },
      {
        "id": "p015",
        "name": "Boina jaspeada Euskadi vuelo 32",
        "category": "sombreros",
        "price": 7400,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fd5133117-bf38-42f3-9749-18369a6f18a0.jpg?alt=media"
      },
      {
        "id": "p016",
        "name": "Boina Labastida de hilo vuelo 35",
        "category": "sombreros",
        "price": 13300,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F185755db-d919-4571-84f3-04f13f553e7d.jpg?alt=media"
      },
      {
        "id": "p017",
        "name": "Boina Labastida hilo vuelo 32",
        "category": "sombreros",
        "price": 10200,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F92dfdf24-726b-4daa-9262-cd76bbc70231.jpg?alt=media"
      },
      {
        "id": "p018",
        "name": "Boinas Euskadi de hilo vuelo 26",
        "category": "sombreros",
        "price": 6000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F3524e35e-c6aa-4a91-9abf-4861adc22334.jpg?alt=media"
      },
      {
        "id": "p019",
        "name": "Boinas Euskadi de hilo vuelo 28",
        "category": "sombreros",
        "price": 6700,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F39cf797b-f47f-4e46-a56c-18685bf19685.jpg?alt=media"
      },
      {
        "id": "p020",
        "name": "Boinas jaspeadas Euskadi vuelo 35",
        "category": "sombreros",
        "price": 7500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F8dc97ff9-3c3e-4bc6-96c3-eb5b2dd7cf56.jpg?alt=media"
      },
      {
        "id": "p021",
        "name": "Boinas Labastida de hilo vuelo 30",
        "category": "sombreros",
        "price": 7900,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F27a5549e-bf27-407f-ad97-d5edc26738a4.jpg?alt=media"
      },
      {
        "id": "p022",
        "name": "Bufandas Labastida",
        "category": "indumentaria",
        "price": 18750,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F4ba93246-6b35-4558-9edf-b15ac89c05bb.jpg?alt=media"
      },
      {
        "id": "p023",
        "name": "Campera pampa Euskadi niño (S al XXL)",
        "category": "indumentaria",
        "price": 19300,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ffb02afc8-8ee2-439e-957e-1ad267d6255d.jpg?alt=media"
      },
      {
        "id": "p024",
        "name": "Campera pampa Euskadi (S al XXL)",
        "category": "indumentaria",
        "price": 25300,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F0208e0b7-ad25-4510-af41-edcfe63cb76f.jpg?alt=media"
      },
      {
        "id": "p025",
        "name": "Chaleco pampa Euskadi niño (S al XXL)",
        "category": "indumentaria",
        "price": 14800,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fab3be59f-627f-4f40-8296-7f2ea0260a46.jpg?alt=media"
      },
      {
        "id": "p026",
        "name": "Chaleco pampa Euskadi (S al XXL)",
        "category": "indumentaria",
        "price": 17300,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fc7cbe64c-4174-47fb-94d6-23ebe7ae539b.jpg?alt=media"
      },
      {
        "id": "p027",
        "name": "Faja 11cm",
        "category": "indumentaria",
        "price": 7500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F23ada29c-bcc1-4432-a61b-d5a19f720499.jpg?alt=media"
      },
      {
        "id": "p028",
        "name": "Faja 9cm",
        "category": "indumentaria",
        "price": 5600,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F73d46c93-e463-462e-bbf9-4ecd3c3fbad3.jpg?alt=media"
      },
      {
        "id": "p029",
        "name": "Gorra inglesa",
        "category": "sombreros",
        "price": 6300,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F2f853db9-328a-42a3-be40-1a7634eb8516.jpg?alt=media"
      },
      {
        "id": "p030",
        "name": "Gorra vento Lagomarsino",
        "category": "sombreros",
        "price": 45920,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F1e7d20b4-698f-422b-8946-3439f29aa3f3.jpg?alt=media"
      },
      {
        "id": "p031",
        "name": "3 virolas ac inoxidable 14 cm",
        "category": "accesorios",
        "price": 37500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F6adc8a8e-53e1-4538-9bbf-2f1dbd297b60.jpg?alt=media"
      },
      {
        "id": "p032",
        "name": "Cinto cuero blanco (x 12)",
        "category": "accesorios",
        "price": 106000,
        "unit": "x12",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fa423f87e-a2e0-41f4-a429-1955cbcd1844.jpg?alt=media"
      },
      {
        "id": "p033",
        "name": "Cinto en vaqueta liso (x 12)",
        "category": "accesorios",
        "price": 112000,
        "unit": "x12",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Feeff4c97-582f-4bc2-9a4e-3e8011d69155.jpg?alt=media"
      },
      {
        "id": "p034",
        "name": "Corbatines bordados",
        "category": "accesorios",
        "price": 1300,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F7cd7d131-ac5e-4c9c-bf06-22e287119ee4.jpg?alt=media"
      },
      {
        "id": "p035",
        "name": "Faja Euskadi 9 cm",
        "category": "accesorios",
        "price": 14000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F6dabdda1-7d5d-4ace-94d0-251e1bf1c19b.jpg?alt=media"
      },
      {
        "id": "p036",
        "name": "Faja Labastida 12 cm",
        "category": "accesorios",
        "price": 23600,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F3636b7ea-57fe-4dff-9b24-3fa0f96f6368.jpg?alt=media"
      },
      {
        "id": "p037",
        "name": "Faja Labastida 9cm",
        "category": "accesorios",
        "price": 21000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ff10d4ac8-34d1-4ced-bce3-e387442e36ea.jpg?alt=media"
      },
      {
        "id": "p038",
        "name": "Lonjas c/c",
        "category": "accesorios",
        "price": 9000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F6e9e56b8-2cdf-4ea3-90f0-53f88e823160.jpg?alt=media"
      },
      {
        "id": "p039",
        "name": "Pañuelos planchados",
        "category": "accesorios",
        "price": 4500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fafb5cbea-a72c-420d-b6e4-d41dec62a3e5.jpg?alt=media"
      },
      {
        "id": "p040",
        "name": "Yuntas dama alpaca",
        "category": "accesorios",
        "price": 19000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F0d1e55e2-3fd4-4422-90b7-88a132db2ff5.jpg?alt=media"
      },
      {
        "id": "p041",
        "name": "Yuntas niño alpaca",
        "category": "accesorios",
        "price": 15500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F96090f13-1e21-4078-8d2b-69c00b00ecde.jpg?alt=media"
      },
      {
        "id": "p042",
        "name": "Bombacha niño T. 10",
        "category": "ninos",
        "price": 8500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F9927f80e-349b-4ea8-8ecb-76cb3bedb8ba.jpg?alt=media"
      },
      {
        "id": "p043",
        "name": "Bombachas bb (5 al 8)",
        "category": "ninos",
        "price": 8000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F42470fe9-2203-40ed-bdb8-7e8e9be0c73b.jpg?alt=media"
      },
      {
        "id": "p044",
        "name": "Bombachas de bb (0 al 4)",
        "category": "ninos",
        "price": 7500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fd8ba2063-9ff7-4fdc-82b5-38e256a8a4e4.jpg?alt=media"
      },
      {
        "id": "p045",
        "name": "Bombachas niño/a (T. 4 al 16)",
        "category": "ninos",
        "price": 15500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ffff8be2f-d346-4600-b1d9-88f565fe914b.jpg?alt=media"
      },
      {
        "id": "p046",
        "name": "Bufandas Euskadi",
        "category": "ninos",
        "price": 10500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F2928d45d-7f8e-43bd-bfa9-6ff11b70f398.jpg?alt=media"
      },
      {
        "id": "p047",
        "name": "Chaleco bebe",
        "category": "ninos",
        "price": 9900,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F4fb73d66-ad3f-4b5c-ba9d-d96921ab0e6d.jpg?alt=media"
      },
      {
        "id": "p048",
        "name": "Cinto elástico guarda pampa",
        "category": "ninos",
        "price": 4000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fe2cf154b-00c5-4d15-89a5-fd2364004c2d.jpg?alt=media"
      },
      {
        "id": "p049",
        "name": "Cinto infantil elastizado",
        "category": "ninos",
        "price": 4000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F50dbefea-e0e6-4197-8674-c2c497296c5c.jpg?alt=media"
      },
      {
        "id": "p050",
        "name": "Conjunto de niño (T. 1 al 6)",
        "category": "ninos",
        "price": 24750,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F6ee36d1e-e84e-437f-8ee0-74ceaa6c7cab.jpg?alt=media"
      },
      {
        "id": "p051",
        "name": "Faja 4cm",
        "category": "ninos",
        "price": 3000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F53bd18e8-d621-4db3-b963-731a9ef2c820.jpg?alt=media"
      },
      {
        "id": "p052",
        "name": "Faja 6cm",
        "category": "ninos",
        "price": 4300,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ff04f69e0-145d-40fd-b769-ab7f1ecaa83b.jpg?alt=media"
      },
      {
        "id": "p053",
        "name": "Faja Euskadi 6cm",
        "category": "ninos",
        "price": 11900,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fe4af8290-c53f-4113-8355-2a7847d3b2eb.jpg?alt=media"
      },
      {
        "id": "p054",
        "name": "Alpaca ac. al carbono 14 cm",
        "category": "cuchillos",
        "price": 89000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F6cd4a4d0-2977-4fb6-b563-aae601583bbf.jpg?alt=media"
      },
      {
        "id": "p055",
        "name": "Alpaca ac. inoxidable 14 cm",
        "category": "cuchillos",
        "price": 89000,
        "unit": "un",
        "description": "",
        "featured": true,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ffa567304-f1ba-4207-9643-d37b3dbeac80.jpg?alt=media"
      },
      {
        "id": "p056",
        "name": "Alpaca vaina baqueta 14 cm",
        "category": "cuchillos",
        "price": 38000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fc6062db4-af70-47c1-ae99-1770bb4ed01b.jpg?alt=media"
      },
      {
        "id": "p057",
        "name": "Alpaca vaina baqueta 20 cm",
        "category": "cuchillos",
        "price": 45000,
        "unit": "un",
        "description": "",
        "featured": true,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F4c980d01-1508-4cb1-9e4f-2621de16d09a.jpg?alt=media"
      },
      {
        "id": "p058",
        "name": "Artesanal 13cm. Acero inoxidable.",
        "category": "cuchillos",
        "price": 38000,
        "unit": "un",
        "description": "",
        "featured": true,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fef2087b1-bd16-4d62-89b7-3d0cbbec6b49.jpg?alt=media"
      },
      {
        "id": "p059",
        "name": "Cuchillo y tenedor entrerriano",
        "category": "cuchillos",
        "price": 8500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fcf6a94fd-5683-4ee6-8e26-f48652d7ab3a.jpg?alt=media"
      },
      {
        "id": "p060",
        "name": "Encina ac. al carbono 20 cm",
        "category": "cuchillos",
        "price": 34000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ff5ccb111-dd48-4b68-bbd6-d2835c5a0acd.jpg?alt=media"
      },
      {
        "id": "p061",
        "name": "Entrerrianos 14 cm",
        "category": "cuchillos",
        "price": 8000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Feb36fbaa-747d-448f-bf18-0689edb27137.jpg?alt=media"
      },
      {
        "id": "p062",
        "name": "Entrerrianos ciervo 14 cm",
        "category": "cuchillos",
        "price": 13500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fcfae233f-a062-4a5f-8de2-fc7cfd4e3f16.jpg?alt=media"
      },
      {
        "id": "p063",
        "name": "Picasso ac. inoxidable 14 cm",
        "category": "cuchillos",
        "price": 95000,
        "unit": "un",
        "description": "",
        "featured": true,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fd7f8a2c2-d374-44b9-8b20-5c3229dac92b.jpg?alt=media"
      },
      {
        "id": "p064",
        "name": "Picasso ac. inoxidable cuero crudo 14 cm",
        "category": "cuchillos",
        "price": 98000,
        "unit": "un",
        "description": "",
        "featured": true,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F34b38662-cab5-4741-91fd-5295e68d74d6.jpg?alt=media"
      },
      {
        "id": "p065",
        "name": "Regional ac inoxidable 14 cm",
        "category": "cuchillos",
        "price": 21500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Faff6cc58-898c-4dac-b32c-041ebe1cffab.jpg?alt=media"
      },
      {
        "id": "p066",
        "name": "Schmiden, ciervo y alpaca. 14cm. Acero inoxidable.",
        "category": "cuchillos",
        "price": 36000,
        "unit": "un",
        "description": "",
        "featured": true,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ffe6d5b08-c47c-4609-bb61-76ac83c80a63.jpg?alt=media"
      },
      {
        "id": "p067",
        "name": "Tandilero económico",
        "category": "cuchillos",
        "price": 5000,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F4c14bcf0-c9ca-4ce5-bd3e-fc5e8edc7aa3.jpg?alt=media"
      },
      {
        "id": "p068",
        "name": "Tenedor para asado madera",
        "category": "cuchillos",
        "price": 13700,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F283e9ac4-f37b-4836-96e0-9909a23126e5.jpg?alt=media"
      },
      {
        "id": "p069",
        "name": "Tenedor para asado simil ciervo",
        "category": "cuchillos",
        "price": 15500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F089f670b-8a07-4baf-861c-0cef150cbb23.jpg?alt=media"
      },
      {
        "id": "p070",
        "name": "Tenedores para asado",
        "category": "cuchillos",
        "price": 6500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ff43571c1-efa9-4cbc-adfc-57fc66b40dd3.jpg?alt=media"
      },
      {
        "id": "p071",
        "name": "Tiento fino ac. inoxidable 14 cm",
        "category": "cuchillos",
        "price": 52500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F3153f7e2-7688-4fb1-a70c-e5380d1a26cf.jpg?alt=media"
      },
      {
        "id": "p072",
        "name": "Tiento grueso 14 cm",
        "category": "cuchillos",
        "price": 48500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fb320c0a5-83fc-45cc-884a-8a37aa747bb2.jpg?alt=media"
      },
      {
        "id": "p073",
        "name": "Tiento grueso 14 cm Juca",
        "category": "cuchillos",
        "price": 49500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F0691e062-12c8-436a-a1f1-d04c17a51afe.jpg?alt=media"
      },
      {
        "id": "p074",
        "name": "Bombilla acero micrófono",
        "category": "mates",
        "price": 2900,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F558D85B9-C51A-4AC3-A290-921EF9F5CF46.jpg?alt=media"
      },
      {
        "id": "p075",
        "name": "Bombilla brasilera",
        "category": "mates",
        "price": 3800,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F32E58558-D8C1-4B3D-A888-0B31C3FFFEB9.jpg?alt=media"
      },
      {
        "id": "p076",
        "name": "Bombilla estribo",
        "category": "mates",
        "price": 2900,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F39c720af-dc66-4ae8-b808-0b9f7566f0cb.jpg?alt=media"
      },
      {
        "id": "p077",
        "name": "Bombilla tambor acero",
        "category": "mates",
        "price": 3800,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F9DF08433-A79E-44FE-85B5-29BE6B75EA41.jpg?alt=media"
      },
      {
        "id": "p078",
        "name": "Imperial acero/acero",
        "category": "mates",
        "price": 15500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F7b54b7fb-f4b4-4d5e-a056-1891ca161f0c.jpg?alt=media"
      },
      {
        "id": "p079",
        "name": "Imperial alpaca acero",
        "category": "mates",
        "price": 18500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fc8c78faa-df33-4139-b43e-545b53f054fe.jpg?alt=media"
      },
      {
        "id": "p080",
        "name": "Imperial PVC",
        "category": "mates",
        "price": 10500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F2b024357-471f-4170-a780-470c13bd5675.jpg?alt=media"
      },
      {
        "id": "p081",
        "name": "Mate bocón calabaza",
        "category": "mates",
        "price": 9200,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F410ce552-1839-42d1-a03f-25dc498ec167.jpg?alt=media"
      },
      {
        "id": "p082",
        "name": "Mate calabaza alpaca",
        "category": "mates",
        "price": 7500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ffb64c79e-1a8c-456a-921a-8e75c242d86b.jpg?alt=media"
      },
      {
        "id": "p083",
        "name": "Mate calabaza c/tiento acero",
        "category": "mates",
        "price": 14500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F560c8295-6e50-42df-88cc-4a329df92f00.jpg?alt=media"
      },
      {
        "id": "p084",
        "name": "Mate calabaza tiento aluminio",
        "category": "mates",
        "price": 12500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ff1b96eb9-f3d9-4b58-bdbb-11483821ab23.jpg?alt=media"
      },
      {
        "id": "p085",
        "name": "Mate camionero calabaza",
        "category": "mates",
        "price": 9500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F2adc665e-f069-4ccb-b1fb-20d5bb19f634.jpg?alt=media"
      },
      {
        "id": "p086",
        "name": "Mate imperial crudo con patas",
        "category": "mates",
        "price": 20500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F4ce055c7-f084-4b83-b16d-44f2c43748eb.jpg?alt=media"
      },
      {
        "id": "p087",
        "name": "Mate pampa",
        "category": "mates",
        "price": 13500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F104effff-8ba4-40af-ab8f-ec7caeda6ae2.jpg?alt=media"
      },
      {
        "id": "p088",
        "name": "Mates imperial de algarrobo y acero",
        "category": "mates",
        "price": 13500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Face9cf87-9ac3-45fc-967e-b3fbe25a6acd.jpg?alt=media"
      },
      {
        "id": "p089",
        "name": "Portatermo",
        "category": "mates",
        "price": 11950,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F29fc0a20-781b-4312-a7fb-33bdc592edd8.jpg?alt=media"
      },
      {
        "id": "p090",
        "name": "Portatermos colores surtidos",
        "category": "mates",
        "price": 11950,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F7e05e390-cb30-4291-a743-10b407f60a2d.jpg?alt=media"
      },
      {
        "id": "p091",
        "name": "Sombrero Australiano Lagomarsino (Tostado y Natural)",
        "category": "sombreros",
        "price": 44500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Fe0b21985-084e-4197-90d4-03ae9f810cae.jpg?alt=media"
      },
      {
        "id": "p092",
        "name": "Sombrero Lagomarsino ala 10 (Tostado y natural)",
        "category": "sombreros",
        "price": 56500,
        "unit": "un",
        "description": "",
        "featured": true,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F36485C4B-4EDD-4E24-AB20-9903F24F0A42.jpg?alt=media"
      },
      {
        "id": "p093",
        "name": "Sombrero Pampa, Natural y Tostado, ala 10. Lagomarsino",
        "category": "sombreros",
        "price": 56500,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2Ff6707acc-b9bd-4d9f-b173-372d8af5f600.jpg?alt=media"
      },
      {
        "id": "p094",
        "name": "Sombrero Pampa, Tostado y Natural, ala 8. Lagomarsino",
        "category": "sombreros",
        "price": 52000,
        "unit": "un",
        "description": "",
        "featured": true,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F9dd27c33-b06b-4e6b-95b4-f0e2b723bea7.jpg?alt=media"
      },
      {
        "id": "p095",
        "name": "Cinto cuero crudo (X 12)",
        "category": "otros",
        "price": 126000,
        "unit": "x12",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2F9D7DB7BD-887A-4C09-B18E-2997F3C73753.jpg?alt=media"
      },
      {
        "id": "p096",
        "name": "Gorra vento Lagomarsino algodón ventilado",
        "category": "otros",
        "price": 46900,
        "unit": "un",
        "description": "",
        "featured": false,
        "inStock": true,
        "image": "https://images-cdn.kyte.site/v0/b/kyte-7c484.appspot.com/o/sfbspuWWX1Y5WwOrgE20kXRCBH73%2FC13B0B49-66E8-4CB0-B97C-9F278F9A9A40.jpg?alt=media"
      }
    ],
  };

  // ---------- State + persistence ----------
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // simple migration: ensure all top-level keys exist
        return { ...JSON.parse(JSON.stringify(DEFAULTS)), ...parsed };
      }
    } catch (e) {
      console.warn("store load error", e);
    }
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  let state = load();
  const listeners = new Set();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("store save error (probably quota)", e);
    }
    listeners.forEach((fn) => fn(state));
  }

  function uid(prefix) {
    return prefix + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  }

  // ---------- Public API ----------
  window.STORE = {
    get state() { return state; },
    get products() { return state.products; },
    get categories() { return state.categories; },
    get business() { return state.business; },

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    // Products
    addProduct(p) {
      const product = {
        id: uid("p"),
        name: "Producto nuevo",
        category: state.categories[0]?.id || "fiambres",
        price: 0,
        unit: "un",
        description: "",
        featured: false,
        inStock: true,
        image: null,
        ...p,
      };
      state.products.unshift(product);
      save();
      return product;
    },
    updateProduct(id, patch) {
      const i = state.products.findIndex((p) => p.id === id);
      if (i >= 0) {
        state.products[i] = { ...state.products[i], ...patch };
        save();
      }
    },
    deleteProduct(id) {
      state.products = state.products.filter((p) => p.id !== id);
      save();
    },

    // Categories
    addCategory(c) {
      const category = { id: uid("c"), name: "Nueva categoría", color: "#8C5A2B", ...c };
      state.categories.push(category);
      save();
      return category;
    },
    updateCategory(id, patch) {
      const i = state.categories.findIndex((c) => c.id === id);
      if (i >= 0) {
        state.categories[i] = { ...state.categories[i], ...patch };
        save();
      }
    },
    deleteCategory(id) {
      // reassign products of this category to the first remaining one
      const remaining = state.categories.filter((c) => c.id !== id);
      if (remaining.length === 0) return; // never zero
      const fallback = remaining[0].id;
      state.products = state.products.map((p) =>
        p.category === id ? { ...p, category: fallback } : p
      );
      state.categories = remaining;
      save();
    },

    // Business
    updateBusiness(patch) {
      state.business = { ...state.business, ...patch };
      save();
    },

    // Auth (demo only — sessionStorage)
    isAdmin() {
      return sessionStorage.getItem(ADMIN_KEY) === "1";
    },
    login(password) {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(ADMIN_KEY, "1");
        return true;
      }
      return false;
    },
    logout() {
      sessionStorage.removeItem(ADMIN_KEY);
    },

    // Util: compress + read an uploaded image to data URL
    async readImage(file, maxSize = 800) {
      const dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = dataUrl;
      });
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      return c.toDataURL("image/jpeg", 0.82);
    },

    // Util: factory reset (clears localStorage and reseeds)
    resetAll() {
      localStorage.removeItem(KEY);
      state = JSON.parse(JSON.stringify(DEFAULTS));
      save();
    },

    formatPrice(n) {
      const cur = state.business.currency || "$";
      return cur + " " + (n || 0).toLocaleString("es-AR");
    },

    formatUnit(unit) {
      const map = {
        kg: "kilo",
        un: "unidad",
        docena: "docena",
        pack: "pack",
        x12: "pack de 12",
        "100g": "100 g",
        "500g": "500 g",
      };
      return map[unit] || unit;
    },
  };
})();
