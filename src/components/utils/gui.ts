const GUICls = require('lil-gui').default;

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
  const Cls = debug ? GUICls : GUIWrapper;
  return new Cls();
}
