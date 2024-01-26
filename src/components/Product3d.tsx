import * as THREE from "three";
import { Canvas, extend } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { DDSLoader } from "three-stdlib";
import { type MutableRefObject, Suspense } from "react";
// extend({ DDSLoader });

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

type Props = {
  eventSource: HTMLElement | MutableRefObject<HTMLElement> | undefined;
  eventPrefix: "offset" | "client" | "page" | "layer" | "screen" | undefined;
};

const Scene = () => {
  const materials = useLoader(MTLLoader, "Poimandres.mtl");
  const obj = useLoader(OBJLoader, "Poimandres.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  console.log(obj);
  return <primitive object={obj} scale={0.4} />;
};

export const Product3d = (props: Props) => {
  return (
    <>
      <Canvas
      // {...props}
      // onCreated={(state) => (state.gl.toneMapping = THREE.AgXToneMapping)}
      >
        <Suspense fallback={<div>Chargement</div>}>
          <Scene />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </>
  );
};
