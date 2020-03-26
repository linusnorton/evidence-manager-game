import { Cursors } from "../scene/MainScene";

export const playerSprite = {
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

  constructor(
    private readonly sprite: Phaser.GameObjects.Sprite
  ) { }

  public update(cursors: Cursors) {
    const possibleAnimations = [] as string[];

    if (cursors.left.isDown) {
      this.sprite.x -= 2;
      possibleAnimations.push("walkLeft");
    }
    if (cursors.right.isDown) {
      this.sprite.x += 2;
      possibleAnimations.push("walkRight");
    }
    if (cursors.down.isDown) {
      this.sprite.y += 2;
      possibleAnimations.push("walkDown");
    }
    if (cursors.up.isDown) {
      this.sprite.y -= 2;
      possibleAnimations.push("walkUp");
    }

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

