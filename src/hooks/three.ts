import { ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer, THREE } from "expo-three";
import { useRef } from "react";

export const useGLView = () => {
  const running = useRef(false);
  const scene = useRef<THREE.Scene>();
  const camera = useRef<THREE.Camera>();
  const updateFunction = useRef<() => void>();
  const renderingContext = useRef<ExpoWebGLRenderingContext>();
  const setScene = (newScene: THREE.Scene) => scene.current = newScene;
  const setCamera = (newCamera: THREE.Camera) => camera.current = newCamera;
  const setRunning = (isRunning: boolean) => running.current = isRunning;
  const setUpdateFunction = (newUpdateFunction: () => void) => updateFunction.current = newUpdateFunction;

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    const renderer = new Renderer({ gl });
    renderer.setClearColor("black");
    renderingContext.current = gl;

    // render loop
    const render = () => {
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

      if (updateFunction.current)
        updateFunction.current();

      if (scene.current && camera.current)
        renderer.render(scene.current, camera.current);

      gl.flush();
      gl.endFrameEXP();

      if (running)
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
    renderingContext,
  };
};

export type UseGLView = ReturnType<typeof useGLView>;
