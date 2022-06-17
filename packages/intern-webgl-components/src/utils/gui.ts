const GUICls = require('lil-gui').default;
// import { Vector2Controller, Vector3Controller, Vector4Controller } from './gui-extensions/gui-vector';

class Folder {
  add(_arg0?: Object, _arg1?: Object, _arg2?: Object, _arg3?: Object, _arg4?: Object) {
    return this;
  }
  addFolder(_name: String) {
    return new Folder();
  }

  removeFolder(_name?: Object) {
    return new Folder();
  }

  destroy() {
    return this;
  }
  addColor(_arg0?: Object, _arg1?: Object) {
    return this;
  }
  listen(_arg?: Object) {
    return this;
  }
  name(_arg?: String) {
    return this;
  }
  close() {
    return this;
  }
  step() {
    return this;
  }
  onChange(_arg?: Object) {
    return this;
  }
  setValue(_arg?: Object) {
    return this;
  }
  remove() {
    return this;
  }
  open() {
    return this;
  }
}

export class GUIWrapper {
  add(_arg0?: Object, _arg1?: Object, _arg2?: Object, _arg3?: Object, _arg4?: Object) {
    return this;
  }
  addFolder(_name: String) {
    return new Folder();
  }

  removeFolder(_name?: Object) {
    return new Folder();
  }

  destroy() {
    return this;
  }
  addColor(_arg0?: Object, _arg1?: Object) {
    return this;
  }
  listen(_arg?: Object) {
    return this;
  }
  name(_arg?: String) {
    return this;
  }
  close() {
    return this;
  }
  step() {
    return this;
  }
  onChange(_arg?: Object) {
    return this;
  }
  setValue(_arg?: Object) {
    return this;
  }
  remove() {
    return this;
  }
  open() {
    return this;
  }

  //Extensions -------
  addVector2(_object: any, _property: any, _min: number, _max: number, _step: number) {
    return this;
  }

  addVector3(_object: any, _property: any, _min: number, _max: number, _step: number) {
    return this;
  }

  addVector4(_object: any, _property: any, _min: number, _max: number, _step: number) {
    return this;
  }
}

// GUICls.prototype.addVector2 = function (object: any, property: any, min: number, max: number, step: number) {
//   return new Vector2Controller(this, object, property, min, max, step);
// };

// GUICls.prototype.addVector3 = function (object: any, property: any, min: number, max: number, step: number) {
//   return new Vector3Controller(this, object, property, min, max, step);
// };

// GUICls.prototype.addVector4 = function (object: any, property: any, min: number, max: number, step: number) {
//   return new Vector4Controller(this, object, property, min, max, step);
// };

export default function GUI(debug: boolean) {
  const Cls = debug ? GUICls : GUIWrapper;
  return new Cls();
}
