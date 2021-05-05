import { BootScene } from "./scenes/boot-scene";
import { GameScene } from "./scenes/game.scene";
import { GameEndScene } from "./scenes/game-end.scene";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: 0x2a4d69,
  scale: {
    // width: 800,
    // height: 600,
    width: 1600,
    height: 1200,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // fps: {
  //   target: 10,
  //   forceSetTimeOut: true,
  // },
  scene: [BootScene, GameScene, GameEndScene],
};
