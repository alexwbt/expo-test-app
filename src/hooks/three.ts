import { ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer, THREE } from "expo-three";
import { useRef } from "react";

export const useGLView = () => {
  const running = useRef(false);
  const renderer = useRef<Renderer>();
  const scene = useRef<THREE.Scene>();
  const camera = useRef<THREE.Camera>();
  const updateFunction = useRef<() => void>();
  const renderingContext = useRef<ExpoWebGLRenderingContext>();
  const setScene = (newScene: THREE.Scene) => scene.current = newScene;
  const setCamera = (newCamera: THREE.Camera) => camera.current = newCamera;
  const setRunning = (isRunning: boolean) => running.current = isRunning;
  const setUpdateFunction = (newUpdateFunction: () => void) => updateFunction.current = newUpdateFunction;

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    renderer.current = new Renderer({ gl });
    renderingContext.current = gl;

    // render loop
    const render = () => {
      if (!running || !renderer.current)
        return;

      if (updateFunction.current)
        updateFunction.current();

      if (scene.current && camera.current)
        renderer.current.render(scene.current, camera.current);

      gl.flush();
      gl.endFrameEXP();

      requestAnimationFrame(render);
    }

    // start render loop
    running.current = true;
    render();
  };

  return {
    onContextCreate,
    setScene,
    setCamera,
    setRunning,
    setUpdateFunction,
    renderer,
    renderingContext,
  };
};

export type UseGLView = ReturnType<typeof useGLView>;
