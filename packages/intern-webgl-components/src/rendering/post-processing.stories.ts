import '../style.css';

import {
    Mesh,
    MeshBasicMaterial,
    Vector2,
    Scene,
    BoxBufferGeometry
} from 'three';
import webglScene from '../webgl-scene';

import { IScene } from './post-processing/passes/transition-pass/transition-pass';
import SceneTransitionPostEffect, { GraphicsConfig } from './post-processing/post-processing';
import GUI from '../utils/gui';

export default { title: 'Rendering' };
export const postProcessing = () => {

    const gui = GUI(true);

    const { scene, camera, renderer } = webglScene();
    let resolution = new Vector2();
    renderer.getSize(resolution);

    let sceneA: IScene = {
        scene: scene,
        clearColor: 0x000000,
        cameras: {
            main: camera,
            debug: null,
        },
        update: () => { },
    }
    let sceneB: IScene = {
        scene: new Scene(),
        clearColor: 0x000000,
        cameras: {
            main: camera,
            debug: null,
        },
        update: () => { },
    }

    let sceneTransition = new SceneTransitionPostEffect(renderer, new GraphicsConfig(), gui);
    sceneTransition.setScenes(sceneA, sceneB);

    // add the two different scenes in the transition post effect 
    // sceneA.scene.add(new Mesh(new SphereBufferGeometry(2, 64, 64), new MeshBasicMaterial({ color: 'salmon' })));
    sceneB.scene.add(new Mesh(new BoxBufferGeometry(2, 2, 2), new MeshBasicMaterial({ color: 'blue' })));

    function update() {
        requestAnimationFrame(update);
        sceneTransition.render(0);
    }

    update();
    return renderer.domElement;
}