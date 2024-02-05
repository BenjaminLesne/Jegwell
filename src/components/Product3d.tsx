import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib";
import { Suspense } from "react";
import { Loading } from "./Loading/Loading";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "/ring/scene.gltf");
  // const gltf = useLoader(GLTFLoader, "/ring2/scene.gltf");
  // const gltf = useLoader(GLTFLoader, "/Poimandres.gltf");
  return (
    <>
      <primitive object={gltf.scene} scale={0.4} />
    </>
  );
};

export const Product3d = () => {
  return (
    <Canvas className="mx-auto h-[400px] max-h-[400px] w-[400px] max-w-full object-cover lg:mt-5">
      <Suspense fallback={null}>
        <Model />
        <OrbitControls />
        <Environment preset="studio" background />
      </Suspense>
    </Canvas>
  );
};

export default Product3d;
