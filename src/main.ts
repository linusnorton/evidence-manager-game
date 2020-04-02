import { MainScene } from "./scene/MainScene";
import { Game, Types } from "phaser";

declare var window;

const gameConfig: Types.Core.GameConfig = {
  title: "Evidence Manager - Distributing Justice",
  parent: "game",
  backgroundColor: "#000000",
  type: Phaser.AUTO,
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [MainScene],
  input: { gamepad: true }
};

export const game = new Game(gameConfig);
