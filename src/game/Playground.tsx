import { THREE } from "expo-three";
import Chunk from "./Chunk";

export default class Playground {

  public camera: THREE.Camera;
  public scene: THREE.Scene;

  // private block: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial, THREE.Object3DEventMap>;

  // private chunk: Chunk;

  constructor(
    private gl: WebGLRenderingContext
  ) {
    // init camera
    const width = this.gl.drawingBufferWidth;
    const height = this.gl.drawingBufferHeight;
    const aspectRatio = width / height;

    // this.camera = new THREE.PerspectiveCamera(70, aspectRatio, 0.1, 1000);
    const cameraSize = 20;
    this.camera = new THREE.OrthographicCamera(
      -cameraSize * aspectRatio,
      cameraSize * aspectRatio,
      cameraSize, -cameraSize,
      -20, 1000
    );

    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);

    // init scene
    this.scene = new THREE.Scene();

    // this.block = new THREE.Mesh(
    //   new THREE.BoxGeometry(10, 10, 10),
    //   new THREE.MeshNormalMaterial(),
    // );
    // this.scene.add(this.block);

    // this.chunk = new Chunk(0, 0, 0, 10);
    // this.scene.add(this.chunk.getMesh());

    // for (let x = -1; x <= 1; x++) {
    //   for (let y = -1; y <= 1; y++) {
    //     const chunk = new Chunk(x * 10, 0, y * 10, 10);
    //     this.scene.add(chunk.getMesh());
    //   }
    // }
    const chunk = new Chunk(0, 0, 0, 10);
    this.scene.add(chunk.getMesh());

    this.scene.add(new THREE.AmbientLight("white", 0.4));

    const light = new THREE.PointLight(0xffffff);
    light.castShadow = true;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 1024 * 4;
    light.shadow.mapSize.height = 1024 * 4;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;

    light.position.set(0, 50, 50);
    this.scene.add(light);
  }

  update() {

  }

}
