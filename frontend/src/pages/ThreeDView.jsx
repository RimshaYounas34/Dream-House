import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  TransformControls,
} from "@react-three/drei";
import { useLocation, useNavigate } from "react-router-dom";
import { createProject, getProject, updateProject } from "../services/projectApi";
import { normalizeFloorPlan, planFromLocationState } from "../utils/planNormalizer";
import { materialFor, textureFor } from "../utils/materials";

/* =========================================================
   HOUSE SETTINGS
========================================================= */

const SCALE = 0.018;
const WALL_H = 2.7;
const WALL_T = 0.16;
const FLOOR_HEIGHT = 3.05;

/* =========================================================
   2D -> 3D DATA
   The 3D scene never creates or rearranges rooms. It renders the
   exact objects received from the 2D editor using the same x/y,
   width/height and rotation values.
========================================================= */

/* =========================================================
   COLORS
========================================================= */

const FLOOR_COLORS = {
  living: "#c9a982",
  bedroom: "#c5a47f",
  kitchen: "#c9c6bc",
  dining: "#a77f57",
  bathroom: "#d7dedc",
  garage: "#8c918e",
  study: "#b28e68",
  balcony: "#9a876d",
  laundry: "#c9cbc6",
  store: "#a89a87",
  stairs: "#a88762",
};

const WALL_COLOR = "#eee9df";

/* =========================================================
   CONVERT ROOM TO 3D
========================================================= */

function convertRoom(room) {
  return {
    ...room,
    x: room.x * SCALE,
    z: room.y * SCALE,
    width: room.width * SCALE,
    depth: room.height * SCALE,
  };
}

/* =========================================================
   SIMPLE BOX
========================================================= */

function Box({
  position,
  size,
  color,
  materialName,
  rotation = [0, 0, 0],
  roughness = 0.8,
  metalness = 0,
  castShadow = true,
  receiveShadow = true,
}) {
  const preset = materialName ? materialFor(materialName) : null;
  // const texture = useMemo(() => textureFor(materialName), [materialName]);
  const texture = useMemo(
  () => (materialName ? textureFor(materialName) : null),
  [materialName]
);
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <boxGeometry args={size} />
      <meshPhysicalMaterial
        map={texture || undefined}
        color={texture ? "#ffffff" : color || preset?.color || "#c7c5bd"}
        roughness={preset?.roughness ?? roughness}
        metalness={preset?.metalness ?? metalness}
        clearcoat={materialName === "glass" ? 0.8 : 0.08}
        clearcoatRoughness={materialName === "glass" ? 0.08 : 0.35}
        transmission={materialName === "glass" ? 0.72 : 0}
        transparent={materialName === "glass"}
        opacity={materialName === "glass" ? 0.72 : 1}
      />
    </mesh>
  );
}

/* =========================================================
   ROOM FLOOR
========================================================= */

function RoomFloor({ room }) {
  return (
    <Box
      position={[
        room.x + room.width / 2,
        0.035,
        room.z + room.depth / 2,
      ]}
      size={[
        room.width,
        0.07,
        room.depth,
      ]}
      color={room.floorColor || FLOOR_COLORS[room.type] || "#c0a17f"}
      materialName={room.floorMaterial}
      castShadow={false}
    />
  );
}

function RoomCeiling({ room }) {
  return <Box position={[room.x + room.width / 2, Number(room.ceilingHeight || WALL_H), room.z + room.depth / 2]} size={[room.width, 0.08, room.depth]} color={room.ceilingColor || "#fffdf8"} materialName={room.ceilingMaterial || "white-paint"} castShadow={false} />;
}

/* =========================================================
   ROOM WALLS
========================================================= */

function RoomWalls({ room, doors = [], windows = [] }) {
  const y = WALL_H / 2;
  const openings = [...doors, ...windows].map(convertRoom).filter((opening) => opening.y <= room.z + 0.2 && opening.x < room.x + room.width && opening.x + opening.width > room.x).sort((a, b) => a.x - b.x);
  const topSegments = [];
  let cursor = room.x;
  for (const opening of openings) {
    const start = Math.max(room.x, opening.x);
    const end = Math.min(room.x + room.width, opening.x + opening.width);
    if (start > cursor) topSegments.push([cursor, start]);
    cursor = Math.max(cursor, end);
  }
  if (cursor < room.x + room.width) topSegments.push([cursor, room.x + room.width]);

  return (
    <group>
      {/* left */}
      <Box
        position={[
          room.x,
          y,
          room.z + room.depth / 2,
        ]}
        size={[
          WALL_T,
          WALL_H,
          room.depth,
        ]}
        color={room.wallColor || WALL_COLOR}
        materialName={room.wallMaterial}
      />

      {/* right */}
      <Box
        position={[
          room.x + room.width,
          y,
          room.z + room.depth / 2,
        ]}
        size={[
          WALL_T,
          WALL_H,
          room.depth,
        ]}
        color={room.wallColor || WALL_COLOR}
        materialName={room.wallMaterial}
      />

      {/* top wall split around actual door/window openings */}
      {(openings.length ? topSegments : [[room.x, room.x + room.width]]).map(([start, end], index) => <Box key={`top-${index}`} position={[(start + end) / 2, y, room.z]} size={[end - start, WALL_H, WALL_T]} color={room.wallColor || WALL_COLOR} materialName={room.wallMaterial} />)}

      {/* bottom */}
      <Box
        position={[
          room.x + room.width / 2,
          y,
          room.z + room.depth,
        ]}
        size={[
          room.width,
          WALL_H,
          WALL_T,
        ]}
        color={room.wallColor || WALL_COLOR}
        materialName={room.wallMaterial}
      />
    </group>
  );
}

/* =========================================================
   BED
========================================================= */

function Bed({ room }) {
  const cx = room.x + room.width / 2;
  const cz = room.z + room.depth / 2;

  return (
    <group position={[cx, 0, cz]}>
      {/* bed base */}
      <Box
        position={[0, 0.35, 0]}
        size={[2.25, 0.42, 2.2]}
        color="#704b36"
      />

      {/* mattress */}
      <Box
        position={[0, 0.62, 0]}
        size={[2.08, 0.25, 2.05]}
        color="#eee9de"
      />

      {/* blanket */}
      <Box
        position={[0, 0.77, 0.38]}
        size={[1.9, 0.08, 1.05]}
        color="#b9b5a7"
        castShadow={false}
      />

      {/* headboard */}
      <Box
        position={[0, 1.15, -1.03]}
        size={[2.25, 1.2, 0.13]}
        color="#674735"
      />

      {/* pillows */}
      <Box
        position={[-0.48, 0.82, -0.67]}
        size={[0.68, 0.14, 0.42]}
        color="#faf8f1"
      />

      <Box
        position={[0.48, 0.82, -0.67]}
        size={[0.68, 0.14, 0.42]}
        color="#faf8f1"
      />

      <BedsideTable x={-1.35} z={-0.55} />
      <BedsideTable x={1.35} z={-0.55} />
    </group>
  );
}

