import { CONST } from "../const/const";

export class Clock {
  private scene: Phaser.Scene;
  private interval: number;
  private timerEvent: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, interval: number, repeat: number) {
    this.scene = scene;
    this.interval = interval;
    this.timerEvent = this.scene.time.addEvent({
      delay: interval,
      repeat: repeat,
    });
  }

  public getTimerEvent(): Phaser.Time.TimerEvent {
    return this.timerEvent;
  }
}
