import '../../style.css';

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  SphereBufferGeometry,
  AmbientLight,
  DirectionalLight,
  Vector3,
  Vector2,
  MeshNormalMaterial
} from 'three';
import { setRendererSize, resizeWithConstraint } from './resize';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default { title: 'Rendering' };

function setup() {
  const root = document.getElementById('root');
  const renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false
  });

  const camera = new PerspectiveCamera(65, 1, 0.1, 100);
  camera.position.set(0, 2, 7);
  camera.lookAt(new Vector3());

  if (root == null) return { renderer, camera };
  const scene = new Scene();

  const controls = new OrbitControls(camera, renderer.domElement);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(root.offsetWidth, root.offsetHeight);

  const ambient = new AmbientLight();
  const directional = new DirectionalLight();
  directional.position.set(1, 1, 1);
  scene.add(ambient, directional);

  const mesh = new Mesh(new SphereBufferGeometry(2, 64, 64), new MeshNormalMaterial());
  scene.add(mesh);

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }

  update();

  return { renderer, camera, root };
}

export const resizeElements = () => {
  const maxResolution = new Vector2(1280, 720);
  const root = document.getElementById('root');
  const container = document.createElement('container');
  const baseElement = document.createElement('div');
  const resizedElement = document.createElement('div');
  Object.assign(baseElement.style, {
    backgroundColor: 'rgba(255, 0, 0, 0.25)',
    position: 'absolute',
    top: '0',
    left: '0',
  });
  Object.assign(resizedElement.style, {
    backgroundColor: 'rgba(0, 0, 255, 0.25)',
    position: 'absolute',
    top: '0',
    left: '0',
  });

  function resize() {
    if (root instanceof HTMLElement) {
      baseElement.style.width = `${maxResolution.x}px`;
      baseElement.style.height = `${maxResolution.y}px`;
      const {width, height} = resizeWithConstraint(root.offsetWidth, root.offsetHeight, maxResolution.x, maxResolution.y);    
      resizedElement.style.width = `${width}px`;
      resizedElement.style.height = `${height}px`;
    }
  }
  resize();

  window.addEventListener('resize', resize);

  container.appendChild(baseElement);
  container.appendChild(resizedElement);

  return container;
};

export const resizeWebGL = () => {
  const { renderer, camera, root } = setup();
  const maxResolution = new Vector2(1280, 720);

  function resize() {
    if (root instanceof HTMLElement) {
      const width = root.offsetWidth;
      const height = root.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      setRendererSize(renderer, width, height, maxResolution.x, maxResolution.y);
    }
  }
  resize();

  window.addEventListener('resize', resize);

  return renderer.domElement;
};
