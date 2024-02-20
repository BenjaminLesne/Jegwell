import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { Environment, OrbitControls, useProgress } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib";
import { Suspense } from "react";
import { EVENT_SCENE_LOADED } from "~/lib/constants";

let alreadyFired = false;

const Model = () => {
  const gltf = useLoader(GLTFLoader, "/ring/scene.gltf");
  const { active } = useProgress();

  if (active === false && alreadyFired === false) {
    alreadyFired = true;
    window.dispatchEvent(new Event(EVENT_SCENE_LOADED));
  }

  return (
    <>
      <primitive object={gltf.scene} scale={0.4} />
    </>
  );
};

const Product3d = () => {
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
