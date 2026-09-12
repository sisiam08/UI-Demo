"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const nodeCount = reduceMotion ? 34 : 56;
    const linkDistance = 8;
    const bounds = { x: 24, y: 14, z: 8 };
    const nodes = Array.from({ length: nodeCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() * 2 - 1) * bounds.x,
        (Math.random() * 2 - 1) * bounds.y,
        (Math.random() * 2 - 1) * bounds.z
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.008
      ),
    }));

    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(nodePositions, 3)
    );
    const nodeMaterial = new THREE.PointsMaterial({
      color: 0xa480f2,
      size: 0.42,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(points);

    const maxLines = nodeCount * 5;
    const linePositions = new Float32Array(maxLines * 2 * 3);
    const lineColors = new Float32Array(maxLines * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    lineGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3)
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const colorStart = new THREE.Color(0x4338ca);
    const colorEnd = new THREE.Color(0x7c3aed);
    let mouseX = 0;
    let mouseY = 0;
    let animationFrame = 0;

    function handleMouseMove(event: MouseEvent) {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    }

    function updateNodePositions() {
      nodes.forEach((node, index) => {
        if (!reduceMotion) {
          node.position.add(node.velocity);
          if (node.position.x > bounds.x || node.position.x < -bounds.x) {
            node.velocity.x *= -1;
          }
          if (node.position.y > bounds.y || node.position.y < -bounds.y) {
            node.velocity.y *= -1;
          }
          if (node.position.z > bounds.z || node.position.z < -bounds.z) {
            node.velocity.z *= -1;
          }
        }
        nodePositions[index * 3] = node.position.x;
        nodePositions[index * 3 + 1] = node.position.y;
        nodePositions[index * 3 + 2] = node.position.z;
      });
      nodeGeometry.attributes.position.needsUpdate = true;
    }

    function updateConnections() {
      let lineIndex = 0;
      for (
        let firstIndex = 0;
        firstIndex < nodeCount && lineIndex < maxLines;
        firstIndex++
      ) {
        for (
          let secondIndex = firstIndex + 1;
          secondIndex < nodeCount && lineIndex < maxLines;
          secondIndex++
        ) {
          const distance = nodes[firstIndex].position.distanceTo(
            nodes[secondIndex].position
          );
          if (distance >= linkDistance) continue;

          const offset = lineIndex * 6;
          const firstNode = nodes[firstIndex].position;
          const secondNode = nodes[secondIndex].position;
          linePositions[offset] = firstNode.x;
          linePositions[offset + 1] = firstNode.y;
          linePositions[offset + 2] = firstNode.z;
          linePositions[offset + 3] = secondNode.x;
          linePositions[offset + 4] = secondNode.y;
          linePositions[offset + 5] = secondNode.z;

          const color = colorStart
            .clone()
            .lerp(colorEnd, 1 - distance / linkDistance);
          for (const colorOffset of [offset, offset + 3]) {
            lineColors[colorOffset] = color.r;
            lineColors[colorOffset + 1] = color.g;
            lineColors[colorOffset + 2] = color.b;
          }
          lineIndex++;
        }
      }
      lineGeometry.setDrawRange(0, lineIndex * 2);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;
    }

    function animate() {
      updateNodePositions();
      updateConnections();
      if (!reduceMotion) {
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    }

    function handleResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-70"
    />
  );
}
