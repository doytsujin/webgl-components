import '../../style.css';

import { Mesh, PlaneBufferGeometry, ShaderMaterial } from 'three';
import { simplexNoise2D, simplexNoise3D, simplexNoise4D } from './simplex.glsl';
import webglScene from '../../webgl-scene';

export default { title: 'Shaders/Noise' };

function setup(options: { vertexShader: string; fragmentShader: string }) {
  const { renderer, scene, clock } = webglScene();

  const mesh = new Mesh(
    new PlaneBufferGeometry(2, 2),
    new ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: options.vertexShader,
      fragmentShader: options.fragmentShader
    })
  );
  scene.add(mesh);

  function update() {
    mesh.material.uniforms.time.value += clock.getDelta();
    requestAnimationFrame(update);
  }

  update();

  return { renderer };
}

export const simplex2D = () => {
  const { renderer } = setup({
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      ${simplexNoise2D}
      void main() {
        float noise = simplexNoise2D(vUv * 10.0);
        gl_FragColor = vec4(vec3(noise), 1.0);
      }
    `
  });

  return renderer.domElement;
};

export const simplex3D = () => {
  const { renderer } = setup({
    vertexShader: /* glsl */ `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float time;
      varying vec3 vPosition;
      ${simplexNoise3D}
      void main() {
        float noise = simplexNoise3D(vPosition * 5.0 + time);
        gl_FragColor = vec4(vec3(noise), 1.0);
      }
    `
  });

  return renderer.domElement;
};

export const simplex4D = () => {
  const { renderer } = setup({
    vertexShader: /* glsl */ `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float time;
      varying vec3 vPosition;
      ${simplexNoise4D}
      void main() {
        float noise = simplexNoise4D(vec4(vPosition * 5.0 + time, time));
        gl_FragColor = vec4(vec3(noise), 1.0);
      }
    `
  });

  return renderer.domElement;
};
