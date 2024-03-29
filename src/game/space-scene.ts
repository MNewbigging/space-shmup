import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GameLoader } from "../loaders/game-loader";

export class SpaceScene {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private controls: OrbitControls;

  constructor(
    private renderer: THREE.WebGLRenderer,
    private gameLoader: GameLoader
  ) {
    this.setupCamera();
    this.setupLights();
    this.setupObjects();
    this.setupSkybox();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  getCamera() {
    return this.camera;
  }

  update(dt: number) {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private setupCamera() {
    this.camera.fov = 75;
    this.camera.far = 100;
    const canvas = this.renderer.domElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.position.z = 3;
    this.camera.position.y = 1;
  }

  private setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const directLight = new THREE.DirectionalLight();
    this.scene.add(directLight);
  }

  private setupObjects() {
    const axesHelper = new THREE.AxesHelper(20);
    this.scene.add(axesHelper);

    // Add ship
    const ship = this.gameLoader.modelLoader.get("ship-fighter-05");
    ship.position.x = 2;
    this.scene.add(ship);
  }

  private setupSkybox() {
    const skyboxTexture =
      this.gameLoader.modelLoader.textureLoader.get("skybox");
    if (skyboxTexture) {
      this.scene.background = skyboxTexture;
    }
  }
}
