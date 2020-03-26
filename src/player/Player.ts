import { Cursors } from "../scene/MainScene";
import { Physics } from "phaser";

export const playerConfig = {
  name: "justine",
  spriteSheet: {
    image: "image/sprite/characters.png",
    frames: { frameWidth: 72, frameHeight: 96 },
  },
  animations: {
    walkLeft: {
      start: 63,
      end: 65,
      rate: 10,
      repeat: -1
    },
    walkRight: {
      start: 75,
      end: 77,
      rate: 10,
      repeat: -1
    },
    walkUp: {
      start: 87,
      end: 89,
      rate: 10,
      repeat: -1
    },
    walkDown: {
      start: 51,
      end: 53,
      rate: 10,
      repeat: -1
    }
  }
};

export class Player {
  private readonly SPEED = 200;

  constructor(
    private readonly sprite: Physics.Arcade.Sprite
  ) { }

  public update(cursors: Cursors) {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    const possibleAnimations = [] as string[];

    if (cursors.left.isDown) {
      this.sprite.body.velocity.x = -this.SPEED;
      possibleAnimations.push("walkLeft");
    }
    if (cursors.right.isDown) {
      this.sprite.body.velocity.x = this.SPEED;
      possibleAnimations.push("walkRight");
    }
    if (cursors.down.isDown) {
      this.sprite.body.velocity.y = this.SPEED;
      possibleAnimations.push("walkDown");
    }
    if (cursors.up.isDown) {
      this.sprite.body.velocity.y = -this.SPEED;
      possibleAnimations.push("walkUp");
    }

    this.sprite.body.velocity.normalize().scale(this.SPEED);

    if (possibleAnimations.length === 0) {
      this.sprite.anims.stop();
    }
    else {
      const currentAnimation = this.sprite.anims.getCurrentKey();

      if (possibleAnimations.includes(currentAnimation)) {
        this.sprite.anims.play(currentAnimation, true);
      }
      else {
        this.sprite.anims.play(possibleAnimations[0], true);
      }
    }
  }

}

