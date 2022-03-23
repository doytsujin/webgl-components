const GUICls = require('lil-gui').default;

class Folder {
  add(_arg1?: Object, _arg2?: Object, _arg3?: Object, _arg4?: Object, _arg5?: Object) {
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
  addColor(_arg1?: Object, _arg2?: Object) {
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

class GUIWrapper {
  add(_arg1?: Object, _arg2?: Object, _arg3?: Object, _arg4?: Object, _arg5?: Object) {
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
  addColor(_arg1?: Object, _arg2?: Object) {
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

export default function GUI(debug: boolean) {
  const Cls = debug ? GUICls : GUIWrapper;
  return new Cls();
}
