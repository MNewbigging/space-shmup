import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GameLoader } from "../loaders/game-loader";
import { KeyboardListener } from "../listeners/keyboard-listener";

export class SpaceScene {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private controls: OrbitControls;

  private player: THREE.Object3D;

  constructor(
    private renderer: THREE.WebGLRenderer,
    private gameLoader: GameLoader,
    private keyboardListener: KeyboardListener
  ) {
    this.setupCamera();
    this.setupLights();
    this.setupObjects();
    this.setupSkybox();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Setup player here to satisfy compiler that it exists
    this.player = this.gameLoader.modelLoader.get("ship-fighter-05");
    this.player.rotateY(Math.PI);
    this.scene.add(this.player);
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
    this.camera.position.y = 20;
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
  }

  private setupSkybox() {
    const skyboxTexture =
      this.gameLoader.modelLoader.textureLoader.get("skybox");
    if (skyboxTexture) {
      this.scene.background = skyboxTexture;
    }
  }
}
