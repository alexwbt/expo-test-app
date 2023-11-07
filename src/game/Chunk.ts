import { THREE } from "expo-three";
import { PerlinNoise } from "./noise";

// every vertex includes position(3), normal(3) and uv(2)
const CUBE_VERTICES = [
  // Back face
  -0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 1.0, // Bottom-left
  0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 1.0, // bottom-right
  0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 0.0, // top-right
  0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 0.0, // top-right
  -0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 0.0, // top-left
  -0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 1.0, // bottom-left
  // Front face
  -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 1.0, // bottom-left
  0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 0.0, // top-right
  0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 1.0, // bottom-right
  0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 0.0, // top-right
  -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 1.0, // bottom-left
  -0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0, // top-left
  // Left face
  -0.5, 0.5, 0.5, -1.0, 0.0, 0.0, 0.0, 0.0, // top-right
  -0.5, -0.5, -0.5, -1.0, 0.0, 0.0, 1.0, 1.0, // bottom-left
  -0.5, 0.5, -0.5, -1.0, 0.0, 0.0, 1.0, 0.0, // top-left
  -0.5, -0.5, -0.5, -1.0, 0.0, 0.0, 1.0, 1.0, // bottom-left
  -0.5, 0.5, 0.5, -1.0, 0.0, 0.0, 0.0, 0.0, // top-right
  -0.5, -0.5, 0.5, -1.0, 0.0, 0.0, 0.0, 1.0, // bottom-right
  // Right face
  0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0, // top-left
  0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 0.0, // top-right
  0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 1.0, // bottom-right
  0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 1.0, // bottom-right
  0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 1.0, // bottom-left
  0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0, // top-left
  // Bottom face
  -0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.0, 1.0, // top-right
  0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 1.0, 0.0, // bottom-left
  0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 1.0, 1.0, // top-left
  0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 1.0, 0.0, // bottom-left
  -0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.0, 1.0, // top-right
  -0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 0.0, 0.0, // bottom-right
  // Top face
  -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0, // top-left
  0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0, // top-right
  0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0, // bottom-right
  0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0, // bottom-right
  -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 0.0, // bottom-left
  -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0,  // top-left
];

const generateVertices = (data: number[][][], size: number) => {
  const outputVertices: number[] = [];

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        if (!data[x][y][z]) continue;

        for (let face = 0; face < 6; face++) {
          // the coordinates next to this face
          const ix = x + CUBE_VERTICES[face * 6 * 8 + 3];
          const iy = y + CUBE_VERTICES[face * 6 * 8 + 4];
          const iz = z + CUBE_VERTICES[face * 6 * 8 + 5];

          // don't create a face if that block is inbound and has data
          if (
            ix >= 0 && ix < size &&
            iy >= 0 && iy < size &&
            iz >= 0 && iz < size &&
            !!data[ix][iy][iz]
          ) continue;

          // create face
          for (let vert = 0; vert < 6; vert++) {
            const i = face * 6 + vert; 4
            outputVertices.push(
              // position
              x + CUBE_VERTICES[i * 8],
              y + CUBE_VERTICES[i * 8 + 1],
              z + CUBE_VERTICES[i * 8 + 2],
              // normal
              // CUBE_VERTICES[i * 8 + 3],
              // CUBE_VERTICES[i * 8 + 4],
              // CUBE_VERTICES[i * 8 + 5],
            );
          }
        }
      }
    }
  }

  return outputVertices;
};

const NOISE = new PerlinNoise(3, 2, 0.5, 20);
NOISE.seed(Date.now());

const generateData = (
  size: number,
  offset: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
) => {
  const data: number[][][] = [];
  for (let x = 0; x < size; x++) {
    data[x] = [];
    for (let y = 0; y < size; y++) {
      data[x][y] = [];
      for (let z = 0; z < size; z++) {
        data[x][y][z] = NOISE.value(offset.x + x, offset.y + y, offset.z + z) > 0.5 ? 1 : 0;
      }
    }
  }
  return data;
};

export default class Chunk {

  private geometry: THREE.BufferGeometry;

  constructor() {
    this.geometry = new THREE.BufferGeometry();

    const size = 10;
    const data = generateData(size);
    const vertices = generateVertices(data, size);

    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    this.geometry.computeVertexNormals();
  }

  getGeometry() {
    return this.geometry;
  }

}
