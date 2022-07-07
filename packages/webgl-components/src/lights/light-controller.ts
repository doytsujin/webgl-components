import { Light } from 'three';
require('lil-gui');
import GUI from 'lil-gui';

export default class LightController {
  light: Light = new Light();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addGUI(_gui: GUI) {
    //
  }
}
