import { THREE } from "expo-three";

export class Playground {

  public camera: THREE.Camera;
  public scene: THREE.Scene;

  constructor(
    private gl: WebGLRenderingContext
  ) {
    // init camera
    const width = this.gl.drawingBufferWidth;
    const height = this.gl.drawingBufferHeight;
    const aspectRatio = width / height;

    // this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

    const cameraSize = 200;
    this.camera = new THREE.OrthographicCamera(
      -cameraSize * aspectRatio,
      cameraSize * aspectRatio,
      cameraSize, -cameraSize,
      1, 1000
    );

    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);

    // init scene
    this.scene = new THREE.Scene();

    // this.scene.add(new THREE.AxesHelper(40));
    // this.scene.add(new THREE.AmbientLight(0x444444));

    // const light = new THREE.PointLight(0xffffff, 0.8);
    // light.position.set(0, 50, 50);
    // this.scene.add(light);

    // const grid = new THREE.Mesh(
    //   new THREE.PlaneGeometry(1000, 1000, 100, 100),
    //   new THREE.MeshBasicMaterial({
    //     opacity: 0.5,
    //     wireframe: true,
    //     transparent: true,
    //   }),
    // );
    // grid.rotation.order = 'YXZ';
    // grid.rotation.y = -Math.PI / 2;
    // grid.rotation.x = -Math.PI / 2;
    // this.scene.add(grid);

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshNormalMaterial(),
    );
    this.scene.add(mesh);
  }

  update() {
    // this.camera.position.add(new THREE.Vector3(0.1, 0.1, 0.1));
  }

}
