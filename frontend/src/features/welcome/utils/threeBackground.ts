import * as THREE from 'three';

// ─── Configuration ────────────────────────────────────────────────────────────
export interface ThreeBackgroundConfig {
    /** Number of floating particles */
    particleCount?: number;
    /** Max distance between two particles to draw a connecting line */
    connectionDistance?: number;
    /** Primary brand colour (CSS hex or rgb string). Defaults to reading --brand-primary. */
    primaryColor?: string;
    /** Slow rotation speed (radians per second) */
    rotationSpeed?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCSSVar(name: string, fallback: string): string {
    if (typeof window === 'undefined') return fallback;
    const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || fallback;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    // Handle #RRGGBB or #RGB
    const clean = hex.replace('#', '');
    if (clean.length === 3) {
        return {
            r: parseInt(clean[0] + clean[0], 16) / 255,
            g: parseInt(clean[1] + clean[1], 16) / 255,
            b: parseInt(clean[2] + clean[2], 16) / 255,
        };
    }
    return {
        r: parseInt(clean.slice(0, 2), 16) / 255,
        g: parseInt(clean.slice(2, 4), 16) / 255,
        b: parseInt(clean.slice(4, 6), 16) / 255,
    };
}

// ─── Main factory ─────────────────────────────────────────────────────────────
export function initThreeBackground(
    container: HTMLElement,
    config: ThreeBackgroundConfig = {}
): { destroy: () => void } {
    const PARTICLE_COUNT = config.particleCount ?? 110;
    const CONNECTION_DIST = config.connectionDistance ?? 3.2;
    const ROTATION_SPEED = config.rotationSpeed ?? 0.04;

    // Resolve brand colour
    const hexColor = config.primaryColor ?? getCSSVar('--brand-primary', '#7bcbc4');
    const rgb = hexToRgb(hexColor);
    const brandColor = new THREE.Color(rgb.r, rgb.g, rgb.b);
    const brandColorDark = new THREE.Color(rgb.r * 0.6, rgb.g * 0.6, rgb.b * 0.6);

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );
    camera.position.set(0, 0, 12);

    // ── Particles ─────────────────────────────────────────────────────────────
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const positions: THREE.Vector3[] = [];
    const spread = 10;

