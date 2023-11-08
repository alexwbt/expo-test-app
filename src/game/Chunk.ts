import { THREE } from "expo-three";
import { PerlinNoise } from "./noise";
import { textures } from "./asset";

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

const BLOCK_FACE_TEXTURE_INDEX = [
  [0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1],
  [3, 3, 3, 3, 1, 2],
];

const generateVertices = (data: number[][][], size: number) => {
  const output = {
    positions: [] as number[],
    normals: [] as number[],
    uv: [] as number[],
  };

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
            output.positions.push(
              x + CUBE_VERTICES[i * 8],
              y + CUBE_VERTICES[i * 8 + 1],
              z + CUBE_VERTICES[i * 8 + 2],
            );
            // output.normals.push(
            //   CUBE_VERTICES[i * 8 + 3],
            //   CUBE_VERTICES[i * 8 + 4],
            //   CUBE_VERTICES[i * 8 + 5],
            // );

            const textureTile = BLOCK_FACE_TEXTURE_INDEX[data[x][y][z] - 1][face];
            const textureTileX = Math.round(textureTile % 10);
            const textureTileY = Math.round(textureTile / 10);

            output.uv.push(
              (textureTileX + (CUBE_VERTICES[i * 8 + 6] - 0.5) * 0.96 + 0.5),
              // flipY
              1 - (textureTileY + (CUBE_VERTICES[i * 8 + 7] - 0.5) * 0.96 + 0.5),
            );
          }
        }
      }
    }
  }

  return output;
};

const NOISE = new PerlinNoise(3, 2, 0.5, 30);
// NOISE.seed(Date.now());

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
        const value = NOISE.value(offset.x + x, offset.y + y, offset.z + z);
        if (value > y / size) {
          if (value > (y / size) * 2)
            data[x][y][z] = 1;
          else
            data[x][y][z] = 2;
        } else
          data[x][y][z] = 0;
        // data[x][y][z] = (NOISE.value(offset.x + x, offset.y + y, offset.z + z) > (y / size)) ? 1 : 0;

        // data[x][y][z] = 1;
        // const o = size / 2;
        // data[x][y][z] = (
        //   Math.pow(x - o, 2) +
        //   Math.pow(y - o, 2) +
        //   Math.pow(z - o, 2) <
        //   Math.pow(o / 2, 2)
        // ) ? 1 : 0;
      }
    }
  }
  for (let x = 0; x < size; x++)
    for (let y = 0; y < size; y++)
      for (let z = 0; z < size; z++)
        if (data[x][y][z])
          if (y >= size - 1 || (y < size - 1 && !data[x][y + 1][z]))
            data[x][y][z] = 3;
  // else if (y == size - 1)
  //   // data[x][y][z] = (NOISE.value(offset.x + x, offset.y + y + 1, offset.z + z) > (y / size)) ? 1 : 3;
  //   data[x][y][z] = 3;
  return data;
};

export default class Chunk {

  private data: number[][][] = [];
  private mesh: THREE.Mesh = new THREE.Mesh();

  constructor(
    public x: number,
    public y: number,
    public z: number,
    public size: number,
  ) {
    this.generateData();
    this.updateMesh();
  }

  generateData() {
    this.data = generateData(this.size, {
      x: this.x,
      y: this.y,
      z: this.z,
    });
  }

  updateMesh() {
    this.mesh.geometry = new THREE.BufferGeometry()
    this.mesh.material = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
      map: textures.chunk,
      metalness: 0,
    });
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.mesh.position.set(this.x, this.y, this.z);

    const { positions, uv } = generateVertices(this.data, this.size);

    this.mesh.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    this.mesh.geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    this.mesh.geometry.computeVertexNormals();
  }

  getMesh() {
    return this.mesh;
  }

}
