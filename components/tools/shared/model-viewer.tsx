"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ModelViewerProps {
  modelUrl?: string;
  className?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const ModelViewer = ({ 
  modelUrl, 
  className = "", 
  placeholder,
  onLoad,
  onError
}: ModelViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userInteractingRef = useRef(false);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Dark grey background
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;
    
    // Create renderer with shadow support
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Allow transparency
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true; // Enable shadow mapping
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
    // Use the correct property based on Three.js version
    // In newer versions, physicallyCorrectLights is replaced with useLegacyLights (with inverted meaning)
    if ('useLegacyLights' in renderer) {
      // @ts-ignore - TypeScript might not know about this property yet
      renderer.useLegacyLights = false; // Equivalent to physicallyCorrectLights = true
    } else if ('physicallyCorrectLights' in renderer) {
      // @ts-ignore - Handle older versions
      renderer.physicallyCorrectLights = true;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Better color reproduction
    renderer.toneMappingExposure = 1.2; // Slightly brighter
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lights - enhanced for dark mode visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Increased intensity
    scene.add(ambientLight);
    
    // Add hemisphere light for better environmental lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040, 0.6);
    scene.add(hemisphereLight);
    
    // Main directional light (simulates sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased intensity
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Back light for rim lighting effect
    const backLight = new THREE.DirectionalLight(0xffffff, 0.7); // Increased intensity
    backLight.position.set(-1, -1, -1);
    scene.add(backLight);
    
    // Add bright spotlight from front to fully illuminate the model
    const frontSpotLight = new THREE.SpotLight(0xffffff, 2.5); // Increased intensity
    frontSpotLight.position.set(0, 0, 8); // Position directly in front of the model
    frontSpotLight.angle = Math.PI / 4; // Wider beam for more coverage
    frontSpotLight.penumbra = 0.3; // Softer edges
    frontSpotLight.decay = 1.5; // Less decay for more reach
    frontSpotLight.distance = 30; // Increased distance
    frontSpotLight.castShadow = true; // Enable shadow casting
    frontSpotLight.shadow.mapSize.width = 1024; // Higher resolution shadows
    frontSpotLight.shadow.mapSize.height = 1024;
    frontSpotLight.shadow.camera.near = 0.5;
    frontSpotLight.shadow.camera.far = 50;
    frontSpotLight.shadow.bias = -0.0001; // Reduce shadow acne
    scene.add(frontSpotLight);
    
    // Add fill lights to ensure the object is well-lit from all angles
    const leftFillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    leftFillLight.position.set(-5, 0, 0); // Left side
    scene.add(leftFillLight);
    
    const rightFillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    rightFillLight.position.set(5, 0, 0); // Right side
    scene.add(rightFillLight);
    
    const bottomFillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    bottomFillLight.position.set(0, -5, 0); // Bottom
    scene.add(bottomFillLight);
    
    // Add a ground plane to receive shadows and provide context
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.5 // Semi-transparent
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    ground.position.y = -2; // Position below the expected model position
    ground.receiveShadow = true; // Receive shadows from the model
    scene.add(ground);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controlsRef.current = controls;
    
    // Track user interaction with controls
    controls.addEventListener('start', () => {
      userInteractingRef.current = true;
    });
    controls.addEventListener('end', () => {
      userInteractingRef.current = false;
    });
    
    // Store references for animation (using regular variables, not React hooks)
    const initialIntensity = frontSpotLight.intensity;
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Add subtle rotation to the model if it exists and user is not interacting with controls
      if (modelRef.current && !userInteractingRef.current) {
        // Rotate very slowly around the y-axis for a subtle showcase effect
        modelRef.current.rotation.y += 0.002;
      }
      
      // Animate the front spotlight for a subtle effect
      {
        // Make the spotlight intensity pulse slightly
        const time = Date.now() * 0.001; // Convert to seconds
        const pulseIntensity = initialIntensity + Math.sin(time * 2) * 0.2;
        frontSpotLight.intensity = pulseIntensity;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
    };
  }, []);
  
  // Load model when URL changes
  useEffect(() => {
    if (!modelUrl || !sceneRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    // Remove previous model if it exists
    if (modelRef.current && sceneRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
    
    const loader = new GLTFLoader();
    
    loader.load(
      modelUrl,
      (gltf) => {
        if (!sceneRef.current) return;
        
        const model = gltf.scene;
        
        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Reset position
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;
        
        // Adjust camera and controls to fit model
        if (cameraRef.current && controlsRef.current) {
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = cameraRef.current.fov * (Math.PI / 180);
          let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
          
          // Add some padding
          cameraZ *= 1.5;
          
          cameraRef.current.position.z = cameraZ;
          
          const minPadding = 1.0;
          controlsRef.current.minDistance = maxDim / 2 + minPadding;
          controlsRef.current.maxDistance = cameraZ * 2;
          
          controlsRef.current.update();
        }
        
        // Enable shadows for all meshes in the model
        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            
            // Enhance materials for better visibility in dark mode
            if (node.material) {
              // Handle both single materials and material arrays
              const materials = Array.isArray(node.material) ? node.material : [node.material];
              
              materials.forEach(material => {
                // Increase material emissive to make it slightly self-illuminating
                if (material.emissive) {
                  material.emissive.set(0x222222); // Slight glow
                }
                
                // Increase material reflectivity if it's a physical material
                if ('metalness' in material) {
                  material.metalness = Math.min(material.metalness + 0.1, 1.0);
                  material.roughness = Math.max(material.roughness - 0.1, 0.0);
                }
              });
            }
          }
        });
        
        sceneRef.current.add(model);
        modelRef.current = model;
        
        setIsLoading(false);
        if (onLoad) onLoad();
      },
      (progress) => {
        // You could update a progress bar here if needed
        console.log(`Loading model: ${Math.round((progress.loaded / progress.total) * 100)}%`);
      },
      (error) => {
        console.error('Error loading model:', error);
        setError('Failed to load model. Please try again.');
        setIsLoading(false);
        if (onError) onError(new Error(error instanceof Error ? error.message : 'Failed to load model'));
      }
    );
    
    return () => {
      // Cleanup will be handled by the main useEffect cleanup
    };
  }, [modelUrl, onLoad, onError]);
  
  return (
    <div 
      ref={containerRef}
      className={`bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-10">
          <div className="text-white text-center">
            <p className="text-red-500 text-lg mb-2">Error</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      )}
      
      {!modelUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
