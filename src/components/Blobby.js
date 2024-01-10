import { useEffect } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Blob() {
  useEffect(() => {
    const noise2D = createNoise2D();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x657174);
    document.getElementById("blob-container").appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05; // Adjust this value to control the smoothness

    // Set other controls properties
    controls.rotateSpeed = 0.8; // Adjust rotation speed if needed
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    const geometry = new THREE.SphereGeometry(0.85, 512, 512);

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FF0000"),
      metalness: 0.9,
      roughness: 0.27,
      envMapIntensity: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      transmission: 0.0,
    });

    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);
    const light = new THREE.AmbientLight(0xffffff, 10);
    scene.add(light);

    const originalPositions = Float32Array.from(
      blob.geometry.attributes.position.array
    );
    let time = 0;

    const animate = function () {
      requestAnimationFrame(animate);
      time += 0.01;

      const positions = blob.geometry.attributes.position.array;
      const normals = blob.geometry.attributes.normal.array;

      for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];
        const noiseValue = noise2D(x + time, y + time);

        positions[i] = x + normals[i] * noiseValue * 0.1;
        positions[i + 1] = y + normals[i + 1] * noiseValue * 0.1;
        positions[i + 2] = z + normals[i + 2] * noiseValue * 0.1;
      }

      blob.geometry.attributes.position.needsUpdate = true;
      controls.update();
      renderer.render(scene, camera);
    };

    // Start the animation loop
    animate();
  }, []);

  return (
    <div id="blob-container" style={{ width: "100vw", height: "100vh" }} />
  );
}
