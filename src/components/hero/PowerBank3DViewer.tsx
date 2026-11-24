"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { Rotate3d, AlertCircle } from "lucide-react";

interface PowerBank3DViewerProps {
  fallbackImage?: string;
  className?: string;
}

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export default function PowerBank3DViewer({
  fallbackImage = "/assets/products/powerbank-hero.png",
  className = "",
}: PowerBank3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL] = useState(checkWebGLSupport);
  const [isLoading, setIsLoading] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [mode, setMode] = useState<"3d" | "render">(() => (checkWebGLSupport() ? "3d" : "render"));

  useEffect(() => {
    if (mode !== "3d" || !hasWebGL) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let width = container.clientWidth || 520;
    let height = container.clientHeight || 520;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 7.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Studio Lighting matching the dark satin concept
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Top-down Key Spotlight (Soft highlights on rounded edges)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3, 8, 5);
    scene.add(keyLight);

    // Studio Fill Light from left
    const fillLight = new THREE.DirectionalLight(0xd4d8e2, 1.2);
    fillLight.position.set(-6, 3, 3);
    scene.add(fillLight);

    // Subtle Rim Light from behind
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(0, -4, -6);
    scene.add(rimLight);

    // Precision Emerald Accent Bounce (reflecting the signature green LED glow)
    const emeraldBounce = new THREE.PointLight(0x00e676, 1.5, 8);
    emeraldBounce.position.set(0, -1, 1.5);
    scene.add(emeraldBounce);

    // Group for complete Power Bank assembly
    const powerBankGroup = new THREE.Group();

    // Procedural Carbon Weave Canvas Texture for Faceplate
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 128;
    textureCanvas.height = 128;
    const ctx = textureCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#121316";
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = "#1c1e23";
      for (let y = 0; y < 128; y += 8) {
        for (let x = 0; x < 128; x += 8) {
          if ((x + y) % 16 === 0) {
            ctx.fillRect(x, y, 6, 6);
          }
        }
      }
    }
    const carbonTexture = new THREE.CanvasTexture(textureCanvas);
    carbonTexture.wrapS = THREE.RepeatWrapping;
    carbonTexture.wrapT = THREE.RepeatWrapping;
    carbonTexture.repeat.set(10, 18);

    // Materials
    // Satin Matte Obsidian Chassis
    const satinBlackMaterial = new THREE.MeshStandardMaterial({
      color: 0x121316,
      metalness: 0.35,
      roughness: 0.38,
    });

    // Textured Faceplate Material
    const carbonFaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x141519,
      map: carbonTexture,
      roughness: 0.42,
      metalness: 0.4,
    });

    // Glossy Mirror Display Window
    const glossyDisplayMaterial = new THREE.MeshStandardMaterial({
      color: 0x050608,
      metalness: 0.95,
      roughness: 0.08,
    });

    // Glowing Jewel Emerald Indicator Light
    const emeraldLedMaterial = new THREE.MeshStandardMaterial({
      color: 0x00e676,
      emissive: 0x00e676,
      emissiveIntensity: 3.5,
      roughness: 0.1,
    });

    // Digital LED Meter Texture ("87%")
    const ledDisplayCanvas = document.createElement("canvas");
    ledDisplayCanvas.width = 256;
    ledDisplayCanvas.height = 128;
    const ledCtx = ledDisplayCanvas.getContext("2d");
    if (ledCtx) {
      ledCtx.fillStyle = "#07080a";
      ledCtx.fillRect(0, 0, 256, 128);
      // Digital readout text
      ledCtx.font = "bold 56px monospace";
      ledCtx.fillStyle = "#ffffff";
      ledCtx.textAlign = "center";
      ledCtx.textBaseline = "middle";
      ledCtx.fillText("87", 128, 54);
      ledCtx.font = "bold 22px monospace";
      ledCtx.fillText("%", 188, 50);

      // Emerald LED Status indicator dot in display
      ledCtx.beginPath();
      ledCtx.arc(128, 98, 7, 0, Math.PI * 2);
      ledCtx.fillStyle = "#00e676";
      ledCtx.shadowColor = "#00e676";
      ledCtx.shadowBlur = 12;
      ledCtx.fill();
    }
    const ledDisplayTexture = new THREE.CanvasTexture(ledDisplayCanvas);

    const ledScreenMaterial = new THREE.MeshBasicMaterial({
      map: ledDisplayTexture,
      transparent: true,
    });

    // Lanyard Strap Material
    const lanyardMaterial = new THREE.MeshStandardMaterial({
      color: 0x484b55,
      roughness: 0.65,
      metalness: 0.15,
    });

    // 1. Main Power Bank Body
    const bodyGeometry = new THREE.BoxGeometry(2.35, 4.5, 0.72);
    const bodyMesh = new THREE.Mesh(bodyGeometry, satinBlackMaterial);
    powerBankGroup.add(bodyMesh);

    // 2. Carbon Weave Front Plate
    const frontPlateGeo = new THREE.BoxGeometry(2.26, 4.4, 0.04);
    const frontPlate = new THREE.Mesh(frontPlateGeo, carbonFaceMaterial);
    frontPlate.position.set(0, 0, 0.36);
    powerBankGroup.add(frontPlate);

    // 3. Carbon Weave Rear Plate
    const rearPlate = new THREE.Mesh(frontPlateGeo, carbonFaceMaterial);
    rearPlate.position.set(0, 0, -0.36);
    powerBankGroup.add(rearPlate);

    // 4. Glossy Display Bezel Window
    const displayWindowGeo = new THREE.BoxGeometry(0.9, 0.65, 0.05);
    const displayWindow = new THREE.Mesh(displayWindowGeo, glossyDisplayMaterial);
    displayWindow.position.set(0, 1.35, 0.375);
    powerBankGroup.add(displayWindow);

    // 5. LED Screen overlay inside display
    const screenGeo = new THREE.PlaneGeometry(0.8, 0.55);
    const screenMesh = new THREE.Mesh(screenGeo, ledScreenMaterial);
    screenMesh.position.set(0, 1.35, 0.405);
    powerBankGroup.add(screenMesh);

    // 6. External Jewel Emerald LED indicator dot
    const jewelDotGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 24);
    jewelDotGeo.rotateX(Math.PI / 2);
    const jewelDotMesh = new THREE.Mesh(jewelDotGeo, emeraldLedMaterial);
    jewelDotMesh.position.set(0, 0.75, 0.38);
    powerBankGroup.add(jewelDotMesh);

    // 7. Signature Integrated Lanyard Carry Loop (as seen in photo)
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.85, 2.25, 0),
      new THREE.Vector3(-1.1, 2.7, 0.05),
      new THREE.Vector3(-0.95, 3.2, 0),
      new THREE.Vector3(-0.6, 2.8, -0.05),
      new THREE.Vector3(-0.75, 2.25, 0),
    ]);
    const lanyardGeo = new THREE.TubeGeometry(curve, 32, 0.045, 12, false);
    const lanyardMesh = new THREE.Mesh(lanyardGeo, lanyardMaterial);
    powerBankGroup.add(lanyardMesh);

    // 8. Top Port Cutouts (USB-C & USB-A)
    const portMaterial = new THREE.MeshStandardMaterial({
      color: 0x08080a,
      metalness: 0.9,
      roughness: 0.1,
    });
    const usbCPortGeo = new THREE.BoxGeometry(0.45, 0.08, 0.22);
    const usbCPort = new THREE.Mesh(usbCPortGeo, portMaterial);
    usbCPort.position.set(0.4, 2.26, 0);
    powerBankGroup.add(usbCPort);

    const usbAPortGeo = new THREE.BoxGeometry(0.65, 0.08, 0.25);
    const usbAPort = new THREE.Mesh(usbAPortGeo, portMaterial);
    usbAPort.position.set(-0.1, 2.26, 0);
    powerBankGroup.add(usbAPort);

    // Default angle: floating slightly angled toward camera
    powerBankGroup.rotation.x = 0.22;
    powerBankGroup.rotation.y = -0.35;
    powerBankGroup.position.y = 0.1;
    scene.add(powerBankGroup);

    // 9. Soft Diffused Contact Ground Shadow
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext("2d");
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(128, 128, 0, 128, 128, 120);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.85)");
      grad.addColorStop(0.4, "rgba(0, 0, 0, 0.45)");
      grad.addColorStop(0.8, "rgba(0, 0, 0, 0.1)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(4.2, 4.2);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.85,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMaterial);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.6;
    scene.add(shadowPlane);

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

      velocityX = deltaX * 0.0075;
      velocityY = deltaY * 0.0075;

      powerBankGroup.rotation.y += velocityX;
      powerBankGroup.rotation.x += velocityY;

      // Clamp vertical tilt
      powerBankGroup.rotation.x = Math.max(-0.75, Math.min(0.75, powerBankGroup.rotation.x));
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

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        // Inertia decay
        velocityX *= 0.94;
        velocityY *= 0.94;
        powerBankGroup.rotation.y += velocityX;
        powerBankGroup.rotation.x += velocityY;

        idleTimer += 0.016;
        if (idleTimer > 0.5) {
          // Continuous serene idle rotation
          powerBankGroup.rotation.y += 0.007;
          powerBankGroup.rotation.x = THREE.MathUtils.lerp(powerBankGroup.rotation.x, 0.22, 0.02);
          powerBankGroup.rotation.z = THREE.MathUtils.lerp(powerBankGroup.rotation.z, 0, 0.02);
        }

        // Float oscillation (sinusoidal)
        const floatOffset = Math.sin(elapsedTime * 1.4) * 0.12;
        powerBankGroup.position.y = 0.1 + floatOffset;
        // Soft shadow breathes with float
        shadowPlane.scale.setScalar(1 + floatOffset * 0.4);
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
      frontPlateGeo.dispose();
      displayWindowGeo.dispose();
      screenGeo.dispose();
      jewelDotGeo.dispose();
      lanyardGeo.dispose();
      usbCPortGeo.dispose();
      usbAPortGeo.dispose();
      shadowGeo.dispose();

      satinBlackMaterial.dispose();
      carbonFaceMaterial.dispose();
      glossyDisplayMaterial.dispose();
      emeraldLedMaterial.dispose();
      ledScreenMaterial.dispose();
      lanyardMaterial.dispose();
      shadowMaterial.dispose();

      carbonTexture.dispose();
      ledDisplayTexture.dispose();
      shadowTexture.dispose();

      renderer.dispose();
    };
  }, [mode, hasWebGL]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 3D Canvas / Studio Master Render Container */}
      <div className="relative w-full aspect-square max-w-[540px] max-h-[540px] flex items-center justify-center">
        {mode === "3d" && hasWebGL ? (
          <div
            ref={containerRef}
            className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700 ${isLoading ? "opacity-0" : "opacity-100"
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
              className="object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
            />
          </div>
        )}

        {/* Ambient Loading indicator */}
        {isLoading && mode === "3d" && (
          <div className="absolute inset-0 flex items-center justify-center text-xs tracking-widest uppercase text-neutral-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Initializing 3D Power Cell...
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="mt-2 flex items-center gap-3 z-10">
        {hasWebGL ? (
          <>
            <button
              onClick={() => setMode(mode === "3d" ? "render" : "3d")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide bg-[#111216] hover:bg-[#181920] border border-[#22242c] text-neutral-300 transition-colors"
            >
              <Rotate3d className="w-3.5 h-3.5 text-emerald-400" />
              {mode === "3d" ? "Studio Master Render" : "Interactive 3D Orbit"}
            </button>

            {mode === "3d" && (
              <span className="text-[11px] tracking-wider text-neutral-400 uppercase font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isInteracting ? "Inspecting 360°" : "Drag to Rotate"}
              </span>
            )}
          </>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
            Studio Keynote View
          </div>
        )}
      </div>
    </div>
  );
}
