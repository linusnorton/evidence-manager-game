import { Physics, GameObjects } from "phaser";
import { InputState } from "../input/InputState";
import { ContainerWithBody } from "../scene/MainScene";

export const playerConfig = {
  name: "justine",
  spriteSheet: {
    image: "image/sprite/characters.png",
    frames: { frameWidth: 72, frameHeight: 96 },
  },
  idleTile: 51,
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

export const weaponConfig = {
  name: "justine-hammer",
  spriteSheet: {
    image: "image/sprite/hammer.png",
    frames: { frameWidth: 32, frameHeight: 48 },
  },
  idleTile: 0,
  animations: {}
};

export class Player {
  private readonly SPEED = 200;

  constructor(
    private readonly character: Physics.Arcade.Sprite,
    private readonly weapon: Physics.Arcade.Sprite,
    private readonly container: ContainerWithBody
) {
    character.setPosition(20, -12);
    weapon.setPosition(6, -10);
    container.depth = 1;
    container.body.setCollideWorldBounds(true);
    container.body.setSize(40, 35);
  }

  public update(input: InputState) {
    const speed = input.run ? this.SPEED * 2 : this.SPEED;
    const animationRate = input.run ? 20 : 10;
    const possibleAnimations = [] as string[];

    this.container.body.setVelocity(0);
    this.character.anims.frameRate = animationRate;

    if (input.left) {
      this.container.body.setVelocityX(speed * input.left);
      possibleAnimations.push("walkLeft");
    }
    if (input.right) {
      this.container.body.setVelocityX(speed * input.right);
      possibleAnimations.push("walkRight");
    }
    if (input.down) {
      this.container.body.setVelocityY(speed * input.down);
      possibleAnimations.push("walkDown");
    }
    if (input.up) {
      this.container.body.setVelocityY(speed * input.up);
      possibleAnimations.push("walkUp");
    }

    this.container.body.velocity.normalize().scale(speed);

    if (possibleAnimations.length === 0) {
      this.character.anims.stop();
    }
    else {
      const currentAnimation = this.character.anims.getCurrentKey();

      if (possibleAnimations.includes(currentAnimation)) {
        this.character.anims.play(currentAnimation, true);
      }
      else {
        if (possibleAnimations[0] === "walkLeft"){
          this.weapon.setPosition(10, -10);
          this.container.sendToBack(this.weapon);
        }
        else if (possibleAnimations[0] === "walkUp") {
          this.weapon.setPosition(30, -10);
          this.container.sendToBack(this.weapon);
        }
        else if (possibleAnimations[0] === "walkRight") {
          this.weapon.setPosition(25, -10);
          this.container.sendToBack(this.character);
        }
        else if (possibleAnimations[0] === "walkDown") {
          this.weapon.setPosition(6, -10);
          this.container.sendToBack(this.character);
        }

        this.character.anims.play(possibleAnimations[0], true);
      }
    }
  }

}
