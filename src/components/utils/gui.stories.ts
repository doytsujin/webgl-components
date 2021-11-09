import { configure, addDecorator } from '@storybook/html';

import webglScene from '../../stories/webgl-scene';
import '../../style.css';
import createCanvas from './canvas';
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
