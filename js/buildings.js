const THREE = window.THREE;

import { ERA_COLORS, groundColor, heightColor } from './colors.js';

export async function buildBuildings({ scene, buildings, maxHeight, minGround, maxGround, setProgress }) {
    const geoList = [];
    const CHUNK = 400;
    const colorHeight = [];
    const colorEra = [];
    const colorGround = [];
    const buildingMeta = [];

    for (let off = 0; off < buildings.length; off += CHUNK) {
        const end = Math.min(off + CHUNK, buildings.length);

        for (let i = off; i < end; i++) {
            const building = buildings[i];
            const shape = new THREE.Shape();
            const ext = building.ext;

            shape.moveTo(ext[0], ext[1]);
            for (let j = 2; j < ext.length; j += 2) shape.lineTo(ext[j], ext[j + 1]);
            shape.closePath();

            if (building.holes) {
                for (const hole of building.holes) {
                    const holePath = new THREE.Path();
                    holePath.moveTo(hole[0], hole[1]);
                    for (let j = 2; j < hole.length; j += 2) holePath.lineTo(hole[j], hole[j + 1]);
                    holePath.closePath();
                    shape.holes.push(holePath);
                }
            }

            const visualHeight = building.h * 0.1;
            const geometry = new THREE.ExtrudeGeometry(shape, { depth: visualHeight, bevelEnabled: false });
            geometry.rotateX(-Math.PI / 2);
            geometry.translate(0, building.g * 0.02, 0);

            const heightRatio = building.h / maxHeight;
            const groundRatio = maxGround > minGround ? (building.g - minGround) / (maxGround - minGround) : 0;
            const heightCol = heightColor(heightRatio);
            const eraCol = ERA_COLORS[building.era];
            const groundCol = groundColor(groundRatio);
            const vertexCount = geometry.attributes.position.count;

            for (let v = 0; v < vertexCount; v++) {
                colorHeight.push(heightCol.r, heightCol.g, heightCol.b);
                colorEra.push(eraCol.r, eraCol.g, eraCol.b);
                colorGround.push(groundCol.r, groundCol.g, groundCol.b);
            }

            buildingMeta.push({ building, vs: colorHeight.length / 3 - vertexCount, vc: vertexCount });
            geoList.push(geometry);
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

    for (let geometryIndex = 0; geometryIndex < geoList.length; geometryIndex++) {
        const geometry = geoList[geometryIndex];
        const meta = buildingMeta[geometryIndex];

        positions.set(geometry.attributes.position.array, vertexOffset * 3);
        if (geometry.attributes.normal) normals.set(geometry.attributes.normal.array, vertexOffset * 3);

        for (let vertex = 0; vertex < meta.vc; vertex++) {
            colors[(vertexOffset + vertex) * 3] = colorHeight[(meta.vs + vertex) * 3];
            colors[(vertexOffset + vertex) * 3 + 1] = colorHeight[(meta.vs + vertex) * 3 + 1];
            colors[(vertexOffset + vertex) * 3 + 2] = colorHeight[(meta.vs + vertex) * 3 + 2];
        }

        if (geometry.index) {
            const geometryIndices = geometry.index.array;
            for (let i = 0; i < geometryIndices.length; i++) indices[indexOffset + i] = geometryIndices[i] + vertexOffset;
            indexOffset += geometryIndices.length;
        } else {
            for (let i = 0; i < meta.vc; i++) indices[indexOffset + i] = i + vertexOffset;
            indexOffset += meta.vc;
        }

        vertexOffset += meta.vc;
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
        palettes: {
            height: colorHeight,
            era: colorEra,
            ground: colorGround
        }
    };
}

export function applyBuildingColors({ mesh, buildingMeta, sourceColors }) {
    if (!mesh) return;

    const colorAttribute = mesh.geometry.attributes.color;
    const target = colorAttribute.array;

    for (const meta of buildingMeta) {
        for (let vertex = 0; vertex < meta.vc; vertex++) {
            target[(meta.vs + vertex) * 3] = sourceColors[(meta.vs + vertex) * 3];
            target[(meta.vs + vertex) * 3 + 1] = sourceColors[(meta.vs + vertex) * 3 + 1];
            target[(meta.vs + vertex) * 3 + 2] = sourceColors[(meta.vs + vertex) * 3 + 2];
        }
    }

    colorAttribute.needsUpdate = true;
}

export function applyHeightFilter({ mesh, buildingMeta, minHeight, sourceColors }) {
    if (!mesh) return;

    const colorAttribute = mesh.geometry.attributes.color;
    const target = colorAttribute.array;

    for (const meta of buildingMeta) {
        const hide = meta.building.h < minHeight;
        for (let vertex = 0; vertex < meta.vc; vertex++) {
            const base = (meta.vs + vertex) * 3;
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
