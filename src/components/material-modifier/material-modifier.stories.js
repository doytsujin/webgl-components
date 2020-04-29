import '../../style.css';

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  Clock,
  SphereBufferGeometry,
  MeshLambertMaterial,
  AmbientLight,
  DirectionalLight,
  Vector3,
  MeshStandardMaterial,
  MeshPhongMaterial
} from 'three';
import materialModifier from './material-modifier';
import { simplexNoise3D } from '../shaders/noise/simplex.glsl';
import { createOrbitControls } from '../cameras/cameras';

export default { title: 'Material Modifier' };

function setup(shaderConfig, material) {
  const root = document.getElementById('root');
  const renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false
  });

  if (root == null) return { renderer };
  const clock = new Clock();
  const scene = new Scene();
  const camera = new PerspectiveCamera(65, 1, 0.1, 100);
  camera.position.set(0, 2, 7);
  camera.lookAt(new Vector3());

  createOrbitControls(camera, renderer);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(root.offsetWidth, root.offsetHeight);

  const ambient = new AmbientLight();
  const directional = new DirectionalLight();
  directional.position.set(1, 1, 1);
  scene.add(ambient, directional);

  // Extend the material
  let compiledShader;
  material.onBeforeCompile = (shader: Object) => {
    compiledShader = materialModifier(shader, shaderConfig);
  };

  const mesh = new Mesh(new SphereBufferGeometry(2, 64, 64), material);
  scene.add(mesh);

  function resize() {
    camera.aspect = root.offsetWidth / root.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(root.offsetWidth, root.offsetHeight);
  }
  resize();

  window.addEventListener('resize', resize);

  function update() {
    if (compiledShader) compiledShader.uniforms.time.value += clock.getDelta();
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }

  update();

  return { renderer };
}

export const lambert = () => {
  const shaderConfig = {
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: {
      uniforms: `
        uniform float time;
        varying vec3 vNormal;
      `,
      functions: `
        ${simplexNoise3D}
      `,
      postTransform: `
        float speed = time * 0.5;
        float noise = simplexNoise3D(position.xyz * 0.75 + speed) * 0.15;
        transformed = normal * noise;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + transformed, 1.0);
        vNormal = normal;
      `
    },
    fragmentShader: {
      uniforms: `
        varying vec3 vNormal;
      `,
      functions: ``,
      preFragColor: `
        vec3 normal = normalize(vNormal);
        normal.b = 1.0;
        outgoingLight *= (normal * 0.5 + 0.5);
      `
    }
  };

  const material = new MeshLambertMaterial();
  const { renderer } = setup(shaderConfig, material);
  return renderer.domElement;
};

export const phong = () => {
  const shaderConfig = {
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: {
      uniforms: `
        uniform float time;
      `,
      functions: `
        ${simplexNoise3D}
      `,
      postTransform: `
        float speed = time * 0.5;
        float noise = simplexNoise3D(position.xyz * 0.75 + speed) * 0.15;
        transformed = normal * noise;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + transformed, 1.0);
      `
    },
    fragmentShader: {}
  };

  const material = new MeshPhongMaterial({ color: 0xff69b4 });
  const { renderer } = setup(shaderConfig, material);
  return renderer.domElement;
};

export const standard = () => {
  const shaderConfig = {
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: {
      uniforms: `
        uniform float time;
      `,
      functions: `
        ${simplexNoise3D}
      `,
      postTransform: `
        float speed = time * 0.5;
        float noise = simplexNoise3D(position.xyz * 0.75 + speed) * 0.15;
        transformed = normal * noise;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + transformed, 1.0);
      `
    },
    fragmentShader: {}
  };

  const material = new MeshStandardMaterial({ color: 0xff69b4, roughness: 0.1, metalness: 0.7 });
  const { renderer } = setup(shaderConfig, material);
  return renderer.domElement;
};
