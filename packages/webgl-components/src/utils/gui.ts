/* eslint-disable @typescript-eslint/no-unused-vars */
require('lil-gui');
import GUICls from 'lil-gui';

class Folder {
  add(_arg0?: unknown, _arg1?: unknown, _arg2?: unknown, _arg3?: unknown, _arg4?: unknown) {
    return this;
  }
  addFolder(_name: string) {
    return new Folder();
  }

  removeFolder(_name?: unknown) {
    return new Folder();
  }

  destroy() {
    return this;
  }
  addColor(_arg0?: unknown, _arg1?: unknown) {
    return this;
  }
  listen(_arg?: unknown) {
    return this;
  }
  name(_arg?: string) {
    return this;
  }
  close() {
    return this;
  }
  step() {
    return this;
  }
  onChange(_arg?: unknown) {
    return this;
  }
  setValue(_arg?: unknown) {
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
  add(_arg0?: unknown, _arg1?: unknown, _arg2?: unknown, _arg3?: unknown, _arg4?: unknown) {
    return this;
  }
  addFolder(_name: string) {
    return new Folder();
  }

  removeFolder(_name?: unknown) {
    return new Folder();
  }

  destroy() {
    return this;
  }
  addColor(_arg0?: unknown, _arg1?: unknown) {
    return this;
  }
  listen(_arg?: unknown) {
    return this;
  }
  name(_arg?: string) {
    return this;
  }
  close() {
    return this;
  }
  step() {
    return this;
  }
  onChange(_arg?: unknown) {
    return this;
  }
  setValue(_arg?: unknown) {
    return this;
  }
  remove() {
    return this;
  }
  open() {
    return this;
  }

  //Extensions -------
  addVector2(_object: unknown, _property: unknown, _min: number, _max: number, _step: number) {
    return this;
  }

  addVector3(_object: unknown, _property: unknown, _min: number, _max: number, _step: number) {
    return this;
  }

  addVector4(_object: unknown, _property: unknown, _min: number, _max: number, _step: number) {
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