/* =========================================================
   BEDSIDE TABLE
========================================================= */

function BedsideTable({ x, z }) {
  return (
    <group position={[x, 0, z]}>
      <Box
        position={[0, 0.35, 0]}
        size={[0.45, 0.65, 0.45]}
        color="#79563d"
      />

      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.25, 16]} />
        <meshStandardMaterial color="#d0b878" />
      </mesh>

      <mesh position={[0, 0.94, 0]}>
        <coneGeometry args={[0.22, 0.18, 4]} />
        <meshStandardMaterial color="#eee6d7" />
      </mesh>
    </group>
  );
}

/* =========================================================
   SOFA
========================================================= */

function Sofa({ room }) {
  const cx = room.x + room.width / 2;
  const cz = room.z + room.depth / 2;

  return (
    <group position={[cx, 0, cz]}>
      <Box
        position={[0, 0.42, 0.65]}
        size={[2.7, 0.55, 0.8]}
        color="#858d84"
      />

      <Box
        position={[0, 0.82, 0.85]}
        size={[2.55, 0.55, 0.2]}
        color="#747d75"
      />

      <Box
        position={[-1.18, 0.75, 0.65]}
        size={[0.35, 0.85, 0.82]}
        color="#747d75"
      />

      <Box
        position={[1.18, 0.75, 0.65]}
        size={[0.35, 0.85, 0.82]}
        color="#747d75"
      />

      {/* coffee table */}
      <Box
        position={[0, 0.35, -0.3]}
        size={[1.35, 0.12, 0.72]}
        color="#815a3d"
      />

      {/* TV cabinet */}
      <Box
        position={[0, 0.42, -room.depth / 2 + 0.45]}
        size={[2.2, 0.7, 0.35]}
        color="#694b36"
      />

      {/* TV */}
      <Box
        position={[0, 1.15, -room.depth / 2 + 0.27]}
        size={[1.85, 0.95, 0.06]}
        color="#171b1b"
        metalness={0.2}
        roughness={0.15}
      />
    </group>
  );
}

/* =========================================================
   KITCHEN
========================================================= */

function Kitchen({ room }) {
  const x = room.x;
  const z = room.z;

  return (
    <group>
      {/* back cabinets */}
      <Box
        position={[
          x + room.width / 2,
          0.58,
          z + 0.45,
        ]}
        size={[
          room.width - 0.6,
          1.05,
          0.65,
        ]}
        color="#dedbd2"
      />

      {/* counter */}
      <Box
        position={[
          x + room.width / 2,
          1.15,
          z + 0.45,
        ]}
        size={[
          room.width - 0.5,
          0.12,
          0.75,
        ]}
        color="#777873"
        roughness={0.4}
      />

      {/* island */}
      <Box
        position={[
          x + room.width / 2,
          0.62,
          z + room.depth - 1.15,
        ]}
        size={[
          Math.min(2.1, room.width - 1),
          1.05,
          0.8,
        ]}
        color="#e4dfd3"
      />

      {/* stools */}
      {[-0.55, 0, 0.55].map((offset, i) => (
        <group
          key={i}
          position={[
            x + room.width / 2 + offset,
            0.35,
            z + room.depth - 0.55,
          ]}
        >
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.65, 12]} />
            <meshStandardMaterial color="#5d4a39" />
          </mesh>

          <mesh position={[0, 0.37, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
            <meshStandardMaterial color="#9b7858" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* =========================================================
   DINING
========================================================= */

function Dining({ room }) {
  const cx = room.x + room.width / 2;
  const cz = room.z + room.depth / 2;

  return (
    <group>
      <Box
        position={[cx, 0.72, cz]}
        size={[2.0, 0.14, 1.1]}
        color="#805b3e"
      />

      {[
        [-0.8, -0.55],
        [0.8, -0.55],
        [-0.8, 0.55],
        [0.8, 0.55],
      ].map(([dx, dz], i) => (
        <group
          key={i}
          position={[cx + dx, 0.42, cz + dz]}
        >
          <Box
            position={[0, 0, 0]}
            size={[0.42, 0.65, 0.42]}
            color="#6c503b"
          />

          <Box
            position={[0, 0.4, 0]}
            size={[0.55, 0.1, 0.55]}
            color="#987252"
          />
        </group>
      ))}
    </group>
  );
}

/* =========================================================
   BATHROOM
========================================================= */

function Bathroom({ room }) {
  return (
    <group>
      {/* bathtub */}
      <Box
        position={[
          room.x + room.width * 0.3,
          0.32,
          room.z + room.depth * 0.32,
        ]}
        size={[0.75, 0.55, 1.25]}
        color="#f0efeb"
      />

      {/* toilet */}
      <mesh
        position={[
          room.x + room.width * 0.72,
          0.3,
          room.z + room.depth * 0.32,
        ]}
        castShadow
      >
        <cylinderGeometry args={[0.27, 0.32, 0.45, 24]} />
        <meshStandardMaterial color="#f2f0eb" />
      </mesh>

      {/* sink */}
      <Box
        position={[
          room.x + room.width / 2,
          0.55,
          room.z + room.depth * 0.73,
        ]}
        size={[0.65, 0.65, 0.4]}
        color="#d5d0c6"
      />

      <mesh
        position={[
          room.x + room.width / 2,
          0.92,
          room.z + room.depth * 0.73,
        ]}
      >
        <cylinderGeometry args={[0.2, 0.2, 0.06, 20]} />
        <meshStandardMaterial color="#f4f1eb" />
      </mesh>
    </group>
  );
}

/* =========================================================
   STUDY
========================================================= */

function Study({ room }) {
  const cx = room.x + room.width / 2;

  return (
    <group>
      <Box
        position={[cx, 0.65, room.z + 0.7]}
        size={[1.8, 0.14, 0.65]}
        color="#79583f"
      />

      <Box
        position={[cx, 0.45, room.z + 1.4]}
        size={[0.65, 0.7, 0.65]}
        color="#6d7770"
      />

      {/* bookshelf */}
      <Box
        position={[
          room.x + 0.4,
          1.15,
          room.z + room.depth / 2,
        ]}
        size={[0.42, 2.0, 1.35]}
        color="#71523d"
      />
    </group>
  );
}

/* =========================================================
   CAR
========================================================= */

function Car({ room }) {
  const cx = room.x + room.width / 2;
  const cz = room.z + room.depth / 2;

  return (
    <group position={[cx, 0, cz]}>
      {/* body */}
      <Box
        position={[0, 0.45, 0]}
        size={[1.55, 0.55, 2.75]}
        color="#a8ada8"
        roughness={0.3}
        metalness={0.45}
      />

      {/* upper body */}
      <Box
        position={[0, 0.85, -0.1]}
        size={[1.3, 0.35, 1.45]}
        color="#8f9893"
        roughness={0.3}
        metalness={0.35}
      />

      {/* windshield */}
      <Box
        position={[0, 1.02, -0.42]}
        size={[1.08, 0.22, 0.04]}
        color="#273338"
        roughness={0.15}
        metalness={0.25}
      />

      {/* wheels */}
      {[
        [-0.82, -0.82],
        [0.82, -0.82],
        [-0.82, 0.82],
        [0.82, 0.82],
      ].map(([x, z], i) => (
        <mesh
          key={i}
          position={[x * 0.72, 0.3, z]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.22, 0.22, 0.16, 20]} />
          <meshStandardMaterial color="#242625" />
        </mesh>
      ))}
    </group>
  );
}

/* =========================================================
   TREES
========================================================= */

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 1.1, 10]} />
        <meshStandardMaterial color="#73533b" />
      </mesh>

      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.72, 16, 16]} />
        <meshStandardMaterial
          color="#5e8052"
          roughness={1}
        />
      </mesh>

      <mesh position={[0.35, 1.15, 0.15]} castShadow>
        <sphereGeometry args={[0.45, 14, 14]} />
        <meshStandardMaterial
          color="#6e8d5e"
          roughness={1}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   GARDEN
