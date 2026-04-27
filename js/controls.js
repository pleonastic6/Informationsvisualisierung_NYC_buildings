const THREE = window.THREE;

const CAM_SPEED = 1.5;
const CAM_SENSITIVITY = 0.003;

export function createControls(camera) {
    const keys = {};
    let mouseDown = false;
    let lastMouse = { x: 0, y: 0 };
    let camYaw = -0.3;
    let camPitch = 0.8;
    const camPos = new THREE.Vector3(-55, 200, 300);

    function getDirection() {
        return new THREE.Vector3(
            Math.sin(camYaw) * Math.cos(camPitch),
            -Math.sin(camPitch),
            Math.cos(camYaw) * Math.cos(camPitch)
        );
    }

    function updateCamera() {
        const dir = getDirection();
        const right = new THREE.Vector3(-Math.cos(camYaw), 0, Math.sin(camYaw));

        if (keys.w || keys.W || keys.ArrowUp) camPos.addScaledVector(dir, CAM_SPEED);
        if (keys.s || keys.S || keys.ArrowDown) camPos.addScaledVector(dir, -CAM_SPEED);
        if (keys.a || keys.A || keys.ArrowLeft) camPos.addScaledVector(right, -CAM_SPEED);
        if (keys.d || keys.D || keys.ArrowRight) camPos.addScaledVector(right, CAM_SPEED);
        if (keys.q || keys.Q) camPos.y += CAM_SPEED;
        if (keys.e || keys.E) camPos.y -= CAM_SPEED;

        camera.position.copy(camPos);
        camera.lookAt(camPos.clone().addScaledVector(dir, 100));
    }

    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    document.addEventListener('mousedown', (event) => {
        if (event.target.id === 'height-filter') return;
        if (event.button === 0) {
            mouseDown = true;
            lastMouse = { x: event.clientX, y: event.clientY };
        }
    });

    document.addEventListener('mouseup', (event) => {
        if (event.button === 0) mouseDown = false;
    });

    document.addEventListener('mousemove', (event) => {
        if (!mouseDown) return;
        const dx = event.clientX - lastMouse.x;
        const dy = event.clientY - lastMouse.y;
        lastMouse = { x: event.clientX, y: event.clientY };
        camYaw -= dx * CAM_SENSITIVITY;
        camPitch = Math.max(-1.4, Math.min(1.4, camPitch + dy * CAM_SENSITIVITY));
    });

    document.addEventListener('wheel', (event) => {
        camPos.addScaledVector(getDirection(), -event.deltaY * 0.3);
    }, { passive: true });

    document.addEventListener('contextmenu', (event) => event.preventDefault());

    updateCamera();
    return { updateCamera };
}
