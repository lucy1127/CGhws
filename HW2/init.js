var renderer, scene, camera ,clock,controls;
var cameraHUD, sceneHUD;
var keyboard = new KeyboardState();

var car;
var pos = new THREE.Vector3();
var vel = new THREE.Vector3();
var force = new THREE.Vector3();
var power, angle;
var Obstacles = [], radius = 10;


(function() {
  Math.clamp = function(val,min,max){
    return Math.min(Math.max(val,min),max);
    
  }})();
  
function initHUD() {

  sceneHUD = new THREE.Scene();
  cameraHUD = new THREE.OrthographicCamera(-10.5, 10.5, 10.5, -10.5, -10, 10);
  cameraHUD.position.z = 5;
  let WW = window.innerWidth;
  let HH = window.innerHeight;
  let planeTB = new THREE.Mesh( new THREE.PlaneGeometry( 0.5, 50 ), new THREE.MeshBasicMaterial( {color: 0xFDF5E6, side: THREE.DoubleSide} ));
  planeTB.position.set(10.5, 0, 0);
  sceneHUD.add( planeTB );
  planeTB = planeTB.clone();
  planeTB.position.set(-10.5, 0, 0);
  sceneHUD.add( planeTB );
  let planeLR = new THREE.Mesh( new THREE.PlaneGeometry( 50, 0.5 ), new THREE.MeshBasicMaterial( {color: 0xFDF5E6, side: THREE.DoubleSide} ));
  planeLR = planeLR.clone();
  planeLR.position.set(0, 10.5, 0);
  sceneHUD.add( planeLR );
  planeLR = planeLR.clone();
  planeLR.position.set(0, -10, 0);
  sceneHUD.add( planeLR );
	
}

function init() {
	
	clock = new THREE.Clock();
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set (0, 200, 250);
	
	camera3PV = new THREE.PerspectiveCamera(50, window.innerWidth/2 / window.innerHeight, 1, 1000);
	camera3PV.position.copy(new THREE.Vector3(-50,30,0));
	camera3PV.lookAt(30,0,0);
	
	scene.add(camera);

	var gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
	scene.add(gridXZ);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xFDF5E6);

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	
	let ambient = new THREE.AmbientLight(0x444444);
	scene.add(ambient);

	let directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(0, 0, 1).normalize();
	scene.add(directionalLight);

	let pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(100, 200, -100);
	scene.add(pointLight);
	
	// disable OrbitControl keys
	controls.enableKeys = false;
	document.body.appendChild(renderer.domElement);
	//////////////
	power = 1.0;
	angle = 0.0;
  	//////////////
	initHUD();
	renderer.autoClear = false;
	
	car = Buildcar();
	car.add(camera3PV);
	scene.add(car);

	for(let i=0;i<4;i++){
		let ObstacleGeometry = new THREE.CylinderGeometry( radius, radius, 20, 50 );
		let Obstacle = new THREE.Mesh (ObstacleGeometry, new THREE.MeshBasicMaterial());
		Obstacles.push(Obstacle);
		scene.add (Obstacle);
		let plusOrMinus = Math.random() < 0.5 ? 1 : -1;
		let plusOrMinus2 = Math.random() < 0.5 ? 1 : -1;
		Obstacle.position.set ((Math.random()*70+30)*plusOrMinus, 10, (Math.random()*70+30)*plusOrMinus2);
	}


}
function Buildcar(){
	let car =  new THREE.Group();
	
	//ExtrudeGeometry
	var length = 0.5, width = 0.5;
	var shape = new THREE.Shape();
	shape.moveTo( 0,0 );
	shape.lineTo( 0, width );
	shape.lineTo( length, width );
	shape.lineTo( length, 0 );
	shape.lineTo( 0, 0 );

	var extrudeSettings = {
		steps: 2, //側面三角形
		depth: 2.5, //長方體長度
		bevelEnabled: true,
		bevelThickness: 1,//頭的斜角長度
		bevelSize: 2.1,//長方體寬度
		bevelOffset: 0, //頭的正面
		bevelSegments: 1//斜角三角形
	};
	
	var egeometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
	var material = new THREE.MeshPhongMaterial( { color: 0x00ffff } );
	var extrude = new THREE.Mesh( egeometry, material ) ;
	extrude.position.set(12,8,0);
	extrude.rotation.y = -Math.PI/2;

	
	var geometry = new THREE.BoxGeometry(20,10,10); //geometry 幾何 y-2.5
	var material = new THREE.MeshPhongMaterial( { color: 0x46A3FF } );
	var body = new THREE.Mesh( geometry,material);
	body.position.set(0,8,0);
	
	var cgeometry = new THREE.CylinderGeometry(2.5,2.5,2,64);// 半徑+2.5 高-5
	var material = new THREE.MeshPhongMaterial( { color: 0x000000 } );
	var wheel = new THREE.Mesh(cgeometry,material);
	var wheel2 = wheel.clone();
	var wheel3 = wheel.clone();
	var wheel4 = wheel.clone();
	wheel.rotation.x = Math.PI / 2;
	wheel2.rotation.x = Math.PI / 2;
	wheel3.rotation.x = Math.PI / 2;
	wheel4.rotation.x = Math.PI / 2;
	
	wheel.position.set(5, 2.5, -6); //x,y,z 左邊 y+2.5
	wheel2.position.set(-5, 2.5, -6);
	wheel3.position.set(5, 2.5, 6);
	wheel4.position.set(-5, 2.5, 6);
	
	car.add(extrude,body,wheel,wheel2,wheel3,wheel4);
	return car;
}
function onWindowResize() {

	var width = window.innerWidth;
	var height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}