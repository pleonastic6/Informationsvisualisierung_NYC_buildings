const THREE = window.THREE;

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0b11);
    scene.fog = new THREE.FogExp2(0x0a0b11, 0.00034);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 6000);

    scene.add(new THREE.AmbientLight(0xf5f7ff, 0.7));

    const sun = new THREE.DirectionalLight(0xe9efff, 1.45);
    sun.position.set(320, 620, 240);
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xb8c4e6, 0.45);
    fill.position.set(-260, 180, -360);
    scene.add(fill);

    scene.add(new THREE.HemisphereLight(0x56627f, 0x0b0c12, 0.62));

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(2200, 2200),
        new THREE.MeshStandardMaterial({
            color: 0x10131b,
            roughness: 0.92,
            metalness: 0.08
        })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer };
}
