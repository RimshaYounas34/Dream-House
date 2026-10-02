// import * as THREE from "three";

// export const MATERIAL_PRESETS = {
//   "white-paint": { label: "White paint", color: "#f7f5ef", roughness: 0.8, metalness: 0.02 },
//   "cream-paint": { label: "Cream paint", color: "#eee4d0", roughness: 0.82, metalness: 0.01 },
//   "grey-paint": { label: "Grey paint", color: "#aeb5b1", roughness: 0.78, metalness: 0.02 },
//   marble: { label: "Marble", color: "#e9e6de", roughness: 0.28, metalness: 0.04 },
//   "light-wood": { label: "Light wood", color: "#b9976c", roughness: 0.62, metalness: 0.02 },
//   "dark-wood": { label: "Dark wood", color: "#553d2d", roughness: 0.58, metalness: 0.02 },
//   concrete: { label: "Concrete", color: "#b4b3ad", roughness: 0.9, metalness: 0 },
//   stone: { label: "Stone", color: "#8a857a", roughness: 0.92, metalness: 0 },
//   grass: { label: "Grass", color: "#70875d", roughness: 1, metalness: 0 },
//   black: { label: "Black frame", color: "#1f2825", roughness: 0.35, metalness: 0.5 },
//   glass: { label: "Clear glass", color: "#b9dce1", roughness: 0.08, metalness: 0.1 },
//   fabric: { label: "Fabric", color: "#a99c8e", roughness: 0.92, metalness: 0 },
//   metal: { label: "Metal", color: "#8d9593", roughness: 0.24, metalness: 0.8 },
// };

// const textureCache = new Map();

// function drawTexture(name) {
//   if (typeof document === "undefined") return null;
//   if (textureCache.has(name)) return textureCache.get(name);
//   const canvas = document.createElement("canvas");
//   canvas.width = 256;
//   canvas.height = 256;
//   const context = canvas.getContext("2d");
//   const preset = MATERIAL_PRESETS[name] || MATERIAL_PRESETS.concrete;
//   context.fillStyle = preset.color;
//   context.fillRect(0, 0, 256, 256);

//   if (name.includes("wood")) {
//     for (let x = -256; x < 512; x += 18) {
//       context.strokeStyle = x % 36 === 0 ? "rgba(75,43,24,.18)" : "rgba(255,255,255,.08)";
//       context.lineWidth = x % 36 === 0 ? 3 : 1;
//       context.beginPath();
//       context.moveTo(x, 0);
//       context.bezierCurveTo(x + 12, 70, x - 10, 170, x + 9, 256);
//       context.stroke();
//     }
//   } else if (name.includes("marble")) {
//     for (let index = 0; index < 18; index += 1) {
//       context.strokeStyle = `rgba(92,98,101,${0.08 + (index % 3) * 0.03})`;
//       context.lineWidth = 1 + (index % 2);
//       context.beginPath();
//       context.moveTo((index * 71) % 256, 0);
//       context.bezierCurveTo(100 + index * 3, 75, 40 + index * 11, 150, (index * 47) % 256, 256);
//       context.stroke();
//     }
//   } else if (name.includes("tile")) {
//     context.strokeStyle = "rgba(70,70,70,.14)";
//     context.lineWidth = 2;
//     for (let offset = 0; offset <= 256; offset += 64) {
//       context.beginPath(); context.moveTo(offset, 0); context.lineTo(offset, 256); context.stroke();
//       context.beginPath(); context.moveTo(0, offset); context.lineTo(256, offset); context.stroke();
//     }
//   } else if (["stone", "concrete", "grass"].some((item) => name.includes(item))) {
//     for (let index = 0; index < 500; index += 1) {
//       const shade = name === "grass" ? "rgba(32,70,30,.12)" : "rgba(30,30,30,.08)";
//       context.fillStyle = shade;
//       const size = 1 + (index % 3);
//       context.fillRect((index * 47) % 256, (index * 83) % 256, size, size);
//     }
//   }

