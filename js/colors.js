const THREE = window.THREE;

export const ERA_COLORS = [
    new THREE.Color(0x2a3044),
    new THREE.Color(0x8b6914),
    new THREE.Color(0xc45c1a),
    new THREE.Color(0x1a6fc4),
    new THREE.Color(0x1a9c4a),
    new THREE.Color(0x8b1ac4)
];

export function heightColor(t) {
    const c = new THREE.Color();
    if (t < 0.2) {
        const s = t / 0.2;
        c.setRGB(0.02 + s * 0.05, 0.03 + s * 0.1, 0.1 + s * 0.35);
    } else if (t < 0.45) {
        const s = (t - 0.2) / 0.25;
        c.setRGB(0.07 + s * 0.1, 0.13 + s * 0.22, 0.45 + s * 0.28);
    } else if (t < 0.7) {
        const s = (t - 0.45) / 0.25;
        c.setRGB(0.17 + s * 0.25, 0.35 + s * 0.48, 0.73 + s * 0.18);
    } else if (t < 0.88) {
        const s = (t - 0.7) / 0.18;
        c.setRGB(0.42 + s * 0.45, 0.83 + s * 0.13, 0.91 + s * 0.07);
    } else {
        const s = (t - 0.88) / 0.12;
        c.setRGB(0.87 + s * 0.13, 0.96 + s * 0.04, 0.98 + s * 0.02);
    }
    return c;
}

export function groundColor(t) {
    const c = new THREE.Color();
    if (t < 0.4) {
        const s = t / 0.4;
        c.setRGB(0.02 + s * 0.05, 0.12 + s * 0.3, 0.05);
    } else if (t < 0.75) {
        const s = (t - 0.4) / 0.35;
        c.setRGB(0.07 + s * 0.5, 0.42 + s * 0.35, 0.05);
    } else {
        const s = (t - 0.75) / 0.25;
        c.setRGB(0.57 + s * 0.43, 0.77 + s * 0.2, 0.05);
    }
    return c;
}

export function drawLegendBar(fn) {
    const cv = document.getElementById('legend-bar');
    const ctx = cv.getContext('2d');

    for (let i = 0; i < 180; i++) {
        const col = fn(i / 179);
        ctx.fillStyle = `rgb(${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)})`;
        ctx.fillRect(i, 0, 1, 4);
    }
}
