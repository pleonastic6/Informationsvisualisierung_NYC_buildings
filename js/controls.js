const THREE = window.THREE;

const CAM_SPEED = 1.5;
const CAM_SENSITIVITY = 0.003;

export function createControls(camera) {
    const keys = {};
    let mouseDown = false;
    let lastMouse = { x: 0, y: 0 };
    let camYaw = -0.12;
    let camPitch = 0.92;
    const camPos = new THREE.Vector3(-8, 115, 360);

    let cinematicActive = false;
    const cinematicFrom = {
        pos: camPos.clone(),
        yaw: camYaw,
        pitch: camPitch
    };
    const cinematicTo = {
        pos: camPos.clone(),
        yaw: camYaw,
        pitch: camPitch
    };
    let cinematicProgress = 1;

    function stopCinematic() {
        cinematicActive = false;
        cinematicProgress = 1;
    }

    function startCinematic(target) {
        cinematicFrom.pos.copy(camPos);
        cinematicFrom.yaw = camYaw;
        cinematicFrom.pitch = camPitch;
        cinematicTo.pos.copy(target.pos);
        cinematicTo.yaw = target.yaw;
        cinematicTo.pitch = target.pitch;
        cinematicProgress = 0;
        cinematicActive = true;
    }

    function getDirection() {
        return new THREE.Vector3(
            Math.sin(camYaw) * Math.cos(camPitch),
            -Math.sin(camPitch),
            Math.cos(camYaw) * Math.cos(camPitch)
        );
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function updateCamera() {
        if (cinematicActive) {
            cinematicProgress = Math.min(1, cinematicProgress + 0.035);
            const eased = easeInOutCubic(cinematicProgress);
            camPos.lerpVectors(cinematicFrom.pos, cinematicTo.pos, eased);
            camYaw = cinematicFrom.yaw + (cinematicTo.yaw - cinematicFrom.yaw) * eased;
            camPitch = cinematicFrom.pitch + (cinematicTo.pitch - cinematicFrom.pitch) * eased;
            if (cinematicProgress >= 1) cinematicActive = false;
        }

        const dir = getDirection();
        const right = new THREE.Vector3(-Math.cos(camYaw), 0, Math.sin(camYaw));

        if (!cinematicActive) {
            if (keys.w || keys.W || keys.ArrowUp) camPos.addScaledVector(dir, CAM_SPEED);
            if (keys.s || keys.S || keys.ArrowDown) camPos.addScaledVector(dir, -CAM_SPEED);
            if (keys.a || keys.A || keys.ArrowLeft) camPos.addScaledVector(right, -CAM_SPEED);
            if (keys.d || keys.D || keys.ArrowRight) camPos.addScaledVector(right, CAM_SPEED);
            if (keys.q || keys.Q) camPos.y += CAM_SPEED;
            if (keys.e || keys.E) camPos.y -= CAM_SPEED;
        }

        camera.position.copy(camPos);
        camera.lookAt(camPos.clone().addScaledVector(dir, 100));
    }

    document.addEventListener('keydown', (event) => {
        stopCinematic();
        keys[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    document.addEventListener('mousedown', (event) => {
        if (event.target.id === 'height-filter') return;
        stopCinematic();
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
        stopCinematic();
        const dx = event.clientX - lastMouse.x;
        const dy = event.clientY - lastMouse.y;
        lastMouse = { x: event.clientX, y: event.clientY };
        camYaw -= dx * CAM_SENSITIVITY;
        camPitch = Math.max(-1.4, Math.min(1.4, camPitch + dy * CAM_SENSITIVITY));
    });

    document.addEventListener('wheel', (event) => {
        stopCinematic();
        camPos.addScaledVector(getDirection(), -event.deltaY * 0.3);
    }, { passive: true });

    document.addEventListener('contextmenu', (event) => event.preventDefault());

    updateCamera();

    return {
        updateCamera,
        transitionToView(view) {
            if (view === 'ranking') {
                startCinematic({
                    pos: new THREE.Vector3(0, 125, 245),
                    yaw: 0,
                    pitch: 0.88
                });
                return;
            }

            startCinematic({
                pos: new THREE.Vector3(-8, 115, 360),
                yaw: -0.12,
                pitch: 0.92
            });
        }
    };
}
