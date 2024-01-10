import { useEffect } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const vertexShader = `
  varying vec3 vUv; 

  void main() {
    vUv = position; 

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

const fragmentShader = `
  varying vec3 vUv;

  void main() {
    float y = vUv.y * 0.5 + 0.5; // Normalize y to the range 0 to 1

    vec3 red = vec3(1.0, 0.0, 0.0);
    vec3 orange = vec3(1.0, 0.5, 0.0);
    vec3 yellow = vec3(1.0, 1.0, 0.0);
    vec3 green = vec3(0.0, 1.0, 0.0);
    vec3 cyan = vec3(0.0, 1.0, 1.0);
    vec3 blue = vec3(0.0, 0.0, 1.0);
    vec3 purple = vec3(0.6, 0.0, 0.6);

    vec3 color = red;
    color = mix(color, orange, smoothstep(0.0/6.0, 1.0/6.0, y));
    color = mix(color, yellow, smoothstep(1.0/6.0, 2.0/6.0, y));
    color = mix(color, green, smoothstep(2.0/6.0, 3.0/6.0, y));
    color = mix(color, cyan, smoothstep(3.0/6.0, 4.0/6.0, y));
    color = mix(color, blue, smoothstep(4.0/6.0, 5.0/6.0, y));
    color = mix(color, purple, smoothstep(5.0/6.0, 6.0/6.0, y));

    gl_FragColor = vec4(color, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

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
    controls.dampingFactor = 0.05;

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    const geometry = new THREE.SphereGeometry(0.85, 512, 512);

    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);
    const light = new THREE.AmbientLight(0xffffff, 20);
    scene.add(light);
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(0, 1, 1);
    scene.add(light1);
    const originalPositions = Float32Array.from(
      blob.geometry.attributes.position.array
    );
    const spotLight1 = new THREE.SpotLight(0xffffff);
    spotLight1.position.set(0, 5, 10);
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xffffff);
    spotLight2.position.set(10, -5, 0);
    scene.add(spotLight2);

    const spotLight3 = new THREE.SpotLight(0xffffff);
    spotLight3.position.set(-10, -5, 0);
    scene.add(spotLight3);
    let time = 0;
    // const material = new THREE.MeshPhysicalMaterial({
    //   color: new THREE.Color("rgb(0,0,250)"),
    //   metalness: 0.88,
    //   roughness: 0.27,
    //   envMapIntensity: 0.81,
    //   clearcoat: 1.0,
    //   clearcoatRoughness: 0.0,
    //   transmission: 0.0,
    // });
    const animate = function () {
      requestAnimationFrame(animate);
      time += 0.015;

      const positions = blob.geometry.attributes.position.array;
      const normals = blob.geometry.attributes.normal.array;

      // Define the number of waves and the frequency of waves
      const numberOfWaves = 2.7; // Adjust this value to get the desired number of waves
      const frequencyOfWaves = 1.0; // Adjust this value to get the desired frequency of waves

      // Keep the distortion intensity low to prevent the blob from moving
      const distortionIntensity = 0.5;
      const waveDistortion = 0.3; // Adjust this value to get the desired wave distortion

      for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];
        const noiseValue = noise2D(
          x * numberOfWaves + time * frequencyOfWaves,
          y * numberOfWaves + time * frequencyOfWaves
        );
        positions[i] =
          x + normals[i] * noiseValue * distortionIntensity * waveDistortion;
        positions[i + 1] =
          y +
          normals[i + 1] * noiseValue * distortionIntensity * waveDistortion;
        positions[i + 2] =
          z +
          normals[i + 2] * noiseValue * distortionIntensity * waveDistortion;
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
