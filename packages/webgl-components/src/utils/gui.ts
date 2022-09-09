/* eslint-disable @typescript-eslint/no-unused-vars */
import GUI from 'lil-gui';

export class GUIWrapper {
  root: unknown;
  parent: unknown;
  $children: unknown;
  children: Array<unknown> = [];
  controllers: Array<unknown> = [];
  folders: Array<unknown> = [];
  _closed = false;
  _hidden = false;
  _title = '';
  domElement!: HTMLElement;
  $title!: HTMLElement;
  _onChange = () => {
    //
  };
  _callOnChange = () => {
    //
  };
  _onFinishChange = () => {
    //
  };
  _callOnFinishChange = () => {
    //
  };
  controllersRecursive() {
    return this;
  }
  foldersRecursive() {
    return this;
  }
  load(_arg0?: unknown, _arg1?: unknown) {
    return this;
  }
  save(_arg0?: unknown) {
    return this;
  }
  title(_arg0?: unknown) {
    return this;
  }
  show(_arg0?: unknown) {
    return this;
  }
  hide(_arg0?: unknown) {
    return this;
  }
  openAnimated(_arg0?: unknown) {
    return this;
  }
  add(_arg0?: unknown, _arg1?: unknown, _arg2?: unknown, _arg3?: unknown, _arg4?: unknown) {
    return this;
  }
  addFolder(_name: string) {
    return new GUIWrapper();
  }
  removeFolder(_name?: unknown) {
    return new GUIWrapper();
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
  onFinishChange(_arg?: unknown) {
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
  reset() {
    return this;
  }
}

function createGUI(debug: boolean) {
  const Cls = debug ? GUI : GUIWrapper;
  return new Cls();
}

export { GUI, createGUI };
