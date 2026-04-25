import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

interface BeeData {
  localTarget: THREE.Vector3;
  velocity: THREE.Vector3;
  position: THREE.Vector3;
  baseColor: THREE.Color;
  driftOffsets: [number, number, number];
  dartTimers: [number, number]; 
  isRoamer: boolean;
  roamCenter: THREE.Vector3;
}

const Hero3DText = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 500;

    // ── Scene Setup ──
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── Warm Honey Lighting ──
    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-4, -1, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffa600, 1.2);
    rimLight.position.set(0, 0, -5);
    scene.add(rimLight);

    const bottomLight = new THREE.DirectionalLight(0xffddaa, 0.4);
    bottomLight.position.set(0, -5, 3);
    scene.add(bottomLight);

    scene.add(new THREE.AmbientLight(0xffddaa, 0.35));

    // ── Physics & Interaction Globals ──
    let instancedMesh: THREE.InstancedMesh | null = null;
    const beeData: BeeData[] = [];
    const textBeesCount = 120;
    const roamerBeesCount = 130;
    const totalBees = textBeesCount + roamerBeesCount; 

    let mouseBall: THREE.Mesh | null = null;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouseWorld = new THREE.Vector3(-100, -100, 0);

    let shockwaveIntensity = 0; 
    const dummyObj = new THREE.Object3D();
    const tempColor = new THREE.Color();
    const upVector = new THREE.Vector3(0, 1, 0);

    // ── Typography ──
    const loader = new FontLoader();
    let textGroup: THREE.Group | null = null;
    let fontsLoaded = 0;
    let regularFont: any = null;
    let italicFont: any = null;

    const tryCreate = () => {
      fontsLoaded++;
      if (fontsLoaded === 2) buildScene();
    };

    loader.load("/assets/fonts/instrument-regular.json", (f) => {
      regularFont = f;
      tryCreate();
    });
    loader.load("/assets/fonts/instrument-italic.json", (f) => {
      italicFont = f;
      tryCreate();
    });

    function buildScene() {
      textGroup = new THREE.Group();

      const waxMat = new THREE.MeshStandardMaterial({
        color: 0x3a2200, 
        roughness: 0.8,
        metalness: 0.1,
      });

      const waxSideMat = new THREE.MeshStandardMaterial({
        color: 0x1a0f00,
        roughness: 0.9,
        metalness: 0.1,
      });

      const liquidHoneyMat = new THREE.MeshPhysicalMaterial({
        color: 0xffa600,
        emissive: 0x442200,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.9, 
        thickness: 0.5,
        ior: 1.5,
      });

      const liquidHoneySideMat = new THREE.MeshStandardMaterial({
        color: 0xffb700,
        roughness: 0.2,
        metalness: 0.4,
      });

      const textOpts = {
        size: 0.5,
        depth: 0.15,
        curveSegments: 24,
        bevelEnabled: true,
        bevelThickness: 0.02, 
        bevelSize: 0.015,
        bevelSegments: 6,
      };

      const g1 = new TextGeometry("Crafting", { ...textOpts, font: italicFont });
      g1.center();
      const m1 = new THREE.Mesh(g1, [waxMat, waxSideMat]);
      m1.position.y = 0.7;

      const g2 = new TextGeometry("interfaces", { ...textOpts, font: regularFont, depth: 0.22 });
      g2.center();
      const m2 = new THREE.Mesh(g2, [liquidHoneyMat, liquidHoneySideMat]);
      m2.position.y = 0.2;

      const g3 = new TextGeometry("that scale.", { ...textOpts, font: italicFont });
      g3.center();
      const m3 = new THREE.Mesh(g3, [waxMat, waxSideMat]);
      m3.position.y = -0.40;

      textGroup.add(m1, m2, m3);
      textGroup.rotation.y = -Math.PI * 2;
      textGroup.rotation.x = 0.6;
      scene.add(textGroup);

      // ── The Bee Swarm (InstancedMesh) ──
      const beeGeo = new THREE.SphereGeometry(0.035, 16, 16);
      const beeMat = new THREE.MeshStandardMaterial({
        color: 0xffd500, 
        emissive: 0x664400, 
        emissiveIntensity: 0.8,
        roughness: 0.3,
        metalness: 0.5,
      });

      instancedMesh = new THREE.InstancedMesh(beeGeo, beeMat, totalBees);
      instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      
      let beeIdx = 0;

      // 1. Spawning bees glued to the Text Honeycomb
      const spawnBeesOnText = (geom: TextGeometry, yOffset: number, count: number) => {
        geom.computeBoundingBox();
        const box = geom.boundingBox;
        if (!box) return;

        for (let i = 0; i < count; i++) {
          const lx = THREE.MathUtils.randFloat(box.min.x, box.max.x) * 1.05;
          const ly = THREE.MathUtils.randFloat(box.min.y, box.max.y) * 1.05 + yOffset;
          const lz = THREE.MathUtils.randFloat(box.min.z, box.max.z) + 0.15;

          const startX = (Math.random() - 0.5) * 8;
          const startY = (Math.random() - 0.5) * 8 + yOffset;
          const startZ = (Math.random() - 0.5) * 4 + 2;

          beeData[beeIdx] = {
            localTarget: new THREE.Vector3(lx, ly, lz),
            velocity: new THREE.Vector3(0, 0, 0),
            position: new THREE.Vector3(startX, startY, startZ),
            baseColor: new THREE.Color(0xffd500),
            driftOffsets: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
            dartTimers: [Math.random(), Math.random()],
            isRoamer: false,
            roamCenter: new THREE.Vector3()
          };

          dummyObj.position.set(startX, startY, startZ);
          dummyObj.updateMatrix();
          instancedMesh!.setMatrixAt(beeIdx, dummyObj.matrix);
          instancedMesh!.setColorAt(beeIdx, beeData[beeIdx].baseColor);

          beeIdx++;
        }
      };

      spawnBeesOnText(g1, 0.7, 35);
      spawnBeesOnText(g2, 0.2, 50); 
      spawnBeesOnText(g3, -0.40, 35);

      // 2. Spawning Free-Roamer Bees exploring the Viewport
      for (let i = 0; i < roamerBeesCount; i++) {
        const rcX = (Math.random() - 0.5) * 14; 
        const rcY = (Math.random() - 0.5) * 10; 
        const rcZ = (Math.random() - 0.5) * 8;  

        const startX = rcX + (Math.random() - 0.5) * 2;
        const startY = rcY + (Math.random() - 0.5) * 2;
        const startZ = rcZ + (Math.random() - 0.5) * 2;

        beeData[beeIdx] = {
          localTarget: new THREE.Vector3(rcX, rcY, rcZ),
          velocity: new THREE.Vector3(0, 0, 0),
          position: new THREE.Vector3(startX, startY, startZ),
          baseColor: new THREE.Color(0xffd500).lerp(new THREE.Color(0xffa600), Math.random() * 0.5), 
          driftOffsets: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
          dartTimers: [Math.random(), Math.random()],
          isRoamer: true,
          roamCenter: new THREE.Vector3(rcX, rcY, rcZ)
        };

        dummyObj.position.set(startX, startY, startZ);
        dummyObj.updateMatrix();
        instancedMesh!.setMatrixAt(beeIdx, dummyObj.matrix);
        instancedMesh!.setColorAt(beeIdx, beeData[beeIdx].baseColor);

        beeIdx++;
      }

      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
      scene.add(instancedMesh);

      // ── The "Sun" / Giant Honey Drop (Mouse Cursor) ──
      const mBallGeo = new THREE.SphereGeometry(0.12, 64, 64);
      const mBallMat = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0x221100,
        transmission: 1,
        opacity: 1,
        metalness: 0.1,
        roughness: 0.02,
        ior: 1.5,
        thickness: 1.0,
      });
      mouseBall = new THREE.Mesh(mBallGeo, mBallMat);
      
      const hoverLight = new THREE.PointLight(0xffa600, 3.5, 5.0);
      mouseBall.add(hoverLight);

      mouseBall.position.set(0, 0, 100);
      scene.add(mouseBall);
    }

    // ── Interaction State ──
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotY = 0;
    let dragRotX = 0;

    const introStart = Date.now();
    const introDuration = 2.4;
    let introComplete = false;

    // ── Handlers ──
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      container.style.cursor = "grabbing";
      shockwaveIntensity = 1.0; 
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      dragRotY = (dx / width) * Math.PI * 1.5;
      dragRotX = (dy / height) * Math.PI * 0.8;
    };

    const onPointerUp = () => {
      isDragging = false;
      dragStartX = 0;
      dragStartY = 0;
      container.style.cursor = "grab";
    };

    const onPointerLeave = () => {
      mouse.set(-1000, -1000);
      isDragging = false;
      container.style.cursor = "grab";
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerLeave);

    // ── Master Animation Engine ──
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);

      if (!textGroup || !instancedMesh || !mouseBall) {
        renderer.render(scene, camera);
        return;
      }

      const t = Date.now() * 0.001;

      // -- 1. Smooth Text Parallax --
      if (!introComplete) {
        const elapsed = (Date.now() - introStart) / 1000;
        const progress = Math.min(elapsed / introDuration, 1);
        const ease = 1 - Math.pow(1 - progress, 4); 

        textGroup.rotation.y = -Math.PI * 2 + ease * Math.PI * 2;
        textGroup.rotation.x = 0.6 * (1 - ease);

        if (progress >= 1) introComplete = true;
      } else {
        const idleY = Math.sin(t * 0.4) * 0.12;
        const idleX = Math.sin(t * 0.25) * 0.04;
        const idleFloat = Math.sin(t * 0.3) * 0.05;

        if (isDragging) {
          textGroup.rotation.y += ((dragRotY + idleY) - textGroup.rotation.y) * 0.15;
          textGroup.rotation.x += ((dragRotX + idleX) - textGroup.rotation.x) * 0.15;
        } else {
          dragRotY += (0 - dragRotY) * 0.06;
          dragRotX += (0 - dragRotX) * 0.06;

          textGroup.rotation.y += ((dragRotY + idleY) - textGroup.rotation.y) * 0.08;
          textGroup.rotation.x += ((dragRotX + idleX) - textGroup.rotation.x) * 0.08;
        }
        textGroup.position.y = idleFloat;
      }

      // -- 2. Mouse Mapping --
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, mouseWorld);

      const isOffscreen = mouse.x < -0.99 && mouse.y < -0.99;
      if (!isOffscreen) {
        mouseBall.position.lerp(mouseWorld, 0.25);
      } else {
        mouseBall.position.lerp(new THREE.Vector3(0, 0, 100), 0.1);
      }

      // -- 3. Bee Swarm Simulation --
      if (shockwaveIntensity > 0) {
        shockwaveIntensity *= 0.92; 
      }

      for (let i = 0; i < totalBees; i++) {
        const bee = beeData[i];

        if (bee.isRoamer) {
          bee.localTarget.x = bee.roamCenter.x + Math.sin(t * 0.15 + bee.driftOffsets[0]) * 4.0;
          bee.localTarget.y = bee.roamCenter.y + Math.cos(t * 0.20 + bee.driftOffsets[1]) * 4.0;
          bee.localTarget.z = bee.roamCenter.z + Math.sin(t * 0.25 + bee.driftOffsets[2]) * 3.0;
        }

        const flightFreq = 18.0; 
        const dartProg = (Math.sin(t * 3.0 + bee.dartTimers[0]) + 1) * 0.5; 
        
        const driftX = Math.sin(t * flightFreq + bee.driftOffsets[0]) * 0.03 * dartProg;
        const driftY = Math.cos(t * flightFreq * 1.2 + bee.driftOffsets[1]) * 0.03 * dartProg;
        const driftZ = Math.sin(t * flightFreq * 0.8 + bee.driftOffsets[2]) * 0.03 * dartProg;

        const orbitX = Math.sin(t * 1.5 + bee.driftOffsets[0] * 0.1) * 0.12;
        const orbitZ = Math.cos(t * 1.5 + bee.driftOffsets[0] * 0.1) * 0.12;

        const combinedLocal = bee.localTarget.clone().add(new THREE.Vector3(driftX + orbitX, driftY, driftZ + orbitZ));
        const worldTgt = textGroup.localToWorld(combinedLocal);

        const diff = worldTgt.sub(bee.position);
        bee.velocity.add(diff.multiplyScalar(0.015)); 

        const distToMouse = bee.position.distanceTo(mouseBall.position);
        const repelRadius = 1.2;
        
        if (!isOffscreen && distToMouse < repelRadius) {
          const force = Math.pow(repelRadius - distToMouse, 2) * 1.1; 
          const pushDir = bee.position.clone().sub(mouseBall.position).normalize();
          
          pushDir.add(new THREE.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5)).normalize();
          bee.velocity.add(pushDir.multiplyScalar(force));
        }

        if (shockwaveIntensity > 0.01 && !isOffscreen && distToMouse < 6.0) {
           const shockForce = shockwaveIntensity * (6.0 - distToMouse) * 0.25;
           const pushDir = bee.position.clone().sub(mouseBall.position).normalize();
           pushDir.add(new THREE.Vector3((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, 0)).normalize(); 
           bee.velocity.add(pushDir.multiplyScalar(shockForce));
        }

        bee.velocity.multiplyScalar(0.88); 
        bee.position.add(bee.velocity);

        const speed = bee.velocity.length();
        const stretchAmount = 1.0 + speed * 4.0; 

        dummyObj.position.copy(bee.position);
        if (speed > 0.02) {
          dummyObj.quaternion.setFromUnitVectors(upVector, bee.velocity.clone().normalize());
          dummyObj.scale.set(1.0, stretchAmount, 1.0);
        } else {
          const vibrateRot = new THREE.Euler(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1);
          dummyObj.quaternion.setFromEuler(vibrateRot);
          dummyObj.scale.set(1, 1, 1);
        }
        
        dummyObj.updateMatrix();
        instancedMesh.setMatrixAt(i, dummyObj.matrix);

        if (!isOffscreen && distToMouse < 1.4) {
          const intensity = 1.0 - distToMouse / 1.4;
          tempColor.copy(bee.baseColor).lerp(new THREE.Color(0xffffff), intensity * 0.7); 
          instancedMesh.setColorAt(i, tempColor);
        } else if (speed > 0.3) {
          tempColor.copy(bee.baseColor).lerp(new THREE.Color(0xffaa00), Math.min(speed * 0.5, 1.0));
          instancedMesh.setColorAt(i, tempColor);
        } else {
          instancedMesh.setColorAt(i, bee.baseColor);
        }
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // ── Screen Resize ──
    const onResize = () => {
      width = container.clientWidth || 800;
      height = container.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // ── Teardown ──
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      textGroup?.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
          else child.material.dispose();
        }
      });

      if (instancedMesh) {
        instancedMesh.geometry.dispose();
        (instancedMesh.material as THREE.Material).dispose();
      }

      if (mouseBall) {
        mouseBall.geometry.dispose();
        (mouseBall.material as THREE.Material).dispose();
      }
    };
  }, []);

  return <div ref={containerRef} className="hero-3d-container w-full h-full" style={{ touchAction: "none" }} />;
};

export default Hero3DText;
