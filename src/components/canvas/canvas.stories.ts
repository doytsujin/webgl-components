import '../../style.css';
import createCanvas from './canvas';

export default { title: 'Canvas' };

export const create = () => {
  const { canvas, ctx } = createCanvas(512, 512);
  if (ctx instanceof CanvasRenderingContext2D) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = '#ff69b4';
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
  return canvas;
};
