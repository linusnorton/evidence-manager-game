import { MainScene } from "./scene/MainScene";
import { Game, Types } from "phaser";

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
      debug: false,
    },
  },
  scene: [MainScene]
};

export const game = new Game(gameConfig);
