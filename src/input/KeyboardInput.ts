import { Cursors } from "../scene/MainScene";
import { InputState } from "./InputState";
import { Input } from "./Input";

export class KeyboardInput implements Input<Cursors> {

  public getState(keyboard: Cursors): InputState {
    return {
      up: keyboard.up.isDown ? -1 : 0,
      down: keyboard.down.isDown ? 1 : 0,
      left: keyboard.left.isDown ? -1 : 0,
      right: keyboard.right.isDown ? 1 : 0,
      run: keyboard.shift.isDown
    }
  }

}