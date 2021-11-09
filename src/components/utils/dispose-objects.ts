import { Mesh, Object3D, Scene } from 'three';

/**
 * Dispose of a threejs scene or object3D
 *
 * @export
 * @param {(Scene | Object3D)} object
 * @param {(Scene | Object3D | null)} parent
 * @return {*}  {void}
 */
export default function disposeObjects(object: Scene | Object3D, parent: Scene | Object3D | null): void {
  if (object === null || object === undefined) return;
  if (parent) parent.remove(object);

  if (object instanceof Mesh) {
    object.geometry.dispose();
  }
  if (object instanceof Mesh) {
    object.material.dispose();
  }
  if (object.children) {
    let i = 0;
    const l = object.children.length;
    while (i < l) {
      disposeObjects(object.children[0], object);
      i++;
    }
  }
}
