const THREE = window.THREE;

const MAP_PICK_CELL_SIZE = 80;
const MAP_PICK_MAX_DISTANCE = 4200;
const MAP_PICK_STEP = 24;
const MAP_PICK_BROADPHASE_PADDING = 1.5;
const MAP_PICK_EPSILON = 0.00001;

function pointInRing(x, z, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
        const xi = ring[i];
        const zi = ring[i + 1];
        const xj = ring[j];
        const zj = ring[j + 1];
        const intersects = ((zi > z) !== (zj > z)) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi;
        if (intersects) inside = !inside;
    }
    return inside;
}

function pointInBuildingFootprint(meta, x, z) {
    const building = meta.building;
    if (!pointInRing(x, z, building.ext)) return false;
    if (!building.holes) return true;
    return !building.holes.some((hole) => pointInRing(x, z, hole));
}

function getFootprintBounds(building) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;

    for (let i = 0; i < building.ext.length; i += 2) {
        const x = building.ext[i];
        const z = building.ext[i + 1];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
    }

    return { minX, maxX, minZ, maxZ };
}

function makeCellKey(x, z) {
    return `${Math.floor(x / MAP_PICK_CELL_SIZE)},${Math.floor(z / MAP_PICK_CELL_SIZE)}`;
}

function createMapPickIndex(mapMeta) {
    const cells = new Map();

    mapMeta.forEach((meta) => {
        const bounds = getFootprintBounds(meta.building);
        meta.pickBounds = bounds;
        meta.pickBox = new THREE.Box3(
            new THREE.Vector3(bounds.minX, meta.building.g * 0.02, -bounds.maxZ),
            new THREE.Vector3(bounds.maxX, meta.building.g * 0.02 + meta.height * 0.1, -bounds.minZ)
        );
        meta.pickBox.expandByScalar(MAP_PICK_BROADPHASE_PADDING);

        const minCellX = Math.floor(bounds.minX / MAP_PICK_CELL_SIZE);
        const maxCellX = Math.floor(bounds.maxX / MAP_PICK_CELL_SIZE);
        const minCellZ = Math.floor(bounds.minZ / MAP_PICK_CELL_SIZE);
        const maxCellZ = Math.floor(bounds.maxZ / MAP_PICK_CELL_SIZE);

        for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
            for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ++) {
                const key = `${cellX},${cellZ}`;
                if (!cells.has(key)) cells.set(key, []);
                cells.get(key).push(meta);
            }
        }
    });

    return { source: mapMeta, cells };
}

function collectRayCandidates(ray, pickIndex) {
    const candidates = new Set();

    for (let distance = 0; distance <= MAP_PICK_MAX_DISTANCE; distance += MAP_PICK_STEP) {
        const worldX = ray.origin.x + ray.direction.x * distance;
        const worldZ = ray.origin.z + ray.direction.z * distance;
        const cellItems = pickIndex.cells.get(makeCellKey(worldX, -worldZ));
        if (!cellItems) continue;
        cellItems.forEach((meta) => candidates.add(meta));
    }

    if (Math.abs(ray.direction.y) > 0.0001) {
        const groundDistance = -ray.origin.y / ray.direction.y;
        if (groundDistance >= 0 && groundDistance <= MAP_PICK_MAX_DISTANCE) {
            const worldX = ray.origin.x + ray.direction.x * groundDistance;
            const worldZ = ray.origin.z + ray.direction.z * groundDistance;
            const cellItems = pickIndex.cells.get(makeCellKey(worldX, -worldZ));
            if (cellItems) cellItems.forEach((meta) => candidates.add(meta));
        }
    }

    return candidates;
}

function intersectHorizontalPlane(meta, ray, y) {
    if (Math.abs(ray.direction.y) < MAP_PICK_EPSILON) return Infinity;

    const distance = (y - ray.origin.y) / ray.direction.y;
    if (distance < 0) return Infinity;

    const x = ray.origin.x + ray.direction.x * distance;
    const z = ray.origin.z + ray.direction.z * distance;
    return pointInBuildingFootprint(meta, x, -z) ? distance : Infinity;
}

function intersectVerticalRing(ray, ring, minY, maxY) {
    let bestDistance = Infinity;
    const originX = ray.origin.x;
    const originZ = ray.origin.z;
    const dirX = ray.direction.x;
    const dirZ = ray.direction.z;

    for (let i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
        const ax = ring[j];
        const az = -ring[j + 1];
        const bx = ring[i];
        const bz = -ring[i + 1];
        const edgeX = bx - ax;
        const edgeZ = bz - az;
        const denominator = dirX * edgeZ - dirZ * edgeX;

        if (Math.abs(denominator) < MAP_PICK_EPSILON) continue;

        const relX = ax - originX;
        const relZ = az - originZ;
        const distance = (relX * edgeZ - relZ * edgeX) / denominator;
        const edgeRatio = (relX * dirZ - relZ * dirX) / denominator;

        if (distance < 0 || edgeRatio < 0 || edgeRatio > 1 || distance >= bestDistance) continue;

        const y = ray.origin.y + ray.direction.y * distance;
        if (y < minY || y > maxY) continue;

        bestDistance = distance;
    }

    return bestDistance;
}