//   const texture = new THREE.CanvasTexture(canvas);
//   texture.colorSpace = THREE.SRGBColorSpace;
//   texture.wrapS = THREE.RepeatWrapping;
//   texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.set(name === "grass" ? 5 : 2.5, name === "grass" ? 5 : 2.5);
//   texture.anisotropy = 4;
//   textureCache.set(name, texture);
//   return texture;
// }

// export function materialFor(name, fallback = "concrete") {
//   return MATERIAL_PRESETS[name] || MATERIAL_PRESETS[fallback];
// }

// export function textureFor(name) {
//   return drawTexture(name);
// }












































import * as THREE from "three";

/* =========================================================
   MATERIAL PRESETS
========================================================= */

export const MATERIAL_PRESETS = {
  "white-paint": {
    label: "White paint",
    color: "#f7f5ef",
    roughness: 0.8,
    metalness: 0.02,
  },

  "cream-paint": {
    label: "Cream paint",
    color: "#eee4d0",
    roughness: 0.82,
    metalness: 0.01,
  },

  "grey-paint": {
    label: "Grey paint",
    color: "#aeb5b1",
    roughness: 0.78,
    metalness: 0.02,
  },

  marble: {
    label: "Marble",
    color: "#e9e6de",
    roughness: 0.28,
    metalness: 0.04,
  },

  "light-wood": {
    label: "Light wood",
    color: "#b9976c",
    roughness: 0.62,
    metalness: 0.02,
  },

  "dark-wood": {
    label: "Dark wood",
    color: "#553d2d",
    roughness: 0.58,
    metalness: 0.02,
  },

  concrete: {
    label: "Concrete",
    color: "#b4b3ad",
    roughness: 0.9,
    metalness: 0,
  },

  stone: {
    label: "Stone",
    color: "#8a857a",
    roughness: 0.92,
    metalness: 0,
  },

  grass: {
    label: "Grass",
    color: "#70875d",
    roughness: 1,
    metalness: 0,
  },

  black: {
    label: "Black frame",
    color: "#1f2825",
    roughness: 0.35,
    metalness: 0.5,
  },

  glass: {
    label: "Clear glass",
    color: "#b9dce1",
    roughness: 0.08,
    metalness: 0.1,
  },

  fabric: {
    label: "Fabric",
    color: "#a99c8e",
    roughness: 0.92,
    metalness: 0,
  },

  metal: {
    label: "Metal",
    color: "#8d9593",
    roughness: 0.24,
    metalness: 0.8,
  },

  /* aliases used by the architectural plan */
  "white-plaster": {
    label: "White plaster",
    color: "#f4f1e8",
    roughness: 0.86,
    metalness: 0,
  },

  "cream-plaster": {
    label: "Cream plaster",
    color: "#e8ddc8",
    roughness: 0.86,
    metalness: 0,
  },

  "roof-tile": {
    label: "Roof tile",
    color: "#8a6550",
    roughness: 0.78,
    metalness: 0.02,
  },

  tile: {
    label: "Ceramic tile",
    color: "#d8d5cc",
    roughness: 0.34,
    metalness: 0.02,
  },

  ceramic: {
    label: "Ceramic",
    color: "#e8e6df",
    roughness: 0.3,
    metalness: 0.02,
  },

  "stainless-steel": {
    label: "Stainless steel",
    color: "#9ca3a3",
    roughness: 0.22,
    metalness: 0.85,
  },
};

/* =========================================================
   TEXTURE CACHE
========================================================= */

const textureCache = new Map();

/* =========================================================
   SAFE TEXTURE NAME
========================================================= */

function safeMaterialName(name) {
  if (typeof name !== "string") {
    return "";
  }

  return name.trim().toLowerCase();
}

/* =========================================================
   PROCEDURAL TEXTURE GENERATOR
========================================================= */

