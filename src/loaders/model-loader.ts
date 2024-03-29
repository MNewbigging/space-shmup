import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextureLoader } from "./texture-loader";

export class ModelLoader {
  doneLoading = false;
  readonly models = new Map<string, THREE.Object3D>();
  readonly textureLoader = new TextureLoader();
  private loadingManager = new THREE.LoadingManager();

  get(modelName: string): THREE.Object3D {
    // Return the model if found
    const model = this.models.get(modelName);
    if (model) {
      return SkeletonUtils.clone(model);
    }

    // Otherwise create debug object and error message
    console.error(
      `Could not find ${modelName}, returning debug object instead`
    );
    return new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshBasicMaterial({ color: "red" })
    );
  }

  load(onLoad: () => void) {
    // Setup loading manager
    this.loadingManager.onError = (url) => console.error("error loading", url);
    this.loadingManager.onLoad = () => {
      this.doneLoading = true;
      onLoad();
    };

    // Load textures for models first, then models
    this.textureLoader.load(this.loadModels);
  }

  private loadModels = () => {
    const fbxLoader = new FBXLoader(this.loadingManager);

    // Load all similar models in the same manner
    const nameUrlMap = this.getNameUrlMap();
    nameUrlMap.forEach((url, name) => {
      fbxLoader.load(url, (group) => {
        // Apply the same basic texture to each model
        // TODO - might want to do this separately/outside of this class
        const atlas = this.textureLoader.get("atlas-1a");
        if (atlas) {
          this.applyModelTexture(group, atlas);
        }

        this.scaleSyntyModel(group);
        this.models.set(name, group);
      });
    });
  };

  private getNameUrlMap() {
    const nameUrlMap = new Map<string, string>();

    const fighter5Url = new URL("/models/ship_fighter_05.fbx", import.meta.url)
      .href;
    nameUrlMap.set("ship-fighter-05", fighter5Url);

    return nameUrlMap;
  }

  private applyModelTexture(group: THREE.Group, texture: THREE.Texture) {
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshLambertMaterial;
        mat.map = texture;
        // Synty models have this true by default, making model black
        mat.vertexColors = false;
      }
    });
  }

  private scaleSyntyModel(group: THREE.Group) {
    // Synty models need scale adjusting, unless done in blender beforehand
    group.scale.multiplyScalar(0.01);
    group.updateMatrixWorld();
  }
}