========================================================= */

function Garden({ houseWidth, houseDepth }) {
  return (
    <group>
      {/* large ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[
          houseWidth / 2,
          -0.03,
          houseDepth / 2,
        ]}
        receiveShadow
      >
        <planeGeometry args={[houseWidth + 8, houseDepth + 8]} />
        <meshStandardMaterial
          color="#a9b29b"
          roughness={1}
        />
      </mesh>

      {/* driveway */}
      <Box
        position={[
          houseWidth + 1.15,
          0.01,
          houseDepth / 2,
        ]}
        size={[2.3, 0.04, 5.5]}
        color="#777a77"
        castShadow={false}
      />

      {/* garden border */}
      <Box
        position={[
          houseWidth / 2,
          0.15,
          -0.2,
        ]}
        size={[houseWidth + 0.8, 0.3, 0.18]}
        color="#ddd9cf"
      />

      <Box
        position={[
          -0.2,
          0.15,
          houseDepth / 2,
        ]}
        size={[0.18, 0.3, houseDepth]}
        color="#ddd9cf"
      />

      {/* trees */}
      <Tree position={[-1.4, 0, -0.9]} scale={1.15} />
      <Tree position={[houseWidth + 0.9, 0, -0.8]} scale={1.2} />
      <Tree position={[-1.2, 0, houseDepth + 0.9]} scale={0.9} />
      <Tree position={[houseWidth + 1.2, 0, houseDepth + 0.7]} scale={1.1} />

      <Tree position={[houseWidth / 2 - 3, 0, houseDepth + 1.2]} scale={0.7} />
      <Tree position={[houseWidth / 2 + 3, 0, houseDepth + 1.2]} scale={0.75} />
    </group>
  );
}

function BoundarySite({ houseWidth, houseDepth, site = {} }) {
  if (site.boundaryWall?.enabled === false) return null;
  const wallHeight = Number(site.boundaryWall?.height || 2.2);
  const wallColor = site.boundaryWall?.color || materialFor(site.boundaryWall?.material || "white-plaster").color;
  const gateWidth = Math.max(Number(site.gate?.width || 4) * SCALE * 8, 1.2);
  return (
    <group>
      <Box position={[houseWidth / 2, wallHeight / 2, -2.4]} size={[houseWidth + 5, wallHeight, 0.18]} color={wallColor} materialName={site.boundaryWall?.material} />
      <Box position={[-2.4, wallHeight / 2, houseDepth / 2]} size={[0.18, wallHeight, houseDepth + 5]} color={wallColor} materialName={site.boundaryWall?.material} />
      <Box position={[houseWidth + 2.4, wallHeight / 2, houseDepth / 2]} size={[0.18, wallHeight, houseDepth + 5]} color={wallColor} materialName={site.boundaryWall?.material} />
      <Box position={[(houseWidth - gateWidth) / 2, wallHeight / 2, houseDepth + 2.4]} size={[(houseWidth - gateWidth) / 2, wallHeight, 0.18]} color={wallColor} />
      <Box position={[(houseWidth + gateWidth) / 2, wallHeight / 2, houseDepth + 2.4]} size={[(houseWidth - gateWidth) / 2, wallHeight, 0.18]} color={wallColor} />
      <Box position={[houseWidth / 2, 0.06, houseDepth + 1.1]} size={[gateWidth, 0.08, 2.7]} color={site.gate?.color || "#26352f"} materialName={site.gate?.material} />
      {site.parkingSpaces > 0 && Array.from({ length: Math.min(Number(site.parkingSpaces), 3) }).map((_, index) => (
        <Box key={index} position={[houseWidth + 1.1, 0.04, 1.4 + index * 1.7]} size={[2.2, 0.06, 1.35]} color="#8a8a82" materialName="concrete" />
      ))}
    </group>
  );
}

/* =========================================================
   FLOOR SLABS / STRUCTURE
   Every selected floor gets a real horizontal slab at its
   elevation so multi-storey houses read as one stacked building.
========================================================= */

function FloorSlab({ rooms = [], floorElevation = 0, visible = true }) {
  if (!visible || !rooms.length) return null;

  const converted = rooms.map(convertRoom);
  const minX = Math.min(...converted.map((room) => room.x));
  const minZ = Math.min(...converted.map((room) => room.z));
  const maxX = Math.max(...converted.map((room) => room.x + room.width));
  const maxZ = Math.max(...converted.map((room) => room.z + room.depth));

  const width = Math.max(maxX - minX + 0.18, 1);
  const depth = Math.max(maxZ - minZ + 0.18, 1);
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;

  return (
    <group>
      <Box
        position={[centerX, floorElevation - 0.08, centerZ]}
        size={[width, 0.16, depth]}
        color="#b9b6ae"
        materialName="concrete"
        castShadow
        receiveShadow
      />
      {floorElevation > 0 && (
        <Box
          position={[centerX, floorElevation - 0.18, centerZ]}
          size={[width + 0.04, 0.05, depth + 0.04]}
          color="#8f918b"
          materialName="concrete"
          castShadow={false}
        />
      )}
    </group>
  );
}

