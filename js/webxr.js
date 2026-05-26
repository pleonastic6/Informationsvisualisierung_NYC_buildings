const THREE = window.THREE;

const MOVE_SPEED = 72;
const VERTICAL_SPEED = 42;
const DEAD_ZONE = 0.16;
const SNAP_DEAD_ZONE = 0.72;
const SNAP_RESET_ZONE = 0.35;
const SNAP_TURN = Math.PI / 10;
const HEIGHT_OFFSET = 1.6;
const XR_SETTLE_SECONDS = 0.25;
const XR_FRAMEBUFFER_SCALE = 0.72;
const XR_RAY_PITCH_CORRECTION = -0.12;
const XR_RAY_YAW_CORRECTION = 0.14;

function createControllerRay(index) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -18)
    ]);
    const material = new THREE.LineBasicMaterial({
        color: 0xff4ca6,
        transparent: true,
        opacity: 0.72
    });
    const ray = new THREE.Line(geometry, material);
    ray.name = 'xr-controller-ray';
    ray.rotation.x = XR_RAY_PITCH_CORRECTION;
    ray.rotation.y = index === 0 ? XR_RAY_YAW_CORRECTION : -XR_RAY_YAW_CORRECTION;
    return ray;
}

function createXRButton() {
    const panel = document.createElement('div');
    panel.id = 'xr-panel';

    const button = document.createElement('button');
    button.id = 'xr-enter';
    button.type = 'button';
    button.textContent = 'VR starten';
    button.disabled = true;

    const status = document.createElement('div');
    status.id = 'xr-status';
    status.textContent = 'WebXR wird geprueft';

    panel.append(button, status);
    document.body.appendChild(panel);

    return { panel, button, status };
}

function axisValue(gamepad, index) {
    const value = gamepad?.axes?.[index] ?? 0;
    return Math.abs(value) > DEAD_ZONE ? value : 0;
}

function stickAxes(gamepad) {
    const primaryX = axisValue(gamepad, 2);
    const primaryY = axisValue(gamepad, 3);
    if (primaryX || primaryY) return { x: primaryX, y: primaryY };
    return {
        x: axisValue(gamepad, 0),
        y: axisValue(gamepad, 1)
    };
}

function pressed(gamepad, index) {
    return Boolean(gamepad?.buttons?.[index]?.pressed);
}

