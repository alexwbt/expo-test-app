
const perlinNoise3d = require("perlin-noise-3d");

export class PerlinNoise {

  private noise = new perlinNoise3d();

  constructor(
    private octaves: number,
    private lacunarity: number,
    private persistance: number,
    private scale: number,
  ) { }

  seed(seed: number) {
    this.noise.noiseSeed(seed);
  }

  value(x: number, y: number, z: number): number {
    const pos = {
      x: x / this.scale,
      y: y / this.scale,
      z: z / this.scale,
    };

    let value = 0;
    for (let i = 0; i < this.octaves; i++) {
      pos.x *= Math.pow(this.lacunarity, i) * Math.pow(this.persistance, i);
      pos.y *= Math.pow(this.lacunarity, i) * Math.pow(this.persistance, i);
      pos.z *= Math.pow(this.lacunarity, i) * Math.pow(this.persistance, i);
      value += this.noise.get(pos.x, pos.y, pos.z) * 0.5;
    }
    return value;
    // return this.noise.get(x, y, z);
  }

}
