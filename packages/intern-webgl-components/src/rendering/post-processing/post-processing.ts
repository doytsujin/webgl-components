import { Vector2, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
// import graphics from '../graphics/graphics';
// import graphicsConfig from '../graphics/config';
import TransitionPass, { IScene } from './passes/transition-pass/transition-pass';
//import { getRenderBufferSize, rendererSize } from '../resize';
//import EmptyScene from '@/webgl-app/scenes/empty-scene/empty-scene';
//import { IScene } from '@/webgl-app/scenes/base-scene/base-scene';

const GUI = require('lil-gui');

export class GraphicsConfig {
    antialias: boolean = true;
    pixelRatio: number = 1.0;
    maxFramebufferSize: Vector2 = new Vector2(1280, 720);
}


/**
 * Post processing manager
 *
 * @export
 * @class PostProcessing
 */
export default class SceneTransitionPostEffect {
    gui: typeof GUI;
    composer: EffectComposer;
    transitionPass: TransitionPass;
    fxaaPass: ShaderPass;
    sceneA!: IScene;
    sceneB!: IScene;

    constructor(renderer: WebGLRenderer, config: GraphicsConfig, gui: typeof GUI | null) {
        this.gui = gui.addFolder('post processing');
        this.gui.open();

        const { pixelRatio } = new GraphicsConfig();//graphicsConfig(graphics.mode);

        this.composer = new EffectComposer(renderer);
        this.composer.setPixelRatio(pixelRatio);

        this.transitionPass = new TransitionPass(config.maxFramebufferSize, false, this.gui);
        this.fxaaPass = new ShaderPass(FXAAShader);

        this.composer.addPass(this.transitionPass);
        this.composer.addPass(this.fxaaPass);

        this.gui.add(this.fxaaPass, 'enabled').name('fxaa');
    }

    /**
     * Set the current webgl scene
     *
     * @param {IScene} scene
     * @memberof PostProcessing
     */
    setCurrentScene(scene: IScene) {
        this.transitionPass.setScenes(this.transitionPass.sceneB, scene);
    }

    /**
     * Set both scenes
     *
     * @param {IScene} sceneA
     * @param {IScene} sceneB
     * @memberof PostProcessing
     */
    setScenes(sceneA: IScene, sceneB: IScene) {
        this.transitionPass.setScenes(sceneA, sceneB);
    }

    /**
     * Resize handler
     *
     * @memberof PostProcessing
     */
    resize() {
        // const { width, height } = getRenderBufferSize();
        // this.fxaaPass.material.uniforms.resolution.value.x = 1 / width;
        // this.fxaaPass.material.uniforms.resolution.value.y = 1 / height;
        // this.composer.setSize(rendererSize.x, rendererSize.y);
        // this.transitionPass.setSize(width, height);
    }

    /**
     * Render
     *
     * @param {number} delta
     * @memberof PostProcessing
     */
    render(delta: number) {
        this.composer.render(delta);
    }
}
