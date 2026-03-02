"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import TextShimmer from "@/components/magicui/text-shimmer";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Link from "next/link";

export default function HeroSection() {
  const cubeRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  useEffect(() => {
    if (!cubeRef.current) return;

    const container = cubeRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Create scene with transparent background
    const scene = new THREE.Scene();

    // Create camera with adjusted position
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 500);
    camera.position.set(4, 3, 6);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha(0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Create controls with adjusted constraints
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;

    // Create a perfect cube
    const geometry = new THREE.BoxGeometry(2.64, 2.64, 2.64);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x1a0b2e, // Dark galaxy purple
      metalness: 0.6,
      roughness: 0.2,
      envMapIntensity: 3.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      transmission: 0.3,
      ior: 1.5
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add lighting with color tints
    const mainLight = new THREE.DirectionalLight(0x6366f1, 30); // Indigo (brighter)
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 20); // Light indigo (brighter)
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc084fc, 18); // Purple (brighter)
    rimLight.position.set(0, -5, 5);
    scene.add(rimLight);

    // Add more lights for better coverage
    const topLight = new THREE.DirectionalLight(0x6366f1, 15);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    const frontLight = new THREE.DirectionalLight(0x818cf8, 12);
    frontLight.position.set(0, 0, 10);
    scene.add(frontLight);

    const ambientLight = new THREE.AmbientLight(0x1a0b2e, 1.0); // Increased ambient intensity
    scene.add(ambientLight);

    // Create environment lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    const envScene = new THREE.Scene();
    const envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;
    material.envMap = envMap;
    material.needsUpdate = true;
    pmremGenerator.dispose();

    // Animation loop
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      cube.rotation.x += 0.001;
      cube.rotation.y += 0.002;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      controls.dispose();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative mx-auto mt-32 max-w-[80rem] xl:max-w-[90rem] 2xl:max-w-[100rem] px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 xl:gap-24 2xl:gap-32 items-center">
        <div className="order-1 md:order-1">
          <div className="backdrop-filter-[12px] inline-flex h-7 items-center justify-between rounded-full border border-white/5 bg-white/10 px-3 text-xs text-white dark:text-black transition-all ease-in hover:cursor-pointer hover:bg-white/20 group gap-1 mb-6">
            <TextShimmer className="inline-flex items-center justify-center">
              <span>✨ Welcome to Mesh Reality</span>{" "}
              <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </TextShimmer>
          </div>
          <h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text text-4xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Revolutionizing
            <br />3D Generation
            <br />for Modern Creators
          </h1>
          <p className="mt-8 text-base tracking-tight text-gray-400 md:text-lg max-w-[500px]">
            Experience the future of 3D content creation with our advanced AI technology.
            Create, customize, and share your 3D models with unprecedented ease.
          </p>
          <RainbowButton
            className="mt-8"
            onClick={() => window.location.href = '/signup'}
          >
            <span>Start Creating Now</span>
            <ArrowRightIcon className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </RainbowButton>
        </div>
        <div className="order-2 md:order-2">
          <div
            ref={ref}
          >
            <div className="relative rounded-xl border border-white/10 bg-white bg-opacity-[0.01] aspect-square overflow-hidden max-w-[85%] mx-auto">
              <BorderBeam
                size={250}
                duration={12}
                delay={11}
                colorFrom="var(--color-one)"
                colorTo="var(--color-two)"
              />
              <div 
                ref={cubeRef} 
                className="absolute inset-0 z-20 xl:scale-[1.2] 2xl:scale-[1.3]" 
                style={{ transform: 'scale(1.1)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
