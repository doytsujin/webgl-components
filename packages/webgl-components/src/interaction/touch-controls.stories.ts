import { Color } from 'three';
import createCanvas from '../utils/canvas';
import TouchControls, { Pointer } from './touch-controls';

export default { title: 'Interaction' };

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