function intersectBuilding(meta, ray) {
    const minY = meta.building.g * 0.02;
    const maxY = minY + meta.height * 0.1;
    const building = meta.building;
    let bestDistance = Math.min(
        intersectHorizontalPlane(meta, ray, maxY),
        intersectHorizontalPlane(meta, ray, minY),
        intersectVerticalRing(ray, building.ext, minY, maxY)
    );

    if (building.holes) {
        for (const hole of building.holes) {
            bestDistance = Math.min(bestDistance, intersectVerticalRing(ray, hole, minY, maxY));
        }
    }

    return bestDistance;
}

function pickMapBuilding(state, raycaster, pickIndex) {
    const ray = raycaster.ray;
    const candidates = collectRayCandidates(ray, pickIndex);
    let bestMeta = null;
    let bestDistance = Infinity;

    for (const meta of candidates) {
        if (meta.height < state.minHeight) continue;
        if (!ray.intersectsBox(meta.pickBox)) continue;

        const distance = intersectBuilding(meta, ray);
        if (distance >= bestDistance) continue;

        bestMeta = meta;
        bestDistance = distance;
    }

    if (!bestMeta) return null;
    return {
        meta: bestMeta,
        context: { type: 'map', meta: bestMeta }
    };
}

function getRankingHit(state, raycaster) {
    const rankingMeshes = state.rankingItems.map((item) => item.mesh).filter((mesh) => mesh.visible);
    const hit = raycaster.intersectObjects(rankingMeshes, false)[0];
    if (!hit) return null;

    const item = state.rankingItems.find((entry) => entry.mesh === hit.object) ?? null;
    return {
        meta: hit.object.userData.meta,
        context: { type: 'ranking', item }
    };
}

function getMapHit(state, raycaster, pickIndex) {
    if (!state.mapMesh || !state.mapMesh.visible) return null;
    return pickMapBuilding(state, raycaster, pickIndex);
}

function getSelection(state, raycaster, pickIndex) {
    if (!state) return null;
    return state.viewMode === 'ranking'
        ? getRankingHit(state, raycaster)
        : getMapHit(state, raycaster, pickIndex);
}

export function createSelectionController({ camera, xrControllers = [], getInteractiveState, onSelect, onClear, onBeforeXRSelect = null }) {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const controllerDirection = new THREE.Vector3();
    const controllerOrigin = new THREE.Vector3();
    const controllerRotation = new THREE.Matrix4();
    const downPointer = { x: 0, y: 0 };
    let pointerDown = false;
    let mapPickIndex = null;

    function getMapPickIndex(state) {
        if (!mapPickIndex || mapPickIndex.source !== state.mapMeta) {
            mapPickIndex = createMapPickIndex(state.mapMeta);
        }
        return mapPickIndex;
    }

    function isUiTarget(target) {
        if (!target) return false;
        return Boolean(target.closest?.('#hud-tl, #hud-tr, #search-panel, #mode-bar, #view-bar, #legend, #filter-panel, #controls, #xr-panel'));
    }

    function updatePointer(event) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function selectFromMouse(event) {
        if (isUiTarget(event.target)) return;
        updatePointer(event);
        raycaster.setFromCamera(pointer, camera);

        const state = getInteractiveState();
        const selection = getSelection(state, raycaster, getMapPickIndex(state));
        if (!selection) return onClear();

        onSelect(selection.meta, { x: event.clientX, y: event.clientY }, selection.context);
    }

    function selectFromController(controller) {
        if (onBeforeXRSelect?.(controller)) return;

        const raySource = controller.userData.ray ?? controller;
        controller.updateMatrixWorld(true);
        raySource.updateMatrixWorld(true);
        controllerOrigin.setFromMatrixPosition(raySource.matrixWorld);
        controllerRotation.identity().extractRotation(raySource.matrixWorld);
        controllerDirection.set(0, 0, -1).applyMatrix4(controllerRotation);
        raycaster.set(controllerOrigin, controllerDirection);

        const state = getInteractiveState();
        const selection = getSelection(state, raycaster, getMapPickIndex(state));
        if (!selection) return onClear();

        onSelect(selection.meta, { x: 24, y: 24 }, selection.context);
    }

    window.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 || isUiTarget(event.target)) return;
        pointerDown = true;
        downPointer.x = event.clientX;
        downPointer.y = event.clientY;
    });

    window.addEventListener('click', (event) => {
        if (!pointerDown) return;
        pointerDown = false;

        const dx = event.clientX - downPointer.x;
        const dy = event.clientY - downPointer.y;
        if (Math.hypot(dx, dy) > 6) return;

        selectFromMouse(event);
    });

    xrControllers.forEach((controller) => {
        controller.addEventListener('select', () => selectFromController(controller));
    });

    window.addEventListener('blur', () => {
        pointerDown = false;
    });

    return {
        clearSelection: onClear
    };
}
