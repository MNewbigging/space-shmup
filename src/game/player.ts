import * as THREE from "three";
import { KeyboardListener } from "../listeners/keyboard-listener";
import { clamp } from "three/src/math/MathUtils";
import { easeInCubic, easeInOutSine, easeInSine } from "../utils/math";

export class Player {
  direction = new THREE.Vector3();
  acceleration = new THREE.Vector3();
  accelerationRampTime = new THREE.Vector3();
  accelerationRampDir = new THREE.Vector3();
  velocity = new THREE.Vector3();
  effectiveSpeed = new THREE.Vector3();
  speed = 20;

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
    this.keyboardListener.on("w", this.onPressForward);
    this.keyboardListener.onRelease("w", this.onReleaseForward);
    this.keyboardListener.on("s", this.onPressBackward);
    this.keyboardListener.onRelease("s", this.onReleaseBackward);
  }

  update(dt: number) {
    // Ramp timer ticks along according to ramp direction - dt is tick rate for now
    this.accelerationRampTime.add(
      this.accelerationRampDir.clone().multiplyScalar(dt)
    );

    // Clamp it between 0 and 1
    this.accelerationRampTime.clampScalar(0, 1);

    // Feed into easing function to get acceleration
    this.acceleration.set(
      easeInOutSine(this.accelerationRampTime.x),
      easeInOutSine(this.accelerationRampTime.y),
      easeInOutSine(this.accelerationRampTime.z)
    );

    // Effective takes into account acceleration modifier and delta time
    this.effectiveSpeed.copy(
      this.acceleration.clone().multiplyScalar(this.speed * dt)
    );

    // Velocity is direction * effective speed
    this.velocity = this.direction.clone().multiply(this.effectiveSpeed);

    // Add to current position
    this.ship.position.add(this.velocity);
  }

  private onPressForward = () => {
    // Now moving forwards
    this.direction.z = -1;
    // Ensure acceleration ramp direction is moving fowards
    this.accelerationRampDir.z = 1;
  };

  private onReleaseForward = () => {
    // If moving forwards
    if (this.direction.z === -1) {
      // Can decelerate
      this.accelerationRampDir.z = -1;
    }
  };

  private onPressBackward = () => {
    // Now moving backwards
    this.direction.z = 1;
    // Ensure acceleration ramp direction is moving fowards
    this.accelerationRampDir.z = 1;
  };

  private onReleaseBackward = () => {
    // If moving backwards
    if (this.direction.z === 1) {
      // Can decelerate
      this.accelerationRampDir.z = -1;
    }
  };

  private onPressLeft = () => {
    // Now moving left
    this.direction.x = -1;
    // Ensure acceleration ramp direction is moving fowards
    this.accelerationRampDir.x = 1;
  };

  private onReleaseLeft = () => {
    // If moving left
    if (this.direction.x === -1) {
      // Can decelerate
      this.accelerationRampDir.x = -1;
    }
  };

  private onPressRight = () => {
    // Now moving right
    this.direction.x = 1;
    // Ensure acceleration ramp direction is moving fowards
    this.accelerationRampDir.x = 1;
  };

  private onReleaseRight = () => {
    // If moving right
    if (this.direction.x === 1) {
      this.accelerationRampDir.x = -1;
    }
  };

  /**
   * On pressing a direction button:
   *
   * - Ramp up direction should be positive
   * - If moving in opposite direction, overrides previous opposite direction
   * - E.g if holding & moving right, then press left - should stop moving right and move left
   *
   * On moving in opposite direction / moving in direction not currently moving in
   *
   * - Ramp up time should be lowered to achieve a sort of speed up effect
   * - Ideally done based on axis, not across everything
   * - E.g if moving left and pressing forward, forward momentum has ramp up but left has already ramped up
   *
   * On releasing all buttons for a particular input direction:
   *
   * - Ramp up direction should be negative for the given input direction value
   */
}
