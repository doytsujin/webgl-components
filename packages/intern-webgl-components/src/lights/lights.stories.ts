import { AmbientLight, SpotLightHelper, CameraHelper, SpotLight, sRGBEncoding, PCFSoftShadowMap, MeshPhongMaterial, CylinderGeometry, PlaneGeometry, Mesh } from 'three';
import '../style.css';
import webglScene from '../webgl-scene';
import GUI from '../utils/gui';
import AmbientLightController from './ambient-light';
import DirectionalLightController from './directional-light';
import { PointLightController } from './point-light';
import { SpotLightController } from './spot-light';

export default { title: 'Lights' };

export const LightsTestBed = () => {
    const gui = GUI(true);
    const { renderer, camera, scene } = webglScene(false);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.outputEncoding = sRGBEncoding;

    const ambient = new AmbientLightController({ color: 0x0000FF, intensity: 0.1 });
    ambient.addGUI(gui);
    scene.add(ambient.light);

    const directional = new DirectionalLightController({ color: 0xFFFF00, intensity: 0.1 });
    directional.addGUI(gui);

    directional.light.position.set(-15, 40, 35);
    directional.light.lookAt(0.0, 0.0, 0.0);
    directional.light.castShadow = true;
    directional.light.shadow.camera.near = 1;
    directional.light.shadow.camera.far = 100;
    directional.light.shadow.camera.right = 15;
    directional.light.shadow.camera.left = - 15;
    directional.light.shadow.camera.top = 15;
    directional.light.shadow.camera.bottom = - 15;
    directional.light.shadow.mapSize.width = 1024;
    directional.light.shadow.mapSize.height = 1024;
    scene.add(directional.light);


    let spotLight = new SpotLightController();
    spotLight.addGUI(gui);
    spotLight.light.position.set(15, 40, 35);
    spotLight.light.angle = Math.PI / 4;
    spotLight.light.penumbra = 0.1;
    spotLight.light.decay = 2;
    spotLight.light.distance = 200;

    spotLight.light.castShadow = true;
    spotLight.light.shadow.mapSize.width = 512;
    spotLight.light.shadow.mapSize.height = 512;
    spotLight.light.shadow.camera.near = 10;
    spotLight.light.shadow.camera.far = 200;
    spotLight.light.shadow.focus = 1;
    scene.add(spotLight.light);

    let lightHelper = new SpotLightHelper(spotLight.light);
    scene.add(lightHelper);

    let shadowCameraHelper = new CameraHelper(directional.light.shadow.camera);
    scene.add(shadowCameraHelper);

    let material = new MeshPhongMaterial({ color: 0x808080, dithering: true });
    let geometry = new PlaneGeometry(200, 200);

    let mesh = new Mesh(geometry, material);
    mesh.position.set(0, - 1, 0);
    mesh.rotation.x = - Math.PI * 0.5;
    mesh.receiveShadow = true;
    scene.add(mesh);

    //

    material = new MeshPhongMaterial({ color: 0x4080ff, dithering: true });

    let circleGeometry = new CylinderGeometry(5, 5, 2, 32, 1, false);

    let cmesh = new Mesh(circleGeometry, material);
    cmesh.position.set(0, 5, 0);
    cmesh.castShadow = true;
    scene.add(cmesh);


    //spotLight.addGUI(gui);

    function update() {
        requestAnimationFrame(update);
        cmesh.rotateX(0.01);

        renderer.render(scene, camera);
    }
    update();

    return renderer.domElement;
};
