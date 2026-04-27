const THREE = window.THREE;

const STREET_COLORS = {
    m: 0x4a7fff,
    t: 0x3a6fef,
    p: 0x2055cc,
    s: 0x163a7a,
    e: 0x0f2550,
    r: 0x0a1a38
};

export function buildStreets(scene, data) {
    const streetGroup = new THREE.Group();
    const groupedByType = {};

    for (const street of data.streets) {
        if (!groupedByType[street.t]) groupedByType[street.t] = [];
        groupedByType[street.t].push(street);
    }

    for (const [type, streets] of Object.entries(groupedByType)) {
        const points = [];

        for (const street of streets) {
            for (let i = 0; i < street.c.length - 2; i += 2) {
                points.push(new THREE.Vector3(street.c[i], 0.5, -street.c[i + 1]));
                points.push(new THREE.Vector3(street.c[i + 2], 0.5, -street.c[i + 3]));
            }
        }

        if (points.length === 0) continue;

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const opacity = type === 'r' ? 0.3 : type === 'e' ? 0.45 : 0.7;
        const material = new THREE.LineBasicMaterial({
            color: STREET_COLORS[type] || 0x1a3a6a,
            opacity,
            transparent: true
        });

        streetGroup.add(new THREE.LineSegments(geometry, material));
    }

    scene.add(streetGroup);
    return streetGroup;
}
