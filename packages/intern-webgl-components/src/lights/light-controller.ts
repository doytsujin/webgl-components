import { Light } from 'three';
const GUI = require('lil-gui');

interface LightController {
  light: Light;
  addGUI(gui: typeof GUI): void;
}

export default LightController;
