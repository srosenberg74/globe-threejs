import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const a = new THREE.Vector3( 0, 1, 0 );
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let clickPoint = new THREE.Vector3();

function onPointerMove( event ) {

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild( renderer.domElement );
const sphereRadius = 3
const geometry = new THREE.SphereGeometry( sphereRadius, 80, 80 );
const texture = new THREE.TextureLoader().load('/images/globe2.jpg')
texture.wrapS = THREE.RepeatWrapping;
texture.offset.x = 3.14/(2*Math.PI)
const material = new THREE.MeshBasicMaterial( { map: texture } );

const globe = new THREE.Mesh( geometry, material );
scene.add( globe );

const controls = new OrbitControls( camera, renderer.domElement,  );
controls.enableDamping =true
controls.enableZoom = true

function onClick( event ) {

const mouse = new THREE.Vector2()


  mouse.x = event.clientX / window.innerWidth * 2 - 1
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersect = raycaster.intersectObject(globe)
  if(intersect) clickPoint = intersect[0].point
  console.log(intersect)


  // let latitude = Math.acos(clickPoint.y / sphereRadius);
  // let longitude = Math.atan(clickPoint.x / clickPoint.z);

  // let latitude = Math.acos(clickPoint.y/sphereRadius)
  // let longitude = Math.atan(clickPoint.x/clickPoint.z)
  // let latitude = Math.asin((clickPoint.y/sphereRadius)*Math.PI/180)
  // let longitude = Math.asin((clickPoint.x/(sphereRadius * Math.cos(latitude)))*Math.PI/180)
  const offset = 8;
  const latitude = (90 - (Math.acos(clickPoint.y / sphereRadius)) * 180 / Math.PI) + offset;
  const longitude = (((270 + (Math.atan2(clickPoint.x , clickPoint.z)) * 180 / Math.PI) % 360) - 180) + offset;

  
  console.log(latitude, longitude)

  const getCountry = fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false`)
  .then((response) => response.json())
  .then((data) => console.log(data));
}

window.addEventListener( 'click', onClick );
window.addEventListener( 'mousemove', onPointerMove );

camera.position.z = 12;
controls.update();

function animate() {
	requestAnimationFrame( animate );
  controls.update();
	renderer.render( scene, camera );
}
animate();