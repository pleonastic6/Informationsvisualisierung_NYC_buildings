const THREE = window.THREE;

import { ERA_COLORS, ERA_LABELS, groundColor, heightColor } from './colors.js';

const RANKING_LIMIT = 100;
const RING_SIZE = 25;
const BASE_RADIUS = 110;
const RING_GAP = 125;

function createShape(points, centerX = 0, centerZ = 0) {
    const shape = new THREE.Shape();
    shape.moveTo(points[0] - centerX, points[1] - centerZ);
    for (let i = 2; i < points.length; i += 2) shape.lineTo(points[i] - centerX, points[i + 1] - centerZ);
    shape.closePath();
    return shape;
}

function buildGeometry(building, { centered = false } = {}) {
    const centerX = centered ? building.x : 0;
    const centerZ = centered ? building.z : 0;
    const shape = createShape(building.ext, centerX, centerZ);

    if (building.holes) {
        for (const hole of building.holes) {
            const holePath = new THREE.Path();
            holePath.moveTo(hole[0] - centerX, hole[1] - centerZ);
            for (let i = 2; i < hole.length; i += 2) holePath.lineTo(hole[i] - centerX, hole[i + 1] - centerZ);
            holePath.closePath();
            shape.holes.push(holePath);
        }
    }

    const geometry = new THREE.ExtrudeGeometry(shape, { depth: building.h * 0.1, bevelEnabled: false });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, building.g * 0.02, 0);
    return geometry;
}

function createPaletteSet(building, maxHeight, minGround, maxGround, vertexCount) {
    const heightRatio = building.h / maxHeight;
    const groundRatio = maxGround > minGround ? (building.g - minGround) / (maxGround - minGround) : 0;
    const heightCol = heightColor(heightRatio);
    const eraCol = ERA_COLORS[building.era] ?? ERA_COLORS[0];
    const groundCol = groundColor(groundRatio);

    const palette = {
        height: new Float32Array(vertexCount * 3),
        era: new Float32Array(vertexCount * 3),
        ground: new Float32Array(vertexCount * 3)
    };

    for (let i = 0; i < vertexCount; i++) {
        const base = i * 3;
        palette.height[base] = heightCol.r;
        palette.height[base + 1] = heightCol.g;
        palette.height[base + 2] = heightCol.b;

        palette.era[base] = eraCol.r;
        palette.era[base + 1] = eraCol.g;
        palette.era[base + 2] = eraCol.b;

        palette.ground[base] = groundCol.r;
        palette.ground[base + 1] = groundCol.g;
        palette.ground[base + 2] = groundCol.b;
    }

    return palette;
}

function describeBuilding(building, rank = null) {
    return {
        building,
        rank,
        height: building.h,
        era: building.era,
        eraLabel: ERA_LABELS[building.era] ?? ERA_LABELS[0]
    };
}

export async function buildBuildings({ scene, buildings, maxHeight, minGround, maxGround, setProgress }) {
    const geoList = [];
    const CHUNK = 400;
    const palettes = {
        height: [],
        era: [],
        ground: []
    };
    const buildingMeta = [];

    for (let off = 0; off < buildings.length; off += CHUNK) {
        const end = Math.min(off + CHUNK, buildings.length);

        for (let i = off; i < end; i++) {
            const building = buildings[i];
            const geometry = buildGeometry(building);
            const vertexCount = geometry.attributes.position.count;
            const palette = createPaletteSet(building, maxHeight, minGround, maxGround, vertexCount);

            for (let v = 0; v < vertexCount * 3; v++) {
                palettes.height.push(palette.height[v]);
                palettes.era.push(palette.era[v]);
                palettes.ground.push(palette.ground[v]);
            }

            geoList.push(geometry);
            buildingMeta.push({
                ...describeBuilding(building),
                vertexStart: palettes.height.length / 3 - vertexCount,
                vertexCount
            });
        }

        setProgress(30 + Math.round((end / buildings.length) * 55), `Geometrien ${end.toLocaleString()} / ${buildings.length.toLocaleString()}…`);
        await new Promise((resolve) => setTimeout(resolve, 0));
    }

    setProgress(87, 'Zusammenführen…');
    await new Promise((resolve) => setTimeout(resolve, 0));

    let totalVertices = 0;
    let totalIndices = 0;
    for (const geometry of geoList) {
        totalVertices += geometry.attributes.position.count;
        totalIndices += geometry.index ? geometry.index.count : geometry.attributes.position.count;
    }

    const positions = new Float32Array(totalVertices * 3);
    const normals = new Float32Array(totalVertices * 3);
    const colors = new Float32Array(totalVertices * 3);
    const indices = new Uint32Array(totalIndices);

    let vertexOffset = 0;
    let indexOffset = 0;

    for (let i = 0; i < geoList.length; i++) {
        const geometry = geoList[i];
        const meta = buildingMeta[i];
        const indicesStart = indexOffset;

        positions.set(geometry.attributes.position.array, vertexOffset * 3);
        if (geometry.attributes.normal) normals.set(geometry.attributes.normal.array, vertexOffset * 3);

        for (let vertex = 0; vertex < meta.vertexCount; vertex++) {
            const targetBase = (vertexOffset + vertex) * 3;
            const sourceBase = (meta.vertexStart + vertex) * 3;
            colors[targetBase] = palettes.height[sourceBase];
            colors[targetBase + 1] = palettes.height[sourceBase + 1];
            colors[targetBase + 2] = palettes.height[sourceBase + 2];
        }

        if (geometry.index) {
            const geometryIndices = geometry.index.array;
            for (let k = 0; k < geometryIndices.length; k++) indices[indexOffset + k] = geometryIndices[k] + vertexOffset;
            indexOffset += geometryIndices.length;
        } else {
            for (let k = 0; k < meta.vertexCount; k++) indices[indexOffset + k] = k + vertexOffset;
            indexOffset += meta.vertexCount;
        }

        meta.triangleStart = indicesStart / 3;
        meta.triangleEnd = indexOffset / 3;

        vertexOffset += meta.vertexCount;
        geometry.dispose();
    }

    const mergedGeometry = new THREE.BufferGeometry();
    mergedGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    mergedGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    mergedGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    mergedGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const mesh = new THREE.Mesh(mergedGeometry, new THREE.MeshLambertMaterial({ vertexColors: true }));
    scene.add(mesh);

    return {
        mesh,
        buildingMeta,
        palettes
    };
}