    const particleMat = new THREE.MeshBasicMaterial({ color: brandColor, transparent: true, opacity: 0.55 });
    const particleGeo = new THREE.SphereGeometry(0.045, 6, 6);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const mesh = new THREE.Mesh(particleGeo, particleMat.clone());
        const pos = new THREE.Vector3(
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread * 0.8,
            (Math.random() - 0.5) * spread * 0.6
        );
        mesh.position.copy(pos);
        positions.push(pos);
        particleGroup.add(mesh);
    }

    // ── Connecting Lines ──────────────────────────────────────────────────────
    // We'll pre-build line segments between close particles
    const linesMat = new THREE.LineBasicMaterial({
        color: brandColor,
        transparent: true,
        opacity: 0.12,
    });
    const linesGroup = new THREE.Group();
    particleGroup.add(linesGroup);

    const lineObjects: THREE.Line[] = [];

    function buildLines() {
        // Clear old
        linesGroup.clear();
        lineObjects.length = 0;

        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                if (positions[i].distanceTo(positions[j]) < CONNECTION_DIST) {
                    const geo = new THREE.BufferGeometry().setFromPoints([
                        positions[i],
                        positions[j],
                    ]);
                    const line = new THREE.Line(geo, linesMat.clone());
                    linesGroup.add(line);
                    lineObjects.push(line);
                }
            }
        }
    }
    buildLines();

    // ── Wireframe Geometric Shapes ────────────────────────────────────────────
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    const wireMat = () =>
        new THREE.MeshBasicMaterial({
            color: brandColorDark,
            wireframe: true,
            transparent: true,
            opacity: 0.045,
        });

    const shapeConfigs: { geo: THREE.BufferGeometry; pos: [number, number, number]; scale: number; rotSpeed: [number, number, number] }[] = [
        {
            geo: new THREE.IcosahedronGeometry(3.2, 1),
            pos: [-5, 2, -4],
            scale: 1,
            rotSpeed: [0.003, 0.005, 0.002],
        },
        {
            geo: new THREE.TorusGeometry(2.8, 0.08, 8, 48),
            pos: [6, -1.5, -5],
            scale: 1,
            rotSpeed: [0.004, 0.002, 0.006],
        },
        {
            geo: new THREE.IcosahedronGeometry(2.4, 1),
            pos: [4, 3, -3],
            scale: 1,
            rotSpeed: [0.005, 0.003, 0.004],
        },
        {
            geo: new THREE.TorusGeometry(2.0, 0.07, 6, 36),
            pos: [-4, -2.5, -3],
            scale: 1,
            rotSpeed: [0.002, 0.006, 0.003],
        },
        {
            geo: new THREE.OctahedronGeometry(1.8, 0),
            pos: [1, 4, -5],
            scale: 1,
            rotSpeed: [0.006, 0.004, 0.002],
        },
    ];

    const shapeMeshes: { mesh: THREE.Mesh; rotSpeed: [number, number, number] }[] = [];
    for (const s of shapeConfigs) {
        const mesh = new THREE.Mesh(s.geo, wireMat());
        mesh.position.set(...s.pos);
        mesh.scale.setScalar(s.scale);
        shapesGroup.add(mesh);
        shapeMeshes.push({ mesh, rotSpeed: s.rotSpeed });
    }

    // ── Mouse parallax ────────────────────────────────────────────────────────
    const mouse = new THREE.Vector2(0, 0);
    const targetCameraOffset = new THREE.Vector2(0, 0);
    const currentCameraOffset = new THREE.Vector2(0, 0);

    function onMouseMove(e: MouseEvent) {
        // Normalize to [-1, 1]
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        targetCameraOffset.set(mouse.x * 0.8, mouse.y * 0.5);
    }

    // ── Scroll fade ───────────────────────────────────────────────────────────
    let scrollOpacityScale = 1.0;

    function onScroll() {
        const scrollY = window.scrollY;
        const maxScroll = window.innerHeight * 0.8;
        scrollOpacityScale = Math.max(0, 1 - scrollY / maxScroll);
    }

    // ── Resize ────────────────────────────────────────────────────────────────
    function onResize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', onResize);

    // ── Visibility API ────────────────────────────────────────────────────────
    let paused = false;
    function onVisibilityChange() {
        paused = document.visibilityState === 'hidden';
        if (!paused) tick(); // resume
    }

    // ── Animation Loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId = 0;

    function tick() {
        if (paused) return;
        rafId = requestAnimationFrame(tick);

        const elapsed = clock.getElapsedTime();
        const delta = clock.getDelta(); // tiny; just for lerp below

        // Slowly rotate particle network
        particleGroup.rotation.y = elapsed * ROTATION_SPEED;
        particleGroup.rotation.x = Math.sin(elapsed * 0.015) * 0.08;

        // "Breathing" scale pulse
        const breathe = 1 + Math.sin(elapsed * 0.4) * 0.012;
        particleGroup.scale.setScalar(breathe);

        // Rotate each wireframe shape independently
        for (const { mesh, rotSpeed } of shapeMeshes) {
            mesh.rotation.x += rotSpeed[0];
            mesh.rotation.y += rotSpeed[1];
            mesh.rotation.z += rotSpeed[2];
        }

        // Lerp camera offset toward mouse target (smooth parallax)
        currentCameraOffset.lerp(targetCameraOffset, 0.04);
        camera.position.x = currentCameraOffset.x;
        camera.position.y = currentCameraOffset.y;
        camera.lookAt(0, 0, 0);

        // Apply scroll opacity to all particle materials and lines
        const baseParticleOpacity = 0.55 * scrollOpacityScale;
        const baseLineOpacity = 0.12 * scrollOpacityScale;

        particleGroup.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
                (child.material as THREE.MeshBasicMaterial).opacity = baseParticleOpacity;
            }
        });
        for (const line of lineObjects) {
            (line.material as THREE.LineBasicMaterial).opacity = baseLineOpacity;
        }
        for (const { mesh } of shapeMeshes) {
            (mesh.material as THREE.MeshBasicMaterial).opacity = 0.045 * scrollOpacityScale;
        }

        renderer.render(scene, camera);
    }

    // ── Event Wiring ──────────────────────────────────────────────────────────
    container.addEventListener('mousemove', onMouseMove);
    // Use window for scroll since container may be inside a scrollable page
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    tick();

    // ── Destroy / Cleanup ─────────────────────────────────────────────────────
    function destroy() {
        paused = true;
        cancelAnimationFrame(rafId);

        container.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        resizeObserver.disconnect();

        // Dispose geometries + materials
        particleGeo.dispose();
        particleMat.dispose();
        linesMat.dispose();

        for (const line of lineObjects) {
            line.geometry.dispose();
            (line.material as THREE.LineBasicMaterial).dispose();
        }

        for (const s of shapeConfigs) s.geo.dispose();
        for (const { mesh } of shapeMeshes) {
            (mesh.material as THREE.Material).dispose();
        }

        renderer.dispose();
        if (renderer.domElement.parentElement) {
            renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
    }

    return { destroy };
}
