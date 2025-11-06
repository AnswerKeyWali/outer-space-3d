// === 3D SOLAR SYSTEM ===
// Mahesh Meena (modern module version)

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

// === SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#space") });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// === LIGHTS ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const pointLight = new THREE.PointLight(0xffffff, 2);
scene.add(ambientLight, pointLight);

// === TEXTURE LINKS (NASA official from three.js repo) ===
const textures = {
  sun: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/sun.jpg",
  mercury: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury.jpg",
  venus: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus.jpg",
  earth: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg",
  mars: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1k_color.jpg",
  jupiter: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter.jpg",
  saturn: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn.jpg",
  uranus: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus.jpg",
  neptune: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune.jpg",
};

const loader = new THREE.TextureLoader();

// === SUN ===
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(10, 64, 64),
  new THREE.MeshBasicMaterial({ map: loader.load(textures.sun) })
);
scene.add(sun);

// === PLANETS CONFIG ===
// [radius, distance from sun, texture, orbit speed]
const planetsData = [
  [1, 18, textures.mercury, 0.02],
  [1.5, 25, textures.venus, 0.015],
  [2, 34, textures.earth, 0.01],
  [1.8, 42, textures.mars, 0.008],
  [4, 58, textures.jupiter, 0.006],
  [3.5, 74, textures.saturn, 0.005],
  [3, 88, textures.uranus, 0.004],
  [2.5, 102, textures.neptune, 0.003],
];

const planets = [];

for (let [radius, dist, texture, speed] of planetsData) {
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 64, 64),
    new THREE.MeshStandardMaterial({ map: loader.load(texture) })
  );
  planet.userData = { distance: dist, speed, angle: Math.random() * Math.PI * 2 };
  scene.add(planet);
  planets.push(planet);
}

// === BACKGROUND STARS ===
const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 2000;
}
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// === CAMERA + CONTROLS ===
camera.position.set(0, 50, 140);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;

// === RESPONSIVE ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATION LOOP ===
function animate() {
  requestAnimationFrame(animate);

  sun.rotation.y += 0.002;

  for (let planet of planets) {
    planet.userData.angle += planet.userData.speed;
    planet.position.x = planet.userData.distance * Math.cos(planet.userData.angle);
    planet.position.z = planet.userData.distance * Math.sin(planet.userData.angle);
    planet.rotation.y += 0.01;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