export function buildRankingView({ scene, buildings, maxHeight, minGround, maxGround }) {
    const group = new THREE.Group();
    group.visible = false;

    const topBuildings = [...buildings]
        .sort((a, b) => b.h - a.h)
        .slice(0, RANKING_LIMIT);

    const items = topBuildings.map((building, index) => {
        const geometry = buildGeometry(building, { centered: true });
        const paletteSet = createPaletteSet(building, maxHeight, minGround, maxGround, geometry.attributes.position.count);
        geometry.setAttribute('color', new THREE.BufferAttribute(paletteSet.height.slice(), 3));

        const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ vertexColors: true }));
        const ringIndex = Math.floor(index / RING_SIZE);
        const positionInRing = index % RING_SIZE;
        const ringCount = Math.min(RING_SIZE, topBuildings.length - ringIndex * RING_SIZE);
        const angle = (-Math.PI / 2) + (positionInRing / ringCount) * Math.PI * 2;
        const radius = BASE_RADIUS + ringIndex * RING_GAP;

        mesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        mesh.rotation.y = -angle + Math.PI / 2;
        mesh.userData.meta = describeBuilding(building, index + 1);
        group.add(mesh);

        return {
            mesh,
            meta: mesh.userData.meta,
            palettes: paletteSet
        };
    });

    scene.add(group);
    return { group, items };
}

export function applyBuildingColors({ mesh, buildingMeta, sourceColors }) {
    if (!mesh) return;

    const colorAttribute = mesh.geometry.attributes.color;
    const target = colorAttribute.array;

    for (const meta of buildingMeta) {
        for (let vertex = 0; vertex < meta.vertexCount; vertex++) {
            const targetBase = (meta.vertexStart + vertex) * 3;
            target[targetBase] = sourceColors[targetBase];
            target[targetBase + 1] = sourceColors[targetBase + 1];
            target[targetBase + 2] = sourceColors[targetBase + 2];
        }
    }

    colorAttribute.needsUpdate = true;
}

export function applyHeightFilter({ mesh, buildingMeta, minHeight, sourceColors }) {
    if (!mesh) return;

    const colorAttribute = mesh.geometry.attributes.color;
    const target = colorAttribute.array;

    for (const meta of buildingMeta) {
        const hide = meta.height < minHeight;
        for (let vertex = 0; vertex < meta.vertexCount; vertex++) {
            const base = (meta.vertexStart + vertex) * 3;
            if (hide) {
                target[base] = 0;
                target[base + 1] = 0;
                target[base + 2] = 0;
            } else {
                target[base] = sourceColors[base];
                target[base + 1] = sourceColors[base + 1];
                target[base + 2] = sourceColors[base + 2];
            }
        }
    }

    colorAttribute.needsUpdate = true;
}

export function updateRankingView({ rankingItems, mode, minHeight }) {
    for (const item of rankingItems) {
        const colorAttribute = item.mesh.geometry.attributes.color;
        const target = colorAttribute.array;
        const source = item.palettes[mode];
        const hide = item.meta.height < minHeight;

        for (let i = 0; i < source.length; i += 3) {
            if (hide) {
                target[i] = 0;
                target[i + 1] = 0;
                target[i + 2] = 0;
            } else {
                target[i] = source[i];
                target[i + 1] = source[i + 1];
                target[i + 2] = source[i + 2];
            }
        }

        colorAttribute.needsUpdate = true;
        item.mesh.visible = !hide;
    }
}

export function findBuildingMetaByFaceIndex(buildingMeta, faceIndex) {
    if (faceIndex == null) return null;

    let left = 0;
    let right = buildingMeta.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const meta = buildingMeta[mid];
        if (faceIndex < meta.triangleStart) right = mid - 1;
        else if (faceIndex >= meta.triangleEnd) left = mid + 1;
        else return meta;
    }

    return null;
}
