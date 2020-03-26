import { Scene, Physics, Types } from "phaser";
import { Player, playerSprite } from "../player/Player";

export class MainScene extends Scene {
  private player?: Player;

  public preload() {
    this.load.spritesheet(
      playerSprite.name,
      playerSprite.spriteSheet.image,
      playerSprite.spriteSheet.frames
    );
  }

  public create() {
    this.player = new Player(this.physics.add.sprite(100, 450, playerSprite.name, 51));

    for (const [name, animation] of Object.entries(playerSprite.animations)) {
      this.anims.create({
        key: name,
        frames: this.anims.generateFrameNumbers(playerSprite.name, animation),
        frameRate: animation.rate,
        repeat: animation.repeat
      });
    }
  }

  public update() {
    const cursors = this.input.keyboard.createCursorKeys() as Cursors;

    if (this.player) {
      this.player.update(cursors);
    }

  }
}

export type Complete<T extends object> = { [K in keyof T]-?: T[K]; };
export type Cursors = Complete<Types.Input.Keyboard.CursorKeys>;
