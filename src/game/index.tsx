import { THREE } from "expo-three";

export class Playground {

  public camera: THREE.Camera;
  public scene: THREE.Scene;

  private block: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial, THREE.Object3DEventMap>;

  constructor(
    private gl: WebGLRenderingContext
  ) {
    // init camera
    const width = this.gl.drawingBufferWidth;
    const height = this.gl.drawingBufferHeight;
    const aspectRatio = width / height;

    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    // const cameraSize = 20;
    // this.camera = new THREE.OrthographicCamera(
    //   -cameraSize * aspectRatio,
    //   cameraSize * aspectRatio,
    //   cameraSize, -cameraSize,
    //   1, 1000
    // );

    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);

    // init scene
    this.scene = new THREE.Scene();

    this.block = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshNormalMaterial(),
    );
    this.scene.add(this.block);
  }

  update() {
    this.block.rotateX(Math.PI / 110);
    this.block.rotateY(Math.PI / 90);
    this.block.rotateZ(Math.PI / 70);
  }

}
