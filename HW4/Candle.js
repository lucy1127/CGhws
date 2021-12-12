import * as THREE from "https://threejs.org/build/three.module.js";
import {scene} from './main.js';

class Candle{
	constructor(x,z,Can,b,flame){
	
		var candle = new THREE.Object3D();
		let body = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 20, 36), new THREE.MeshPhongMaterial({color: 'red',side: THREE.DoubleSide}));
		candle.add(body);
		candle.name = Can;
		body.position.y = 5;
		body.name = b;
		let loader = new THREE.TextureLoader();
		// load a resource
		//let texture = loader.load( 'https://i.imgur.com/M2tr5Tm.png?1');
		let texture = loader.load( 'flame.png');
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(1/3,1/3);
		texture.offset.set(0,2/3);
		var texMat = new THREE.MeshBasicMaterial({
			map: texture,
			alphaTest: 0.5
		});

		let flameMesh = new THREE.Mesh(new THREE.PlaneGeometry(30,30), texMat);
		candle.add(flameMesh);
		flameMesh.name = flame;
		scene.add(candle);
		flameMesh.position.y = 20;

		let light = new THREE.PointLight('white', 0.5);
		light.position.copy(flameMesh.position);
		light.castShadow = true;
		candle.add(light);
		candle.position.set(x,0,z);
	  
		this.candle = candle;
		this.body = body;
		this.light = light;
		this.flameMesh = flameMesh;
		this.interval = setInterval (this.textureAnimate.bind(this), 100);	
		this.count = undefined;
  }
  
  textureAnimate() {
	  this.count = (this.count === undefined) ? 1 : this.count;
		if (this.flameMesh !== undefined) {
			var texture = this.flameMesh.material.map;
				texture.offset.x += 1 / 3;
			if (this.count % 3 === 0) {
				texture.offset.y -= 1 / 3;
			}
			this.count++;
		}
	}
	
	flameOn(){
		clearInterval(this.off);
		this.interval = setInterval(this.textureAnimate.bind(this), 200);
	    this.flameMesh.material.visible = true;
	    this.light.visible = true;
	}
	
	flameOff(){
		clearInterval(this.interval);
		this.off = setInterval(this.flameOn.bind(this), 3000);
	    this.flameMesh.material.visible = false;
	    this.light.visible = false;
	}
}
export { Candle };