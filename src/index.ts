import * as THREE from "three";
import * as fgui from "fairygui-three";
import { PerspectiveCamera, AxesHelper, GridHelper, Group } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export class Threescene {
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer;
    private camera: PerspectiveCamera;
    private controls: OrbitControls;

    private _view: fgui.GComponent;

    constructor() {
        this.init();
    }

    private init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0X222222);
        this.renderer.sortObjects = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.localClippingEnabled = true;
        this.renderer.autoClear = false;

        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }, false);

        this.scene = new THREE.Scene();

        fgui.Stage.init(this.renderer);
        fgui.Stage.scene = this.scene;

        fgui.UIPackage.loadPackage("assets/UI/3DInventory").then(this.start.bind(this));

        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        this.camera = new PerspectiveCamera(60, aspect, 1, 2000);
        this.camera.position.set(500, 200, 500);
        this.camera.lookAt(this.scene.position);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.animate();
    }

    private start() {
        this._view = fgui.UIPackage.createObject("3DInventory", "Main").asCom;
        this._view.displayObject.setLayer(0);
        this._view.displayObject.camera = this.camera;

        let container = new Group();
        container.scale.set(0.5, 0.5, 0.5);
        container.rotation.y = Math.PI / 6;
        container.add(this._view.obj3D);
        this.scene.add(container);

        let helper = new GridHelper(2000, 10);
        this.scene.add(helper);

        let helper2 = new AxesHelper(2000);
        this.scene.add(helper2);

        this._view.getTransition("show").play();
    }

    private render() {
        fgui.Stage.update();

        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.render(this.scene, fgui.Stage.camera);
    }

    private animate = () => {
        requestAnimationFrame(this.animate)
        this.render()
    }
}

new Threescene();