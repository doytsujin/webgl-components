import '../../../style.css';

import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, PlaneBufferGeometry, ShaderMaterial, Clock } from 'three';
import { simplexNoise2D, simplexNoise3D, simplexNoise4D } from './simplex.glsl';

export default { title: 'Simplex' };

function setup(options: { vertexShader: string; fragmentShader: string }) {
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

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(root.offsetWidth, root.offsetHeight);

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

  function resize() {
    if (root instanceof HTMLElement) {
      camera.aspect = root.offsetWidth / root.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(root.offsetWidth, root.offsetHeight);
    }
  }

  window.addEventListener('resize', resize);

  function update() {
    mesh.material.uniforms.time.value += clock.getDelta();
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }

  update();

  return { renderer };
}

export const simplex2D = () => {
  const { renderer } = setup({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
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
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
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
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
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
