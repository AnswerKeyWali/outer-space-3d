// === 3D Solar System by Mahesh Meena ===

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#space") });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const pointLight = new THREE.PointLight(0xffffff, 2);
scene.add(ambientLight, pointLight);

// Texture loader
const loader = new THREE.TextureLoader();
const base = "https://threejsfundamentals.org/threejs/resources/images/";

// Create Sun
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(10, 64, 64),
  new THREE.MeshBasicMaterial({ map: loader.load(base + "sun.jpg") })
);
scene.add(sun);

// Planet data: [size, distance from sun, texture, orbit speed]
const planetsData = [
  [1, 16, "mercury.jpg", 0.02],
  [1.5, 22, "venus.jpg", 0.015],
  [2, 30, "earth-day.jpg", 0.01],
  [1.8, 38, "mars_1k_color.jpg", 0.008],
  [4, 52, "jupiter.jpg", 0.006],
  [3.5, 68, "saturn.jpg", 0.005],
  [3, 80, "uranus.jpg", 0.004],
  [2.5, 92, "neptune.jpg", 0.003]
];

const planets = [];

// Create planets
for (let [size, dist, tex, speed] of planetsData) {
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(size, 64, 64),
    new THREE.MeshStandardMaterial({ map: loader.load(base + tex) })
  );
  planet.userData = { distance: dist, speed, angle: Math.random() * Math.PI * 2 };
  scene.add(planet);
  planets.push(planet);
}

// Stars background
const starsGeometry = new THREE.BufferGeometry();
const starCount = 1000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 2000;
}
starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
scene.add(new THREE.Points(starsGeometry, starsMaterial));

// Camera setup
camera.position.set(0, 40, 120);
camera.lookAt(scene.position);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
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
