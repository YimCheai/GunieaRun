import React, { useEffect } from "react";
import Phaser from "phaser";
import StartScene from "../../../inGame/scenes/Start"; // Phaser 씬 경로 맞춰서 import

export default function InGame() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 1920,
      height: 1080,
      parent: "phaser-container",
      scene: [StartScene],
      physics: {
        default: "arcade",
        arcade: { debug: false }
      }
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-container" />;
}
