const THREE = window.THREE;

function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 76, 166, 0.5)');
    gradient.addColorStop(0.35, 'rgba(255, 76, 166, 0.18)');
    gradient.addColorStop(0.7, 'rgba(255, 76, 166, 0.05)');
    gradient.addColorStop(1, 'rgba(255, 76, 166, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
}

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07080f);
    scene.fog = new THREE.FogExp2(0x07080f, 0.0004);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 6000);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    const sun = new THREE.DirectionalLight(0xdde8ff, 1.3);
    sun.position.set(300, 600, 200);
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xffd0a0, 0.5);
    fill.position.set(-200, 200, -400);
    scene.add(fill);

    scene.add(new THREE.HemisphereLight(0x304070, 0x080c14, 0.5));

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000),
        new THREE.MeshLambertMaterial({ color: 0x0b0e18 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);

    const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: createGlowTexture(),
            color: 0xffffff,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })
    );
    glow.scale.set(420, 420, 1);
    glow.position.set(0, 40, 0);
    scene.add(glow);

    const accentLight = new THREE.PointLight(0xff4ca6, 1.2, 900, 2);
    accentLight.position.set(0, 120, 0);
    scene.add(accentLight);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer };
}