function Roof({ houseWidth, houseDepth, roof = {}, visible = true, floorCount = 1 }) {
  if (!visible) return null;
  const roofColor = roof.color || materialFor(roof.material || "concrete").color;
  const roofHeight = Number(roof.height || 0.45);
  const roofBase = Math.max(1, Number(floorCount || 1)) * FLOOR_HEIGHT;
  if (roof.type === "sloped" || roof.type === "tiled") {
    return <Box position={[houseWidth / 2, roofBase + roofHeight, houseDepth / 2]} size={[houseWidth + 0.35, 0.22, houseDepth + 0.35]} color={roofColor} materialName={roof.material} rotation={[0, 0, roof.type === "sloped" ? 0.04 : 0]} />;
  }
  return (
    <group>
      <Box position={[houseWidth / 2, roofBase + roofHeight / 2, 0]} size={[houseWidth + 0.3, roofHeight, 0.16]} color={roofColor} materialName={roof.material} />
      <Box position={[houseWidth / 2, roofBase + roofHeight / 2, houseDepth]} size={[houseWidth + 0.3, roofHeight, 0.16]} color={roofColor} materialName={roof.material} />
      <Box position={[0, roofBase + roofHeight / 2, houseDepth / 2]} size={[0.16, roofHeight, houseDepth]} color={roofColor} materialName={roof.material} />
      <Box position={[houseWidth, roofBase + roofHeight / 2, houseDepth / 2]} size={[0.16, roofHeight, houseDepth]} color={roofColor} materialName={roof.material} />
    </group>
  );
}

function Openings3D({ doors = [], windows = [], floorElevation = 0 }) {
  return (
    <group position={[0, floorElevation, 0]}>
      {doors.map((door) => {
        const item = convertRoom(door);
        return <Box key={door.id} position={[item.x + item.width / 2, 1.1, item.z]} size={[Math.max(item.width, 0.5), 2.2, 0.08]} color={door.color || "#553d2d"} materialName={door.material || "dark-wood"} rotation={[0, ((door.rotation || 0) * Math.PI) / 180, 0]} />;
      })}
      {windows.map((window) => {
        const item = convertRoom(window);
        return <Box key={window.id} position={[item.x + item.width / 2, 1.45, item.z]} size={[Math.max(item.width, 0.6), 1.35, 0.06]} color={window.frameColor || "#1f2825"} materialName={window.frameMaterial || "black"} rotation={[0, ((window.rotation || 0) * Math.PI) / 180, 0]} metalness={0.35} roughness={0.18} />;
      })}
    </group>
  );
}

/* =========================================================
   ROOM FURNITURE
========================================================= */

function Furniture({ room }) {
  if (room.type === "living") {
    return <Sofa room={room} />;
  }

  if (room.type === "bedroom") {
    return <Bed room={room} />;
  }

  if (room.type === "kitchen") {
    return <Kitchen room={room} />;
  }

  if (room.type === "dining") {
    return <Dining room={room} />;
  }

  if (room.type === "bathroom") {
    return <Bathroom room={room} />;
  }

  if (room.type === "study") {
    return <Study room={room} />;
  }

  if (room.type === "garage") {
    return <Car room={room} />;
  }

  if (room.type === "stairs") {
    return <Stairs3D room={room} />;
  }

  return null;
}

function PlacedFurniture({ piece, selected, onSelect, onCommit }) {
  const groupRef = useRef();
  const item = convertRoom(piece);
  return (
    <>
      <group ref={groupRef} position={[item.x + item.width / 2, 0.45, item.z + item.depth / 2]} rotation={[0, ((piece.rotation || 0) * Math.PI) / 180, 0]} onClick={(event) => { event.stopPropagation(); onSelect(piece.id); }}>
        <Box
          position={[0, 0, 0]}
          size={[item.width, 0.8, item.depth]}
          color={piece.color || (piece.type === "bed" ? "#806248" : piece.type === "sofa" ? "#6c8178" : "#a48b69")}
          materialName={piece.material}
        />
      </group>
      {selected && groupRef.current && <TransformControls object={groupRef.current} mode="translate" showX showY={false} showZ onMouseUp={() => onCommit(piece.id, groupRef.current.position)} />}
    </>
  );
}

/* =========================================================
   HOUSE
========================================================= */

function House({
  rooms,
  walls = [],
  furniture = [],
  doors = [],
  windows = [],
  showCeilings = false,
  floorElevation = 0,
  selected,
  onSelect,
  onFurnitureSelect,
  onFurnitureCommit,
}) {
  const converted = rooms.map(convertRoom);

  return (
    <group position={[0, floorElevation, 0]}>
      {converted.map((room) => (
        <group
          key={room.id}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(room);
          }}
        >
          <RoomFloor room={room} />
          {showCeilings && <RoomCeiling room={room} />}

          <RoomWalls
            room={room}
            doors={doors.filter((door) =>
              door.roomId === room.id ||
              String(door.name || "").toLowerCase().includes(String(room.name || "").toLowerCase())
            )}
            windows={windows.filter((window) =>
              window.roomId === room.id ||
              String(window.name || "").toLowerCase().includes(String(room.name || "").toLowerCase())
            )}
          />

          {/*
            Built-in room furniture: keep the original 3D look (bed, sofa,
            kitchen, bathroom, etc.) while still using the exact room
            position/size coming from the 2D editor.

            If the 2D editor already contains furniture inside this room,
            use that furniture instead so it is not duplicated.
          */}
          {(() => {
            const roomFurniture = furniture.filter((piece) =>
              piece.roomId === room.id ||
              String(piece.roomName || "").toLowerCase() === String(room.name || "").toLowerCase()
            );

            return roomFurniture.length === 0 ? <Furniture room={room} /> : null;
          })()}

          {/* selected room indicator */}
          {selected === room.id && (
            <mesh
              position={[
                room.x + room.width / 2,
                0.09,
                room.z + room.depth / 2,
              ]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry
                args={[
                  Math.max(room.width - 0.2, 0.5),
                  Math.max(room.depth - 0.2, 0.5),
                ]}
              />
              <meshBasicMaterial
                color="#a7c4a6"
                transparent
                opacity={0.18}
              />
            </mesh>
          )}
        </group>
      ))}
      {walls.length > 0 && <WallSegments walls={walls} />}
      {furniture.map((piece) => <PlacedFurniture key={piece.id} piece={piece} selected={selected === piece.id} onSelect={onFurnitureSelect} onCommit={onFurnitureCommit} />)}
    </group>
  );
}

/* =========================================================
   CAMERA
========================================================= */