export function createWebXR({ scene, camera, renderer, xrOrigin }) {
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local-floor');
    if (renderer.xr.setFramebufferScaleFactor) {
        renderer.xr.setFramebufferScaleFactor(XR_FRAMEBUFFER_SCALE);
    }
    if (renderer.xr.setFoveation) {
        renderer.xr.setFoveation(1);
    }

    const { button, status } = createXRButton();
    const controllers = [0, 1].map((index) => {
        const controller = renderer.xr.getController(index);
        const ray = createControllerRay(index);
        controller.userData.ray = ray;
        controller.add(ray);
        xrOrigin.add(controller);
        return controller;
    });

    let supported = false;
    let session = null;
    let snapTurnReady = true;
    let settleTime = 0;
    const desktopCameraState = {
        position: new THREE.Vector3(),
        quaternion: new THREE.Quaternion()
    };
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const move = new THREE.Vector3();
    const desktopForward = new THREE.Vector3();

    function setSessionState(nextSession) {
        session = nextSession;
        document.body.classList.toggle('xr-presenting', Boolean(session));
        button.textContent = session ? 'VR beenden' : 'VR starten';
        status.textContent = session ? 'Links bewegen, rechts drehen/hoehe' : 'Bereit fuer VR-Brille';
    }

    async function startSession() {
        desktopCameraState.position.copy(camera.position);
        desktopCameraState.quaternion.copy(camera.quaternion);
        camera.getWorldDirection(desktopForward);
        const desktopYaw = Math.atan2(desktopForward.x, desktopForward.z);

        const xrSession = await navigator.xr.requestSession('immersive-vr', {
            optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking']
        });
        xrSession.addEventListener('end', () => {
            xrOrigin.position.set(0, 0, 0);
            xrOrigin.rotation.set(0, 0, 0);
            camera.position.copy(desktopCameraState.position);
            camera.quaternion.copy(desktopCameraState.quaternion);
            setSessionState(null);
        });
        await renderer.xr.setSession(xrSession);
        xrOrigin.position.set(desktopCameraState.position.x, Math.max(0, desktopCameraState.position.y - HEIGHT_OFFSET), desktopCameraState.position.z);
        xrOrigin.rotation.set(0, desktopYaw, 0);
        camera.position.set(0, 0, 0);
        camera.quaternion.identity();
        snapTurnReady = true;
        settleTime = XR_SETTLE_SECONDS;
        setSessionState(xrSession);
    }

    async function endSession() {
        await session?.end();
    }

    button.addEventListener('click', async () => {
        if (!supported) return;
        button.disabled = true;
        try {
            if (session) await endSession();
            else await startSession();
        } catch (error) {
            console.warn('WebXR session failed', error);
            status.textContent = 'VR konnte nicht gestartet werden';
        } finally {
            button.disabled = false;
        }
    });

    async function detectSupport() {
        if (!window.isSecureContext) {
            status.textContent = 'VR braucht HTTPS oder localhost';
            return;
        }

        if (!navigator.xr) {
            status.textContent = 'WebXR nicht verfuegbar';
            return;
        }

        supported = await navigator.xr.isSessionSupported('immersive-vr');
        button.disabled = !supported;
        status.textContent = supported ? 'Bereit fuer VR-Brille' : 'Keine VR-Brille erkannt';
    }

    function update(deltaSeconds) {
        if (!session) return;
        if (settleTime > 0) {
            settleTime = Math.max(0, settleTime - deltaSeconds);
            return;
        }

        renderer.xr.getCamera(camera).getWorldDirection(forward);
        forward.y = 0;
        if (forward.lengthSq() > 0) forward.normalize();
        right.set(-forward.z, 0, forward.x).normalize();
        move.set(0, 0, 0);

        const sources = Array.from(session.inputSources).filter((source) => source.gamepad);

        for (let index = 0; index < sources.length; index++) {
            const source = sources[index];
            const gamepad = source.gamepad;
            const { x, y } = stickAxes(gamepad);
            const isRight = source.handedness === 'right' || (!source.handedness && index === 1);
            const isLeft = source.handedness === 'left' || (!source.handedness && index === 0);

            if (isRight) {
                if (Math.abs(x) < SNAP_RESET_ZONE) snapTurnReady = true;
                if (snapTurnReady && Math.abs(x) > SNAP_DEAD_ZONE) {
                    xrOrigin.rotation.y -= Math.sign(x) * SNAP_TURN;
                    snapTurnReady = false;
                }
                if (y) move.y += -y * VERTICAL_SPEED * deltaSeconds;
                if (pressed(gamepad, 4)) move.y += VERTICAL_SPEED * deltaSeconds;
                if (pressed(gamepad, 5)) move.y -= VERTICAL_SPEED * deltaSeconds;
                continue;
            }

            if (isLeft) {
                const boost = pressed(gamepad, 1) ? 2.1 : 1;
                move.addScaledVector(right, x * MOVE_SPEED * boost * deltaSeconds);
                move.addScaledVector(forward, -y * MOVE_SPEED * boost * deltaSeconds);
                if (pressed(gamepad, 4)) move.y -= VERTICAL_SPEED * deltaSeconds;
                if (pressed(gamepad, 5)) move.y += VERTICAL_SPEED * deltaSeconds;
            }
        }

        if (move.lengthSq() > 0) {
            xrOrigin.position.add(move);
            xrOrigin.position.y = Math.max(0, xrOrigin.position.y);
        }
    }

    detectSupport().catch(() => {
        status.textContent = 'WebXR-Pruefung fehlgeschlagen';
    });

    return {
        isPresenting: () => Boolean(session),
        update,
        controllers,
        scene
    };
}
