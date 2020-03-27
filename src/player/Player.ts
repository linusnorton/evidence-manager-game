import { Cursors } from "../scene/MainScene";
import { Physics } from "phaser";
import { InputState } from "../input/InputState";

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
    sprite.body.setSize(40, 45);
    sprite.body.setOffset(15, 55);
  }

  public update(input: InputState) {
    const speed = input.run ? this.SPEED * 2 : this.SPEED;
    const animationRate = input.run ? 20 : 10;
    const possibleAnimations = [] as string[];

    this.sprite.setVelocity(0);
    this.sprite.anims.frameRate = animationRate;

    if (input.left) {
      this.sprite.setVelocityX(speed * input.left);
      possibleAnimations.push("walkLeft");
    }
    if (input.right) {
      this.sprite.setVelocityX(speed * input.right);
      possibleAnimations.push("walkRight");
    }
    if (input.down) {
      this.sprite.setVelocityY(speed * input.down);
      possibleAnimations.push("walkDown");
    }
    if (input.up) {
      this.sprite.setVelocityY(speed * input.up);
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

