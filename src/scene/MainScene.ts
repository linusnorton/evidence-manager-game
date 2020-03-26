import { Scene, Physics, Types, Tilemaps } from "phaser";
import { Player, playerConfig } from "../player/Player";

export class MainScene extends Scene {
  private player?: Player;

  public preload() {
    this.load.image("backgroundTiles", "image/background/mainlevbuild2x.png");
    this.load.tilemapTiledJSON("backgroundMap", "map/main.json");
    this.load.spritesheet(
      playerConfig.name,
      playerConfig.spriteSheet.image,
      playerConfig.spriteSheet.frames
    );
  }

  public create() {
    const map = this.make.tilemap({ key: "backgroundMap" });
    const tileset = map.addTilesetImage("mainlevbuild2x", "backgroundTiles");
    const floor = map.createStaticLayer("Floor", tileset, 0, 0);
    const walls = map.createStaticLayer("Walls", tileset, 0, 0);
    walls.setCollisionByProperty({ collides: true });

    const playerSprite = this.physics.add.sprite(100, 450, playerConfig.name, 51);
    this.player = new Player(playerSprite);

    for (const [name, animation] of Object.entries(playerConfig.animations)) {
      this.anims.create({
        key: name,
        frames: this.anims.generateFrameNumbers(playerConfig.name, animation),
        frameRate: animation.rate,
        repeat: animation.repeat
      });
    }

    map.createStaticLayer("Above", tileset, 0, 0);

    this.physics.add.collider(playerSprite, walls);
    playerSprite.setCollideWorldBounds(true);

    this.cameras.main.startFollow(playerSprite, true, 0.05, 0.05);
    this.enableCollisionMap(walls);

    this.cameras.main.setBounds(0, 0, floor.width, floor.height);
    this.physics.world.setBounds(0, 0, floor.width, floor.height);

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
    const cursors = this.input.keyboard.createCursorKeys() as Cursors;

    if (this.player) {
      this.player.update(cursors);
    }

  }
}

export type Complete<T extends object> = { [K in keyof T]-?: T[K]; };
export type Cursors = Complete<Types.Input.Keyboard.CursorKeys>;
