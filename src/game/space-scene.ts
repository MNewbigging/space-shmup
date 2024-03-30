import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GameLoader } from "../loaders/game-loader";
import { KeyboardListener } from "../listeners/keyboard-listener";
import { Player } from "./player";
import { AsteroidManager } from "./asteroid-manager";

export class SpaceScene {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private controls: OrbitControls;

  private player: Player;
  private asteroidManager: AsteroidManager;

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
    const playerShip = this.gameLoader.modelLoader.get("ship-fighter-05");
    this.player = new Player(playerShip, this.keyboardListener);
    this.player.setup();
    this.scene.add(this.player.ship);

    this.asteroidManager = new AsteroidManager(this.gameLoader, this.scene);
  }

  getCamera() {
    return this.camera;
  }

  update(dt: number) {
    this.controls.update();

    this.player.update(dt);

    this.renderer.render(this.scene, this.camera);
  }

  private setupCamera() {
    this.camera.fov = 75;
    this.camera.far = 500;
    const canvas = this.renderer.domElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.position.z = 3;
    this.camera.position.y = 50;
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
