import { Object3D, Raycaster, Vector2, PerspectiveCamera, Intersection } from 'three';
import EventEmitter from 'eventemitter3';
import TouchControls, { Pointer } from './touch-controls';

export type InteractiveObjectOptions = {
  touchStart?: boolean;
  touchMove?: boolean;
  touchEnd?: boolean;
  hover?: boolean;
  mouseMove?: boolean;
};

/**
 * Adds mouse and touch events to Object3D inherited objects
 *
 * @export
 * @class InteractiveObject
 * @extends {EventEmitter}
 */
export default class InteractiveObject extends EventEmitter {
  object: Object3D;
  camera: PerspectiveCamera;
  options: InteractiveObjectOptions;
  touchControls: TouchControls;
  raycaster: Raycaster = new Raycaster();
  coords: Vector2 = new Vector2();
  intersects: Array<Intersection<Object3D<Event>>> | null;
  fired: { hoverOut: boolean; hoverOver: boolean };
  intersected = false;
  hovering = false;

  constructor(
    object: Object3D,
    camera: PerspectiveCamera,
    element: HTMLElement,
    options: InteractiveObjectOptions = {}
  ) {
    super();
    this.object = object;
    this.camera = camera;
    this.options = Object.assign(
      {
        mouseMove: false, // raycast everytime the mouse moves
        touchStart: true, // only fires when clicking down on an object successfully
        touchMove: true, // fires when mouse or touch is moved on and off an object
        touchEnd: true // fires when touch or mouse is released on and off an object
      },
      options
    );
    this.touchControls = new TouchControls(element, { hover: true });

    this.intersects = null;
    this.fired = {
      hoverOut: true, // Only fire hover out once per rollover
      hoverOver: false // Only fire hover out once per rollover
    };
  }

  /**
   * Bind mouse and touch events
   *
   * @param {boolean} bind
   * @memberof InteractiveObject
   */
  bindEvents = (bind: boolean) => {
    const listener = bind ? 'on' : 'off';
    if (this.options.touchStart) this.touchControls[listener]('start', this.onTouchStart);
    if (this.options.touchMove) this.touchControls[listener]('move', this.onTouchMove);
    if (this.options.touchMove) this.touchControls[listener]('mousemove', this.onTouchMove);
    if (this.options.touchEnd || this.options.touchMove) this.touchControls[listener]('end', this.onTouchEnd);
  };

  /**
   * Touch start handler
   *
   * @param {Array<Pointer>} event
   * @memberof InteractiveObject
   */
  onTouchStart = (event: Array<Pointer>) => {
    this.setCoords(event[0].normalX, event[0].normalY);
    this.intersected = this.raycast();
    if (this.intersected) {
      this.emit('start', this.intersects?.[0]);
    }
  };

  /**
   * Touch and mouse move handler
   *
   * @param {Array<Pointer>} event
   * @memberof InteractiveObject
   */
  onTouchMove = (event: Array<Pointer>) => {
    this.setCoords(event[0].normalX, event[0].normalY);
    this.intersected = this.raycast();
    this.hovering = this.intersected;
    if (this.intersected) {
      if (!this.fired.hoverOver || this.options.mouseMove) this.emit('hover', true, this.intersects?.[0]);
      this.fired.hoverOut = false;
      this.fired.hoverOver = true;
    } else if (!this.fired.hoverOut) {
      this.fired.hoverOut = true;
      this.fired.hoverOver = false;
      this.emit('hover', false);
    }
  };

  /**
   * Touch and hover out handler
   *
   * @memberof InteractiveObject
   */
  onTouchEnd = () => {
    if (this.hovering) {
      this.hovering = false;
      this.emit('hover', false);
    }
    if (this.intersected) {
      this.intersected = false;
      this.emit('end');
    }
  };

  /**
   * Set the screenspace coords for the raycaster
   *
   * @param {number} normalX
   * @param {number} normalY
   * @memberof InteractiveObject
   */
  setCoords = (normalX: number, normalY: number) => {
    this.coords.x = normalX * 2 - 1;
    this.coords.y = -normalY * 2 + 1;
  };

  /**
   * Raycast against the object
   *
   * @memberof InteractiveObject
   */
  raycast = (): boolean => {
    this.raycaster.setFromCamera(this.coords, this.camera);
    this.intersects = this.raycaster.intersectObject(this.object);
    return this.intersects.length > 0;
  };

  /**
   * Dispose and unbind events
   *
   * @memberof InteractiveObject
   */
  dispose = () => {
    this.touchControls.dispose();
    this.bindEvents(false);
  };
}