function drawTexture(name = "") {
  /*
   * IMPORTANT:
   * Never allow undefined/null to reach .includes()
   */

  const safeName = safeMaterialName(name);

  if (typeof document === "undefined") {
    return null;
  }

  /*
   * No material supplied:
   * don't generate a texture.
   */
  if (!safeName) {
    return null;
  }

  /*
   * Use normalized name for cache.
   */
  if (textureCache.has(safeName)) {
    return textureCache.get(safeName);
  }

  const canvas = document.createElement("canvas");

  canvas.width = 512;
  canvas.height = 512;

  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  /*
   * If material doesn't exist, use concrete
   * as procedural fallback.
   */
  const preset =
    MATERIAL_PRESETS[safeName] ||
    MATERIAL_PRESETS.concrete;

  /* =======================================================
     BASE COLOR
  ======================================================= */

  context.fillStyle = preset.color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  /* =======================================================
     WOOD
  ======================================================= */

  if (
    safeName.includes("wood") ||
    safeName.includes("timber")
  ) {
    for (let x = -512; x < 1024; x += 28) {
      context.strokeStyle =
        x % 56 === 0
          ? "rgba(75,43,24,.20)"
          : "rgba(255,255,255,.07)";

      context.lineWidth =
        x % 56 === 0 ? 4 : 1.5;

      context.beginPath();

      context.moveTo(x, 0);

      context.bezierCurveTo(
        x + 25,
        120,
        x - 25,
        300,
        x + 18,
        512
      );

      context.stroke();
    }

    /*
     * Small wood grain details
     */
    for (let index = 0; index < 90; index += 1) {
      const y = (index * 67) % 512;

      context.strokeStyle =
        "rgba(55,32,20,.06)";

      context.lineWidth = 1;

      context.beginPath();

      context.moveTo(0, y);

      context.bezierCurveTo(
        150,
        y + 8,
        350,
        y - 8,
        512,
        y + 4
      );

      context.stroke();
    }
  }

  /* =======================================================
     MARBLE
  ======================================================= */

  else if (safeName.includes("marble")) {
    for (let index = 0; index < 25; index += 1) {
      context.strokeStyle =
        `rgba(92,98,101,${
          0.06 + (index % 4) * 0.025
        })`;

      context.lineWidth =
        1 + (index % 3);

      context.beginPath();

      context.moveTo(
        (index * 91) % 512,
        0
      );

      context.bezierCurveTo(
        170 + index * 5,
        130,
        70 + index * 17,
        300,
        (index * 61) % 512,
        512
      );

      context.stroke();
    }

    /*
     * Fine marble veins
     */
    for (let index = 0; index < 35; index += 1) {
      context.strokeStyle =
        "rgba(80,80,80,.035)";

      context.lineWidth = 1;

      context.beginPath();

      context.moveTo(
        (index * 41) % 512,
        0
      );

      context.lineTo(
        (index * 73) % 512,
        512
      );

      context.stroke();
    }
  }

  /* =======================================================
     TILE / CERAMIC
  ======================================================= */

  else if (
    safeName.includes("tile") ||
    safeName.includes("ceramic")
  ) {
    context.strokeStyle =
      "rgba(70,70,70,.14)";

    context.lineWidth = 2;

    for (
      let offset = 0;
      offset <= 512;
      offset += 64
    ) {
      context.beginPath();
      context.moveTo(offset, 0);
      context.lineTo(offset, 512);
      context.stroke();

      context.beginPath();
      context.moveTo(0, offset);
      context.lineTo(512, offset);
      context.stroke();
    }

    /*
     * Slight tile variation
     */
    for (let index = 0; index < 25; index += 1) {
      context.fillStyle =
        "rgba(255,255,255,.035)";

      context.fillRect(
        (index * 97) % 512,
        (index * 61) % 512,
        45,
        45
      );
    }
  }

  /* =======================================================
     STONE / CONCRETE
  ======================================================= */

  else if (
    safeName.includes("stone") ||
    safeName.includes("concrete") ||
    safeName.includes("plaster")
  ) {
    for (let index = 0; index < 1000; index += 1) {
      const shade =
        safeName.includes("stone")
          ? "rgba(30,30,30,.075)"
          : "rgba(30,30,30,.045)";

      context.fillStyle = shade;

      const size =
        1 + (index % 4);

      context.fillRect(
        (index * 47) % 512,
        (index * 83) % 512,
        size,
        size
      );
    }
  }

  /* =======================================================
     GRASS
  ======================================================= */

  else if (
    safeName.includes("grass")
  ) {
    for (let index = 0; index < 1400; index += 1) {
      context.fillStyle =
        index % 2 === 0
          ? "rgba(32,70,30,.16)"
          : "rgba(255,255,255,.035)";

      const size =
        1 + (index % 3);

      context.fillRect(
        (index * 47) % 512,
        (index * 83) % 512,
        size,
        size * 2
      );
    }
  }

  /* =======================================================
     FABRIC
  ======================================================= */

  else if (
    safeName.includes("fabric")
  ) {
    context.strokeStyle =
      "rgba(60,60,60,.035)";

    context.lineWidth = 1;

    for (
      let offset = 0;
      offset < 512;
      offset += 6
    ) {
      context.beginPath();
      context.moveTo(offset, 0);
      context.lineTo(offset, 512);
      context.stroke();

      context.beginPath();
      context.moveTo(0, offset);
      context.lineTo(512, offset);
      context.stroke();
    }
  }

  /* =======================================================
     METAL
  ======================================================= */

  else if (
    safeName.includes("metal") ||
    safeName.includes("steel") ||
    safeName === "black"
  ) {
    for (let index = 0; index < 40; index += 1) {
      context.strokeStyle =
        `rgba(255,255,255,${
          0.02 + (index % 3) * 0.015
        })`;

      context.lineWidth = 1;

      context.beginPath();

      context.moveTo(
        0,
        index * 18
      );

      context.lineTo(
        512,
        index * 18 + 4
      );

      context.stroke();
    }
  }

  /* =======================================================
     GLASS
  ======================================================= */

  else if (
    safeName.includes("glass")
  ) {
    context.fillStyle =
      "rgba(180,220,225,.35)";

    context.fillRect(
      0,
      0,
      512,
      512
    );

    context.strokeStyle =
      "rgba(255,255,255,.18)";

    context.lineWidth = 3;

    for (
      let offset = -512;
      offset < 1024;
      offset += 80
    ) {
      context.beginPath();

      context.moveTo(
        offset,
        0
      );

      context.lineTo(
        offset + 512,
        512
      );

      context.stroke();
    }
  }

  /* =======================================================
     CREATE THREE TEXTURE
  ======================================================= */

  const texture =
    new THREE.CanvasTexture(canvas);

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.wrapS =
    THREE.RepeatWrapping;

  texture.wrapT =
    THREE.RepeatWrapping;

  const repeat =
    safeName.includes("grass")
      ? 5
      : safeName.includes("tile")
        ? 4
        : 2.5;

  texture.repeat.set(
    repeat,
    repeat
  );

  texture.anisotropy = 4;

  texture.needsUpdate = true;

  textureCache.set(
    safeName,
    texture
  );

  return texture;
}

/* =========================================================
   MATERIAL LOOKUP
========================================================= */

export function materialFor(
  name,
  fallback = "concrete"
) {
  const safeName =
    safeMaterialName(name);

  /*
   * Exact material
   */
  if (
    safeName &&
    MATERIAL_PRESETS[safeName]
  ) {
    return MATERIAL_PRESETS[safeName];
  }

  /*
   * Fallback material
   */
  const safeFallback =
    safeMaterialName(fallback);

  return (
    MATERIAL_PRESETS[safeFallback] ||
    MATERIAL_PRESETS.concrete
  );
}

/* =========================================================
   TEXTURE LOOKUP
========================================================= */

export function textureFor(name) {
  /*
   * IMPORTANT:
   * undefined/null/empty material is valid.
   * Just return null instead of crashing.
   */
  const safeName =
    safeMaterialName(name);

  if (!safeName) {
    return null;
  }

  return drawTexture(safeName);
}

/* =========================================================
   OPTIONAL CACHE CLEANUP
========================================================= */

export function disposeMaterialTextures() {
  textureCache.forEach((texture) => {
    texture.dispose();
  });

  textureCache.clear();
}
