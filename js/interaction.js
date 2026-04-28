const THREE = window.THREE;

import { findBuildingMetaByFaceIndex } from './buildings.js';

export function createHoverController({ camera, getInteractiveState, onHover, onLeave }) {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovering = false;
    let cachedRankingItems = [];
    let cachedRankingMeshes = [];
    let rafPending = false;
    let lastEvent = null;
    let lastHoverMeta = null;
    let lastHoverType = null;

    function clearHover() {
        lastHoverMeta = null;
        lastHoverType = null;
        if (!hovering) return;
        hovering = false;
        onLeave();
    }

    function updatePointer(event) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function processHover() {
        rafPending = false;
        const event = lastEvent;
        if (!event) return;

        const state = getInteractiveState();
        if (!state) return clearHover();

        raycaster.setFromCamera(pointer, camera);

        if (state.viewMode === 'ranking') {
            if (cachedRankingItems !== state.rankingItems) {
                cachedRankingItems = state.rankingItems;
                cachedRankingMeshes = cachedRankingItems.map((item) => item.mesh);
            }
            const hits = raycaster.intersectObjects(cachedRankingMeshes, false);
            const hit = hits[0];
            if (!hit || !hit.object.visible) return clearHover();
            const item = hit.object.userData.rankingItem ?? null;
            const meta = hit.object.userData.meta;
            if (hovering && lastHoverType === 'ranking' && lastHoverMeta === meta) return;
            hovering = true;
            lastHoverMeta = meta;
            lastHoverType = 'ranking';
            onHover(meta, { x: event.clientX, y: event.clientY }, { type: 'ranking', item });
            return;
        }

        if (!state.mapMesh || !state.mapMesh.visible) return clearHover();
        const hits = raycaster.intersectObject(state.mapMesh, false);
        const hit = hits[0];
        if (!hit) return clearHover();

        const meta = findBuildingMetaByFaceIndex(state.mapMeta, hit.faceIndex);
        if (!meta || meta.height < state.minHeight) return clearHover();
        if (hovering && lastHoverType === 'map' && lastHoverMeta === meta) return;

        hovering = true;
        lastHoverMeta = meta;
        lastHoverType = 'map';
        onHover(meta, { x: event.clientX, y: event.clientY }, { type: 'map', meta });
    }

    window.addEventListener('mousemove', (event) => {
        lastEvent = event;
        updatePointer(event);
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(processHover);
    });

    window.addEventListener('mouseleave', clearHover);
    window.addEventListener('blur', clearHover);

    return { clearHover };
}
