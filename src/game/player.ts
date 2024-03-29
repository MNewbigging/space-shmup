import * as THREE from "three";
import { KeyboardListener } from "../listeners/keyboard-listener";
import { clamp, lerp } from "three/src/math/MathUtils";

export class Player {
  direction = new THREE.Vector3(0, 0, 0);
  acceleration = new THREE.Vector3(1, 0, 1);
  velocity = new THREE.Vector3();
  speed = 10;

  rampValue = 0;
  rampDir = 0;
  rampSpeed = 2;

  constructor(
    public ship: THREE.Object3D,
    private keyboardListener: KeyboardListener
  ) {}

  setup() {
    // Face the right way
    this.ship.rotateY(Math.PI);

    // Add input listeners
    this.keyboardListener.on("a", this.onPressLeft);
    this.keyboardListener.onRelease("a", this.onReleaseLeft);
    this.keyboardListener.on("d", this.onPressRight);
    this.keyboardListener.onRelease("d", this.onReleaseRight);

    this.keyboardListener.on("w", this.onPressW);
    this.keyboardListener.onRelease("w", this.onReleaseW);
  }

  update(dt: number) {
    // Work out velocity
    this.velocity.copy(
      this.ship.position.add(
        this.direction
          .clone()
          .multiply(this.acceleration)
          .multiplyScalar(this.speed * dt)
      )
    );

    // Ramp
    const newRampValue = this.rampValue + dt * this.rampDir * this.rampSpeed;
    this.rampValue = clamp(newRampValue, 0, 5);
    this.ship.position.y = this.rampValue;
    console.log("ramp value", this.rampValue);
  }

  private onPressW = () => {
    this.rampDir = 1;
  };

  private onReleaseW = () => {
    this.rampDir = -1;
  };

  private onPressLeft = () => {
    this.rampSpeed = 1;
    // Set direction
    //this.direction.x = -1;
    // Start ramping up speed
  };

  private onReleaseLeft = () => {
    // Start ramping down speed
  };

  private onPressRight = () => {
    //this.direction.x = 1;
    this.rampSpeed = 5;
  };

  private onReleaseRight = () => {
    //
  };
}