function CameraSetup({ controlsRef, preset = "exterior", target = [5.8, 0, 4.7] }) {
  const { camera } = useThree();

  useEffect(() => {
    const positions = {
      exterior: [12, 12, 14],
      front: [7, 5, 18],
      rear: [7, 5, -18],
      top: [7, 24, 7],
      site: [16, 18, 20],
      interior: [4, 3.2, 5],
      dollhouse: [12.5, 15.5, 13.5],
    };

    camera.position.set(...(positions[preset] || positions.dollhouse));

    if (controlsRef.current) {
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }
  }, [camera, controlsRef, preset, target]);

  return null;
}

/* =========================================================
   MAIN
========================================================= */

// Refresh karne par bhi pata rahe ke ye design kis project ka hai (duplicate project na bane)
const CURRENT_PROJECT_KEY = "dreamhouse_current_project_id";

export default function ThreeDView() {
  const navigate = useNavigate();
  const location = useLocation();

  const controlsRef = useRef();

  // Start empty. A 3D view must never invent fallback rooms.
  const [plan, setPlan] = useState(() => normalizeFloorPlan({
    project: {},
    rooms: [],
    walls: [],
    doors: [],
    windows: [],
    furniture: [],
  }));
  const [selected, setSelected] = useState(null);
  const [showInfo, setShowInfo] = useState(true);
  const [viewMode, setViewMode] = useState("dollhouse");
  const [lightingMode, setLightingMode] = useState("day");
  const [activeFloor, setActiveFloor] = useState("all");
  const [showCeilings, setShowCeilings] = useState(false);
  const [cameraPreset, setCameraPreset] = useState("dollhouse");
  const [renderMode, setRenderMode] = useState("edit");
  // Cloud project ka id: pehli save par bantaa hai, uske baad har save usi ko update karti hai
  const [projectId, setProjectId] = useState(location.state?.projectId || null);
  const [saveFeedback, setSaveFeedback] = useState({ type: "idle", text: "" });
  const glRef = useRef(null);

  const updateRoomStyle = (field, value) => {
    setPlan((current) => ({ ...current, rooms: current.rooms.map((room) => room.id === selected ? { ...room, [field]: value } : room) }));
  };

  const updateFurnitureField = (field, value) => {
    setPlan((current) => ({ ...current, furniture: current.furniture.map((piece) => piece.id === selected ? { ...piece, [field]: field === "rotation" ? Number(value) : value } : piece) }));
  };

  const commitFurniturePosition = (id, position) => {
    setPlan((current) => ({ ...current, furniture: current.furniture.map((piece) => piece.id === id ? { ...piece, x: Math.round(position.x / SCALE - piece.width / 2), y: Math.round(position.z / SCALE - piece.height / 2) } : piece) }));
  };

  // Dashboard card ke liye 3D scene ki chhoti si photo (JPEG, ~480px)
  const captureThumbnail = () => {
    try {
      const source = glRef.current?.domElement;
      if (!source || !source.width) return "";
      const width = 480;
      const out = document.createElement("canvas");
      out.width = width;
      out.height = Math.max(Math.round((source.height / source.width) * width), 1);
      out.getContext("2d").drawImage(source, 0, 0, out.width, out.height);
      return out.toDataURL("image/jpeg", 0.7);
    } catch {
      return "";
    }
  };

  const saveDesign = async () => {
    if (saveFeedback.type === "saving") return;

    // Local backup hamesha (refresh / login ke baad design wapas mil jaye)
    localStorage.setItem("dreamhouse_current_plan", JSON.stringify(plan));

    if (!rooms.length) {
      setSaveFeedback({ type: "error", text: "There is nothing to save yet. Add rooms in the 2D editor first." });
      return;
    }

    if (!localStorage.getItem("dreamhouse_token")) {
      setSaveFeedback({ type: "login", text: "Log in to save this design to your dashboard. Your work is kept on this device." });
      return;
    }

    setSaveFeedback({ type: "saving", text: "Saving to your dashboard…" });

    const floorPlanData = {
      ...plan,
      lighting: { ...plan.lighting, mode: lightingMode },
      // Admin panel ko pata chalta hai ke ye design 3D mein bhi save hua
      settings: { ...plan.settings, created3D: true, last3DSavedAt: new Date().toISOString() },
    };
    const name = plan.project?.name?.trim() || "My Dream House";
    const thumbnail = captureThumbnail();

    try {
      if (projectId) {
        await updateProject(projectId, {
          name,
          floorPlanData,
          ...(thumbnail ? { thumbnail } : {}),
          versionDescription: "Updated from 3D viewer",
        });
      } else {
        const created = await createProject({ name, floorPlanData, thumbnail });
        setProjectId(created._id);
        localStorage.setItem(CURRENT_PROJECT_KEY, created._id);
      }

      setSaveFeedback({ type: "saved", text: "Saved to your dashboard." });
      setTimeout(() => setSaveFeedback((current) => (current.type === "saved" ? { type: "idle", text: "" } : current)), 6000);
    } catch (error) {
      const expired = /session expired|authentication|invalid authentication|no longer exists/i.test(error.message || "");
      setSaveFeedback(
        expired
          ? { type: "login", text: "Your session has expired. Log in again to save." }
          : { type: "error", text: `Could not save: ${error.message || "please try again."}` }
      );
    }
  };

  /* ===============================================
     RECEIVE FLOOR PLAN DATA
  =============================================== */

  useEffect(() => {
    const state = location.state;

    if (state) {
      setProjectId(state.projectId || null);
      if (state.projectId) localStorage.setItem(CURRENT_PROJECT_KEY, state.projectId);
      else localStorage.removeItem(CURRENT_PROJECT_KEY); // naya, abhi tak save na hua design
    } else {
      setProjectId(localStorage.getItem(CURRENT_PROJECT_KEY) || null);
    }

    if (!state) {
      // Direct refresh: use the latest locally saved 2D design if available.
      try {
        const raw = localStorage.getItem("dreamhouse_current_plan");
        if (raw) setPlan(planFromLocationState(JSON.parse(raw)));
      } catch (error) {
        console.error("Could not restore saved floor plan", error);
      }
      return;
    }

    // IMPORTANT: when navigating from the 2D editor, its in-memory state is
    // the source of truth. Do not replace it with an older cloud snapshot.
    const hasEditorPlan =
      Array.isArray(state.rooms) ||
      Array.isArray(state.walls) ||
      Array.isArray(state.doors) ||
      Array.isArray(state.windows) ||
      Array.isArray(state.furniture);

    if (hasEditorPlan) {
      setPlan(planFromLocationState(state));
      if (state.selected?.id) setSelected(state.selected.id);
      return;
    }

    if (state?.projectId && localStorage.getItem("dreamhouse_token")) {
      getProject(state.projectId)
        .then((remote) => setPlan(normalizeFloorPlan(remote.floorPlanData || {})))
        .catch(() => setPlan(planFromLocationState(state)));
      return;
    }

    setPlan(planFromLocationState(state));
  }, [location.state]);

  const rooms = Array.isArray(plan.rooms) ? plan.rooms : [];
  const furniture = Array.isArray(plan.furniture) ? plan.furniture : [];

  // The 2D editor stores each floor as an independent snapshot in floorPlans.
  // Every declared floor is rendered at its own vertical elevation.
  const sceneFloors = useMemo(() => {
    const stored =
      plan.floorPlans &&
      typeof plan.floorPlans === "object" &&
      !Array.isArray(plan.floorPlans)
        ? plan.floorPlans
        : {};

    const storedLevels = Object.keys(stored)
      .map((key) => {
        if (key === "ground") return 0;
        if (key === "first") return 1;
        const match = /^floor-(\d+)$/.exec(key);
        return match ? Number(match[1]) : -1;
      })
      .filter((level) => level >= 0);

    const declared = Math.max(
      1,
      Number(plan.project?.floors || 0),
      Array.isArray(plan.floors) ? plan.floors.length : 0,
      storedLevels.length ? Math.max(...storedLevels) + 1 : 0
    );

    const getFloorKey = (level) =>
      level === 0 ? "ground" : level === 1 ? "first" : `floor-${level}`;

    const getFloorName = (level) =>
      level === 0 ? "Ground Floor" : level === 1 ? "First Floor" : `Floor ${level + 1}`;

    return Array.from({ length: declared }, (_, level) => {
      const key = getFloorKey(level);
      const snapshot = stored[key];

      if (snapshot) {
        return {
          level,
          key,
          name: getFloorName(level),
          rooms: (snapshot.rooms || []).map((item) => ({ ...item, floor: level })),
          walls: (snapshot.walls || []).map((item) => ({ ...item, floor: level })),
          doors: (snapshot.doors || []).map((item) => ({ ...item, floor: level })),
          windows: (snapshot.windows || []).map((item) => ({ ...item, floor: level })),
          furniture: (snapshot.furniture || []).map((item) => ({ ...item, floor: level })),
        };
      }

      // Backward-compatible fallback for older plans that store floor on each object.
      return {
        level,
        key,
        name: getFloorName(level),
        rooms: rooms.filter((item) => Number(item.floor ?? 0) === level),
        walls: (plan.walls || []).filter((item) => Number(item.floor ?? 0) === level),
        doors: (plan.doors || []).filter((item) => Number(item.floor ?? 0) === level),
        windows: (plan.windows || []).filter((item) => Number(item.floor ?? 0) === level),
        furniture: furniture.filter((item) => Number(item.floor ?? 0) === level),
      };
    });
  }, [plan, rooms, furniture]);

  const visibleFloors = sceneFloors.filter(
    (floor) => activeFloor === "all" || floor.level === Number(activeFloor)
  );

  const displayRooms = visibleFloors.flatMap((floor) => floor.rooms);
  const displayWalls = visibleFloors.flatMap((floor) => floor.walls);
  const displayFurniture = visibleFloors.flatMap((floor) => floor.furniture);
  const displayDoors = visibleFloors.flatMap((floor) => floor.doors);
  const displayWindows = visibleFloors.flatMap((floor) => floor.windows);

  const floorCount = sceneFloors.length;

  /* ===============================================
     HOUSE SIZE
  =============================================== */

  const houseSize = useMemo(() => {
    const converted = displayRooms.map(convertRoom);

    if (!converted.length) {
      return { width: 10, depth: 10 };
    }

    const minX = Math.min(...converted.map((r) => r.x));
    const minZ = Math.min(...converted.map((r) => r.z));
    const maxX = Math.max(...converted.map((r) => r.x + r.width));
    const maxZ = Math.max(...converted.map((r) => r.z + r.depth));

    return {
      width: Math.max(maxX, 1),
      depth: Math.max(maxZ, 1),
      minX,
      minZ,
      centerX: (minX + maxX) / 2,
      centerZ: (minZ + maxZ) / 2,
    };
  }, [displayRooms]);

  const cameraTarget = useMemo(
    () => [
      houseSize.centerX || houseSize.width / 2,
      activeFloor === "all"
        ? Math.max(1.35, ((floorCount - 1) * FLOOR_HEIGHT) / 2 + WALL_H / 2)
        : Number(activeFloor || 0) * FLOOR_HEIGHT + WALL_H / 2,
      houseSize.centerZ || houseSize.depth / 2,
    ],
    [houseSize.centerX, houseSize.centerZ, houseSize.width, houseSize.depth, activeFloor, floorCount]
  );

  const selectedRoom = displayRooms.find(
    (room) => room.id === selected
  );
  const selectedFurniture = displayFurniture.find((piece) => piece.id === selected);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#dfe4dc]">
      {/* =========================================
          TOP BAR
      ========================================= */}

      <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-4">
        <div className="rounded-2xl border border-white/60 bg-white/85 px-5 py-3 shadow-lg backdrop-blur-xl">
          <p className="font-serif text-lg font-bold text-[#173d32]">
            DreamHouse
          </p>

          <p className="text-[8px] font-bold tracking-[0.25em] text-[#89918b]">
            3D MULTI-STOREY VISUALIZATION
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex overflow-hidden rounded-full border border-white/70 bg-white/90 shadow-lg backdrop-blur-xl">
            {["exterior", "interior", "dollhouse"].map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setViewMode(mode);
                if (mode === "dollhouse") setCameraPreset("dollhouse");
              }}
              className={`px-3 py-2.5 text-[10px] font-bold capitalize ${viewMode === mode ? "bg-[#174c3d] text-white" : "text-[#315348]"}`}
            >
              {mode === "dollhouse" ? "🏠 Dollhouse" : mode}
            </button>
          ))}
          </div>
          <div className="flex overflow-hidden rounded-full border border-white/70 bg-white/90 shadow-lg backdrop-blur-xl">
            {["edit", "visualization"].map((mode) => <button key={mode} onClick={() => setRenderMode(mode)} className={`px-3 py-2.5 text-[10px] font-bold capitalize ${renderMode === mode ? "bg-[#174c3d] text-white" : "text-[#315348]"}`}>{mode}</button>)}
          </div>
          <select value={lightingMode} onChange={(event) => setLightingMode(event.target.value)} className="rounded-full border border-white/70 bg-white/90 px-3 py-2.5 text-[10px] font-bold text-[#315348] shadow-lg backdrop-blur-xl">
            <option value="day">Daylight</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
          <select value={cameraPreset} onChange={(event) => setCameraPreset(event.target.value)} className="rounded-full border border-white/70 bg-white/90 px-3 py-2.5 text-[10px] font-bold text-[#315348] shadow-lg backdrop-blur-xl"><option value="dollhouse">Dollhouse</option><option value="exterior">Exterior</option><option value="front">Front</option><option value="rear">Rear</option><option value="top">Bird's-eye</option><option value="site">Site</option><option value="interior">Interior</option></select>
          {floorCount > 1 && <select value={activeFloor} onChange={(event) => setActiveFloor(event.target.value === "all" ? "all" : Number(event.target.value))} className="rounded-full border border-white/70 bg-white/90 px-3 py-2.5 text-[10px] font-bold text-[#315348] shadow-lg backdrop-blur-xl"><option value="all">🏠 All Floors</option>{sceneFloors.map((floor) => <option key={floor.level} value={floor.level}>{floor.name}</option>)}</select>}
          <button onClick={() => setShowCeilings((value) => !value)} className="rounded-full border border-white/70 bg-white/90 px-3 py-2.5 text-[10px] font-bold text-[#315348] shadow-lg backdrop-blur-xl">{showCeilings ? "Hide ceiling" : "Show ceiling"}</button>
          <button onClick={saveDesign} disabled={saveFeedback.type === "saving"} className="rounded-full border border-white/70 bg-white/90 px-4 py-2.5 text-[10px] font-bold text-[#315348] shadow-lg backdrop-blur-xl disabled:opacity-60">{saveFeedback.type === "saving" ? "Saving…" : saveFeedback.type === "saved" ? "Saved ✓" : "Save"}</button>
          <button
            onClick={() => navigate("/floor-plan-editor", { state: projectId ? { projectId } : undefined })}
            className="rounded-full border border-white/70 bg-white/90 px-4 py-2.5 text-[10px] font-bold text-[#315348] shadow-lg backdrop-blur-xl"
          >
            ← 2D Editor
          </button>

          <button
            onClick={() => setShowInfo((v) => !v)}
            className="rounded-full bg-[#174c3d] px-4 py-2.5 text-[10px] font-bold text-white shadow-lg"
          >
            {showInfo ? "Hide Info" : "Show Info"}
          </button>
        </div>
      </div>

      {/* =========================================
          3D
      ========================================= */}

      {saveFeedback.type !== "idle" && (
        <div role="status" className="absolute left-1/2 top-24 z-50 flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 text-[11px] font-medium text-[#315348] shadow-xl backdrop-blur-xl">
          <span>{saveFeedback.text}</span>
          {saveFeedback.type === "saved" && <button onClick={() => navigate("/dashboard")} className="rounded-full bg-[#174c3d] px-3 py-1.5 text-[10px] font-bold text-white">View in dashboard</button>}
          {saveFeedback.type === "login" && <button onClick={() => navigate("/login")} className="rounded-full bg-[#174c3d] px-3 py-1.5 text-[10px] font-bold text-white">Log in</button>}
          {saveFeedback.type !== "saving" && <button onClick={() => setSaveFeedback({ type: "idle", text: "" })} aria-label="Dismiss" className="text-base leading-none text-[#69746d]">×</button>}
        </div>
      )}

      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}
        onCreated={({ gl }) => { glRef.current = gl; }}
        dpr={renderMode === "visualization" ? [1.5, 2] : [1, 1.5]}
        camera={{
          position: [12, 12, 14],
          fov: 40,
          near: 0.1,
          far: 100,
        }}
      >
        <color attach="background" args={[lightingMode === "night" ? "#101b22" : lightingMode === "evening" ? "#c2b6a5" : "#dfe5dd"]} />

        {/* sky / sunlight */}
        <ambientLight intensity={lightingMode === "night" ? 0.28 : Number(plan.lighting?.intensity || 1.7)} color={lightingMode === "night" ? "#6e84a4" : "#fffaf0"} />

        <hemisphereLight
          skyColor="#fffaf0"
          groundColor="#8f968b"
          intensity={lightingMode === "night" ? 0.2 : 1.5}
        />

        <directionalLight
          position={[8, 16, 10]}
          intensity={lightingMode === "night" ? 0.35 : lightingMode === "evening" ? 1.4 : 3.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        <Environment preset={renderMode === "visualization" ? (lightingMode === "night" ? "night" : "sunset") : "park"} />

        {/* garden */}
        <Garden
          houseWidth={houseSize.width}
          houseDepth={houseSize.depth}
        />
        <BoundarySite houseWidth={houseSize.width} houseDepth={houseSize.depth} site={plan.site} />

        {/* actual multi-storey house: one stacked level for every selected floor */}
        {visibleFloors.map((floor) => (
          <group key={`3d-floor-${floor.level}`}>
            <FloorSlab
              rooms={floor.rooms}
              floorElevation={floor.level * FLOOR_HEIGHT}
              visible
            />
            <House
              rooms={floor.rooms}
              walls={floor.walls}
              furniture={floor.furniture}
              doors={floor.doors}
              windows={floor.windows}
              floorElevation={floor.level * FLOOR_HEIGHT}
              showCeilings={showCeilings}
              selected={selected}
              onSelect={(room) => setSelected(room.id)}
              onFurnitureSelect={(id) => setSelected(id)}
              onFurnitureCommit={commitFurniturePosition}
            />
            <Openings3D
              doors={floor.doors}
              windows={floor.windows}
              floorElevation={floor.level * FLOOR_HEIGHT}
            />
          </group>
        ))}
        <Roof
          houseWidth={houseSize.width}
          houseDepth={houseSize.depth}
          roof={plan.roof}
          floorCount={floorCount}
          visible={viewMode === "exterior"}
        />

        {/* realistic ground shadows */}
        <ContactShadows
          position={[houseSize.width / 2, 0, houseSize.depth / 2]}
          scale={25}
          opacity={0.35}
          blur={2.5}
          far={12}
        />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.07}
          minDistance={5}
          maxDistance={30}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 2.08}
        />

        <CameraSetup controlsRef={controlsRef} preset={cameraPreset} target={cameraTarget} />
      </Canvas>

      {/* =========================================
          LEFT BOTTOM INFO
      ========================================= */}

      {showInfo && (
        <div className="absolute bottom-5 left-5 z-40 w-[245px] rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur-xl">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a928c]">
            Architectural Preview
          </p>

          <h2 className="mt-1 font-serif text-xl font-bold text-[#173d32]">
            Your Dream House
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[#edf1eb] p-3">
              <p className="text-[8px] uppercase text-[#8b938c]">
                Rooms
              </p>

              <p className="mt-1 text-sm font-bold text-[#315348]">
                {displayRooms.length}
              </p>
            </div>

            <div className="rounded-2xl bg-[#edf1eb] p-3">
              <p className="text-[8px] uppercase text-[#8b938c]">
                Style
              </p>

              <p className="mt-1 text-sm font-bold text-[#315348]">
                Modern
              </p>
            </div>
          </div>

          <p className="mt-4 text-[10px] leading-5 text-[#68736c]">
            {activeFloor === "all"
              ? `${floorCount} floor${floorCount === 1 ? "" : "s"} stacked together. Use the floor selector to inspect any level.`
              : `Inspect ${sceneFloors.find((floor) => floor.level === Number(activeFloor))?.name || "selected floor"} in 3D.`}
          </p>
        </div>
      )}

      {/* =========================================
          SELECTED ROOM
      ========================================= */}

      {selectedRoom && showInfo && (
        <div className="absolute right-5 top-24 z-40 w-[230px] rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur-xl">
          <button
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 text-lg text-[#69746d]"
          >
            ×
          </button>

          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#89918b]">
            Selected
          </p>

          <h3 className="mt-1 font-serif text-xl font-bold text-[#173d32]">
            {selectedRoom.name}
          </h3>

          <div className="mt-4 space-y-2 text-[10px] text-[#69736c]">
            <div className="flex justify-between">
              <span>Width</span>
              <b className="text-[#315348]">
                {selectedRoom.width} ft
              </b>
            </div>
            <label className="mt-4 block text-[10px] text-[#69736c]">Floor material
              <select value={selectedRoom.floorMaterial || plan.materials.floor || "light-wood"} onChange={(event) => updateRoomStyle("floorMaterial", event.target.value)} className="mt-1 w-full rounded-xl border border-[#d7dfd8] bg-white px-2 py-2 text-[10px] text-[#315348]">
                <option value="light-wood">Light wood</option><option value="dark-wood">Dark wood</option><option value="marble">Marble</option><option value="concrete">Concrete</option>
              </select>
            </label>
            <label className="mt-3 block text-[10px] text-[#69736c]">Wall material
              <select value={selectedRoom.wallMaterial || plan.materials.wall || "white-paint"} onChange={(event) => updateRoomStyle("wallMaterial", event.target.value)} className="mt-1 w-full rounded-xl border border-[#d7dfd8] bg-white px-2 py-2 text-[10px] text-[#315348]">
                <option value="white-paint">White paint</option><option value="cream-paint">Cream paint</option><option value="grey-paint">Grey paint</option><option value="stone">Stone</option>
              </select>
            </label>

            <div className="flex justify-between">
              <span>Length</span>
              <b className="text-[#315348]">
                {selectedRoom.height} ft
              </b>
            </div>

            <div className="flex justify-between">
              <span>Type</span>
              <b className="capitalize text-[#315348]">
                {selectedRoom.type}
              </b>
            </div>
          </div>
        </div>
      )}

      {selectedFurniture && showInfo && (
        <div className="absolute right-5 top-24 z-40 w-[230px] rounded-3xl border border-white/60 bg-white/90 p-5 shadow-xl backdrop-blur-xl">
          <button onClick={() => setSelected(null)} className="absolute right-4 top-4 text-lg text-[#69746d]">×</button>
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#89918b]">Selected furniture</p>
          <h3 className="mt-1 font-serif text-xl font-bold text-[#173d32]">{selectedFurniture.name}</h3>
          <label className="mt-4 block text-[10px] text-[#69736c]">Material
            <select value={selectedFurniture.material || "light-wood"} onChange={(event) => updateFurnitureField("material", event.target.value)} className="mt-1 w-full rounded-xl border border-[#d7dfd8] bg-white px-2 py-2 text-[10px] text-[#315348]"><option value="light-wood">Light wood</option><option value="dark-wood">Dark wood</option><option value="marble">Marble</option><option value="white-paint">White</option></select>
          </label>
          <label className="mt-3 block text-[10px] text-[#69736c]">Color<input type="color" value={selectedFurniture.color || "#a48b69"} onChange={(event) => updateFurnitureField("color", event.target.value)} className="mt-1 h-8 w-full rounded-xl border border-[#d7dfd8] bg-white p-1" /></label>
          <label className="mt-3 block text-[10px] text-[#69736c]">Rotation<input type="number" value={selectedFurniture.rotation || 0} onChange={(event) => updateFurnitureField("rotation", event.target.value)} className="mt-1 w-full rounded-xl border border-[#d7dfd8] bg-white px-2 py-2 text-[10px] text-[#315348]" /></label>
        </div>
      )}
    </div>
  );
}

