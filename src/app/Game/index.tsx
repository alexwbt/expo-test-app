import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Playground from "~/src/game/Playground";
import { loadAllAssets } from "~/src/game/asset";
import { useDragControl, useGLView, useScaleControl } from "~/src/hooks/three";

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
  
  const gestures = Gesture.Race(
    useScaleControl(() => game.current?.camera, { speed: 0.1 }),
    useDragControl(() => game.current?.camera, { speed: 0.1 })
  );

  return (
    <GestureDetector gesture={gestures}>
      <GLView
        style={styles.glView}
        onContextCreate={init}
        {...useDragControl(() => game.current?.camera, { speed: 0.1 })}
      />
    </GestureDetector>
  );
};

export default Game;
