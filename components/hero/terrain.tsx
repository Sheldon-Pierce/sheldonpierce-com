"use client";
import { useEffect, useRef } from "react";

/**
 * Seismic-survey terrain: a wireframe plane displaced by value-noise FBM with
 * ridge sharpening, sparse ochre survey points floating above it, basalt fog,
 * and subtle mouse parallax. Ported from the reference's r128 sketch onto the
 * installed `three` dependency. Respects prefers-reduced-motion (renders one
 * static frame) and pauses when the hero scrolls out of view.
 */
export function Terrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let disposed = false;
    let cleanup = () => {};

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // small fast value noise with smooth interpolation
    const hash = (x: number, y: number) => {
      const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return n - Math.floor(n);
    };
    const smooth = (a: number) => a * a * (3 - 2 * a);
    const noise = (x: number, y: number) => {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      const xf = x - xi;
      const yf = y - yi;
      const a = hash(xi, yi);
      const b = hash(xi + 1, yi);
      const c = hash(xi, yi + 1);
      const d = hash(xi + 1, yi + 1);
      const u = smooth(xf);
      const v = smooth(yf);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
    const fbm = (x: number, y: number) =>
      noise(x, y) * 0.6 +
      noise(x * 2.1, y * 2.1) * 0.28 +
      noise(x * 4.3, y * 4.3) * 0.12;

    import("three").then((THREE) => {
      if (disposed) return;

      const isMobile = window.innerWidth < 720;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x11161b, 18, 78);

      const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 200);
      camera.position.set(0, 7.5, 26);
      camera.lookAt(0, 0, -6);

      const seg = isMobile ? 70 : 110;
      const geo = new THREE.PlaneGeometry(150, 90, seg, Math.round(seg * 0.6));
      geo.rotateX(-Math.PI / 2);

      const pos = geo.attributes.position;
      // store x,z pairs for noise lookup
      const baseZ = new Float32Array(pos.count * 2);
      for (let i = 0; i < pos.count; i++) {
        baseZ[i * 2] = pos.getX(i);
        baseZ[i * 2 + 1] = pos.getZ(i);
      }

      const mat = new THREE.MeshBasicMaterial({
        color: 0x4f7d84,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
        fog: true,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = -3.5;
      scene.add(mesh);

      // sparse ochre survey points floating above the terrain
      const ptsGeo = new THREE.BufferGeometry();
      const N = isMobile ? 90 : 180;
      const arr = new Float32Array(N * 3);
      for (let p = 0; p < N; p++) {
        arr[p * 3] = (Math.random() - 0.5) * 140;
        arr[p * 3 + 1] = Math.random() * 16 - 1;
        arr[p * 3 + 2] = (Math.random() - 0.6) * 80;
      }
      ptsGeo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      const ptsMat = new THREE.PointsMaterial({
        color: 0xc9824b,
        size: 0.32,
        transparent: true,
        opacity: 0.7,
        fog: true,
      });
      const pts = new THREE.Points(ptsGeo, ptsMat);
      scene.add(pts);

      const displace = (time: number) => {
        for (let i = 0; i < pos.count; i++) {
          const x = baseZ[i * 2];
          const z = baseZ[i * 2 + 1];
          let h = fbm(x * 0.045 + time * 0.06, z * 0.045 - time * 0.045);
          // ridge sharpening for a seismic-survey feel
          h = Math.pow(h, 1.6) * 11;
          pos.setY(i, h);
        }
        pos.needsUpdate = true;
      };

      const resize = () => {
        const w = canvas.clientWidth || canvas.parentElement!.clientWidth;
        const h = canvas.clientHeight || canvas.parentElement!.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      let mouseX = 0;
      let mouseY = 0;
      let heroVisible = true;
      let t = 0;

      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!heroVisible) return;
        t += 0.016;
        displace(t);
        camera.position.x += (mouseX * 2.2 - camera.position.x) * 0.04;
        camera.position.y += (7.5 + mouseY * 1.2 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, -6);
        renderer.render(scene, camera);
      };

      const onMouse = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * -2;
      };

      window.addEventListener("resize", resize);
      window.addEventListener("mousemove", onMouse, { passive: true });

      let io: IntersectionObserver | undefined;
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (entries) => {
            heroVisible = entries[0].isIntersecting;
          },
          { threshold: 0.02 },
        );
        const hero = canvas.closest(".hero");
        if (hero) io.observe(hero);
      }

      resize();
      displace(0);
      if (reduceMotion) {
        renderer.render(scene, camera);
      } else {
        raf = requestAnimationFrame(loop);
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMouse);
        io?.disconnect();
        geo.dispose();
        mat.dispose();
        ptsGeo.dispose();
        ptsMat.dispose();
        renderer.dispose();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} className="terrain" />;
}
