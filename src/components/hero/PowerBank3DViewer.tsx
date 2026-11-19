"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { Rotate3d, Sparkles, AlertCircle } from "lucide-react";

interface PowerBank3DViewerProps {
  fallbackImage?: string;
  className?: string;
}

export default function PowerBank3DViewer({
  fallbackImage = "/assets/products/powerbank-hero.png",
  className = "",
}: PowerBank3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [mode, setMode] = useState<"3d" | "render">("3d");

  useEffect(() => {
    if (mode !== "3d") {
      setIsLoading(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // WebGL support check
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        setMode("render");
        setIsLoading(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      setMode("render");
      setIsLoading(false);
      return;
    }

    let animationFrameId: number;
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Key studio light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    // Cyan/electric blue fill light from left
    const fillLight = new THREE.DirectionalLight(0x00e5ff, 1.4);
    fillLight.position.set(-6, 2, 4);
    scene.add(fillLight);

    // Rim light from behind to highlight dark edges
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.8);
    rimLight.position.set(0, -4, -5);
    scene.add(rimLight);

    // Soft warm accent light
    const warmLight = new THREE.DirectionalLight(0xffb74d, 0.8);
    warmLight.position.set(4, -3, 3);
    scene.add(warmLight);

    // Create 3D Power Bank Model Group
    const powerBankGroup = new THREE.Group();

    // Materials
    const darkChassisMaterial = new THREE.MeshStandardMaterial({
      color: 0x16171a,
      metalness: 0.88,
      roughness: 0.22,
    });

    const sideBumperMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c0d0f,
      metalness: 0.4,
      roughness: 0.45,
    });

    const portInteriorMaterial = new THREE.MeshStandardMaterial({
      color: 0x050505,
      metalness: 0.9,
      roughness: 0.1,
    });

    const ledGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });

    // Main Chassis Body (Sleek elongated rectangular prism)
    const bodyGeometry = new THREE.BoxGeometry(2.4, 4.4, 0.65);
    const bodyMesh = new THREE.Mesh(bodyGeometry, darkChassisMaterial);
    powerBankGroup.add(bodyMesh);

    // Side grip ribs
    const sideRibGeo = new THREE.BoxGeometry(2.44, 4.2, 0.62);
    const sideRib = new THREE.Mesh(sideRibGeo, sideBumperMaterial);
    powerBankGroup.add(sideRib);

    // Front decorative panel groove
    const frontPanelGeo = new THREE.BoxGeometry(2.0, 3.8, 0.67);
    const frontPanel = new THREE.Mesh(frontPanelGeo, darkChassisMaterial);
    powerBankGroup.add(frontPanel);

    // Top port cutouts
    const usbCPortGeo = new THREE.BoxGeometry(0.5, 0.1, 0.25);
    const usbCPort = new THREE.Mesh(usbCPortGeo, portInteriorMaterial);
    usbCPort.position.set(-0.5, 2.21, 0);
    powerBankGroup.add(usbCPort);

    const usbAPortGeo = new THREE.BoxGeometry(0.7, 0.1, 0.28);
    const usbAPort = new THREE.Mesh(usbAPortGeo, portInteriorMaterial);
    usbAPort.position.set(0.5, 2.21, 0);
    powerBankGroup.add(usbAPort);

    // LED Power Gauge (4 micro LED dots on the front face)
    const ledGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.05, 16);
    ledGeo.rotateX(Math.PI / 2);
    for (let i = 0; i < 4; i++) {
      const ledMesh = new THREE.Mesh(ledGeo, ledGlowMaterial);
      ledMesh.position.set(-0.45 + i * 0.3, -1.4, 0.34);
      powerBankGroup.add(ledMesh);
    }

    // Default angle for aesthetic presentation
    powerBankGroup.rotation.x = 0.25;
    powerBankGroup.rotation.y = -0.4;
    scene.add(powerBankGroup);

    setIsLoading(false);

    // Interactive Drag Physics
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let idleTimer = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      velocityX = 0;
      velocityY = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      velocityX = deltaX * 0.007;
      velocityY = deltaY * 0.007;

      powerBankGroup.rotation.y += velocityX;
      powerBankGroup.rotation.x += velocityY;

      // Clamp vertical tilt to prevent flipping upside down
      powerBankGroup.rotation.x = Math.max(-0.8, Math.min(0.8, powerBankGroup.rotation.x));
      idleTimer = 0;
    };

    const onPointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    const domElement = renderer.domElement;
    domElement.style.touchAction = "none";
    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Render loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        // Apply inertia decay
        velocityX *= 0.94;
        velocityY *= 0.94;
        powerBankGroup.rotation.y += velocityX;
        powerBankGroup.rotation.x += velocityY;

        idleTimer += 0.016;
        if (idleTimer > 0.5) {
          // Smooth return to idle rotation and floating
          powerBankGroup.rotation.y += 0.007;
          powerBankGroup.rotation.x = THREE.MathUtils.lerp(powerBankGroup.rotation.x, 0.2, 0.02);
          powerBankGroup.rotation.z = THREE.MathUtils.lerp(powerBankGroup.rotation.z, 0, 0.02);
        }

        // Float oscillation
        powerBankGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);

      bodyGeometry.dispose();
      sideRibGeo.dispose();
      frontPanelGeo.dispose();
      usbCPortGeo.dispose();
      usbAPortGeo.dispose();
      ledGeo.dispose();
      darkChassisMaterial.dispose();
      sideBumperMaterial.dispose();
      portInteriorMaterial.dispose();
      ledGlowMaterial.dispose();
      renderer.dispose();
    };
  }, [mode]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 3D Canvas / Render Container */}
      <div className="relative w-full aspect-square max-w-[540px] max-h-[540px] flex items-center justify-center">
        {mode === "3d" && hasWebGL ? (
          <div
            ref={containerRef}
            className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-500 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={fallbackImage}
              alt="Futuristic Charcoal Power Bank"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 540px"
              className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] animate-pulse-slow"
            />
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && mode === "3d" && (
          <div className="absolute inset-0 flex items-center justify-center text-xs tracking-widest uppercase text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Initializing 3D Engine...
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="mt-3 flex items-center gap-3 z-10">
        {hasWebGL ? (
          <>
            <button
              onClick={() => setMode(mode === "3d" ? "render" : "3d")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide bg-[#16171c] hover:bg-[#20222a] border border-[#2b2d36] text-neutral-300 transition-colors"
            >
              <Rotate3d className="w-3.5 h-3.5 text-cyan-400" />
              {mode === "3d" ? "Switch to Studio Render" : "Switch to 3D Orbit"}
            </button>

            {mode === "3d" && (
              <span className="text-[11px] tracking-wider text-neutral-400 uppercase font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {isInteracting ? "Inspecting 360°" : "Drag to Rotate"}
              </span>
            )}
          </>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            High-Definition Studio View
          </div>
        )}
      </div>
    </div>
  );
}
