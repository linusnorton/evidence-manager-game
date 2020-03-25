import { Cursors } from "../scene/MainScene";

export const playerSprite = {
  name: "justine",
  spriteSheet: {
    image: "image/sprite/justine.png",
    frames: { frameWidth: 96, frameHeight: 96 },
  },
  animations: {
    walkSideways: {
      start: 0,
      end: 4,
      rate: 10,
      repeat: -1
    }
  }
};

export class Player {
  private direction = Direction.RIGHT;

  constructor(
    private readonly sprite: Phaser.GameObjects.Sprite
  ) { }

  public update(cursors: Cursors) {
    if (cursors.left.isDown) {
      if (this.direction !== Direction.LEFT) {
        this.sprite.toggleFlipX();
        this.direction = Direction.LEFT;
      }

      this.sprite.x--;
      this.sprite.anims.play("walkSideways", true);
    }
    else if (cursors.right.isDown) {
      if (this.direction !== Direction.RIGHT) {
        this.sprite.toggleFlipX();
        this.direction = Direction.RIGHT;
      }

      this.sprite.x++;
      this.sprite.anims.play("walkSideways", true);
    }
    else {
      this.sprite.anims.stop();
    }
  }

}

enum Direction {
  UP, DOWN, LEFT, RIGHT
}

