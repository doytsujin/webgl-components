import { Controller } from 'lil-gui';

interface VectorInterface {
  [key: string]: number;
  x: number;
  y: number;
  z: number;
  w: number;
}

interface ParentInterface {
  [key: string]: VectorInterface;
}

// Vector controller implements the basic functionality for a gui widget for objects like Threejs Vector2, Vector3 and Vecto4, it's basically a number controller with multiple inputs
// Based on https://github.com/georgealways/lil-gui/blob/master/src/NumberController.js

class VectorController extends Controller {
  _max: number = 1.0;
  _min: number = 0.0;

  _step: number = 0.01;
  _stepExplicit: boolean = true;

  _inputFocused: boolean = false;

  $inputs: HTMLInputElement[] = [];

  _vecProps: string[] = []; // the props keys inside the Vector class (x,y,z,w...) we use to access each value
  _currentProp: string = ''; //this is used to bypass the setValue logic, since it's inherit from it's parent class we cannot pass the current Vector prop as an argument

  constructor(parent: ParentInterface, object: VectorInterface, property: any, min: number, max: number, step: number) {
    super(parent, object, property, 'number');

    this.min(min);
    this.max(max);

    const stepExplicit = step !== undefined;
    this.step(stepExplicit ? step : this._getImplicitStep(), stepExplicit);
    this.$inputs = [];
  }

  min(min: number) {
    this._min = min;
    this._onUpdateMinMax();
    return this;
  }

  max(max: number) {
    this._max = max;
    this._onUpdateMinMax();
    return this;
  }

  step(step: number, explicit = true) {
    this._step = step;
    this._stepExplicit = explicit;
    return this;
  }

  updateDisplay() {
    const value = this.getValue();

    if (!this._inputFocused) {
      for (let i = 0; i < this._vecProps.length; i++) {
        this.$inputs[i].value = value[this._vecProps[i]];
      }
    }

    return this;
  }

  setValue(value: number) {
    (this.object as ParentInterface)[this.property][this._currentProp] = value;
    this._callOnChange();
    this.updateDisplay();
    return this;
  }

  _setVecProps(props: string[]) {
    this._vecProps = props;

    this.$inputs = [];
    for (let i = 0; i < this._vecProps.length; i++) {
      this.$inputs.push(document.createElement('input'));
      this._initInput(this.$inputs[i], this._vecProps[i]);
    }
    this.updateDisplay();
  }

  _initInput(input: HTMLInputElement, prop: string) {
    input.setAttribute('type', 'number');
    input.setAttribute('step', 'any');
    input.setAttribute('aria-labelledby', this.$name.id);
    input.style.marginLeft = '5px';

    this.$widget.appendChild(input);
    this.$disable = input;

    const onInput = () => {
      const value = parseFloat(input.value);
      if (isNaN(value)) return;
      this._currentProp = prop;
      this.setValue(this._clamp(value));
    };

    // Keys & mouse wheel
    // ---------------------------------------------------------------------

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        input.blur();
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (this._inputFocused) {
        e.preventDefault();
      }
    };

    // Vertical drag
    // ---------------------------------------------------------------------

    let testingForVerticalDrag = false;
    let initClientX = 0;
    let initClientY = 0;
    let prevClientY = 0;
    let initValue = 0;
    let dragDelta = 0;

    // Once the mouse is dragged more than DRAG_THRESH px on any axis, we decide
    // on the user's intent: horizontal means highlight, vertical means drag.
    const DRAG_THRESH = 5;

    const onMouseDown = (e: MouseEvent) => {
      initClientX = e.clientX;
      initClientY = prevClientY = e.clientY;
      testingForVerticalDrag = true;

      initValue = this.getValue()[prop];
      dragDelta = 0;

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (testingForVerticalDrag) {
        const dx = e.clientX - initClientX;
        const dy = e.clientY - initClientY;

        if (Math.abs(dy) > DRAG_THRESH) {
          e.preventDefault();
          input.blur();
          testingForVerticalDrag = false;
          this._setDraggingStyle(true, 'vertical');
        } else if (Math.abs(dx) > DRAG_THRESH) {
          onMouseUp();
        }
      }

      // This isn't an else so that the first move counts towards dragDelta
      if (!testingForVerticalDrag) {
        const dy = e.clientY - prevClientY;

        dragDelta -= dy * this._step * this._arrowKeyMultiplier(e);

        // Clamp dragDelta so we don't have 'dead space' after dragging past bounds.
        // We're okay with the fact that bounds can be undefined here.
        if (initValue + dragDelta > this._max) {
          dragDelta = this._max - initValue;
        } else if (initValue + dragDelta < this._min) {
          dragDelta = this._min - initValue;
        }

        this._snapClampSetValue(initValue + dragDelta, prop);
      }

      prevClientY = e.clientY;
    };

