import { GLView } from "expo-gl";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import { Playground } from "../../game";
import { useGLView } from "../../hooks/three";

const styles = StyleSheet.create({
  glView: {
    flex: 1,
  },
});

const Game: React.FC = () => {
  const {
    setScene,
    setCamera,
    onContextCreate,
    setUpdateFunction,
  } = useGLView();
  const game = useRef<Playground>();

  const update = () => {
    if (game.current) {
      game.current.update();

      setScene(game.current.scene);
      setCamera(game.current.camera);
    }
  };

  return (
    <GLView
      style={styles.glView}
      onContextCreate={gl => {
        game.current = new Playground(gl);
        onContextCreate(gl);
        setUpdateFunction(update);
      }}
    />
  );
};

export default Game;
