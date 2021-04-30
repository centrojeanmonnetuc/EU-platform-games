import { BootScene } from "./scenes/boot-scene";
import { GameScene } from "./scenes/game.scene";
import { GameWinScene } from "./scenes/game-win.scene";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: 0x2a4d69,
  scale: {
    width: 1200,
    height: 1600,
    // width: 1600,
    // height: 1200,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  fps: {
    target: 30,
    forceSetTimeOut: true,
  },
  scene: [BootScene, GameScene, GameWinScene],
};