function WallSegments({ walls = [] }) {
  return (
    <group>
      {walls.map((wall) => {
        if (!wall.start || !wall.end) {
          return <Box key={wall.id} position={[(Number(wall.x || 0) + Number(wall.width || 0) / 2) * SCALE, Number(wall.wallHeight || WALL_H) / 2, (Number(wall.y || 0) + Number(wall.height || 0) / 2) * SCALE]} size={[Math.max(Number(wall.width || 1) * SCALE, WALL_T), Number(wall.wallHeight || WALL_H), Math.max(Number(wall.height || 1) * SCALE, WALL_T)]} color={wall.color || WALL_COLOR} materialName={wall.material} />;
        }
        const x1 = Number(wall.start.x || 0) * SCALE;
        const z1 = Number(wall.start.y || 0) * SCALE;
        const x2 = Number(wall.end.x || 0) * SCALE;
        const z2 = Number(wall.end.y || 0) * SCALE;
        const length = Math.max(Math.hypot(x2 - x1, z2 - z1), WALL_T);
        const angle = Math.atan2(z2 - z1, x2 - x1);
        return <Box key={wall.id} position={[(x1 + x2) / 2, Number(wall.height || WALL_H) / 2, (z1 + z2) / 2]} size={[length, Number(wall.height || WALL_H), Number(wall.thickness || WALL_T)]} color={wall.color || WALL_COLOR} materialName={wall.material} rotation={[0, -angle, 0]} />;
      })}
    </group>
  );
}

function Stairs3D({ room }) {
  const steps = Math.max(5, Math.min(16, Number(room.stepCount || 10)));
  const width = Math.max(0.8, room.width * SCALE * 0.72);
  const depth = Math.max(1.5, room.height * SCALE * 0.72);
  return (
    <group position={[room.x + room.width / 2, 0, room.z + room.depth / 2]}>
      {Array.from({ length: steps }).map((_, index) => <Box key={index} position={[0, 0.08 + index * 0.12, -depth / 2 + (index + 0.5) * (depth / steps)]} size={[width, 0.16 + index * 0.02, depth / steps + 0.02]} color={room.floorColor || "#a88762"} materialName={room.floorMaterial || "dark-wood"} />)}
    </group>
  );
}

