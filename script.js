// === SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#space") });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// === LIGHT ===
const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
scene.add(pointLight);

// === TEXTURE LOADER ===
const loader = new THREE.TextureLoader();

// === SUN ===
const sunTex = loader.load("https://threejsfundamentals.org/threejs/resources/images/sun.jpg");
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(10, 64, 64),
  new THREE.MeshBasicMaterial({ map: sunTex })
);
scene.add(sun);

// === PLANET FACTORY ===
function createPlanet(size, texture, distance) {
  const geo = new THREE.SphereGeometry(size, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ map: loader.load(texture) });
  const mesh = new THREE.Mesh(geo, mat);

  const obj = new THREE.Object3D(); // orbit pivot
  obj.add(mesh);
  mesh.position.x = distance;
  scene.add(obj);
  return { mesh, obj };
}

// === PLANETS ===
const mercury = createPlanet(1, "https://threejsfundamentals.org/threejs/resources/images/mercury.jpg", 15);
const venus = createPlanet(1.5, "https://threejsfundamentals.org/threejs/resources/images/venus.jpg", 20);
const earth = createPlanet(2, "https://threejsfundamentals.org/threejs/resources/images/earth-day.jpg", 25);
const mars = createPlanet(1.6, "https://threejsfundamentals.org/threejs/resources/images/mars_1k_color.jpg", 32);
const jupiter = createPlanet(4, "https://threejsfundamentals.org/threejs/resources/images/jupiter.jpg", 45);
const saturn = createPlanet(3.5, "https://threejsfundamentals.org/threejs/resources/images/saturn.jpg", 60);
const uranus = createPlanet(2.5, "https://threejsfundamentals.org/threejs/resources/images/uranus.jpg", 75);
const neptune = createPlanet(2.5, "https://threejsfundamentals.org/threejs/resources/images/neptune.jpg", 90);

// === SATURN RINGS ===
const ringGeo = new THREE.RingGeometry(4.5, 6, 64);
const ringMat = new THREE.MeshBasicMaterial({
  map: loader.load("https://threejsfundamentals.org/threejs/resources/images/saturnring.png"),
  side: THREE.DoubleSide,
  transparent: true,
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2;
saturn.mesh.add(ring);

// === MOON around EARTH ===
const moonTex = loader.load("https://threejsfundamentals.org/threejs/resources/images/moon.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTex })
);
const moonObj = new THREE.Object3D();
moonObj.add(moon);
moon.position.x = 3;
earth.mesh.add(moonObj);

// === SATELLITE (small cube) ===
const satGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
const satMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
const satellite = new THREE.Mesh(satGeo, satMat);
const satOrbit = new THREE.Object3D();
satOrbit.add(satellite);
satellite.position.x = 4;
earth.mesh.add(satOrbit);

// === STARFIELD ===
const starGeo = new THREE.BufferGeometry();
const starCount = 2000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 2000;
}
starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// === CONTROLS ===
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
camera.position.set(0, 40, 120);

// === RESIZE ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATION ===
function animate() {
  requestAnimationFrame(animate);

  // rotate Sun
  sun.rotation.y += 0.001;

  // orbit speeds (in radians)
  mercury.obj.rotation.y += 0.015;
  venus.obj.rotation.y += 0.012;
  earth.obj.rotation.y += 0.01;
  mars.obj.rotation.y += 0.008;
  jupiter.obj.rotation.y += 0.006;
  saturn.obj.rotation.y += 0.005;
  uranus.obj.rotation.y += 0.004;
  neptune.obj.rotation.y += 0.003;

  // self rotations
  earth.mesh.rotation.y += 0.02;
  mars.mesh.rotation.y += 0.018;
  jupiter.mesh.rotation.y += 0.015;
  saturn.mesh.rotation.y += 0.015;
  uranus.mesh.rotation.y += 0.012;
  neptune.mesh.rotation.y += 0.012;

  // moon + satellite orbit
  moonObj.rotation.y += 0.03;
  satOrbit.rotation.y += 0.04;

  controls.update();
  renderer.render(scene, camera);
}
animate();