    const onMouseUp = () => {
      this._setDraggingStyle(false, 'vertical');
      this._callOnFinishChange();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    // Focus state & onFinishChange
    // ---------------------------------------------------------------------

    const onFocus = () => {
      this._inputFocused = true;
    };

    const onBlur = () => {
      this._inputFocused = false;
      this.updateDisplay();
      this._callOnFinishChange();
    };

    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onKeyDown);
    input.addEventListener('wheel', onWheel, { passive: false });
    input.addEventListener('mousedown', onMouseDown);
    input.addEventListener('focus', onFocus);
    input.addEventListener('blur', onBlur);
  }

  _setDraggingStyle(active: boolean, axis = 'horizontal') {
    document.body.classList.toggle('lil-gui-dragging', active);
    document.body.classList.toggle(`lil-gui-${axis}`, active);
  }

  _getImplicitStep() {
    if (this._hasMin && this._hasMax) {
      return (this._max - this._min) / 1000;
    }
    return 0.1;
  }

  _onUpdateMinMax() {
    if (this._hasMin && this._hasMax) {
      // If this is the first time we're hearing about min and max
      // and we haven't explicitly stated what our step is, let's
      // update that too.
      if (!this._stepExplicit) {
        this.step(this._getImplicitStep(), false);
      }

      //this._initSlider();
      this.updateDisplay();
    }
  }

  _normalizeMouseWheel(e: WheelEvent) {
    let { deltaX, deltaY } = e;

    // Safari and Chrome report weird non-integral values for a notched wheel,
    // but still expose actual lines scrolled via wheelDelta. Notched wheels
    // should behave the same way as arrow keys.

    // if (Math.floor(e.deltaY) !== e.deltaY && e.) {
    // 	deltaX = 0;
    // 	deltaY = -e.deltaMode / 120;
    // 	deltaY *= this._stepExplicit ? 1 : 10;
    // }

    const wheel = deltaX + -deltaY;
    return wheel;
  }

  _arrowKeyMultiplier(e: MouseEvent | KeyboardEvent) {
    let mult = this._stepExplicit ? 1 : 10;

    if (e.shiftKey) {
      mult *= 10;
    } else if (e.altKey) {
      mult /= 10;
    }
    return mult;
  }

  _snap(value: number) {
    // This would be the logical way to do things, but floating point errors.
    // return Math.round( value / this._step ) * this._step;

    // Using inverse step solves a lot of them, but not all
    // const inverseStep = 1 / this._step;
    // return Math.round( value * inverseStep ) / inverseStep;

    // Not happy about this, but haven't seen it break.
    const r = Math.round(value / this._step) * this._step;
    return parseFloat(r.toPrecision(15));
  }

  _clamp(value: number) {
    // either condition is false if min or max is undefined
    if (value < this._min) value = this._min;
    if (value > this._max) value = this._max;
    return value;
  }

  _snapClampSetValue(value: number, prop: string) {
    this._currentProp = prop;
    this.setValue(this._clamp(this._snap(value)));
  }

  get _hasScrollBar() {
    const root = this.parent.root.$children;
    return root.scrollHeight > root.clientHeight;
  }

  get _hasMin() {
    return this._min !== undefined;
  }

  get _hasMax() {
    return this._max !== undefined;
  }
}

export class Vector2Controller extends VectorController {
  constructor(parent: any, object: any, property: any, min: number, max: number, step: number) {
    super(parent, object, property, min, max, step);
    this._setVecProps(['x', 'y']);
  }
}

export class Vector3Controller extends VectorController {
  constructor(parent: any, object: any, property: any, min: number, max: number, step: number) {
    super(parent, object, property, min, max, step);
    this._setVecProps(['x', 'y', 'z']);
  }
}

export class Vector4Controller extends VectorController {
  constructor(parent: any, object: any, property: any, min: number, max: number, step: number) {
    super(parent, object, property, min, max, step);
    this._setVecProps(['x', 'y', 'z', 'w']);
  }
}
