import * as Phaser from "phaser";
import { InputState } from "./InputState";
import { Input } from "./Input";

export class ControllerInput implements Input<Phaser.Input.Gamepad.Gamepad> {

  public getState(controller: Phaser.Input.Gamepad.Gamepad): InputState {
    return {
      up: Math.min(0, this.round(controller.leftStick.y)),
      down: Math.max(0, this.round(controller.leftStick.y)),
      left: Math.min(0, this.round(controller.leftStick.x)),
      right: Math.max(0, this.round(controller.leftStick.x)),
      run: controller.A
    }
  }

  private round(number: number): number {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  }

}