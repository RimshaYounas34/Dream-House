import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  TransformControls,
} from "@react-three/drei";
import { useLocation, useNavigate } from "react-router-dom";
import { getProject, updateProject } from "../services/projectApi";
import { normalizeFloorPlan, planFromLocationState } from "../utils/planNormalizer";
import { materialFor, textureFor } from "../utils/materials";

/* =========================================================
   HOUSE SETTINGS
========================================================= */

const SCALE = 0.018;
const WALL_H = 2.7;
const WALL_T = 0.16;

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

function Roof({ houseWidth, houseDepth, roof = {}, visible = true }) {
  if (!visible) return null;
  const roofColor = roof.color || materialFor(roof.material || "concrete").color;
  const roofHeight = Number(roof.height || 0.45);
  if (roof.type === "sloped" || roof.type === "tiled") {
    return <Box position={[houseWidth / 2, WALL_H + roofHeight, houseDepth / 2]} size={[houseWidth + 0.35, 0.22, houseDepth + 0.35]} color={roofColor} materialName={roof.material} rotation={[0, 0, roof.type === "sloped" ? 0.04 : 0]} />;
  }
  return (
    <group>
      <Box position={[houseWidth / 2, WALL_H + roofHeight / 2, 0]} size={[houseWidth + 0.3, roofHeight, 0.16]} color={roofColor} materialName={roof.material} />
      <Box position={[houseWidth / 2, WALL_H + roofHeight / 2, houseDepth]} size={[houseWidth + 0.3, roofHeight, 0.16]} color={roofColor} materialName={roof.material} />
      <Box position={[0, WALL_H + roofHeight / 2, houseDepth / 2]} size={[0.16, roofHeight, houseDepth]} color={roofColor} materialName={roof.material} />
      <Box position={[houseWidth, WALL_H + roofHeight / 2, houseDepth / 2]} size={[0.16, roofHeight, houseDepth]} color={roofColor} materialName={roof.material} />
    </group>
  );
}

