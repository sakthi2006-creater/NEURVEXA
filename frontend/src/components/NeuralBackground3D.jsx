import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeuralBackground3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 2000);
    camera.position.z = 420;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // particle nodes distributed in a 3D sphere volume
    const COUNT = 180;
    const RADIUS = 320;
    const positions = new Float32Array(COUNT * 3);
    const pts = [];
    for (let i = 0; i < COUNT; i++) {
      const r = RADIUS * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointsMat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 3.2, transparent: true, opacity: 0.85, sizeAttenuation: true, depthWrite: false });
    group.add(new THREE.Points(pointsGeo, pointsMat));

    // connecting lines between nearby nodes (computed once)
    const linePositions = [];
    const MAX_DIST = 95;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < MAX_DIST) {
          linePositions.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.18, depthWrite: false });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // a few glowing orbs for depth
    const orbGroup = new THREE.Group();
    const orbColors = [0x00e5ff, 0xc026ff, 0x2979ff];
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.SphereGeometry(6 + Math.random() * 8, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: orbColors[i % orbColors.length], transparent: true, opacity: 0.35 });
      const orb = new THREE.Mesh(geo, mat);
      orb.position.set((Math.random() - 0.5) * 500, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 300);
      orbGroup.add(orb);
    }
    group.add(orbGroup);

    let raf;
    let mx = 0, my = 0;
    function onMove(e) {
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) / window.innerWidth - 0.5;
      const cy = (e.touches ? e.touches[0].clientY : e.clientY) / window.innerHeight - 0.5;
      mx = cx; my = cy;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);

    function animate() {
      group.rotation.y += 0.0012;
      group.rotation.x += (my * 0.3 - group.rotation.x) * 0.02;
      camera.position.x += (mx * 40 - camera.position.x) * 0.02;
      camera.position.y += (-my * 40 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    function onResize() {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      pointsGeo.dispose(); pointsMat.dispose();
      lineGeo.dispose(); lineMat.dispose();
      orbGroup.children.forEach((o) => { o.geometry.dispose(); o.material.dispose(); });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="neural-bg-3d" />;
}
