import * as Phaser from "phaser";
import { MainScene } from "./scene/MainScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Sample",
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
      debug: true,
    },
  },
  scene: [MainScene]
};

export const game = new Phaser.Game(gameConfig);
