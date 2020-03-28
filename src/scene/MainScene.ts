import { GameObjects, Physics, Scene, Tilemaps, Types } from "phaser";
import { Player, playerConfig, weaponConfig } from "../player/Player";
import { ControllerInput } from "../input/ControllerInput";
import { KeyboardInput } from "../input/KeyboardInput";

export class MainScene extends Scene {
  private readonly keyboardInput = new KeyboardInput();
  private readonly controllerInput = new ControllerInput();
  private player?: Player;
  private cursors?: Cursors;

  public preload() {
    this.load.image("backgroundTiles", "image/background/mainlevbuild2x.png");
    this.load.tilemapTiledJSON("backgroundMap", "map/main.json");
    this.load.spritesheet(
      playerConfig.name,
      playerConfig.spriteSheet.image,
      playerConfig.spriteSheet.frames
    );
    this.load.spritesheet(
      weaponConfig.name,
      weaponConfig.spriteSheet.image,
      weaponConfig.spriteSheet.frames
    );
  }

  public create() {
    const map = this.make.tilemap({ key: "backgroundMap" });
    const tileset = map.addTilesetImage("mainlevbuild2x", "backgroundTiles");
    const floor = map.createStaticLayer("Floor", tileset, 0, 0);
    const walls = map.createStaticLayer("Walls", tileset, 0, 0);
    walls.setCollisionByProperty({ collides: true });

    const playerSprite = this.loadSprite(playerConfig);
    const weaponSprite = this.loadSprite(weaponConfig);
    const playerContainer = this.add.container(100, 450, [playerSprite, weaponSprite]) as ContainerWithBody;

    this.physics.add.existing(playerContainer);
    this.player = new Player(playerSprite, weaponSprite, playerContainer);

    const above = map.createStaticLayer("Above", tileset, 0, 0);
    above.depth = 2;

    this.physics.add.collider(playerContainer, walls);
    this.enableCollisionMap(walls);

    this.cameras.main.startFollow(playerContainer, true, 0.05, 0.05);
    this.cameras.main.setBounds(0, 0, floor.width, floor.height);
    this.physics.world.setBounds(0, 0, floor.width, floor.height);
    this.cursors = this.input.keyboard.createCursorKeys() as Cursors;
  }

  private loadSprite(configuration: SpriteConfiguration): Physics.Arcade.Sprite {
    const sprite = this.physics.add.sprite(0, 0, configuration.name, configuration.idleTile);

    for (const [name, animation] of Object.entries(configuration.animations)) {
      this.anims.create({
        key: name,
        frames: this.anims.generateFrameNumbers(configuration.name, animation),
        frameRate: animation.rate,
        repeat: animation.repeat
      });
    }

    return sprite;
  }

  private enableCollisionMap(walls: Tilemaps.StaticTilemapLayer) {
    if (this.game.config.physics.arcade!.debug) {
      const debugGraphics = this.add.graphics().setAlpha(0.75);
      walls.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });
    }
  }

  public update() {
    if (!this.player || !this.cursors) {
      return;
    }

    const input = this.input.gamepad.pad1
      ? this.controllerInput.getState(this.input.gamepad.pad1)
      : this.keyboardInput.getState(this.cursors);

    this.player.update(input);
  }
}

export type Complete<T extends object> = { [K in keyof T]-?: T[K]; };
export type Cursors = Complete<Types.Input.Keyboard.CursorKeys>;

export interface ContainerWithBody extends GameObjects.Container {
  body: Physics.Arcade.Body
}

export interface SpriteConfiguration {
  name: string,
  spriteSheet: {
    image: string,
    frames: {
      frameWidth: number,
      frameHeight: number
    },
  },
  idleTile: number,
  animations: Record<string, AnimationConfiguration>
}

export interface AnimationConfiguration {
  start: number,
  end: number,
  rate: number,
  repeat: number
}
