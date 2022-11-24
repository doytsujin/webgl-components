import '../style.css';
import createCanvas from './canvas';
import { createGUI } from './gui';
import { getQueryFromParams, setQuery } from './query-params';

export default { title: 'Utils' };

export const queryParams = () => {
  const gui = createGUI(true);

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
