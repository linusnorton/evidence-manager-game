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
  ) {
    sprite.body.setSize(40, 40);
    sprite.body.setOffset(15, 60);
  }

  public update(cursors: Cursors) {
    const speed = cursors.shift.isDown ? this.SPEED * 2 : this.SPEED;
    const animationRate = cursors.shift.isDown ? 20 : 10;
    const possibleAnimations = [] as string[];

    this.sprite.setVelocity(0);
    this.sprite.anims.frameRate = animationRate;

    if (cursors.left.isDown) {
      this.sprite.setVelocityX(-speed);
      possibleAnimations.push("walkLeft");
    }
    if (cursors.right.isDown) {
      this.sprite.setVelocityX(speed);
      possibleAnimations.push("walkRight");
    }
    if (cursors.down.isDown) {
      this.sprite.setVelocityY(speed);
      possibleAnimations.push("walkDown");
    }
    if (cursors.up.isDown) {
      this.sprite.setVelocityY(-speed);
      possibleAnimations.push("walkUp");
    }

    this.sprite.body.velocity.normalize().scale(speed);

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

