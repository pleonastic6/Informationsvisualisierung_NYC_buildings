const THREE = window.THREE;

import { findBuildingMetaByFaceIndex } from './buildings.js';

export function createHoverController({ camera, getInteractiveState, onHover, onLeave }) {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovering = false;

    function clearHover() {
        if (!hovering) return;
        hovering = false;
        onLeave();
    }

    function updatePointer(event) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    window.addEventListener('mousemove', (event) => {
        updatePointer(event);
        const state = getInteractiveState();
        if (!state) return clearHover();

        raycaster.setFromCamera(pointer, camera);

        if (state.viewMode === 'ranking') {
            const rankingMeshes = state.rankingItems.map((item) => item.mesh).filter((mesh) => mesh.visible);
            const hits = raycaster.intersectObjects(rankingMeshes, false);
            const hit = hits[0];
            if (!hit) return clearHover();
            hovering = true;
            onHover(hit.object.userData.meta, { x: event.clientX, y: event.clientY });
            return;
        }

        if (!state.mapMesh || !state.mapMesh.visible) return clearHover();
        const hits = raycaster.intersectObject(state.mapMesh, false);
        const hit = hits[0];
        if (!hit) return clearHover();

        const meta = findBuildingMetaByFaceIndex(state.mapMeta, hit.faceIndex);
        if (!meta) return clearHover();

        hovering = true;
        onHover(meta, { x: event.clientX, y: event.clientY });
    });

    window.addEventListener('mouseleave', clearHover);
    window.addEventListener('blur', clearHover);

    return { clearHover };
}