function Openings3D({ doors = [], windows = [] }) {
  return (
    <group>
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
  selected,
  onSelect,
  onFurnitureSelect,
  onFurnitureCommit,
}) {
  const converted = rooms.map(convertRoom);

  return (
    <group>
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
  const [activeFloor, setActiveFloor] = useState(0);
  const [showCeilings, setShowCeilings] = useState(false);
  const [cameraPreset, setCameraPreset] = useState("dollhouse");
  const [renderMode, setRenderMode] = useState("edit");

  const updateRoomStyle = (field, value) => {
    setPlan((current) => ({ ...current, rooms: current.rooms.map((room) => room.id === selected ? { ...room, [field]: value } : room) }));
  };

  const updateFurnitureField = (field, value) => {
    setPlan((current) => ({ ...current, furniture: current.furniture.map((piece) => piece.id === selected ? { ...piece, [field]: field === "rotation" ? Number(value) : value } : piece) }));
  };

  const commitFurniturePosition = (id, position) => {
    setPlan((current) => ({ ...current, furniture: current.furniture.map((piece) => piece.id === id ? { ...piece, x: Math.round(position.x / SCALE - piece.width / 2), y: Math.round(position.z / SCALE - piece.height / 2) } : piece) }));
  };

  const saveDesign = async () => {
    const projectId = location.state?.projectId;
    if (projectId && localStorage.getItem("dreamhouse_token")) {
      await updateProject(projectId, { floorPlanData: plan, versionDescription: "Updated from 3D viewer" });
    }
    localStorage.setItem("dreamhouse_current_plan", JSON.stringify(plan));
  };

  /* ===============================================
     RECEIVE FLOOR PLAN DATA
  =============================================== */

  useEffect(() => {
    const state = location.state;

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

  // Every camera/view mode uses the SAME 2D objects. View modes only change
  // the camera/presentation; they never rearrange, remove or invent objects.
  const displayRooms = rooms.filter((room) => Number(room.floor ?? 0) === activeFloor);
  const displayWalls = (Array.isArray(plan.walls) ? plan.walls : []).filter(
    (wall) => Number(wall.floor ?? 0) === activeFloor
  );
  const displayFurniture = furniture.filter(
    (piece) => Number(piece.floor ?? 0) === activeFloor
  );
  const displayDoors = (Array.isArray(plan.doors) ? plan.doors : []).filter(
    (door) => Number(door.floor ?? 0) === activeFloor
  );
  const displayWindows = (Array.isArray(plan.windows) ? plan.windows : []).filter(
    (window) => Number(window.floor ?? 0) === activeFloor
  );

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
      0,
      houseSize.centerZ || houseSize.depth / 2,
    ],
    [houseSize.centerX, houseSize.centerZ, houseSize.width, houseSize.depth]
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
            3D HOME VISUALIZATION
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
          {plan.floors.length > 1 && <select value={activeFloor} onChange={(event) => setActiveFloor(Number(event.target.value))} className="rounded-full border border-white/70 bg-white/90 px-3 py-2.5 text-[10px] font-bold text-[#315348] shadow-lg backdrop-blur-xl">{plan.floors.map((floor) => <option key={floor.id} value={floor.level}>Floor {floor.level + 1}</option>)}</select>}
          <button onClick={() => setShowCeilings((value) => !value)} className="rounded-full border border-white/70 bg-white/90 px-3 py-2.5 text-[10px] font-bold text-[#315348] shadow-lg backdrop-blur-xl">{showCeilings ? "Hide ceiling" : "Show ceiling"}</button>
          <button onClick={saveDesign} className="rounded-full border border-white/70 bg-white/90 px-4 py-2.5 text-[10px] font-bold text-[#315348] shadow-lg backdrop-blur-xl">Save</button>
          <button
            onClick={() => navigate("/floor-plan-editor", { state: location.state?.projectId ? { projectId: location.state.projectId } : undefined })}
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

      <Canvas
        shadows
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

        {/* actual house */}
        <House
          rooms={displayRooms}
          walls={displayWalls}
          furniture={displayFurniture}
          doors={displayDoors}
          windows={displayWindows}
          showCeilings={showCeilings}
          selected={selected}
          onSelect={(room) => setSelected(room.id)}
          onFurnitureSelect={(id) => setSelected(id)}
          onFurnitureCommit={commitFurniturePosition}
        />
        <Openings3D doors={displayDoors} windows={displayWindows} />
        <Roof houseWidth={houseSize.width} houseDepth={houseSize.depth} roof={plan.roof} visible={viewMode === "exterior"} />

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
                {rooms.length}
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
            {viewMode === "exterior" ? "Inspect the facade, roof, garden, boundary wall and parking." : "Inspect one arranged house layout with the roof hidden."}
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








































// import { useMemo, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Canvas,
//   useThree,
// } from "@react-three/fiber";
// import {
//   OrbitControls,
//   PerspectiveCamera,
//   Environment,
//   ContactShadows,
//   Text,
// } from "@react-three/drei";
// import * as THREE from "three";

// /* =========================================================
//    HELPERS
// ========================================================= */

// const SCALE = 0.045;
// const WALL_HEIGHT = 3.0;
// const WALL_THICKNESS = 0.12;

// function n(value, fallback = 0) {
//   const number = Number(value);
//   return Number.isFinite(number) ? number : fallback;
// }

// function normalizePlan(input = {}) {
//   const source = input.floorPlanData || input;

//   return {
//     project: {
//       name: source.project?.name || source.name || "Dream House",
//       plotWidth: n(source.project?.plotWidth, 30),
//       plotLength: n(source.project?.plotLength, 60),
//       floors: n(source.project?.floors, 1),
//       units: source.project?.units || "feet",
//     },

//     rooms: Array.isArray(source.rooms) ? source.rooms : [],
//     doors: Array.isArray(source.doors) ? source.doors : [],
//     windows: Array.isArray(source.windows) ? source.windows : [],
//     walls: Array.isArray(source.walls) ? source.walls : [],
//     furniture: Array.isArray(source.furniture) ? source.furniture : [],

//     floors: Array.isArray(source.floors) ? source.floors : [],
//     site: source.site || {},
//     exterior: source.exterior || {},
//     interior: source.interior || {},
//     materials: source.materials || {},
//     lighting: source.lighting || {},
//     roof: source.roof || {},
//     settings: source.settings || {},
//   };
// }

// function roomColor(room) {
//   const type = String(room.type || "").toLowerCase();

//   if (type.includes("bath")) return "#dfe8e5";
//   if (type.includes("bed")) return "#e9dfd1";
//   if (type.includes("kitchen")) return "#ddd9cf";
//   if (type.includes("living")) return "#e6e1d5";
//   if (type.includes("dining")) return "#e8dfcf";
//   if (type.includes("garage")) return "#c9cbc8";
//   if (type.includes("stairs")) return "#d5d0c6";
//   if (type.includes("office") || type.includes("study")) return "#ded9ce";

//   return "#e5e0d5";
// }

// function floorColor(plan) {
//   return (
//     plan.materials?.floor ||
//     plan.materials?.floorColor ||
//     "#cdbfa9"
//   );
// }

// function wallColor(plan) {
//   return (
//     plan.materials?.wall ||
//     plan.materials?.wallColor ||
//     plan.exterior?.facadeColor ||
//     "#eeeae0"
//   );
// }

// /* =========================================================
//    MAIN 3D SCENE
// ========================================================= */

// function Scene({ plan, selectedRoom, setSelectedRoom }) {
//   const plotWidth = plan.project.plotWidth;
//   const plotLength = plan.project.plotLength;

//   const centerX = plotWidth / 2;
//   const centerY = plotLength / 2;

//   const sceneScale = SCALE;

//   return (
//     <>
//       <color attach="background" args={["#73787b"]} />

//       <PerspectiveCamera
//         makeDefault
//         position={[
//           plotWidth * sceneScale * 1.35,
//           plotLength * sceneScale * 1.25,
//           plotLength * sceneScale * 1.45,
//         ]}
//         fov={42}
//         near={0.1}
//         far={1000}
//       />

//       <ambientLight intensity={1.15} />

//       <directionalLight
//         position={[5, 12, 8]}
//         intensity={3}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />

//       <directionalLight
//         position={[-8, 8, -4]}
//         intensity={1.2}
//       />

//       <Environment preset="city" />

//       <OrbitControls
//         makeDefault
//         enableDamping
//         dampingFactor={0.08}
//         minDistance={4}
//         maxDistance={30}
//         maxPolarAngle={Math.PI / 2.05}
//       />

//       {/* Ground */}
//       <Ground
//         width={plotWidth}
//         length={plotLength}
//         scale={sceneScale}
//       />

//       {/* Site / garden / parking */}
//       <SiteElements
//         plan={plan}
//         scale={sceneScale}
//       />

//       {/* Building floors */}
//       {Array.from(
//         { length: Math.max(1, plan.project.floors) },
//         (_, floorIndex) => (
//           <FloorLevel
//             key={`floor-${floorIndex}`}
//             plan={plan}
//             floorIndex={floorIndex}
//             scale={sceneScale}
//             selectedRoom={selectedRoom}
//             setSelectedRoom={setSelectedRoom}
//           />
//         )
//       )}

//       {/* Explicit walls from backend */}
//       {plan.walls.map((wall) => (
//         <Wall
//           key={wall.id || `wall-${wall.x}-${wall.y}`}
//           item={wall}
//           scale={sceneScale}
//           color={wallColor(plan)}
//         />
//       ))}

//       {/* Doors */}
//       {plan.doors.map((door) => (
//         <Door
//           key={door.id || `door-${door.x}-${door.y}`}
//           item={door}
//           scale={sceneScale}
//         />
//       ))}

//       {/* Windows */}
//       {plan.windows.map((window) => (
//         <Window3D
//           key={window.id || `window-${window.x}-${window.y}`}
//           item={window}
//           scale={sceneScale}
//         />
//       ))}

//       {/* Furniture */}
//       {plan.furniture.map((item) => (
//         <Furniture
//           key={item.id || `${item.type}-${item.x}-${item.y}`}
//           item={item}
//           scale={sceneScale}
//         />
//       ))}

//       {/* Room labels */}
//       {plan.rooms.map((room) => (
//         <RoomLabel
//           key={`label-${room.id}`}
//           room={room}
//           scale={sceneScale}
//         />
//       ))}

//       <ContactShadows
//         position={[0, 0.01, 0]}
//         opacity={0.35}
//         scale={25}
//         blur={2.5}
//         far={15}
//       />
//     </>
//   );
// }

// /* =========================================================
//    GROUND
// ========================================================= */

// function Ground({ width, length, scale }) {
//   return (
//     <group
//       position={[
//         width * scale / 2,
//         -0.08,
//         length * scale / 2,
//       ]}
//     >
//       <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
//         <planeGeometry
//           args={[
//             width * scale * 2.4,
//             length * scale * 2.4,
//           ]}
//         />
//         <meshStandardMaterial color="#858a87" roughness={0.95} />
//       </mesh>

//       <gridHelper
//         args={[
//           Math.max(width, length) * scale * 2,
//           30,
//           "#707572",
//           "#808582",
//         ]}
//         position={[0, 0.01, 0]}
//       />
//     </group>
//   );
// }

// /* =========================================================
//    FLOOR LEVEL
// ========================================================= */

// function FloorLevel({
//   plan,
//   floorIndex,
//   scale,
//   selectedRoom,
//   setSelectedRoom,
// }) {
//   const floorRooms = plan.rooms.filter((room) => {
//     const floor = n(room.floor, 0);
//     return floor === floorIndex;
//   });

//   const elevation = floorIndex * 3.25;

//   return (
//     <group position={[0, elevation, 0]}>
//       {floorRooms.map((room) => (
//         <Room
//           key={room.id}
//           room={room}
//           scale={scale}
//           selected={selectedRoom === room.id}
//           onSelect={() => setSelectedRoom(room.id)}
//           color={roomColor(room)}
//         />
//       ))}
//     </group>
//   );
// }

// /* =========================================================
//    ROOM
// ========================================================= */

// function Room({
//   room,
//   scale,
//   selected,
//   onSelect,
//   color,
// }) {
//   const x = n(room.x) * scale;
//   const y = n(room.y) * scale;
//   const width = Math.max(0.4, n(room.width, 120) * scale);
//   const depth = Math.max(0.4, n(room.height, 90) * scale);

//   const floorY = 0.02;
//   const wallHeight = WALL_HEIGHT;
//   const wallThickness = WALL_THICKNESS;

//   const rotation = THREE.MathUtils.degToRad(
//     n(room.rotation)
//   );

//   return (
//     <group
//       position={[
//         x + width / 2,
//         0,
//         y + depth / 2,
//       ]}
//       rotation={[0, rotation, 0]}
//       onClick={(event) => {
//         event.stopPropagation();
//         onSelect();
//       }}
//     >
//       {/* Floor */}
//       <mesh
//         position={[0, floorY, 0]}
//         receiveShadow
//       >
//         <boxGeometry args={[width, 0.06, depth]} />
//         <meshStandardMaterial
//           color={color}
//           roughness={0.75}
//         />
//       </mesh>

//       {/* subtle selected outline */}
//       {selected && (
//         <mesh position={[0, 0.04, 0]}>
//           <boxGeometry
//             args={[
//               width + 0.05,
//               0.015,
//               depth + 0.05,
//             ]}
//           />
//           <meshBasicMaterial
//             color="#68b89b"
//             transparent
//             opacity={0.55}
//           />
//         </mesh>
//       )}

//       {/* Four perimeter walls */}
//       <RoomWall
//         width={width}
//         height={wallHeight}
//         position={[0, wallHeight / 2, -depth / 2]}
//         rotation={[0, 0, 0]}
//       />

//       <RoomWall
//         width={width}
//         height={wallHeight}
//         position={[0, wallHeight / 2, depth / 2]}
//         rotation={[0, 0, 0]}
//       />

//       <RoomWall
//         width={depth}
//         height={wallHeight}
//         position={[-width / 2, wallHeight / 2, 0]}
//         rotation={[0, Math.PI / 2, 0]}
//       />

//       <RoomWall
//         width={depth}
//         height={wallHeight}
//         position={[width / 2, wallHeight / 2, 0]}
//         rotation={[0, Math.PI / 2, 0]}
//       />
//     </group>
//   );
// }

// function RoomWall({
//   width,
//   height,
//   position,
//   rotation,
// }) {
//   return (
//     <mesh
//       position={position}
//       rotation={rotation}
//       castShadow
//       receiveShadow
//     >
//       <boxGeometry
//         args={[
//           width,
//           height,
//           WALL_THICKNESS,
//         ]}
//       />

//       <meshStandardMaterial
//         color="#eeeae0"
//         roughness={0.82}
//       />
//     </mesh>
//   );
// }

// /* =========================================================
//    EXPLICIT WALL
// ========================================================= */

// function Wall({ item, scale, color }) {
//   const width = Math.max(
//     0.05,
//     n(item.width, 10) * scale
//   );

//   const depth = Math.max(
//     0.05,
//     n(item.height, 10) * scale
//   );

//   return (
//     <mesh
//       position={[
//         (n(item.x) + n(item.width) / 2) * scale,
//         WALL_HEIGHT / 2,
//         (n(item.y) + n(item.height) / 2) * scale,
//       ]}
//       rotation={[
//         0,
//         THREE.MathUtils.degToRad(n(item.rotation)),
//         0,
//       ]}
//       castShadow
//     >
//       <boxGeometry
//         args={[
//           width,
//           WALL_HEIGHT,
//           depth,
//         ]}
//       />
//       <meshStandardMaterial
//         color={color}
//         roughness={0.85}
//       />
//     </mesh>
//   );
// }

// /* =========================================================
//    DOOR
// ========================================================= */

// function Door({ item, scale }) {
//   const width = Math.max(
//     0.25,
//     n(item.width, 42) * scale
//   );

//   const height = Math.max(
//     1.7,
//     n(item.height, 10) * scale * 2.5
//   );

//   const x = n(item.x) * scale;
//   const z = n(item.y) * scale;

//   return (
//     <group
//       position={[
//         x + width / 2,
//         height / 2,
//         z,
//       ]}
//       rotation={[
//         0,
//         THREE.MathUtils.degToRad(n(item.rotation)),
//         0,
//       ]}
//     >
//       {/* frame */}
//       <mesh castShadow>
//         <boxGeometry
//           args={[width + 0.08, height + 0.08, 0.08]}
//         />
//         <meshStandardMaterial color="#673f2b" />
//       </mesh>

//       {/* glass / open-looking panel */}
//       <mesh position={[0, 0, 0.045]}>
//         <boxGeometry
//           args={[width, height, 0.025]}
//         />
//         <meshStandardMaterial
//           color="#a9d0cc"
//           transparent
//           opacity={0.28}
//           roughness={0.1}
//         />
//       </mesh>

//       {/* handle */}
//       <mesh
//         position={[
//           width * 0.32,
//           0,
//           0.09,
//         ]}
//       >
//         <sphereGeometry args={[0.035, 12, 12]} />
//         <meshStandardMaterial color="#b78a54" />
//       </mesh>
//     </group>
//   );
// }

// /* =========================================================
//    WINDOW
// ========================================================= */

// function Window3D({ item, scale }) {
//   const width = Math.max(
//     0.3,
//     n(item.width, 55) * scale
//   );

//   const height = Math.max(
//     0.55,
//     n(item.height, 8) * scale * 2
//   );

//   const x = n(item.x) * scale;
//   const z = n(item.y) * scale;

//   return (
//     <group
//       position={[
//         x + width / 2,
//         1.55,
//         z,
//       ]}
//       rotation={[
//         0,
//         THREE.MathUtils.degToRad(n(item.rotation)),
//         0,
//       ]}
//     >
//       {/* glass */}
//       <mesh>
//         <boxGeometry
//           args={[width, height, 0.035]}
//         />
//         <meshStandardMaterial
//           color="#8dbdc3"
//           transparent
//           opacity={0.45}
//           roughness={0.15}
//         />
//       </mesh>

//       {/* wooden frame */}
//       <mesh position={[0, height / 2, 0.025]}>
//         <boxGeometry
//           args={[width + 0.07, 0.07, 0.08]}
//         />
//         <meshStandardMaterial color="#72442e" />
//       </mesh>

//       <mesh position={[0, -height / 2, 0.025]}>
//         <boxGeometry
//           args={[width + 0.07, 0.07, 0.08]}
//         />
//         <meshStandardMaterial color="#72442e" />
//       </mesh>

//       <mesh position={[-width / 2, 0, 0.025]}>
//         <boxGeometry
//           args={[0.07, height, 0.08]}
//         />
//         <meshStandardMaterial color="#72442e" />
//       </mesh>

//       <mesh position={[width / 2, 0, 0.025]}>
//         <boxGeometry
//           args={[0.07, height, 0.08]}
//         />
//         <meshStandardMaterial color="#72442e" />
//       </mesh>

//       {/* center divider */}
//       <mesh position={[0, 0, 0.03]}>
//         <boxGeometry
//           args={[0.035, height, 0.08]}
//         />
//         <meshStandardMaterial color="#72442e" />
//       </mesh>
//     </group>
//   );
// }

// /* =========================================================
//    FURNITURE DISPATCHER
// ========================================================= */

// function Furniture({ item, scale }) {
//   const type = String(
//     item.type || item.name || ""
//   ).toLowerCase();

//   const x =
//     (n(item.x) + n(item.width) / 2) * scale;

//   const z =
//     (n(item.y) + n(item.height) / 2) * scale;

//   const width = Math.max(
//     0.2,
//     n(item.width, 60) * scale
//   );

//   const depth = Math.max(
//     0.2,
//     n(item.height, 30) * scale
//   );

//   const rotation = THREE.MathUtils.degToRad(
//     n(item.rotation)
//   );

//   let model = null;

//   if (
//     type.includes("bed") ||
//     type.includes("master")
//   ) {
//     model = (
//       <Bed
//         width={width}
//         depth={depth}
//       />
//     );
//   } else if (
//     type.includes("sofa") ||
//     type.includes("couch")
//   ) {
//     model = (
//       <Sofa
//         width={width}
//         depth={depth}
//       />
//     );
//   } else if (
//     type.includes("table") ||
//     type.includes("dining")
//   ) {
//     model = (
//       <DiningTable
//         width={width}
//         depth={depth}
//       />
//     );
//   } else if (
//     type.includes("kitchen") ||
//     type.includes("counter") ||
//     type.includes("cabinet")
//   ) {
//     model = (
//       <Kitchen
//         width={width}
//         depth={depth}
//       />
//     );
//   } else if (
//     type.includes("toilet") ||
//     type.includes("wc")
//   ) {
//     model = <Toilet />;
//   } else if (
//     type.includes("sink") ||
//     type.includes("wash")
//   ) {
//     model = <Sink />;
//   } else if (
//     type.includes("bath")
//   ) {
//     model = (
//       <Bathtub
//         width={width}
//         depth={depth}
//       />
//     );
//   } else if (
//     type.includes("plant") ||
//     type.includes("tree")
//   ) {
//     model = <Plant />;
//   } else if (
//     type.includes("tv")
//   ) {
//     model = <TV />;
//   } else if (
//     type.includes("chair")
//   ) {
//     model = <Chair />;
//   } else {
//     model = (
//       <GenericFurniture
//         width={width}
//         depth={depth}
//       />
//     );
//   }

//   return (
//     <group
//       position={[x, 0.08, z]}
//       rotation={[0, rotation, 0]}
//     >
//       {model}
//     </group>
//   );
// }

// /* =========================================================
//    BED
// ========================================================= */

// function Bed({ width, depth }) {
//   const mattressHeight = 0.28;
//   const frameHeight = 0.16;

//   return (
//     <group>
//       {/* frame */}
//       <mesh
//         position={[0, frameHeight / 2, 0]}
//         castShadow
//       >
//         <boxGeometry
//           args={[
//             width,
//             frameHeight,
//             depth,
//           ]}
//         />
//         <meshStandardMaterial color="#5c4639" />
//       </mesh>

//       {/* mattress */}
//       <mesh
//         position={[
//           0,
//           frameHeight + mattressHeight / 2,
//           0,
//         ]}
//         castShadow
//       >
//         <boxGeometry
//           args={[
//             width * 0.92,
//             mattressHeight,
//             depth * 0.9,
//           ]}
//         />
//         <meshStandardMaterial
//           color="#e6d3b9"
//           roughness={0.9}
//         />
//       </mesh>

//       {/* headboard */}
//       <mesh
//         position={[
//           0,
//           0.9,
//           -depth * 0.43,
//         ]}
//         castShadow
//       >
//         <boxGeometry
//           args={[
//             width * 0.95,
//             1.25,
//             0.10,
//           ]}
//         />
//         <meshStandardMaterial color="#6b4b3a" />
//       </mesh>

//       {/* pillows */}
//       <mesh
//         position={[
//           -width * 0.22,
//           0.52,
//           -depth * 0.28,
//         ]}
//       >
//         <boxGeometry
//           args={[
//             width * 0.25,
//             0.12,
//             depth * 0.20,
//           ]}
//         />
//         <meshStandardMaterial color="#f1e8dc" />
//       </mesh>

//       <mesh
//         position={[
//           width * 0.22,
//           0.52,
//           -depth * 0.28,
//         ]}
//       >
//         <boxGeometry
//           args={[
//             width * 0.25,
//             0.12,
//             depth * 0.20,
//           ]}
//         />
//         <meshStandardMaterial color="#f1e8dc" />
//       </mesh>
//     </group>
//   );
// }

// /* =========================================================
//    SOFA
// ========================================================= */

// function Sofa({ width, depth }) {
//   const seatHeight = 0.35;

//   return (
//     <group>
//       <mesh
//         position={[0, seatHeight / 2, 0]}
//         castShadow
//       >
//         <boxGeometry
//           args={[
//             width,
//             seatHeight,
//             depth,
//           ]}
//         />
//         <meshStandardMaterial color="#5c5d5b" />
//       </mesh>

//       <mesh
//         position={[
//           0,
//           0.72,
//           -depth * 0.36,
//         ]}
//         castShadow
//       >
//         <boxGeometry
//           args={[
//             width,
//             0.75,
//             0.20,
//           ]}
//         />
//         <meshStandardMaterial color="#4e504e" />
//       </mesh>

//       <mesh
//         position={[
//           -width / 2,
//           0.55,
//           0,
//         ]}
//       >
//         <boxGeometry
//           args={[
//             0.18,
//             0.45,
//             depth,
//           ]}
//         />
//         <meshStandardMaterial color="#4e504e" />
//       </mesh>

//       <mesh
//         position={[
//           width / 2,
//           0.55,
//           0,
//         ]}
//       >
//         <boxGeometry
//           args={[
//             0.18,
//             0.45,
//             depth,
//           ]}
//         />
//         <meshStandardMaterial color="#4e504e" />
//       </mesh>
//     </group>
//   );
// }

// /* =========================================================
//    DINING TABLE
// ========================================================= */

// function DiningTable({ width, depth }) {
//   return (
//     <group>
//       <mesh
//         position={[0, 0.72, 0]}
//         castShadow
//       >
//         <boxGeometry
//           args={[
//             width * 0.75,
//             0.12,
//             depth * 0.65,
//           ]}
//         />
//         <meshStandardMaterial color="#704b32" />
//       </mesh>

//       {[
//         [-1, -1],
//         [1, -1],
//         [-1, 1],
//         [1, 1],
//       ].map(([sx, sz]) => (
//         <mesh
//           key={`${sx}-${sz}`}
//           position={[
//             sx * width * 0.28,
//             0.35,
//             sz * depth * 0.22,
//           ]}
//         >
//           <cylinderGeometry
//             args={[0.045, 0.045, 0.7, 12]}
//           />
//           <meshStandardMaterial color="#503523" />
//         </mesh>
//       ))}

//       {/* chairs */}
//       {[
//         [-width * 0.52, 0],
//         [width * 0.52, 0],
//         [0, -depth * 0.55],
//         [0, depth * 0.55],
//       ].map(([cx, cz], index) => (
//         <Chair
//           key={index}
//           position={[cx, 0, cz]}
//         />
//       ))}
//     </group>
//   );
// }

// function Chair({ position = [0, 0, 0] }) {
//   return (
//     <group position={position}>
//       <mesh position={[0, 0.42, 0]}>
//         <boxGeometry args={[0.25, 0.08, 0.25]} />
//         <meshStandardMaterial color="#704b32" />
//       </mesh>

//       <mesh position={[0, 0.68, -0.10]}>
//         <boxGeometry args={[0.25, 0.55, 0.06]} />
//         <meshStandardMaterial color="#704b32" />
//       </mesh>

//       <mesh
//         position={[-0.09, 0.20, -0.09]}
//       >
//         <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
//         <meshStandardMaterial color="#4d3527" />
//       </mesh>

//       <mesh
//         position={[0.09, 0.20, -0.09]}
//       >
//         <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
//         <meshStandardMaterial color="#4d3527" />
//       </mesh>
//     </group>
//   );
// }

// /* =========================================================
//    KITCHEN
// ========================================================= */

// function Kitchen({ width, depth }) {
//   return (
//     <group>
//       <mesh
//         position={[0, 0.42, 0]}
//         castShadow
//       >
//         <boxGeometry
//           args={[
//             width,
//             0.84,
//             Math.min(depth, 0.55),
//           ]}
//         />
//         <meshStandardMaterial color="#493526" />
//       </mesh>

//       <mesh
//         position={[
//           0,
//           0.88,
//           0,
//         ]}
//       >
//         <boxGeometry
//           args={[
//             width + 0.04,
//             0.08,
//             Math.min(depth, 0.55) + 0.04,
//           ]}
//         />
//         <meshStandardMaterial color="#eee8dc" />
//       </mesh>

//       {/* cabinet doors */}
//       {[-0.28, 0, 0.28].map((x) => (
//         <mesh
//           key={x}
//           position={[
//             x * width,
//             0.38,
//             Math.min(depth, 0.55) / 2 + 0.01,
//           ]}
//         >
//           <boxGeometry
//             args={[
//               width * 0.18,
//               0.5,
//               0.025,
//             ]}
//           />
//           <meshStandardMaterial color="#5b4333" />
//         </mesh>
//       ))}

//       {/* sink */}
//       <mesh
//         position={[
//           width * 0.25,
//           0.94,
//           0,
//         ]}
//       >
//         <boxGeometry args={[0.35, 0.035, 0.30]} />
//         <meshStandardMaterial color="#c7c8c4" metalness={0.4} />
//       </mesh>

//       {/* fridge */}
//       <mesh
//         position={[
//           width * 0.38,
//           1.25,
//           -0.03,
//         ]}
//       >
//         <boxGeometry args={[0.42, 1.8, 0.48]} />
//         <meshStandardMaterial color="#bfc2c0" metalness={0.35} />
//       </mesh>

//       {/* stove */}
//       <mesh
//         position={[
//           -width * 0.20,
//           0.94,
//           0,
//         ]}
//       >
//         <boxGeometry args={[0.42, 0.05, 0.38]} />
//         <meshStandardMaterial color="#353535" />
//       </mesh>

//       {[[-0.1, -0.1], [0.1, -0.1], [-0.1, 0.1], [0.1, 0.1]].map(
//         ([sx, sz], index) => (
//           <mesh
//             key={index}
//             position={[
//               -width * 0.20 + sx,
//               0.98,
//               sz,
//             ]}
//           >
//             <cylinderGeometry args={[0.045, 0.045, 0.02, 16]} />
//             <meshStandardMaterial color="#111111" />
//           </mesh>
//         )
//       )}
//     </group>
//   );
// }

// /* =========================================================
//    BATHROOM
// ========================================================= */

// function Toilet() {
//   return (
//     <group>
//       <mesh position={[0, 0.25, 0]}>
//         <boxGeometry args={[0.42, 0.45, 0.55]} />
//         <meshStandardMaterial color="#f4f3ed" />
//       </mesh>

//       <mesh position={[0, 0.56, -0.12]}>
//         <cylinderGeometry args={[0.19, 0.19, 0.10, 20]} />
//         <meshStandardMaterial color="#f4f3ed" />
//       </mesh>

//       <mesh position={[0, 0.78, -0.22]}>
//         <boxGeometry args={[0.40, 0.55, 0.10]} />
//         <meshStandardMaterial color="#f4f3ed" />
//       </mesh>
//     </group>
//   );
// }

// function Sink() {
//   return (
//     <group>
//       <mesh position={[0, 0.78, 0]}>
//         <boxGeometry args={[0.65, 0.12, 0.45]} />
//         <meshStandardMaterial color="#f3f1ea" />
//       </mesh>

//       <mesh position={[0, 0.4, 0]}>
//         <boxGeometry args={[0.55, 0.7, 0.38]} />
//         <meshStandardMaterial color="#514b45" />
//       </mesh>

//       <mesh position={[0, 0.98, -0.05]}>
//         <cylinderGeometry args={[0.025, 0.025, 0.3, 12]} />
//         <meshStandardMaterial color="#b5b5af" metalness={0.7} />
//       </mesh>
//     </group>
//   );
// }

// function Bathtub({ width, depth }) {
//   return (
//     <mesh position={[0, 0.28, 0]}>
//       <boxGeometry args={[width, 0.55, depth]} />
//       <meshStandardMaterial color="#e8e7df" />
//     </mesh>
//   );
// }

// /* =========================================================
//    TV
// ========================================================= */

// function TV() {
//   return (
//     <group>
//       <mesh position={[0, 0.9, 0]}>
//         <boxGeometry args={[1.25, 0.70, 0.06]} />
//         <meshStandardMaterial color="#111111" />
//       </mesh>

//       <mesh position={[0, 0.9, 0.035]}>
//         <boxGeometry args={[1.12, 0.58, 0.015]} />
//         <meshStandardMaterial color="#28363b" />
//       </mesh>

//       <mesh position={[0, 0.45, 0]}>
//         <boxGeometry args={[0.15, 0.35, 0.15]} />
//         <meshStandardMaterial color="#252525" />
//       </mesh>
//     </group>
//   );
// }

// /* =========================================================
//    PLANT
// ========================================================= */

// function Plant() {
//   return (
//     <group>
//       <mesh position={[0, 0.25, 0]}>
//         <cylinderGeometry args={[0.20, 0.15, 0.45, 16]} />
//         <meshStandardMaterial color="#d1c3aa" />
//       </mesh>

//       {[[-0.18, 0.75, 0], [0.18, 0.78, 0], [0, 0.95, 0.05]].map(
//         (pos, index) => (
//           <mesh key={index} position={pos}>
//             <sphereGeometry args={[0.24, 12, 12]} />
//             <meshStandardMaterial color="#527451" roughness={0.9} />
//           </mesh>
//         )
//       )}
//     </group>
//   );
// }

// /* =========================================================
//    GENERIC FURNITURE
// ========================================================= */

// function GenericFurniture({ width, depth }) {
//   return (
//     <mesh position={[0, 0.35, 0]} castShadow>
//       <boxGeometry
//         args={[
//           width,
//           0.7,
//           depth,
//         ]}
//       />
//       <meshStandardMaterial color="#8a745d" />
//     </mesh>
//   );
// }

// /* =========================================================
//    ROOM LABEL
// ========================================================= */

// function RoomLabel({ room, scale }) {
//   const x =
//     (n(room.x) + n(room.width) / 2) * scale;

//   const z =
//     (n(room.y) + n(room.height) / 2) * scale;

//   return (
//     <Text
//       position={[x, WALL_HEIGHT + 0.04, z]}
//       rotation={[-Math.PI / 2, 0, 0]}
//       fontSize={0.16}
//       color="#45534d"
//       anchorX="center"
//       anchorY="middle"
//     >
//       {room.name || room.type || "Room"}
//     </Text>
//   );
// }

// /* =========================================================
//    SITE
// ========================================================= */

// function SiteElements({ plan, scale }) {
//   const site = plan.site || {};

//   return (
//     <group>
//       {site.garden && (
//         <Garden
//           plan={plan}
//           scale={scale}
//         />
//       )}

//       {site.parkingSpaces > 0 && (
//         <Parking
//           plan={plan}
//           scale={scale}
//           spaces={site.parkingSpaces}
//         />
//       )}

//       {site.boundaryWall?.enabled && (
//         <BoundaryWall
//           plan={plan}
//           scale={scale}
//         />
//       )}

//       {site.gate && (
//         <Gate
//           plan={plan}
//           scale={scale}
//         />
//       )}
//     </group>
//   );
// }

// function Garden({ plan, scale }) {
//   return (
//     <group
//       position={[
//         plan.project.plotWidth * scale * 0.82,
//         0,
//         plan.project.plotLength * scale * 0.78,
//       ]}
//     >
//       <mesh
//         rotation={[-Math.PI / 2, 0, 0]}
//         receiveShadow
//       >
//         <planeGeometry args={[2.2, 1.6]} />
//         <meshStandardMaterial color="#6f8d68" />
//       </mesh>

//       <Plant />
//       <group position={[0.7, 0, 0.4]}>
//         <Plant />
//       </group>
//     </group>
//   );
// }

// function Parking({ plan, scale, spaces }) {
//   return (
//     <group
//       position={[
//         plan.project.plotWidth * scale * 0.16,
//         0.01,
//         plan.project.plotLength * scale * 0.78,
//       ]}
//     >
//       {Array.from({
//         length: Math.min(4, spaces || 1),
//       }).map((_, index) => (
//         <group
//           key={index}
//           position={[index * 1.15, 0, 0]}
//         >
//           <mesh
//             rotation={[-Math.PI / 2, 0, 0]}
//           >
//             <planeGeometry args={[1, 2]} />
//             <meshStandardMaterial color="#777b79" />
//           </mesh>
//         </group>
//       ))}
//     </group>
//   );
// }

// function BoundaryWall({ plan, scale }) {
//   const width =
//     plan.project.plotWidth * scale;

//   const depth =
//     plan.project.plotLength * scale;

//   const height = 0.65;

//   return (
//     <group>
//       <mesh position={[width / 2, height / 2, 0]}>
//         <boxGeometry args={[width, height, 0.08]} />
//         <meshStandardMaterial color="#cfcac0" />
//       </mesh>

//       <mesh position={[width / 2, height / 2, depth]}>
//         <boxGeometry args={[width, height, 0.08]} />
//         <meshStandardMaterial color="#cfcac0" />
//       </mesh>

//       <mesh position={[0, height / 2, depth / 2]}>
//         <boxGeometry args={[0.08, height, depth]} />
//         <meshStandardMaterial color="#cfcac0" />
//       </mesh>

//       <mesh position={[width, height / 2, depth / 2]}>
//         <boxGeometry args={[0.08, height, depth]} />
//         <meshStandardMaterial color="#cfcac0" />
//       </mesh>
//     </group>
//   );
// }

// function Gate({ plan, scale }) {
//   const width =
//     plan.project.plotWidth * scale;

//   return (
//     <group
//       position={[
//         width / 2,
//         0.75,
//         0,
//       ]}
//     >
//       <mesh>
//         <boxGeometry args={[2.5, 1.5, 0.08]} />
//         <meshStandardMaterial color="#704b32" />
//       </mesh>
//     </group>
//   );
// }

// /* =========================================================
//    UI
// ========================================================= */

// function CameraReset() {
//   const { camera } = useThree();

//   return (
//     <button
//       type="button"
//       onClick={() => {
//         camera.position.set(8, 9, 10);
//         camera.lookAt(0, 0, 0);
//       }}
//       className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow hover:bg-slate-50"
//     >
//       Reset Camera
//     </button>
//   );
// }

// export default function ThreeDView() {
//   const location = useLocation();

//   const incomingPlan =
//     location.state?.floorPlanData ||
//     location.state ||
//     {};

//   const plan = useMemo(
//     () => normalizePlan(incomingPlan),
//     [incomingPlan]
//   );

//   const [selectedRoom, setSelectedRoom] =
//     useState(null);

//   const selected = plan.rooms.find(
//     (room) => room.id === selectedRoom
//   );

//   return (
//     <div className="fixed inset-0 flex flex-col bg-[#73787b]">
//       {/* =================================================
//           HEADER
//       ================================================= */}
//       <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm">
//         <div className="flex items-center gap-4">
//           <Link
//             to="/floor-plan-editor"
//             state={incomingPlan}
//             className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-lg hover:bg-slate-50"
//           >
//             ←
//           </Link>

//           <div>
//             <h1 className="font-bold text-slate-900">
//               {plan.project.name}
//             </h1>

//             <p className="text-xs text-slate-500">
//               Interactive 3D House View
//             </p>
//           </div>
//         </div>

//         <div className="hidden items-center gap-2 md:flex">
//           <div className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
//             3D VIEW
//           </div>

//           <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
//             {plan.project.plotWidth} ×{" "}
//             {plan.project.plotLength}{" "}
//             {plan.project.units}
//           </div>

//           <CameraReset />
//         </div>
//       </header>

//       {/* =================================================
//           3D CANVAS
//       ================================================= */}
//       <div className="relative min-h-0 flex-1">
//         <Canvas
//           shadows
//           dpr={[1, 2]}
//           gl={{
//             antialias: true,
//             alpha: false,
//           }}
//         >
//           <Scene
//             plan={plan}
//             selectedRoom={selectedRoom}
//             setSelectedRoom={setSelectedRoom}
//           />
//         </Canvas>

//         {/* Top-left information */}
//         <div className="absolute left-5 top-5 rounded-2xl border border-white/30 bg-white/90 p-4 shadow-xl backdrop-blur">
//           <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
//             3D Architectural View
//           </p>

//           <h2 className="mt-1 text-lg font-bold text-slate-800">
//             {plan.project.name}
//           </h2>

//           <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
//             <div className="rounded-lg bg-slate-100 px-3 py-2">
//               <span className="block text-slate-400">
//                 Rooms
//               </span>
//               <strong className="text-slate-700">
//                 {plan.rooms.length}
//               </strong>
//             </div>

//             <div className="rounded-lg bg-slate-100 px-3 py-2">
//               <span className="block text-slate-400">
//                 Floors
//               </span>
//               <strong className="text-slate-700">
//                 {plan.project.floors}
//               </strong>
//             </div>

//             <div className="rounded-lg bg-slate-100 px-3 py-2">
//               <span className="block text-slate-400">
//                 Doors
//               </span>
//               <strong className="text-slate-700">
//                 {plan.doors.length}
//               </strong>
//             </div>

//             <div className="rounded-lg bg-slate-100 px-3 py-2">
//               <span className="block text-slate-400">
//                 Windows
//               </span>
//               <strong className="text-slate-700">
//                 {plan.windows.length}
//               </strong>
//             </div>
//           </div>
//         </div>

//         {/* Right inspector */}
//         <div className="absolute right-5 top-5 w-72 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-xl backdrop-blur">
//           {selected ? (
//             <>
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
//                     Selected Room
//                   </p>

//                   <h3 className="mt-1 text-lg font-bold text-slate-800">
//                     {selected.name ||
//                       selected.type ||
//                       "Room"}
//                   </h3>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setSelectedRoom(null)
//                   }
//                   className="text-slate-400 hover:text-slate-700"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="mt-4 space-y-2 text-sm">
//                 <Info
//                   label="Type"
//                   value={selected.type || "room"}
//                 />

//                 <Info
//                   label="Position"
//                   value={`${n(selected.x)}, ${n(
//                     selected.y
//                   )}`}
//                 />

//                 <Info
//                   label="Size"
//                   value={`${n(selected.width)} × ${n(
//                     selected.height
//                   )}`}
//                 />

//                 <Info
//                   label="Floor"
//                   value={n(selected.floor, 0) + 1}
//                 />
//               </div>
//             </>
//           ) : (
//             <>
//               <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
//                 Navigation
//               </p>

//               <div className="mt-3 space-y-2 text-sm text-slate-600">
//                 <p>
//                   🖱️ Drag to rotate
//                 </p>

//                 <p>
//                   🔍 Scroll to zoom
//                 </p>

//                 <p>
//                   ✋ Right-click to pan
//                 </p>

//                 <p>
//                   🏠 Click a room to inspect it
//                 </p>
//               </div>

//               <div className="mt-5 rounded-xl bg-green-50 p-3 text-xs leading-5 text-green-800">
//                 This 3D model is generated directly
//                 from your DreamHouse floor-plan data.
//               </div>
//             </>
//           )}
//         </div>

//         {/* Bottom stats */}
//         <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/30 bg-white/90 p-2 shadow-xl backdrop-blur">
//           <Stat label="Rooms" value={plan.rooms.length} />
//           <Stat label="Doors" value={plan.doors.length} />
//           <Stat label="Windows" value={plan.windows.length} />
//           <Stat
//             label="Furniture"
//             value={plan.furniture.length}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    SMALL UI COMPONENTS
// ========================================================= */

// function Info({ label, value }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
//       <span className="text-slate-400">
//         {label}
//       </span>

//       <span className="font-medium text-slate-700">
//         {value}
//       </span>
//     </div>
//   );
// }

// function Stat({ label, value }) {
//   return (
//     <div className="min-w-20 rounded-xl px-3 py-1.5 text-center">
//       <p className="text-[10px] uppercase tracking-wider text-slate-400">
//         {label}
//       </p>

//       <p className="text-sm font-bold text-slate-700">
//         {value}
//       </p>
//     </div>
//   );
// }
































































































// // import { useMemo, useRef, useState } from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import {
// //   Canvas,
// // } from "@react-three/fiber";
// // import {
// //   OrbitControls,
// //   PerspectiveCamera,
// //   Environment,
// //   ContactShadows,
// //   Text,
// // } from "@react-three/drei";
// // import * as THREE from "three";

// // /* =========================================================
// //    HELPERS
// // ========================================================= */

// // const SCALE = 0.045;
// // const WALL_HEIGHT = 3.0;
// // const WALL_THICKNESS = 0.12;

// // function n(value, fallback = 0) {
// //   const number = Number(value);
// //   return Number.isFinite(number) ? number : fallback;
// // }

// // function normalizePlan(input = {}) {
// //   const source = input.floorPlanData || input;

// //   return {
// //     project: {
// //       name: source.project?.name || source.name || "Dream House",
// //       plotWidth: n(source.project?.plotWidth, 30),
// //       plotLength: n(source.project?.plotLength, 60),
// //       floors: n(source.project?.floors, 1),
// //       units: source.project?.units || "feet",
// //     },

// //     rooms: Array.isArray(source.rooms) ? source.rooms : [],
// //     doors: Array.isArray(source.doors) ? source.doors : [],
// //     windows: Array.isArray(source.windows) ? source.windows : [],
// //     walls: Array.isArray(source.walls) ? source.walls : [],
// //     furniture: Array.isArray(source.furniture) ? source.furniture : [],

// //     floors: Array.isArray(source.floors) ? source.floors : [],
// //     site: source.site || {},
// //     exterior: source.exterior || {},
// //     interior: source.interior || {},
// //     materials: source.materials || {},
// //     lighting: source.lighting || {},
// //     roof: source.roof || {},
// //     settings: source.settings || {},
// //   };
// // }

// // function roomColor(room) {
// //   const type = String(room.type || "").toLowerCase();

// //   if (type.includes("bath")) return "#dfe8e5";
// //   if (type.includes("bed")) return "#e9dfd1";
// //   if (type.includes("kitchen")) return "#ddd9cf";
// //   if (type.includes("living")) return "#e6e1d5";
// //   if (type.includes("dining")) return "#e8dfcf";
// //   if (type.includes("garage")) return "#c9cbc8";
// //   if (type.includes("stairs")) return "#d5d0c6";
// //   if (type.includes("office") || type.includes("study")) {
// //     return "#ded9ce";
// //   }

// //   return "#e5e0d5";
// // }

// // function floorColor(plan) {
// //   return (
// //     plan.materials?.floor ||
// //     plan.materials?.floorColor ||
// //     "#cdbfa9"
// //   );
// // }

// // function wallColor(plan) {
// //   return (
// //     plan.materials?.wall ||
// //     plan.materials?.wallColor ||
// //     plan.exterior?.facadeColor ||
// //     "#eeeae0"
// //   );
// // }

// // /* =========================================================
// //    MAIN 3D SCENE
// // ========================================================= */

// // function Scene({
// //   plan,
// //   selectedRoom,
// //   setSelectedRoom,
// // }) {
// //   const plotWidth = plan.project.plotWidth;
// //   const plotLength = plan.project.plotLength;

// //   const sceneScale = SCALE;

// //   return (
// //     <>
// //       <color
// //         attach="background"
// //         args={["#73787b"]}
// //       />

// //       <PerspectiveCamera
// //         makeDefault
// //         position={[
// //           plotWidth * sceneScale * 1.35,
// //           plotLength * sceneScale * 1.25,
// //           plotLength * sceneScale * 1.45,
// //         ]}
// //         fov={42}
// //         near={0.1}
// //         far={1000}
// //       />

// //       <ambientLight intensity={1.15} />

// //       <directionalLight
// //         position={[5, 12, 8]}
// //         intensity={3}
// //         castShadow
// //         shadow-mapSize-width={2048}
// //         shadow-mapSize-height={2048}
// //       />

// //       <directionalLight
// //         position={[-8, 8, -4]}
// //         intensity={1.2}
// //       />

// //       <Environment preset="city" />

// //       <OrbitControls
// //         makeDefault
// //         enableDamping
// //         dampingFactor={0.08}
// //         minDistance={4}
// //         maxDistance={30}
// //         maxPolarAngle={Math.PI / 2.05}
// //       />

// //       {/* Ground */}
// //       <Ground
// //         width={plotWidth}
// //         length={plotLength}
// //         scale={sceneScale}
// //       />

// //       {/* Site / garden / parking */}
// //       <SiteElements
// //         plan={plan}
// //         scale={sceneScale}
// //       />

// //       {/* Building floors */}
// //       {Array.from(
// //         {
// //           length: Math.max(
// //             1,
// //             plan.project.floors
// //           ),
// //         },
// //         (_, floorIndex) => (
// //           <FloorLevel
// //             key={`floor-${floorIndex}`}
// //             plan={plan}
// //             floorIndex={floorIndex}
// //             scale={sceneScale}
// //             selectedRoom={selectedRoom}
// //             setSelectedRoom={setSelectedRoom}
// //           />
// //         )
// //       )}

// //       {/* Explicit walls */}
// //       {plan.walls.map((wall) => (
// //         <Wall
// //           key={
// //             wall.id ||
// //             `wall-${wall.x}-${wall.y}`
// //           }
// //           item={wall}
// //           scale={sceneScale}
// //           color={wallColor(plan)}
// //         />
// //       ))}

// //       {/* Doors */}
// //       {plan.doors.map((door) => (
// //         <Door
// //           key={
// //             door.id ||
// //             `door-${door.x}-${door.y}`
// //           }
// //           item={door}
// //           scale={sceneScale}
// //         />
// //       ))}

// //       {/* Windows */}
// //       {plan.windows.map((window) => (
// //         <Window3D
// //           key={
// //             window.id ||
// //             `window-${window.x}-${window.y}`
// //           }
// //           item={window}
// //           scale={sceneScale}
// //         />
// //       ))}

// //       {/* Furniture */}
// //       {plan.furniture.map((item) => (
// //         <Furniture
// //           key={
// //             item.id ||
// //             `${item.type}-${item.x}-${item.y}`
// //           }
// //           item={item}
// //           scale={sceneScale}
// //         />
// //       ))}

// //       {/* Room labels */}
// //       {plan.rooms.map((room) => (
// //         <RoomLabel
// //           key={`label-${room.id}`}
// //           room={room}
// //           scale={sceneScale}
// //         />
// //       ))}

// //       <ContactShadows
// //         position={[0, 0.01, 0]}
// //         opacity={0.35}
// //         scale={25}
// //         blur={2.5}
// //         far={15}
// //       />
// //     </>
// //   );
// // }

// // /* =========================================================
// //    GROUND
// // ========================================================= */

// // function Ground({
// //   width,
// //   length,
// //   scale,
// // }) {
// //   return (
// //     <group
// //       position={[
// //         (width * scale) / 2,
// //         -0.08,
// //         (length * scale) / 2,
// //       ]}
// //     >
// //       <mesh
// //         receiveShadow
// //         rotation={[-Math.PI / 2, 0, 0]}
// //       >
// //         <planeGeometry
// //           args={[
// //             width * scale * 2.4,
// //             length * scale * 2.4,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#858a87"
// //           roughness={0.95}
// //         />
// //       </mesh>

// //       <gridHelper
// //         args={[
// //           Math.max(width, length) *
// //             scale *
// //             2,
// //           30,
// //           "#707572",
// //           "#808582",
// //         ]}
// //         position={[0, 0.01, 0]}
// //       />
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    FLOOR LEVEL
// // ========================================================= */

// // function FloorLevel({
// //   plan,
// //   floorIndex,
// //   scale,
// //   selectedRoom,
// //   setSelectedRoom,
// // }) {
// //   const floorRooms = plan.rooms.filter(
// //     (room) => {
// //       const floor = n(room.floor, 0);
// //       return floor === floorIndex;
// //     }
// //   );

// //   const elevation =
// //     floorIndex * 3.25;

// //   return (
// //     <group
// //       position={[0, elevation, 0]}
// //     >
// //       {floorRooms.map((room) => (
// //         <Room
// //           key={room.id}
// //           room={room}
// //           scale={scale}
// //           selected={
// //             selectedRoom === room.id
// //           }
// //           onSelect={() =>
// //             setSelectedRoom(room.id)
// //           }
// //           color={roomColor(room)}
// //         />
// //       ))}
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    ROOM
// // ========================================================= */

// // function Room({
// //   room,
// //   scale,
// //   selected,
// //   onSelect,
// //   color,
// // }) {
// //   const x =
// //     n(room.x) * scale;

// //   const y =
// //     n(room.y) * scale;

// //   const width = Math.max(
// //     0.4,
// //     n(room.width, 120) * scale
// //   );

// //   const depth = Math.max(
// //     0.4,
// //     n(room.height, 90) * scale
// //   );

// //   const floorY = 0.02;
// //   const wallHeight = WALL_HEIGHT;
// //   const wallThickness =
// //     WALL_THICKNESS;

// //   const rotation =
// //     THREE.MathUtils.degToRad(
// //       n(room.rotation)
// //     );

// //   return (
// //     <group
// //       position={[
// //         x + width / 2,
// //         0,
// //         y + depth / 2,
// //       ]}
// //       rotation={[0, rotation, 0]}
// //       onClick={(event) => {
// //         event.stopPropagation();
// //         onSelect();
// //       }}
// //     >
// //       {/* Floor */}
// //       <mesh
// //         position={[
// //           0,
// //           floorY,
// //           0,
// //         ]}
// //         receiveShadow
// //       >
// //         <boxGeometry
// //           args={[
// //             width,
// //             0.06,
// //             depth,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color={color}
// //           roughness={0.75}
// //         />
// //       </mesh>

// //       {/* Selected outline */}
// //       {selected && (
// //         <mesh
// //           position={[
// //             0,
// //             0.04,
// //             0,
// //           ]}
// //         >
// //           <boxGeometry
// //             args={[
// //               width + 0.05,
// //               0.015,
// //               depth + 0.05,
// //             ]}
// //           />

// //           <meshBasicMaterial
// //             color="#68b89b"
// //             transparent
// //             opacity={0.55}
// //           />
// //         </mesh>
// //       )}

// //       {/* Front wall */}
// //       <RoomWall
// //         width={width}
// //         height={wallHeight}
// //         position={[
// //           0,
// //           wallHeight / 2,
// //           -depth / 2,
// //         ]}
// //         rotation={[0, 0, 0]}
// //       />

// //       {/* Back wall */}
// //       <RoomWall
// //         width={width}
// //         height={wallHeight}
// //         position={[
// //           0,
// //           wallHeight / 2,
// //           depth / 2,
// //         ]}
// //         rotation={[0, 0, 0]}
// //       />

// //       {/* Left wall */}
// //       <RoomWall
// //         width={depth}
// //         height={wallHeight}
// //         position={[
// //           -width / 2,
// //           wallHeight / 2,
// //           0,
// //         ]}
// //         rotation={[
// //           0,
// //           Math.PI / 2,
// //           0,
// //         ]}
// //       />

// //       {/* Right wall */}
// //       <RoomWall
// //         width={depth}
// //         height={wallHeight}
// //         position={[
// //           width / 2,
// //           wallHeight / 2,
// //           0,
// //         ]}
// //         rotation={[
// //           0,
// //           Math.PI / 2,
// //           0,
// //         ]}
// //       />
// //     </group>
// //   );
// // }

// // function RoomWall({
// //   width,
// //   height,
// //   position,
// //   rotation,
// // }) {
// //   return (
// //     <mesh
// //       position={position}
// //       rotation={rotation}
// //       castShadow
// //       receiveShadow
// //     >
// //       <boxGeometry
// //         args={[
// //           width,
// //           height,
// //           WALL_THICKNESS,
// //         ]}
// //       />

// //       <meshStandardMaterial
// //         color="#eeeae0"
// //         roughness={0.82}
// //       />
// //     </mesh>
// //   );
// // }

// // /* =========================================================
// //    EXPLICIT WALL
// // ========================================================= */

// // function Wall({
// //   item,
// //   scale,
// //   color,
// // }) {
// //   const width = Math.max(
// //     0.05,
// //     n(item.width, 10) * scale
// //   );

// //   const depth = Math.max(
// //     0.05,
// //     n(item.height, 10) * scale
// //   );

// //   return (
// //     <mesh
// //       position={[
// //         (
// //           n(item.x) +
// //           n(item.width) / 2
// //         ) * scale,

// //         WALL_HEIGHT / 2,

// //         (
// //           n(item.y) +
// //           n(item.height) / 2
// //         ) * scale,
// //       ]}
// //       rotation={[
// //         0,
// //         THREE.MathUtils.degToRad(
// //           n(item.rotation)
// //         ),
// //         0,
// //       ]}
// //       castShadow
// //     >
// //       <boxGeometry
// //         args={[
// //           width,
// //           WALL_HEIGHT,
// //           depth,
// //         ]}
// //       />

// //       <meshStandardMaterial
// //         color={color}
// //         roughness={0.85}
// //       />
// //     </mesh>
// //   );
// // }

// // /* =========================================================
// //    DOOR
// // ========================================================= */

// // function Door({
// //   item,
// //   scale,
// // }) {
// //   const width = Math.max(
// //     0.25,
// //     n(item.width, 42) * scale
// //   );

// //   const height = Math.max(
// //     1.7,
// //     n(item.height, 10) *
// //       scale *
// //       2.5
// //   );

// //   const x =
// //     n(item.x) * scale;

// //   const z =
// //     n(item.y) * scale;

// //   return (
// //     <group
// //       position={[
// //         x + width / 2,
// //         height / 2,
// //         z,
// //       ]}
// //       rotation={[
// //         0,
// //         THREE.MathUtils.degToRad(
// //           n(item.rotation)
// //         ),
// //         0,
// //       ]}
// //     >
// //       {/* Frame */}
// //       <mesh castShadow>
// //         <boxGeometry
// //           args={[
// //             width + 0.08,
// //             height + 0.08,
// //             0.08,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#673f2b"
// //         />
// //       </mesh>

// //       {/* Glass */}
// //       <mesh
// //         position={[
// //           0,
// //           0,
// //           0.045,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             width,
// //             height,
// //             0.025,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#a9d0cc"
// //           transparent
// //           opacity={0.28}
// //           roughness={0.1}
// //         />
// //       </mesh>

// //       {/* Handle */}
// //       <mesh
// //         position={[
// //           width * 0.32,
// //           0,
// //           0.09,
// //         ]}
// //       >
// //         <sphereGeometry
// //           args={[
// //             0.035,
// //             12,
// //             12,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#b78a54"
// //         />
// //       </mesh>
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    WINDOW
// // ========================================================= */

// // function Window3D({
// //   item,
// //   scale,
// // }) {
// //   const width = Math.max(
// //     0.3,
// //     n(item.width, 55) * scale
// //   );

// //   const height = Math.max(
// //     0.55,
// //     n(item.height, 8) *
// //       scale *
// //       2
// //   );

// //   const x =
// //     n(item.x) * scale;

// //   const z =
// //     n(item.y) * scale;

// //   return (
// //     <group
// //       position={[
// //         x + width / 2,
// //         1.55,
// //         z,
// //       ]}
// //       rotation={[
// //         0,
// //         THREE.MathUtils.degToRad(
// //           n(item.rotation)
// //         ),
// //         0,
// //       ]}
// //     >
// //       {/* Glass */}
// //       <mesh>
// //         <boxGeometry
// //           args={[
// //             width,
// //             height,
// //             0.035,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#8dbdc3"
// //           transparent
// //           opacity={0.45}
// //           roughness={0.15}
// //         />
// //       </mesh>

// //       {/* Top frame */}
// //       <mesh
// //         position={[
// //           0,
// //           height / 2,
// //           0.025,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             width + 0.07,
// //             0.07,
// //             0.08,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#72442e"
// //         />
// //       </mesh>

// //       {/* Bottom frame */}
// //       <mesh
// //         position={[
// //           0,
// //           -height / 2,
// //           0.025,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             width + 0.07,
// //             0.07,
// //             0.08,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#72442e"
// //         />
// //       </mesh>

// //       {/* Left frame */}
// //       <mesh
// //         position={[
// //           -width / 2,
// //           0,
// //           0.025,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.07,
// //             height,
// //             0.08,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#72442e"
// //         />
// //       </mesh>

// //       {/* Right frame */}
// //       <mesh
// //         position={[
// //           width / 2,
// //           0,
// //           0.025,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.07,
// //             height,
// //             0.08,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#72442e"
// //         />
// //       </mesh>

// //       {/* Center divider */}
// //       <mesh
// //         position={[
// //           0,
// //           0,
// //           0.03,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.035,
// //             height,
// //             0.08,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#72442e"
// //         />
// //       </mesh>
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    FURNITURE DISPATCHER
// // ========================================================= */

// // function Furniture({
// //   item,
// //   scale,
// // }) {
// //   const type = String(
// //     item.type ||
// //       item.name ||
// //       ""
// //   ).toLowerCase();

// //   const x =
// //     (
// //       n(item.x) +
// //       n(item.width) / 2
// //     ) * scale;

// //   const z =
// //     (
// //       n(item.y) +
// //       n(item.height) / 2
// //     ) * scale;

// //   const width = Math.max(
// //     0.2,
// //     n(item.width, 60) * scale
// //   );

// //   const depth = Math.max(
// //     0.2,
// //     n(item.height, 30) * scale
// //   );

// //   const rotation =
// //     THREE.MathUtils.degToRad(
// //       n(item.rotation)
// //     );

// //   let model = null;

// //   if (
// //     type.includes("bed") ||
// //     type.includes("master")
// //   ) {
// //     model = (
// //       <Bed
// //         width={width}
// //         depth={depth}
// //       />
// //     );
// //   } else if (
// //     type.includes("sofa") ||
// //     type.includes("couch")
// //   ) {
// //     model = (
// //       <Sofa
// //         width={width}
// //         depth={depth}
// //       />
// //     );
// //   } else if (
// //     type.includes("table") ||
// //     type.includes("dining")
// //   ) {
// //     model = (
// //       <DiningTable
// //         width={width}
// //         depth={depth}
// //       />
// //     );
// //   } else if (
// //     type.includes("kitchen") ||
// //     type.includes("counter") ||
// //     type.includes("cabinet")
// //   ) {
// //     model = (
// //       <Kitchen
// //         width={width}
// //         depth={depth}
// //       />
// //     );
// //   } else if (
// //     type.includes("toilet") ||
// //     type.includes("wc")
// //   ) {
// //     model = <Toilet />;
// //   } else if (
// //     type.includes("sink") ||
// //     type.includes("wash")
// //   ) {
// //     model = <Sink />;
// //   } else if (
// //     type.includes("bath")
// //   ) {
// //     model = (
// //       <Bathtub
// //         width={width}
// //         depth={depth}
// //       />
// //     );
// //   } else if (
// //     type.includes("plant") ||
// //     type.includes("tree")
// //   ) {
// //     model = <Plant />;
// //   } else if (
// //     type.includes("tv")
// //   ) {
// //     model = <TV />;
// //   } else if (
// //     type.includes("chair")
// //   ) {
// //     model = <Chair />;
// //   } else {
// //     model = (
// //       <GenericFurniture
// //         width={width}
// //         depth={depth}
// //       />
// //     );
// //   }

// //   return (
// //     <group
// //       position={[
// //         x,
// //         0.08,
// //         z,
// //       ]}
// //       rotation={[
// //         0,
// //         rotation,
// //         0,
// //       ]}
// //     >
// //       {model}
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    BED
// // ========================================================= */

// // function Bed({
// //   width,
// //   depth,
// // }) {
// //   const mattressHeight = 0.28;
// //   const frameHeight = 0.16;

// //   return (
// //     <group>
// //       {/* Frame */}
// //       <mesh
// //         position={[
// //           0,
// //           frameHeight / 2,
// //           0,
// //         ]}
// //         castShadow
// //       >
// //         <boxGeometry
// //           args={[
// //             width,
// //             frameHeight,
// //             depth,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#5c4639"
// //         />
// //       </mesh>

// //       {/* Mattress */}
// //       <mesh
// //         position={[
// //           0,
// //           frameHeight +
// //             mattressHeight / 2,
// //           0,
// //         ]}
// //         castShadow
// //       >
// //         <boxGeometry
// //           args={[
// //             width * 0.92,
// //             mattressHeight,
// //             depth * 0.9,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#e6d3b9"
// //           roughness={0.9}
// //         />
// //       </mesh>

// //       {/* Headboard */}
// //       <mesh
// //         position={[
// //           0,
// //           0.9,
// //           -depth * 0.43,
// //         ]}
// //         castShadow
// //       >
// //         <boxGeometry
// //           args={[
// //             width * 0.95,
// //             1.25,
// //             0.10,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#6b4b3a"
// //         />
// //       </mesh>

// //       {/* Pillow 1 */}
// //       <mesh
// //         position={[
// //           -width * 0.22,
// //           0.52,
// //           -depth * 0.28,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             width * 0.25,
// //             0.12,
// //             depth * 0.20,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#f1e8dc"
// //         />
// //       </mesh>

// //       {/* Pillow 2 */}
// //       <mesh
// //         position={[
// //           width * 0.22,
// //           0.52,
// //           -depth * 0.28,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             width * 0.25,
// //             0.12,
// //             depth * 0.20,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#f1e8dc"
// //         />
// //       </mesh>
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    SOFA
// // ========================================================= */

// // function Sofa({
// //   width,
// //   depth,
// // }) {
// //   const seatHeight = 0.35;

// //   return (
// //     <group>
// //       <mesh
// //         position={[
// //           0,
// //           seatHeight / 2,
// //           0,
// //         ]}
// //         castShadow
// //       >
// //         <boxGeometry
// //           args={[
// //             width,
// //             seatHeight,
// //             depth,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#5c5d5b"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           0,
// //           0.72,
// //           -depth * 0.36,
// //         ]}
// //         castShadow
// //       >
// //         <boxGeometry
// //           args={[
// //             width,
// //             0.75,
// //             0.20,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#4e504e"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           -width / 2,
// //           0.55,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.18,
// //             0.45,
// //             depth,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#4e504e"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           width / 2,
// //           0.55,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.18,
// //             0.45,
// //             depth,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#4e504e"
// //         />
// //       </mesh>
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    DINING TABLE
// // ========================================================= */

// // function DiningTable({
// //   width,
// //   depth,
// // }) {
// //   return (
// //     <group>
// //       <mesh
// //         position={[
// //           0,
// //           0.72,
// //           0,
// //         ]}
// //         castShadow
// //       >
// //         <boxGeometry
// //           args={[
// //             width * 0.75,
// //             0.12,
// //             depth * 0.65,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#704b32"
// //         />
// //       </mesh>

// //       {[
// //         [-1, -1],
// //         [1, -1],
// //         [-1, 1],
// //         [1, 1],
// //       ].map(
// //         ([sx, sz]) => (
// //           <mesh
// //             key={`${sx}-${sz}`}
// //             position={[
// //               sx * width * 0.28,
// //               0.35,
// //               sz * depth * 0.22,
// //             ]}
// //           >
// //             <cylinderGeometry
// //               args={[
// //                 0.045,
// //                 0.045,
// //                 0.7,
// //                 12,
// //               ]}
// //             />

// //             <meshStandardMaterial
// //               color="#503523"
// //             />
// //           </mesh>
// //         )
// //       )}

// //       {/* Chairs */}
// //       {[
// //         [-width * 0.52, 0],
// //         [width * 0.52, 0],
// //         [0, -depth * 0.55],
// //         [0, depth * 0.55],
// //       ].map(
// //         ([cx, cz], index) => (
// //           <Chair
// //             key={index}
// //             position={[
// //               cx,
// //               0,
// //               cz,
// //             ]}
// //           />
// //         )
// //       )}
// //     </group>
// //   );
// // }

// // function Chair({
// //   position = [0, 0, 0],
// // }) {
// //   return (
// //     <group
// //       position={position}
// //     >
// //       <mesh
// //         position={[
// //           0,
// //           0.42,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.25,
// //             0.08,
// //             0.25,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#704b32"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           0,
// //           0.68,
// //           -0.10,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.25,
// //             0.55,
// //             0.06,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#704b32"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           -0.09,
// //           0.20,
// //           -0.09,
// //         ]}
// //       >
// //         <cylinderGeometry
// //           args={[
// //             0.025,
// //             0.025,
// //             0.4,
// //             8,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#4d3527"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           0.09,
// //           0.20,
// //           -0.09,
// //         ]}
// //       >
// //         <cylinderGeometry
// //           args={[
// //             0.025,
// //             0.025,
// //             0.4,
// //             8,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#4d3527"
// //         />
// //       </mesh>
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    KITCHEN
// // ========================================================= */

// // function Kitchen({
// //   width,
// //   depth,
// // }) {
// //   return (
// //     <group>
// //       <mesh
// //         position={[
// //           0,
// //           0.42,
// //           0,
// //         ]}
// //         castShadow
// //       >
// //         <boxGeometry
// //           args={[
// //             width,
// //             0.84,
// //             Math.min(
// //               depth,
// //               0.55
// //             ),
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#493526"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           0,
// //           0.88,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             width + 0.04,
// //             0.08,
// //             Math.min(
// //               depth,
// //               0.55
// //             ) + 0.04,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#eee8dc"
// //         />
// //       </mesh>

// //       {/* Cabinet doors */}
// //       {[
// //         -0.28,
// //         0,
// //         0.28,
// //       ].map((x) => (
// //         <mesh
// //           key={x}
// //           position={[
// //             x * width,
// //             0.38,
// //             Math.min(
// //               depth,
// //               0.55
// //             ) / 2 + 0.01,
// //           ]}
// //         >
// //           <boxGeometry
// //             args={[
// //               width * 0.18,
// //               0.5,
// //               0.025,
// //             ]}
// //           />

// //           <meshStandardMaterial
// //             color="#5b4333"
// //           />
// //         </mesh>
// //       ))}

// //       {/* Sink */}
// //       <mesh
// //         position={[
// //           width * 0.25,
// //           0.94,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.35,
// //             0.035,
// //             0.30,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#c7c8c4"
// //           metalness={0.4}
// //         />
// //       </mesh>

// //       {/* Fridge */}
// //       <mesh
// //         position={[
// //           width * 0.38,
// //           1.25,
// //           -0.03,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.42,
// //             1.8,
// //             0.48,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#bfc2c0"
// //           metalness={0.35}
// //         />
// //       </mesh>

// //       {/* Stove */}
// //       <mesh
// //         position={[
// //           -width * 0.20,
// //           0.94,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.42,
// //             0.05,
// //             0.38,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#353535"
// //         />
// //       </mesh>

// //       {[
// //         [-0.1, -0.1],
// //         [0.1, -0.1],
// //         [-0.1, 0.1],
// //         [0.1, 0.1],
// //       ].map(
// //         ([sx, sz], index) => (
// //           <mesh
// //             key={index}
// //             position={[
// //               -width * 0.20 + sx,
// //               0.98,
// //               sz,
// //             ]}
// //           >
// //             <cylinderGeometry
// //               args={[
// //                 0.045,
// //                 0.045,
// //                 0.02,
// //                 16,
// //               ]}
// //             />

// //             <meshStandardMaterial
// //               color="#111111"
// //             />
// //           </mesh>
// //         )
// //       )}
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    BATHROOM
// // ========================================================= */

// // function Toilet() {
// //   return (
// //     <group>
// //       <mesh
// //         position={[
// //           0,
// //           0.25,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.42,
// //             0.45,
// //             0.55,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#f4f3ed"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           0,
// //           0.56,
// //           -0.12,
// //         ]}
// //       >
// //         <cylinderGeometry
// //           args={[
// //             0.19,
// //             0.19,
// //             0.10,
// //             20,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#f4f3ed"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           0,
// //           0.78,
// //           -0.22,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.40,
// //             0.55,
// //             0.10,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#f4f3ed"
// //         />
// //       </mesh>
// //     </group>
// //   );
// // }

// // function Sink() {
// //   return (
// //     <group>
// //       <mesh
// //         position={[
// //           0,
// //           0.78,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.65,
// //             0.12,
// //             0.45,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#f3f1ea"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           0,
// //           0.4,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.55,
// //             0.7,
// //             0.38,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#514b45"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           0,
// //           0.98,
// //           -0.05,
// //         ]}
// //       >
// //         <cylinderGeometry
// //           args={[
// //             0.025,
// //             0.025,
// //             0.3,
// //             12,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#b5b5af"
// //           metalness={0.7}
// //         />
// //       </mesh>
// //     </group>
// //   );
// // }

// // function Bathtub({
// //   width,
// //   depth,
// // }) {
// //   return (
// //     <mesh
// //       position={[
// //         0,
// //         0.28,
// //         0,
// //       ]}
// //     >
// //       <boxGeometry
// //         args={[
// //           width,
// //           0.55,
// //           depth,
// //         ]}
// //       />

// //       <meshStandardMaterial
// //         color="#e8e7df"
// //       />
// //     </mesh>
// //   );
// // }

// // /* =========================================================
// //    TV
// // ========================================================= */

// // function TV() {
// //   return (
// //     <group>
// //       <mesh
// //         position={[
// //           0,
// //           0.9,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             1.25,
// //             0.70,
// //             0.06,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#111111"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           0,
// //           0.9,
// //           0.035,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             1.12,
// //             0.58,
// //             0.015,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#28363b"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           0,
// //           0.45,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.15,
// //             0.35,
// //             0.15,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#252525"
// //         />
// //       </mesh>
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    PLANT
// // ========================================================= */

// // function Plant() {
// //   return (
// //     <group>
// //       <mesh
// //         position={[
// //           0,
// //           0.25,
// //           0,
// //         ]}
// //       >
// //         <cylinderGeometry
// //           args={[
// //             0.20,
// //             0.15,
// //             0.45,
// //             16,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#d1c3aa"
// //         />
// //       </mesh>

// //       {[
// //         [-0.18, 0.75, 0],
// //         [0.18, 0.78, 0],
// //         [0, 0.95, 0.05],
// //       ].map(
// //         (pos, index) => (
// //           <mesh
// //             key={index}
// //             position={pos}
// //           >
// //             <sphereGeometry
// //               args={[
// //                 0.24,
// //                 12,
// //                 12,
// //               ]}
// //             />

// //             <meshStandardMaterial
// //               color="#527451"
// //               roughness={0.9}
// //             />
// //           </mesh>
// //         )
// //       )}
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    GENERIC FURNITURE
// // ========================================================= */

// // function GenericFurniture({
// //   width,
// //   depth,
// // }) {
// //   return (
// //     <mesh
// //       position={[
// //         0,
// //         0.35,
// //         0,
// //       ]}
// //       castShadow
// //     >
// //       <boxGeometry
// //         args={[
// //           width,
// //           0.7,
// //           depth,
// //         ]}
// //       />

// //       <meshStandardMaterial
// //         color="#8a745d"
// //       />
// //     </mesh>
// //   );
// // }

// // /* =========================================================
// //    ROOM LABEL
// // ========================================================= */

// // function RoomLabel({
// //   room,
// //   scale,
// // }) {
// //   const x =
// //     (
// //       n(room.x) +
// //       n(room.width) / 2
// //     ) * scale;

// //   const z =
// //     (
// //       n(room.y) +
// //       n(room.height) / 2
// //     ) * scale;

// //   return (
// //     <Text
// //       position={[
// //         x,
// //         WALL_HEIGHT + 0.04,
// //         z,
// //       ]}
// //       rotation={[
// //         -Math.PI / 2,
// //         0,
// //         0,
// //       ]}
// //       fontSize={0.16}
// //       color="#45534d"
// //       anchorX="center"
// //       anchorY="middle"
// //     >
// //       {room.name ||
// //         room.type ||
// //         "Room"}
// //     </Text>
// //   );
// // }

// // /* =========================================================
// //    SITE
// // ========================================================= */

// // function SiteElements({
// //   plan,
// //   scale,
// // }) {
// //   const site =
// //     plan.site || {};

// //   return (
// //     <group>
// //       {site.garden && (
// //         <Garden
// //           plan={plan}
// //           scale={scale}
// //         />
// //       )}

// //       {site.parkingSpaces > 0 && (
// //         <Parking
// //           plan={plan}
// //           scale={scale}
// //           spaces={
// //             site.parkingSpaces
// //           }
// //         />
// //       )}

// //       {site.boundaryWall
// //         ?.enabled && (
// //         <BoundaryWall
// //           plan={plan}
// //           scale={scale}
// //         />
// //       )}

// //       {site.gate && (
// //         <Gate
// //           plan={plan}
// //           scale={scale}
// //         />
// //       )}
// //     </group>
// //   );
// // }

// // function Garden({
// //   plan,
// //   scale,
// // }) {
// //   return (
// //     <group
// //       position={[
// //         plan.project.plotWidth *
// //           scale *
// //           0.82,

// //         0,

// //         plan.project.plotLength *
// //           scale *
// //           0.78,
// //       ]}
// //     >
// //       <mesh
// //         rotation={[
// //           -Math.PI / 2,
// //           0,
// //           0,
// //         ]}
// //         receiveShadow
// //       >
// //         <planeGeometry
// //           args={[
// //             2.2,
// //             1.6,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#6f8d68"
// //         />
// //       </mesh>

// //       <Plant />

// //       <group
// //         position={[
// //           0.7,
// //           0,
// //           0.4,
// //         ]}
// //       >
// //         <Plant />
// //       </group>
// //     </group>
// //   );
// // }

// // function Parking({
// //   plan,
// //   scale,
// //   spaces,
// // }) {
// //   return (
// //     <group
// //       position={[
// //         plan.project.plotWidth *
// //           scale *
// //           0.16,

// //         0.01,

// //         plan.project.plotLength *
// //           scale *
// //           0.78,
// //       ]}
// //     >
// //       {Array.from({
// //         length: Math.min(
// //           4,
// //           spaces || 1
// //         ),
// //       }).map(
// //         (_, index) => (
// //           <group
// //             key={index}
// //             position={[
// //               index * 1.15,
// //               0,
// //               0,
// //             ]}
// //           >
// //             <mesh
// //               rotation={[
// //                 -Math.PI / 2,
// //                 0,
// //                 0,
// //               ]}
// //             >
// //               <planeGeometry
// //                 args={[
// //                   1,
// //                   2,
// //                 ]}
// //               />

// //               <meshStandardMaterial
// //                 color="#777b79"
// //               />
// //             </mesh>
// //           </group>
// //         )
// //       )}
// //     </group>
// //   );
// // }

// // function BoundaryWall({
// //   plan,
// //   scale,
// // }) {
// //   const width =
// //     plan.project.plotWidth *
// //     scale;

// //   const depth =
// //     plan.project.plotLength *
// //     scale;

// //   const height = 0.65;

// //   return (
// //     <group>
// //       <mesh
// //         position={[
// //           width / 2,
// //           height / 2,
// //           0,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             width,
// //             height,
// //             0.08,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#cfcac0"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           width / 2,
// //           height / 2,
// //           depth,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             width,
// //             height,
// //             0.08,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#cfcac0"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           0,
// //           height / 2,
// //           depth / 2,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.08,
// //             height,
// //             depth,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#cfcac0"
// //         />
// //       </mesh>

// //       <mesh
// //         position={[
// //           width,
// //           height / 2,
// //           depth / 2,
// //         ]}
// //       >
// //         <boxGeometry
// //           args={[
// //             0.08,
// //             height,
// //             depth,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#cfcac0"
// //         />
// //       </mesh>
// //     </group>
// //   );
// // }

// // function Gate({
// //   plan,
// //   scale,
// // }) {
// //   const width =
// //     plan.project.plotWidth *
// //     scale;

// //   return (
// //     <group
// //       position={[
// //         width / 2,
// //         0.75,
// //         0,
// //       ]}
// //     >
// //       <mesh>
// //         <boxGeometry
// //           args={[
// //             2.5,
// //             1.5,
// //             0.08,
// //           ]}
// //         />

// //         <meshStandardMaterial
// //           color="#704b32"
// //         />
// //       </mesh>
// //     </group>
// //   );
// // }

// // /* =========================================================
// //    MAIN UI
// // ========================================================= */

// // export default function ThreeDView() {
// //   const location =
// //     useLocation();

// //   const incomingPlan =
// //     location.state
// //       ?.floorPlanData ||
// //     location.state ||
// //     {};

// //   const plan = useMemo(
// //     () =>
// //       normalizePlan(
// //         incomingPlan
// //       ),
// //     [incomingPlan]
// //   );

// //   const [
// //     selectedRoom,
// //     setSelectedRoom,
// //   ] = useState(null);

// //   /*
// //     IMPORTANT:
// //     Camera ref is controlled from outside the Canvas.
// //     We get the actual R3F camera using Canvas onCreated.
// //   */
// //   const cameraRef =
// //     useRef(null);

// //   const selected =
// //     plan.rooms.find(
// //       (room) =>
// //         room.id ===
// //         selectedRoom
// //     );

// //   const resetCamera =
// //     () => {
// //       if (!cameraRef.current) {
// //         return;
// //       }

// //       cameraRef.current.position.set(
// //         8,
// //         9,
// //         10
// //       );

// //       cameraRef.current.lookAt(
// //         0,
// //         0,
// //         0
// //       );

// //       cameraRef.current.updateProjectionMatrix();
// //     };

// //   return (
// //     <div className="fixed inset-0 flex flex-col bg-[#73787b]">

// //       {/* =================================================
// //           HEADER
// //       ================================================= */}

// //       <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm">

// //         <div className="flex items-center gap-4">

// //           <Link
// //             to="/floor-plan-editor"
// //             state={incomingPlan}
// //             className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-lg hover:bg-slate-50"
// //           >
// //             ←
// //           </Link>

// //           <div>
// //             <h1 className="font-bold text-slate-900">
// //               {plan.project.name}
// //             </h1>

// //             <p className="text-xs text-slate-500">
// //               Interactive 3D House View
// //             </p>
// //           </div>

// //         </div>

// //         <div className="hidden items-center gap-2 md:flex">

// //           <div className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
// //             3D VIEW
// //           </div>

// //           <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
// //             {plan.project.plotWidth} ×{" "}
// //             {plan.project.plotLength}{" "}
// //             {plan.project.units}
// //           </div>

// //           {/* RESET CAMERA */}
// //           <button
// //             type="button"
// //             onClick={resetCamera}
// //             className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow hover:bg-slate-50"
// //           >
// //             Reset Camera
// //           </button>

// //         </div>
// //       </header>

// //       {/* =================================================
// //           3D CANVAS
// //       ================================================= */}

// //       <div className="relative min-h-0 flex-1">

// //         <Canvas
// //           shadows
// //           dpr={[1, 2]}
// //           gl={{
// //             antialias: true,
// //             alpha: false,
// //           }}
// //           onCreated={({
// //             camera,
// //           }) => {
// //             cameraRef.current =
// //               camera;
// //           }}
// //         >
// //           <Scene
// //             plan={plan}
// //             selectedRoom={
// //               selectedRoom
// //             }
// //             setSelectedRoom={
// //               setSelectedRoom
// //             }
// //           />
// //         </Canvas>

// //         {/* =================================================
// //             TOP LEFT INFORMATION
// //         ================================================= */}

// //         <div className="absolute left-5 top-5 rounded-2xl border border-white/30 bg-white/90 p-4 shadow-xl backdrop-blur">

// //           <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
// //             3D Architectural View
// //           </p>

// //           <h2 className="mt-1 text-lg font-bold text-slate-800">
// //             {plan.project.name}
// //           </h2>

// //           <div className="mt-3 grid grid-cols-2 gap-2 text-xs">

// //             <div className="rounded-lg bg-slate-100 px-3 py-2">
// //               <span className="block text-slate-400">
// //                 Rooms
// //               </span>

// //               <strong className="text-slate-700">
// //                 {plan.rooms.length}
// //               </strong>
// //             </div>

// //             <div className="rounded-lg bg-slate-100 px-3 py-2">
// //               <span className="block text-slate-400">
// //                 Floors
// //               </span>

// //               <strong className="text-slate-700">
// //                 {plan.project.floors}
// //               </strong>
// //             </div>

// //             <div className="rounded-lg bg-slate-100 px-3 py-2">
// //               <span className="block text-slate-400">
// //                 Doors
// //               </span>

// //               <strong className="text-slate-700">
// //                 {plan.doors.length}
// //               </strong>
// //             </div>

// //             <div className="rounded-lg bg-slate-100 px-3 py-2">
// //               <span className="block text-slate-400">
// //                 Windows
// //               </span>

// //               <strong className="text-slate-700">
// //                 {plan.windows.length}
// //               </strong>
// //             </div>

// //           </div>
// //         </div>

// //         {/* =================================================
// //             RIGHT INSPECTOR
// //         ================================================= */}

// //         <div className="absolute right-5 top-5 w-72 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-xl backdrop-blur">

// //           {selected ? (
// //             <>
// //               <div className="flex items-start justify-between">

// //                 <div>
// //                   <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
// //                     Selected Room
// //                   </p>

// //                   <h3 className="mt-1 text-lg font-bold text-slate-800">
// //                     {selected.name ||
// //                       selected.type ||
// //                       "Room"}
// //                   </h3>
// //                 </div>

// //                 <button
// //                   type="button"
// //                   onClick={() =>
// //                     setSelectedRoom(
// //                       null
// //                     )
// //                   }
// //                   className="text-slate-400 hover:text-slate-700"
// //                 >
// //                   ×
// //                 </button>

// //               </div>

// //               <div className="mt-4 space-y-2 text-sm">

// //                 <Info
// //                   label="Type"
// //                   value={
// //                     selected.type ||
// //                     "room"
// //                   }
// //                 />

// //                 <Info
// //                   label="Position"
// //                   value={`${n(
// //                     selected.x
// //                   )}, ${n(
// //                     selected.y
// //                   )}`}
// //                 />

// //                 <Info
// //                   label="Size"
// //                   value={`${n(
// //                     selected.width
// //                   )} × ${n(
// //                     selected.height
// //                   )}`}
// //                 />

// //                 <Info
// //                   label="Floor"
// //                   value={
// //                     n(
// //                       selected.floor,
// //                       0
// //                     ) + 1
// //                   }
// //                 />

// //               </div>
// //             </>
// //           ) : (
// //             <>
// //               <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
// //                 Navigation
// //               </p>

// //               <div className="mt-3 space-y-2 text-sm text-slate-600">

// //                 <p>
// //                   🖱️ Drag to rotate
// //                 </p>

// //                 <p>
// //                   🔍 Scroll to zoom
// //                 </p>

// //                 <p>
// //                   ✋ Right-click to pan
// //                 </p>

// //                 <p>
// //                   🏠 Click a room to inspect it
// //                 </p>

// //               </div>

// //               <div className="mt-5 rounded-xl bg-green-50 p-3 text-xs leading-5 text-green-800">
// //                 This 3D model is generated directly
// //                 from your DreamHouse floor-plan data.
// //               </div>
// //             </>
// //           )}

// //         </div>

// //         {/* =================================================
// //             BOTTOM STATS
// //         ================================================= */}

// //         <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/30 bg-white/90 p-2 shadow-xl backdrop-blur">

// //           <Stat
// //             label="Rooms"
// //             value={
// //               plan.rooms.length
// //             }
// //           />

// //           <Stat
// //             label="Doors"
// //             value={
// //               plan.doors.length
// //             }
// //           />

// //           <Stat
// //             label="Windows"
// //             value={
// //               plan.windows.length
// //             }
// //           />

// //           <Stat
// //             label="Furniture"
// //             value={
// //               plan.furniture.length
// //             }
// //           />

// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    SMALL UI COMPONENTS
// // ========================================================= */

// // function Info({
// //   label,
// //   value,
// // }) {
// //   return (
// //     <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">

// //       <span className="text-slate-400">
// //         {label}
// //       </span>

// //       <span className="font-medium text-slate-700">
// //         {value}
// //       </span>

// //     </div>
// //   );
// // }

// // function Stat({
// //   label,
// //   value,
// // }) {
// //   return (
// //     <div className="min-w-20 rounded-xl px-3 py-1.5 text-center">

// //       <p className="text-[10px] uppercase tracking-wider text-slate-400">
// //         {label}
// //       </p>

// //       <p className="text-sm font-bold text-slate-700">
// //         {value}
// //       </p>

// //     </div>
// //   );
// // }