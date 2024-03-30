import * as THREE from "three";
import { GameLoader } from "../loaders/game-loader";

export class AsteroidManager {
  private asteroids: THREE.Object3D[] = [];
  private timeToNextAsteroid = 1;

  constructor(private gameLoader: GameLoader, private scene: THREE.Scene) {}

  update(dt: number) {
    // Count down spawn timers
    this.timeToNextAsteroid -= dt;

    if (this.timeToNextAsteroid <= 0) {
      this.spawnAsteroid();
      this.resetAsteroidSpawnTimer();
    }
  }

  private spawnAsteroid() {
    // Get random asteroid of 5 available
    const rnd = Math.floor(Math.random() * 5);
    const asteroid = this.gameLoader.modelLoader.get(`asteroid-0${rnd}`);

    // Set random start position
    asteroid.position.x = Math.random() * 30;
    asteroid.position.z = -5;

    // How do I know where to place the asteroids?

    // If the zoom and screen is fixed, I can hardcode the range
    // Ideally I'd like the zoom to change

    // Also need to consider:
    //
  }

  private resetAsteroidSpawnTimer() {
    this.timeToNextAsteroid = 1;
  }
}
