import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { useRef } from "react";
import { Image, StyleSheet } from "react-native";
import Playground from "~/src/game/Playground";
import { loadAllAssets } from "~/src/game/asset";
import { useDragControl, useGLView } from "~/src/hooks/three";
import { useAssets } from "expo-asset";

const styles = StyleSheet.create({
  glView: {
    flex: 1,
  },
});

const step = 1000 / 60;

const Game: React.FC = () => {
  const glViewHook = useGLView();
  const game = useRef<Playground>();

  const time = useRef({
    startTime: Date.now(),
    deltaTime: 0,
  });

  const update = () => {
    if (game.current) {

      const now = Date.now();
      time.current.deltaTime += (now - time.current.startTime) / step;
      time.current.startTime = now;

      while (time.current.deltaTime >= 1) {
        game.current.update();
        time.current.deltaTime--;
      }

      glViewHook.setScene(game.current.scene);
      glViewHook.setCamera(game.current.camera);
    }
  };

  const init = async (gl: ExpoWebGLRenderingContext) => {
    await loadAllAssets();

    glViewHook.onContextCreate(gl);
    glViewHook.setUpdateFunction(update);
    if (glViewHook.renderer.current) {
      glViewHook.renderer.current.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      glViewHook.renderer.current.setClearColor("white");
      glViewHook.renderer.current.shadowMap.enabled = true;
      glViewHook.renderer.current.shadowMap.type = 2;
    }

    game.current = new Playground(gl);
  };

  return (
    <GLView
      style={styles.glView}
      onContextCreate={init}
      {...useDragControl(() => game.current?.camera, { speed: 0.1 })}
    />
  );
};

export default Game;
