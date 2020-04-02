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
    this.load.image("decorativeTiles", "image/background/decorative2x.png");
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
    const collidableTileMaps = this.loadTileMaps();
    const playerSprite = this.loadSprite(playerConfig);
    const weaponSprite = this.loadSprite(weaponConfig);
    const playerContainer = this.add.container(100, 450, [playerSprite, weaponSprite]) as ContainerWithBody;

    this.physics.add.existing(playerContainer);
    this.player = new Player(playerSprite, weaponSprite, playerContainer);

    for (const map of collidableTileMaps) {
      this.physics.add.collider(playerContainer, map);
    }

    this.cameras.main.startFollow(playerContainer, true, 0.05, 0.05);
    this.cameras.main.setBounds(0, 0, collidableTileMaps[0].width, collidableTileMaps[0].height);
    this.physics.world.setBounds(0, 0, collidableTileMaps[0].width, collidableTileMaps[0].height);
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

  private loadTileMaps(): Tilemaps.StaticTilemapLayer[] {
    const map = this.make.tilemap({ key: "backgroundMap" });
    const tileset1 = map.addTilesetImage("mainlevbuild2x", "backgroundTiles");
    const tileset2 = map.addTilesetImage("decorative", "decorativeTiles");

    map.createStaticLayer("Ground1", tileset1, 0, 0);
    map.createStaticLayer("Ground2", tileset2, 0, 0);

    const mid1 = map.createStaticLayer("Mid1", tileset1, 0, 0);
    mid1.setCollisionByProperty({ collides: true });
    this.enableCollisionMap(mid1);

    const mid2 = map.createStaticLayer("Mid2", tileset2, 0, 0);
    mid1.setCollisionByProperty({ collides: true });
    this.enableCollisionMap(mid2);

    const above1 = map.createStaticLayer("Above1", tileset1, 0, 0);
    above1.depth = 2;
    const above2 = map.createStaticLayer("Above2", tileset2, 0, 0);
    above2.depth = 2;

    return [mid1, mid2];
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
