import { Asset } from "expo-asset";
import { loadTextureAsync } from "expo-three";

export const textures: {
  [texture: string]: THREE.Texture | undefined;
} = {};

export const loadAllAssets = async () => {
  textures.chunk = await loadTextureAsync({
    asset: Asset.fromModule(require('~/assets/chunk.png'))
  });
};
