## usage

This JavaScript module exports a single React component named Blob. This component uses the Three.js library to create a 3D blob object that is animated with a wave-like distortion. The blob's color changes based on its y-coordinate.

## dependencies

- React
- Three.js
- simplex-noise

### installation

To install the Blob component, run the following command in your project directory:

```bash
git clone https://github.com/rameshvoodi/Blobby.git
```

cd into the bloby directory:

```bash
cd bloby
```

Install the dependencies:

```bash
yarn install
```
run the project:

```bash
yarn dev
```



# usage

To use the Blob component, simply import it and use it like any other React component:

```javascript

import Blob from './Blob';

function App() {
  return (
    <div>
      <Blob />
    </div>
  );
}

export default App;

```
This will render the Blob component in your application.

## Component details

The Blob component uses the useEffect hook to set up the Three.js scene when the component is first rendered. This includes creating the blob object, setting up the camera and renderer, and starting the animation loop.

The blob object is created using a THREE.Mesh with a THREE.SphereGeometry and a custom THREE.ShaderMaterial. The ShaderMaterial uses GLSL shaders to control the appearance of the blob. The vertex shader passes the position of each vertex to the fragment shader, and the fragment shader uses this position to calculate the color of each pixel.

The animation loop updates the position of each vertex in the blob's geometry based on a 2D noise function. This creates a wave-like distortion effect. The loop also updates the controls and renders the scene.

The Blob component returns a div with the id "blob-container". The Three.js renderer attaches its canvas to this div.


## customization

You can customize the appearance and behavior of the blob by modifying the constants in the animate function:


- **numberOfWaves**:  Controls the number of waves in the distortion effect.
- **frequencyOfWaves**: Controls the frequency of the waves.
- **numberOfWaves**:  Controls the intensity of the distortion effect.
- **numberOfWaves**: Controls the distortion of the waves.


## Color customization

You can use MeshphysicalMaterial to add a specific color along with metalness, roughness and other properties.

``` javascript
 const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("rgb(0,0,250)"),
      metalness: 0.88,
      roughness: 0.27,
      envMapIntensity: 0.81,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      transmission: 0.0,
    });
```
## spotlight

You can use spotlight to add a light source to the scene.

``` javascript
 const spotLight1 = new THREE.SpotLight(0xffffff);
    spotLight1.position.set(0, 5, 10);
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xffffff);
    spotLight2.position.set(10, -5, 0);
    scene.add(spotLight2);

    const spotLight3 = new THREE.SpotLight(0xffffff);
    spotLight3.position.set(-10, -5, 0);
    scene.add(spotLight3);

 ```
