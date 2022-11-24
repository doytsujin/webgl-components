import EventEmitter from 'eventemitter3';
import detect from '@jam3/detect';

export type TouchControlsOptions = {
  touchStart?: boolean;
  touchMove?: boolean;
  touchEnd?: boolean;
  hover?: boolean;
};

export type Pointer = {
  x: number;
  y: number;
  normalX: number;
  normalY: number;
};

/**
 * A class to normalize mouse and touch events
 *
 * @export
 * @class TouchControls
 * @extends {EventEmitter}
 */
export default class TouchControls extends EventEmitter {
  element: HTMLElement;
  pointers: Array<Pointer> = [];
  options: TouchControlsOptions = {
    hover: false, // mouse only
    touchStart: true,
    touchMove: true,
    touchEnd: true
  };
  isDown = false;

  constructor(element: HTMLElement, options: TouchControlsOptions = {}) {
    super();
    this.element = element;
    this.options = Object.assign(this.options, options);
    this.bindEvents(true);
  }

  /**
   * Bind mouse and touch events
   *
   * @param {boolean} bind
   * @memberof TouchControls
   */
  bindEvents = (bind: boolean) => {
    if (bind) {
      if (detect.device.desktop) {
        if (this.options.touchStart) this.element.addEventListener('mousedown', this.onTouchStart);
        if (this.options.touchMove) this.element.addEventListener('mousemove', this.onTouchMove);
        if (this.options.touchEnd) this.element.addEventListener('mouseup', this.onTouchEnd);
        if (this.options.hover) this.element.addEventListener('mouseover', this.onMouseOver);
        if (this.options.hover) this.element.addEventListener('mouseout', this.onMouseOut);
      } else {
        if (this.options.touchStart) this.element.addEventListener('touchstart', this.onTouchStart);
        if (this.options.touchMove) this.element.addEventListener('touchmove', this.onTouchMove);
        if (this.options.touchEnd) this.element.addEventListener('touchend', this.onTouchEnd);
      }
    } else {
      if (detect.device.desktop) {
        if (this.options.touchStart) this.element.removeEventListener('mousedown', this.onTouchStart);
        if (this.options.touchMove) this.element.removeEventListener('mousemove', this.onTouchMove);
        if (this.options.touchEnd) this.element.removeEventListener('mouseup', this.onTouchEnd);
        if (this.options.hover) this.element.removeEventListener('mouseover', this.onMouseOver);
        if (this.options.hover) this.element.removeEventListener('mouseout', this.onMouseOut);
      } else {
        if (this.options.touchStart) this.element.removeEventListener('touchstart', this.onTouchStart);
        if (this.options.touchMove) this.element.removeEventListener('touchmove', this.onTouchMove);
        if (this.options.touchEnd) this.element.removeEventListener('touchend', this.onTouchEnd);
      }
    }
  };

  /**
   * Update the list of current inputs
   *
   * @param {(TouchEvent | MouseEvent)} event
   * @memberof TouchControls
   */
  setPointers = (event: TouchEvent | MouseEvent) => {
    this.pointers = [];
    if (event instanceof TouchEvent) {
      for (let i = 0; i < event.touches.length; i++) {
        const pointer = event.touches[i];
        this.pointers.push({
          x: pointer.pageX,
          y: pointer.pageY,
          normalX: pointer.pageX / window.innerWidth,
          normalY: pointer.pageY / window.innerHeight
        });
      }
    } else {
      this.pointers.push({
        x: event.pageX,
        y: event.pageY,
        normalX: event.pageX / window.innerWidth,
        normalY: event.pageY / window.innerHeight
      });
    }
  };

  /**
   * Touch start handler
   *
   * @param {(TouchEvent | MouseEvent)} event
   * @memberof TouchControls
   */
  onTouchStart = (event: TouchEvent | MouseEvent) => {
    this.isDown = true;
    this.setPointers(event);
    this.emit('start', this.pointers);
  };

  /**
   * Touch move handler
   *
   * @param {(TouchEvent | MouseEvent)} event
   * @memberof TouchControls
   */
  onTouchMove = (event: TouchEvent | MouseEvent) => {
    this.onMouseMove(event);
    if (!this.isDown) return;
    this.setPointers(event);
    this.emit('move', this.pointers);
  };

  /**
   * Touch end handler
   *
   * @memberof TouchControls
   */
  onTouchEnd = () => {
    this.isDown = false;
    this.emit('end', this.pointers);
  };

  /**
   * Mouse move handler
   *
   * @param {(TouchEvent | MouseEvent)} event
   * @memberof TouchControls
   */
  onMouseMove = (event: TouchEvent | MouseEvent) => {
    this.setPointers(event);
    this.emit('mousemove', this.pointers);
  };

  /**
   * Mouse over handler
   *
   * @param {MouseEvent} _event
   * @memberof TouchControls
   */
  onMouseOver = () => {
    this.emit('hover', true);
  };

  /**
   * Mouse out handler
   *
   * @param {MouseEvent} _event
   * @memberof TouchControls
   */
  onMouseOut = () => {
    this.emit('hover', false);
  };

  /**
   * Dispose and unbind events
   *
   * @memberof TouchControls
   */
  dispose = () => {
    this.bindEvents(false);
  };
}
