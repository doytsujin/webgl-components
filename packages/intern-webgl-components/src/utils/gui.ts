const GUICls = require('lil-gui').default;

import { Vector2Controller, Vector3Controller, Vector4Controller } from "./gui-ext/gui-vec";

class GUIWrapper {
  add() {
    return this;
  }
  addColor() {
    return this;
  }
  addFolder() {
    return new GUIWrapper();
  }
  load() {
    return this;
  }
  save() {
    return this;
  }
  open() {
    return this;
  }
  close() {
    return this;
  }
  openAnimated() {
    return this;
  }
  title() {
    return this;
  }
  reset() {
    return this;
  }
  onChange() {
    return this;
  }
  destroy() {
    return this;
  }
  controllersRecursive() {
    return this;
  }
  foldersRecursive() {
    return this;
  }
}


export default function GUI(debug: boolean) {

  GUICls.prototype.addVector2 = function (object: any, property: any, min: number, max: number, step: number) {
    return new Vector2Controller(this, object, property, min, max, step);
  };

  GUICls.prototype.addVector3 = function (object: any, property: any, min: number, max: number, step: number) {
    return new Vector3Controller(this, object, property, min, max, step);
  };

  GUICls.prototype.addVector4 = function (object: any, property: any, min: number, max: number, step: number) {
    return new Vector4Controller(this, object, property, min, max, step);
  };

  const Cls = debug ? GUICls : GUIWrapper;
  return new Cls();
}
