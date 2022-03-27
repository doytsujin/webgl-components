import '../style.css';
import createCanvas from './canvas';
import GUI from './gui';

export default { title: 'Utils' };

export const guiControls = () => {
  // Passing false will use a synthethic wrapper of the GUI
  const gui = GUI(true);

  const controller = {
    myBoolean: true,
    myFunction: function () { },
    myString: 'lil-gui',
    myNumber: 1,
    color: '#ff69b4',
    offset2d: {
      x: 0.0,
      y: 0.0,
    },

    offset3d: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },

    offset4d: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
      w: 0.0,
    }
  };

  const { canvas, ctx } = createCanvas(512, 512);
  function draw() {
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.fillStyle = controller.color;
      ctx.arc(canvas.width / 2 + controller.offset2d.x, canvas.height / 2 + controller.offset2d.y, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
  draw();

  gui.add(controller, 'myBoolean');  // Checkbox
  gui.add(controller, 'myFunction'); // Button
  gui.add(controller, 'myString');   // Text Field
  gui.add(controller, 'myNumber');   // Number Field

  // Add sliders to number fields by passing min and max
  gui.add(controller, 'myNumber', 0, 1);
  gui.add(controller, 'myNumber', 0, 100, 2); // snap to even numbers

  // Create dropdowns by passing an array or object of named values
  gui.add(controller, 'myNumber', [0, 1, 2]);
  gui.add(controller, 'myNumber', { Label1: 0, Label2: 1, Label3: 2 });

  const offsetFolder = gui.addFolder('Position');
  offsetFolder.addVector2(controller, 'offset2d').step(0.1).onChange(() => { draw(); });
  offsetFolder.addVector3(controller, 'offset3d').step(0.1);
  offsetFolder.addVector4(controller, 'offset4d').step(0.1);

  // Create color pickers for multiple color formats
  const colorFormats = {
    string: '#ffffff',
    int: 0xffffff,
    object: { r: 1, g: 1, b: 1 },
    array: [1, 1, 1]
  };

  gui.addColor(colorFormats, 'string');
  gui.addColor(controller, 'color').onChange(draw);

  return canvas;
};
