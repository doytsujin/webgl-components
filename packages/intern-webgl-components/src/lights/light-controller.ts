import { Light } from 'three';
const GUI = require('lil-gui');

export default class LightController {
  light: Light = new Light();
  addGUI(_gui: typeof GUI) {}
}
