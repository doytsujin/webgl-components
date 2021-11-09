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
  MeshPhongMaterial,
  Shader
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import materialModifier, { ShaderConfig } from './material-modifier';
import { simplexNoise3D } from '../shaders/noise/simplex.glsl';
import webglScene from '../../stories/webgl-scene';

export default { title: 'Materials' };

function setup(shaderConfig: ShaderConfig, material: MeshLambertMaterial | MeshPhongMaterial | MeshStandardMaterial) {
  const { scene, camera, renderer, root, clock } = webglScene();

  // Extend the material
  let customShader: Shader | null = null;
  material.onBeforeCompile = (shader: Shader) => {
    customShader = materialModifier(shader, shaderConfig);
  };

  const mesh = new Mesh(new SphereBufferGeometry(2, 64, 64), material);
  scene.add(mesh);

  function update() {
    if (customShader != null) {
      customShader.uniforms.time.value += clock.getDelta();
    }
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }

  update();

  return { renderer };
}

export const modifiedLambert = () => {
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
      preTransform: ``,
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
      outgoingLightColor: `
        vec3 normal = normalize(vNormal);
        normal.b = 1.0;
        outgoingLight *= (normal * 0.5 + 0.5);
      `,
      fragColor: `
        gl_FragColor.a = opacity;
      `
    }
  };

  const material = new MeshLambertMaterial();
  const { renderer } = setup(shaderConfig, material);
  return renderer.domElement;
};

export const modifiedPhong = () => {
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
    fragmentShader: {
      uniforms: '',
      functions: ''
    }
  };

  const material = new MeshPhongMaterial({ color: 0xff69b4 });
  const { renderer } = setup(shaderConfig, material);
  return renderer.domElement;
};

export const modifiedStandard = () => {
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
    fragmentShader: {
      uniforms: '',
      functions: ''
    }
  };

  const material = new MeshStandardMaterial({ color: 0xff69b4, roughness: 0.1, metalness: 0.7 });
  const { renderer } = setup(shaderConfig, material);
  return renderer.domElement;
};
