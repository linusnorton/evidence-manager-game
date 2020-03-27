import { Scene, Tilemaps, Types } from "phaser";
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

    const playerSprite = this.physics.add.sprite(100, 450, playerConfig.name, 51);
    const weaponSprite = this.physics.add.sprite(100, 450, weaponConfig.name, 0);
    this.player = new Player(playerSprite, weaponSprite);

    for (const [name, animation] of Object.entries(playerConfig.animations)) {
      this.anims.create({
        key: name,
        frames: this.anims.generateFrameNumbers(playerConfig.name, animation),
        frameRate: animation.rate,
        repeat: animation.repeat
      });
    }

    const above = map.createStaticLayer("Above", tileset, 0, 0);
    above.depth = 1;

    this.physics.add.collider(playerSprite, walls);
    this.enableCollisionMap(walls);

    this.cameras.main.startFollow(playerSprite, true, 0.05, 0.05);
    this.cameras.main.setBounds(0, 0, floor.width, floor.height);
    this.physics.world.setBounds(0, 0, floor.width, floor.height);
    this.cursors = this.input.keyboard.createCursorKeys() as Cursors;
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
