import * as THREE from "three";

export class TextureLoader {
  doneLoading = false;

  private textures = new Map<string, THREE.Texture>();
  private loadingManager = new THREE.LoadingManager();

  get(name: string) {
    return this.textures.get(name);
  }

  getMulti(names: string[]) {
    const textures: THREE.Texture[] = [];
    names.forEach((name) => {
      const tex = this.get(name);
      if (tex) {
        textures.push(tex);
      }
    });
    return textures;
  }

  load(onLoad: () => void) {
    // Setup loading manager
    this.loadingManager.onError = (url) => console.error("error loading", url);

    this.loadingManager.onLoad = () => {
      this.doneLoading = true;
      onLoad();
    };

    this.loadTextures();
  }

  private loadTextures() {
    const loader = new THREE.TextureLoader(this.loadingManager);
    this.loadBanditTexture(loader);
    //this.loadSkybox03(loader);
    this.loadSkybox();
  }

  private loadBanditTexture(loader: THREE.TextureLoader) {
    const url = new URL("/bandit-texture.png", import.meta.url).href;
    loader.load(url, (texture) => {
      // So colours don't look washed out
      texture.encoding = THREE.sRGBEncoding;
      this.textures.set("bandit", texture);
    });
  }

  private loadSkybox03(loader: THREE.TextureLoader) {
    const backUrl = new URL("/textures/skybox_03_back.png", import.meta.url)
      .href;
    const downUrl = new URL("/textures/skybox_03_down.png", import.meta.url)
      .href;
    const frontUrl = new URL("/textures/skybox_03_front.png", import.meta.url)
      .href;
    const leftUrl = new URL("/textures/skybox_03_left.png", import.meta.url)
      .href;
    const rightUrl = new URL("/textures/skybox_03_right.png", import.meta.url)
      .href;
    const upUrl = new URL("/textures/skybox_03_up.png", import.meta.url).href;

    const names = [
      "skybox-03-front",
      "skybox-03-back",
      "skybox-03-down",
      "skybox-03-up",
      "skybox-03-right",
      "skybox-03-left",
    ];
    [frontUrl, backUrl, downUrl, upUrl, rightUrl, leftUrl].forEach(
      (url: string, index: number) => {
        loader.load(url, (texture) => {
          this.textures.set(names[index], texture);
        });
      }
    );
  }

  private loadSkybox() {
    const loader = new THREE.CubeTextureLoader(this.loadingManager);
    const backUrl = new URL("/textures/skybox_03_back.png", import.meta.url)
      .href;
    const downUrl = new URL("/textures/skybox_03_down.png", import.meta.url)
      .href;
    const frontUrl = new URL("/textures/skybox_03_front.png", import.meta.url)
      .href;
    const leftUrl = new URL("/textures/skybox_03_left.png", import.meta.url)
      .href;
    const rightUrl = new URL("/textures/skybox_03_right.png", import.meta.url)
      .href;
    const upUrl = new URL("/textures/skybox_03_up.png", import.meta.url).href;

    // +x, -x, +y, -y, +z, -z
    // front, back, up, down, left, right
    // except synty assets are stupid, so it is:
    const urls = [leftUrl, rightUrl, upUrl, downUrl, frontUrl, backUrl];

    const cubeTexture = loader.load(urls);
    this.textures.set("skybox", cubeTexture);
  }
}
