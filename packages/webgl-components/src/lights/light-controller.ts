import { Group, Light } from 'three';
import GUI from 'lil-gui';

export const GUI_PRECISION = 0.01;

export default class LightController {
  light: Light = new Light();
  helpers: Group = new Group();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addGUI(guiParent: GUI) {
    //
  }
}
