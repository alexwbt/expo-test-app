import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import Playground from "../../game/Playground";
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

  const init = (gl: ExpoWebGLRenderingContext) => {
    glViewHook.onContextCreate(gl);
    glViewHook.setUpdateFunction(update);
    if (glViewHook.renderer.current) {
      glViewHook.renderer.current.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      glViewHook.renderer.current.setClearColor("black");
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
