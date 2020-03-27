import { InputState } from "./InputState";

export interface Input<T> {
  getState(input: T): InputState;
}
