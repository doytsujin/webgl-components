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
import webglScene from '../../stories/webgl-scene';
import createCanvas from '../canvas/canvas';
import TouchControls from './touch-controls';

export default { title: 'Interaction' };

export const interactiveObject = () => {
  const { scene, camera, renderer, root } = webglScene();

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

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }
  update();

  return renderer.domElement;
};

export const touchControls = () => {
  const { canvas, ctx } = createCanvas(512, 512);

  const touchControls = new TouchControls(canvas);

  type Circle = {
    x: number;
    y: number;
    color: string;
  };
  let circles: Array<Circle> = [];
  let counter = 0;

  function render() {
    requestAnimationFrame(render);
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < circles.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = circles[i].color;
        ctx.arc(circles[i].x, circles[i].y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
  render();

  function addCircles(event: Array<Pointer>) {
    counter += 0.01;
    for (let i = 0; i < event.length; i++) {
      circles.push({ x: event[i].x, y: event[i].y, color: new Color().setHSL(counter % 1, 0.75, 0.5).getStyle() });
    }
  }

  function onStart(event: Array<Pointer>) {
    addCircles(event);
  }
  function onMove(event: Array<Pointer>) {
    addCircles(event);
  }
  function onEnd(event: Array<Pointer>) {
    counter = 0;
    circles = [];
  }

  touchControls.on('start', onStart);
  touchControls.on('move', onMove);
  touchControls.on('end', onEnd);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  return canvas;
};
