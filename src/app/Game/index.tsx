import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import Playground from "../../game/Playground";
import { loadAllAssets } from "../../game/asset";
import { useGLView } from "../../hooks/three";

const styles = StyleSheet.create({
  glView: {
    flex: 1,
  },
});

const Game: React.FC = () => {
  const glViewHook = useGLView();
  const game = useRef<Playground>();

  const update = () => {
    if (game.current) {
      game.current.update();
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
      glViewHook.renderer.current.setClearColor("blue");
      glViewHook.renderer.current.shadowMap.enabled = true;
      glViewHook.renderer.current.shadowMap.type = 2;
    }

    game.current = new Playground(gl);
  };

  return (
    <GLView
      style={styles.glView}
      onContextCreate={init}
    />
  );
};

export default Game;
