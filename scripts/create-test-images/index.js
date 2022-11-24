import { Color } from 'three';
import fs from 'fs';
import { createCanvas } from 'canvas';

const TOTAL = 100;
const PATH = '../../public/assets/images/';

const canvas = createCanvas(200, 200);
const ctx = canvas.getContext('2d');

async function exportImage(index) {
  return new Promise((resolve, reject) => {
    const color = new Color();
    color.setHSL(index / (TOTAL - 1), 0.5, 0.5);
    ctx.fillStyle = color.getStyle();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.toBuffer(
      (error, buffer) => {
        if (error) {
          reject(error);
          return;
        }
        fs.writeFileSync(`${PATH}${index}.jpg`, buffer);
        resolve();
      },
      'image/jpeg',
      { quality: 0.75 }
    );
  });
}

for (let i = 0; i < TOTAL; i++) {
  await exportImage(i);
}
