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
  MeshNormalMaterial,
  MeshLambertMaterial
} from 'three';
import { setRendererSize, resizeWithConstraint } from '../rendering/resize';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import InteractiveObject from './interactive-object';

export default { title: 'Interaction' };

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

  const scene = new Scene();

  if (root == null) return { renderer, camera, scene };

  const controls = new OrbitControls(camera, renderer.domElement);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(root.offsetWidth, root.offsetHeight);

  const ambient = new AmbientLight();
  const directional = new DirectionalLight();
  directional.position.set(1, 1, 1);
  scene.add(ambient, directional);

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }

  update();

  return { renderer, camera, root, scene };
}

export const interactiveObject = () => {
  const { scene, camera, renderer, root } = setup();
  const maxResolution = new Vector2(1280, 720);

  const mesh = new Mesh(
    new SphereBufferGeometry(2, 32, 32),
    new MeshLambertMaterial({ color: 0xffffff, wireframe: true })
  );
  const interactiveObject = new InteractiveObject(mesh, camera, renderer.domElement, {
    touchStart: true,
    touchMove: true,
    touchEnd: true,
    mouseMove: false
  });
  interactiveObject.bindEvents(true);
  scene.add(mesh);

  function onStart() {
    mesh.material.color.setHex(0x00ffff);
  }
  function onHover(over: boolean) {
    mesh.material.color.setHex(over ? 0xff0000 : 0xffffff);
  }
  function onEnd() {
    mesh.material.color.setHex(0xffffff);
  }

  interactiveObject.on('start', onStart);
  interactiveObject.on('hover', onHover);
  interactiveObject.on('end', onEnd);

  function resize() {
    if (root instanceof HTMLElement) {
      const width = root.offsetWidth;
      const height = root.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      setRendererSize(renderer, width, height, maxResolution.x, maxResolution.y);
    }
  }
  window.addEventListener('resize', resize);
  resize();

  return renderer.domElement;
};
