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
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshPhongMaterial({
    color: 'black',
    side: THREE.DoubleSide
  }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
 
  
  candles.push(new Candle(0,0,"c0","b0","f0"));
  candles.push(new Candle(50,50,"c1","b1","f1"));
  candles.push(new Candle(-30,-60,"c2","b2","f2"));
  candles.push(new Candle(-50,80,"c3","b3","f3"));
  candles.push(new Candle(70,-50,"c4","b4","f4"));
  
  for(let i = 0;i<5;i++){
	  pickables.push(candles[i].candle);
  }
	
  window.addEventListener('resize', onWindowResize, false);

  document.addEventListener('pointerdown', onDocumentMouseDown, false);
  //document.addEventListener('pointermove', onDocumentMouseMove, false);

  
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {

  // PICKING DETAILS: 
  // convert mouse.xy = [-1,1]^2 (NDC)
  // unproject (mouse.xy, 1) to a point on the far plane (in world coordinate)
  // set raycaster (origin, direction)
  // find intersection objects, (closest first) 
  // each record as
  // [ { distance, point, face, faceIndex, object }, ... ]

  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // find intersections
  /* old style
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 ).unproject( camera );
	raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
    */
  // new style
  raycaster.setFromCamera(mouse, camera);

  // if recursive set to true, can go deeper into object3D hierarchy 
   var intersects = raycaster.intersectObjects( pickables, true );
  // var intersects = raycaster.intersectObjects(pickables);
  
  if (intersects.length > 0) {
    if (intersects[0].object.name === "b0"||intersects[0].object.name === "f0"){
    	candles[0].flameOff();
    } 
    
    else if (intersects[0].object.name === "b1"||intersects[0].object.name === "f1"){
    	candles[1].flameOff();
    } 
    
  	else if (intersects[0].object.name === "b2"||intersects[0].object.name === "f2"){
    	candles[2].flameOff();
    } 
    
    else if (intersects[0].object.name === "b3"||intersects[0].object.name === "f3"){
    	candles[3].flameOff();
    } 
    
    else if (intersects[0].object.name === "b4"||intersects[0].object.name === "f4"){
    	candles[4].flameOff();
    } 
  }

}

/////////////////////////////////////////////////////
// change cursor style
function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(pickables);

  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'auto';
  }
}


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
  for(let i = 0;i<5;i++){
	   candles[i].candle.lookAt(camera.position.x, 0, camera.position.z);
  }
  
}
export {init, animate, scene};