import * as THREE from "https://threejs.org/build/three.module.js";
import {scene} from './main.js';

class Candle{
	constructor(x,z,Can,b,flame){
	
		this.candle = new THREE.Object3D();
		this.candle.name = Can;
		this.body = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 20, 36), new THREE.MeshPhongMaterial({color: 'red',side: THREE.DoubleSide}));
		this.body.position.y = 5;
		this.body.name = b;
		this.candle.add(this.body);
		
		
		let loader = new THREE.TextureLoader();
		let texture = loader.load( 'flame.png');
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(1/3,1/3);
		texture.offset.set(0,2/3);
		var texMat = new THREE.MeshBasicMaterial({
			map: texture,
			alphaTest: 0.5
		});

		this.flameMesh = new THREE.Mesh(new THREE.PlaneGeometry(30,30), texMat);
		this.flameMesh.name = flame;
		this.flameMesh.position.y = 20;
		this.candle.add(this.flameMesh);
		
		this.light = new THREE.PointLight('white', 0.5);
		this.light.position.copy(this.flameMesh.position);
		this.light.castShadow = true;
		this.candle.add(this.light);
		this.candle.position.set(x,0,z);
		scene.add(this.candle);

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
		this.interval = setInterval(this.textureAnimate.bind(this), 100);
	    this.flameMesh.material.visible = true;
	    this.light.visible = true;
	}
	
	flameOff(){
		clearInterval(this.interval);
		this.off = setTimeout(this.flameOn.bind(this), 3000);
	    this.flameMesh.material.visible = false;
	    this.light.visible = false;
	}
}
export { Candle };