import { Asset } from "expo-asset";
import { THREE } from "expo-three";

export const textures: {
  [texture: string]: THREE.Texture | undefined;
} = {};

export const loadAllAssets = async () => {
  const chunkAsset = await Asset.fromModule(require('../../assets/chunk.png')).downloadAsync();
  if (chunkAsset.localUri)
    textures.chunk = new THREE.TextureLoader().load(chunkAsset.localUri);
};
