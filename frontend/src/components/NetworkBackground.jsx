import { useEffect, useRef } from "react";

/**
 * Three.js neural-network style animated background.
 * Floating particles with connecting lines + mouse parallax.
 * Same parameters as the original design: 140 points, 110 max link
 * distance, cyan points (#00e5ff) + purple lines (#6610f2).
 */
export default function NetworkBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const THREE = await import("three");
      if (cancelled || !mount) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        mount.clientWidth / mount.clientHeight,
        1,
        2000,
      );
      camera.position.z = 480;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const COUNT = 140;
      const positions = new Float32Array(COUNT * 3);
      const velocities = [];
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 900;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
        velocities.push(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.2,
        );
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x00e5ff,
        size: 3.2,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(pGeo, pMat);
      scene.add(points);

      const lineGeo = new THREE.BufferGeometry();
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x6610f2,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(lines);

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 60;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 60;
      };
      const onResize = () => {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("resize", onResize);

      const MAX_DIST = 110;
      let raf = 0;

      const tick = () => {
        const pos = pGeo.attributes.position.array;
        if (!reduceMotion) {
          for (let i = 0; i < COUNT; i++) {
            pos[i * 3 + 0] += velocities[i * 3 + 0];
            pos[i * 3 + 1] += velocities[i * 3 + 1];
            pos[i * 3 + 2] += velocities[i * 3 + 2];
            if (Math.abs(pos[i * 3]) > 450) velocities[i * 3] *= -1;
            if (Math.abs(pos[i * 3 + 1]) > 320) velocities[i * 3 + 1] *= -1;
            if (Math.abs(pos[i * 3 + 2]) > 200) velocities[i * 3 + 2] *= -1;
          }
          pGeo.attributes.position.needsUpdate = true;
        }

        const linePts = [];
        for (let i = 0; i < COUNT; i++) {
          for (let j = i + 1; j < COUNT; j++) {
            const dx = pos[i * 3] - pos[j * 3];
            const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
            const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (d < MAX_DIST) {
              linePts.push(
                pos[i * 3],
                pos[i * 3 + 1],
                pos[i * 3 + 2],
                pos[j * 3],
                pos[j * 3 + 1],
                pos[j * 3 + 2],
              );
            }
          }
        }
        lineGeo.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(linePts, 3),
        );
        lineGeo.attributes.position.needsUpdate = true;

        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        camera.position.x += (mouse.x - camera.position.x) * 0.05;
        camera.position.y += (-mouse.y - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        if (!reduceMotion) {
          points.rotation.y += 0.0008;
          lines.rotation.y += 0.0008;
        }

        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        pGeo.dispose();
        lineGeo.dispose();
        pMat.dispose();
        lineMat.dispose();
        if (mount && renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full top-0 left-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}
