import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

import { Candle } from "./Candle.js";

var camera, scene, renderer;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var pickables = [],candles = [];


function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0x000000);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight,1, 10000);
  camera.position.set(0,100,200);

  let controls = new OrbitControls(camera, renderer.domElement);
  document.body.appendChild(renderer.domElement);

  //////////////////////////////////////////////////////////////////////////////
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.MeshPhongMaterial({
    color: 'black',
    side: THREE.DoubleSide
  }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
 
  candles.push(new Candle(0,0,"candle0","body0","flame0"));
  candles.push(new Candle(40,70,"candle1","body1","flame1"));
  candles.push(new Candle(-100,-10,"candle2","body2","flame2"));
  candles.push(new Candle(-60,90,"candle3","body3","flame3"));
  candles.push(new Candle(110,-30,"candle4","body4","flame4"));
  candles.push(new Candle(20,-100,"candle5","body5","flame5"));
  
  for(let i = 0;i<6;i++){
	  pickables.push(candles[i].candle);
  }
	
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('pointerdown', onDocumentMouseDown, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

   var intersects = raycaster.intersectObjects( pickables, true );
  
  if (intersects.length > 0) {
    if (intersects[0].object.name === "body0"||intersects[0].object.name === "flame0"){
    	candles[0].flameOff();
    } 
    
    else if (intersects[0].object.name === "body1"||intersects[0].object.name === "flame1"){
    	candles[1].flameOff();
    } 
    
  	else if (intersects[0].object.name === "body2"||intersects[0].object.name === "flame2"){
    	candles[2].flameOff();
    } 
    
    else if (intersects[0].object.name === "body3"||intersects[0].object.name === "flame3"){
    	candles[3].flameOff();
    } 
    
    else if (intersects[0].object.name === "body4"||intersects[0].object.name === "flame4"){
    	candles[4].flameOff();
    } 
	else if (intersects[0].object.name === "body5"||intersects[0].object.name === "flame5"){
    	candles[5].flameOff();
    } 
  }

}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
  for(let i = 0;i<6;i++){
	   candles[i].candle.lookAt(camera.position.x,0,camera.position.z);
  }
  
}
export {init, animate, scene};