import { ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer, THREE } from "expo-three";
import { useRef } from "react";
import { GestureResponderEvent } from "react-native";

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

      requestAnimationFrame(render);

      if (updateFunction.current)
        updateFunction.current();

      if (scene.current && camera.current)
        renderer.current.render(scene.current, camera.current);

      gl.flush();
      gl.endFrameEXP();
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

export const useDragControl = (
  getCamera: () => THREE.Camera | undefined,
  options?: {
    speed: number
  },
) => {

  const state = useRef({
    x: 0,
    y: 0,
    pressed: false,
  });

  const onResponderGrant = (e: GestureResponderEvent) => {
    state.current.x = e.nativeEvent.locationX;
    state.current.y = e.nativeEvent.locationY;
    state.current.pressed = true;
  };

  const onResponderRelease = () => {
    state.current.pressed = false;
  };

  const onResponderMove = (e: GestureResponderEvent) => {

    if (state.current.pressed) {
      const camera = getCamera();
      if (camera) {
        const front = camera.getWorldDirection(new THREE.Vector3);
        const dx = e.nativeEvent.locationX - state.current.x;
        const dy = e.nativeEvent.locationY - state.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radians = Math.atan2(dy, dx) - Math.atan2(front.x, front.z);
        const x = Math.cos(radians) * (options?.speed || 1) * dist;
        const y = Math.sin(radians) * (options?.speed || 1) * dist;
        camera.position.add(new THREE.Vector3(x, 0, y));
      }

      state.current.x = e.nativeEvent.locationX;
      state.current.y = e.nativeEvent.locationY;
    }
  };

  return {
    onResponderMove,
    onResponderGrant,
    onResponderRelease,
    onStartShouldSetResponder: () => true,
  };
};
