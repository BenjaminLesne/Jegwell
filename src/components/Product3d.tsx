import * as THREE from "three";
import { Canvas, extend } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { DDSLoader, GLTFLoader } from "three-stdlib";
import { type MutableRefObject, Suspense } from "react";
import Poimandres from "~/assets/3D/Poimandres.json";
// extend({ DDSLoader });

// THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

type Props = {
  // eventSource: HTMLElement | MutableRefObject<HTMLElement> | undefined;
  // eventPrefix: "offset" | "client" | "page" | "layer" | "screen" | undefined;
};

const Model = () => {
  const gltf = useLoader(GLTFLoader, "/Poimandres.gltf");
  return (
    <>
      <primitive object={gltf.scene} scale={0.4} />
    </>
  );
};

export const Product3d = (props: Props) => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <Model />
        <OrbitControls />
        <Environment preset="sunset" background />
      </Suspense>
    </Canvas>
  );
};

export default Product3d;
