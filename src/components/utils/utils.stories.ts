import { configure, addDecorator } from '@storybook/html';

import webglScene from '../../stories/webgl-scene';
import '../../style.css';
import createCanvas from '../canvas/canvas';
import GUI from './gui';
import RenderStats, { RenderStatsPosition } from './stats';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  CanvasTexture,
  IcosahedronBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  SphereGeometry
} from 'three';
import disposeObjects from './dispose-objects';
import { getQueryFromParams, setQuery } from './query-params';

export default { title: 'Utils' };

export const guiControls = () => {
  // Passing false will use a synthethic wrapper of the GUI
  const gui = GUI(true);

  const controller = {
    color: '#ff69b4'
  };

  const { canvas, ctx } = createCanvas(512, 512);
  function draw() {
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.fillStyle = controller.color;
      ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
  draw();
  gui.addColor(controller, 'color').onChange(draw);

  return canvas;
};

export const renderStats = () => {
  const { scene, camera, renderer, root } = webglScene();
  const controls = new OrbitControls(camera, renderer.domElement);

  const mesh = new Mesh(new IcosahedronBufferGeometry(2, 3), new MeshNormalMaterial());
  scene.add(mesh);

  const stats = new RenderStats({
    debug: true,
    parent: document.body,
    position: {
      alignment: RenderStatsPosition.TopLeft,
      x: 1,
      y: 1,
      unit: 'rem'
    }
  });

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
    stats.update(renderer);
  }
  update();

  return renderer.domElement;
};

export const disposeObjectsTest = () => {
  const { scene, camera, renderer, root } = webglScene();
  const controls = new OrbitControls(camera, renderer.domElement);

  function createImage() {
    const { canvas, ctx } = createCanvas(256, 256);
    canvas.width = 256;
    canvas.height = 256;
    ctx.fillStyle =
      'rgb(' +
      Math.floor(Math.random() * 256) +
      ',' +
      Math.floor(Math.random() * 256) +
      ',' +
      Math.floor(Math.random() * 256) +
      ')';
    ctx.fillRect(0, 0, 256, 256);
    return canvas;
  }

  const renderStats = new RenderStats({
    debug: true,
    parent: document.body,
    position: {
      alignment: RenderStatsPosition.TopLeft,
      x: 1,
      y: 1,
      unit: 'rem'
    }
  });

  renderStats.stats.setMode(2);

  function update() {
    requestAnimationFrame(update);

    const geometry = new SphereGeometry(5, Math.random() * 64, Math.random() * 32);
    const texture = new CanvasTexture(createImage());
    const material = new MeshBasicMaterial({ map: texture, wireframe: true });
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    renderer.render(scene, camera);
    renderStats.update(renderer);

    disposeObjects(mesh, scene);

    // Textures need to be done manually for now
    texture.dispose();
  }
  update();

  return renderer.domElement;
};

export const queryParams = () => {
  const gui = GUI(true);

  const controller = {
    color: '#ff69b4'
  };
  const color = getQueryFromParams('color', window.parent);
  if (typeof color == 'string' && color !== '') {
    controller.color = color;
  }

  const { canvas, ctx } = createCanvas(512, 512);
  function draw() {
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.fillStyle = controller.color;
      ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
  draw();
  gui.addColor(controller, 'color').onChange((value: string) => {
    setQuery('color', value, window.parent);
    draw();
  });

  return canvas;
};
