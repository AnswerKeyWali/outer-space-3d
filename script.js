// === SETUP SCENE ===
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#space"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// === LIGHTS ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(20, 20, 20);
scene.add(ambientLight, pointLight);

// === STARFIELD ===
function addStar() {
  const geometry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(600));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(600).fill().forEach(addStar);

// === EARTH ===
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load(
  "https://threejsfundamentals.org/threejs/resources/images/earth-day.jpg"
);
const earthNormal = textureLoader.load(
  "https://threejsfundamentals.org/threejs/resources/images/earth-normal.jpg"
);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(5, 64, 64),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: earthNormal,
  })
);
scene.add(earth);
earth.position.z = 15;

// === CONTROLS ===
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 10;
controls.maxDistance = 40;

// === CAMERA POSITION ===
camera.position.set(0, 0, 25);

// === RESIZE ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATION LOOP ===
function animate() {
  requestAnimationFrame(animate);

  // Rotate Earth slowly
  earth.rotation.y += 0.0015;

  controls.update();
  renderer.render(scene, camera);
}

animate();
// === MARS ===
const marsTexture = textureLoader.load(
  "https://threejsfundamentals.org/threejs/resources/images/mars_1k_color.jpg"
);
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(2, 64, 64),
  new THREE.MeshStandardMaterial({ map: marsTexture })
);
mars.position.set(-15, 0, -20);
scene.add(mars);
