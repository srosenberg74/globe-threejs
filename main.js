import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const a = new THREE.Vector3(0, 1, 0);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let clickPoint = new THREE.Vector3();

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
const sphereRadius = 3;
const geometry = new THREE.SphereGeometry(sphereRadius, 80, 80);
const atmosphereGeometry = new THREE.SphereGeometry(3.07, 20, 20)
const cloudTexture = new THREE.TextureLoader().load("/images/clouds.jpg");
const atmosphereMaterial = new THREE.MeshLambertMaterial({ opacity: .4, transparent: true, map: cloudTexture })
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
scene.add(atmosphere)

const sunGeometry = new THREE.SphereGeometry(1000, 50, 50)
const texture = new THREE.TextureLoader().load("/images/globe3.jpg");

texture.wrapS = THREE.RepeatWrapping;
texture.offset.x = 3.14 / (2 * Math.PI);
const material = new THREE.MeshStandardMaterial({ map: texture });
const sunMaterial = new THREE.MeshLambertMaterial({color: 0xfa6c25, emissive: 0xfa6c25, reflectivity: 1})

const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( -1600, 200, -400 );
scene.add( spotLight );

const spotLightHelper = new THREE.SpotLightHelper( spotLight );
scene.add( spotLightHelper );

const globe = new THREE.Mesh(geometry, material);
scene.add(globe);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun)
sun.position.set(-1600, 200, -400)
spotLight.lookAt(globe)
scene.add(spotLight.target)
spotLight.target = globe

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;

function onClick(event) {
  const mouse = new THREE.Vector2();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersect = raycaster.intersectObject(globe);
  if (intersect.length) {
    clickPoint = intersect[0].point;

    const longOffset = -.1702;
    const latOffset = .0802
    const latitude =
      90 - (Math.acos(clickPoint.y / sphereRadius) * 180) / Math.PI + latOffset;
    const longitude =
      ((270 + (Math.atan2(clickPoint.x, clickPoint.z) * 180) / Math.PI) % 360) -
      180 +
      longOffset;

    console.log(latitude, longitude);
  }

  // const getCountry = fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false`)
  // .then((response) => response.json())
  // .then((data) => console.log(data));
}

window.addEventListener("click", onClick);
window.addEventListener("mousemove", onPointerMove);
const ambientLight = new THREE.AmbientLight(0xffffff, .4)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 2, 3000)
scene.add(pointLight)

const earthAtmosphere = new THREE.PointLight(0x00d2fc, 200, 14000, 0)
earthAtmosphere.position.set(globe.position)
scene.add(earthAtmosphere)

camera.position.z = 12;
controls.update();
// let axisOfRotation = new THREE.Vector3(.2,.2,.2);
// let angleOfRotation = 1.2
// let quaternion = new THREE.Quaternion().setFromAxisAngle( axisOfRotation, angleOfRotation );
// globe.rotation.set( new THREE.Euler().setFromQuaternion( quaternion ) );

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  globe.rotation.y += .001
  atmosphere.rotation.y += .0012
  atmosphere.rotation.z += .00018

}
animate();



    // let latitude = Math.acos(clickPoint.y / sphereRadius);
    // let longitude = Math.atan(clickPoint.x / clickPoint.z);

    // let latitude = Math.acos(clickPoint.y/sphereRadius)
    // let longitude = Math.atan(clickPoint.x/clickPoint.z)
    // let latitude = Math.asin((clickPoint.y/sphereRadius)*Math.PI/180)
    // let longitude = Math.asin((clickPoint.x/(sphereRadius * Math.cos(latitude)))*Math.PI/180)