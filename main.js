// ── Farben ──────────────────────────────────────────
const ERA_COLORS = [
    new THREE.Color(0x2a3044), new THREE.Color(0x8b6914), new THREE.Color(0xc45c1a),
    new THREE.Color(0x1a6fc4), new THREE.Color(0x1a9c4a), new THREE.Color(0x8b1ac4)
];

function heightColor(t) {
    const c = new THREE.Color();
    if (t < 0.2)       { const s = t / 0.2;         c.setRGB(0.02 + s * .05,  0.03 + s * .1,   0.1  + s * .35); }
    else if (t < 0.45) { const s = (t - .2) / .25;  c.setRGB(0.07 + s * .1,   0.13 + s * .22,  0.45 + s * .28); }
    else if (t < 0.7)  { const s = (t - .45) / .25; c.setRGB(0.17 + s * .25,  0.35 + s * .48,  0.73 + s * .18); }
    else if (t < 0.88) { const s = (t - .7) / .18;  c.setRGB(0.42 + s * .45,  0.83 + s * .13,  0.91 + s * .07); }
    else               { const s = (t - .88) / .12;  c.setRGB(0.87 + s * .13,  0.96 + s * .04,  0.98 + s * .02); }
    return c;
}

function groundColor(t) {
    const c = new THREE.Color();
    if (t < 0.4)       { const s = t / .4;           c.setRGB(0.02 + s * .05,  0.12 + s * .3,   0.05); }
    else if (t < 0.75) { const s = (t - .4) / .35;  c.setRGB(0.07 + s * .5,   0.42 + s * .35,  0.05); }
    else               { const s = (t - .75) / .25;  c.setRGB(0.57 + s * .43,  0.77 + s * .2,   0.05); }
    return c;
}

function drawLegendBar(fn) {
    const cv = document.getElementById('legend-bar'), ctx = cv.getContext('2d');
    for (let i = 0; i < 180; i++) {
        const col = fn(i / 179);
        ctx.fillStyle = `rgb(${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)})`;
        ctx.fillRect(i, 0, 1, 4);
    }
}


// ── State ───────────────────────────────────────────
let scene, camera, renderer, mergedMesh = null, buildingMeta = [];
let streetGroup = null;
let currentMode = 'height', maxH = 1, minG = 0, maxG = 1;
let colH = [], colE = [], colG = [];

function setProgress(p, msg) {
    document.getElementById('loading-bar').style.width = p + '%';
    document.getElementById('loading-msg').textContent = msg;
}


// ── Scene ───────────────────────────────────────────
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07080f);
    scene.fog = new THREE.FogExp2(0x07080f, 0.0004);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.5, 6000);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const sun = new THREE.DirectionalLight(0xdde8ff, 1.3);
    sun.position.set(300, 600, 200);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffd0a0, 0.5);
    fill.position.set(-200, 200, -400);
    scene.add(fill);
    scene.add(new THREE.HemisphereLight(0x304070, 0x080c14, 0.5));

    const gnd = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000),
        new THREE.MeshLambertMaterial({ color: 0x0b0e18 })
    );
    gnd.rotation.x = -Math.PI / 2;
    gnd.position.y = -1;
    scene.add(gnd);

    window.addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    });
}


// ── Gebäude: merged geometry ─────────────────────────
async function buildMerged(buildings) {
    const geoList = [];
    const CHUNK = 400;
    colH = []; colE = []; colG = [];

    for (let off = 0; off < buildings.length; off += CHUNK) {
        const end = Math.min(off + CHUNK, buildings.length);
        for (let i = off; i < end; i++) {
            const b = buildings[i];
            const shape = new THREE.Shape();
            const e = b.ext;
            shape.moveTo(e[0], e[1]);
            for (let j = 2; j < e.length; j += 2) shape.lineTo(e[j], e[j + 1]);
            shape.closePath();

            if (b.holes) {
                for (const h of b.holes) {
                    const hp = new THREE.Path();
                    hp.moveTo(h[0], h[1]);
                    for (let j = 2; j < h.length; j += 2) hp.lineTo(h[j], h[j + 1]);
                    hp.closePath();
                    shape.holes.push(hp);
                }
            }

            // Höhe skalieren: 1 Fuß ≈ 0.1 Scene-Units → realistisches Verhältnis
            const visH = b.h * 0.1;
            const geo = new THREE.ExtrudeGeometry(shape, { depth: visH, bevelEnabled: false });
            geo.rotateX(-Math.PI / 2);
            geo.translate(0, b.g * 0.02, 0);

            const t_h = b.h / maxH;
            const t_g = maxG > minG ? (b.g - minG) / (maxG - minG) : 0;
            const ch = heightColor(t_h), ce = ERA_COLORS[b.era], cg = groundColor(t_g);
            const vc = geo.attributes.position.count;
            for (let v = 0; v < vc; v++) {
                colH.push(ch.r, ch.g, ch.b);
                colE.push(ce.r, ce.g, ce.b);
                colG.push(cg.r, cg.g, cg.b);
            }
            buildingMeta.push({ b, vs: colH.length / 3 - vc, vc });
            geoList.push(geo);
        }
        setProgress(30 + Math.round((end / buildings.length) * 55), `Geometrien ${end.toLocaleString()} / ${buildings.length.toLocaleString()}…`);
        await new Promise(r => setTimeout(r, 0));
    }

    setProgress(87, 'Zusammenführen…');
    await new Promise(r => setTimeout(r, 0));

    // Merge
    let tv = 0, ti = 0;
    for (const g of geoList) { tv += g.attributes.position.count; ti += g.index ? g.index.count : g.attributes.position.count; }
    const pos = new Float32Array(tv * 3), nor = new Float32Array(tv * 3), col = new Float32Array(tv * 3), idx = new Uint32Array(ti);
    let vo = 0, io = 0;
    for (let gi = 0; gi < geoList.length; gi++) {
        const g = geoList[gi];
        pos.set(g.attributes.position.array, vo * 3);
        if (g.attributes.normal) nor.set(g.attributes.normal.array, vo * 3);
        const m = buildingMeta[gi];
        for (let v = 0; v < m.vc; v++) {
            col[(vo + v) * 3    ] = colH[(m.vs + v) * 3];
            col[(vo + v) * 3 + 1] = colH[(m.vs + v) * 3 + 1];
            col[(vo + v) * 3 + 2] = colH[(m.vs + v) * 3 + 2];
        }
        if (g.index) { const ix = g.index.array; for (let k = 0; k < ix.length; k++) idx[io + k] = ix[k] + vo; io += ix.length; }
        else { for (let k = 0; k < m.vc; k++) idx[io + k] = k + vo; io += m.vc; }
        vo += m.vc;
        g.dispose();
    }

    const mg = new THREE.BufferGeometry();
    mg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    mg.setAttribute('normal',   new THREE.BufferAttribute(nor, 3));
    mg.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    mg.setIndex(new THREE.BufferAttribute(idx, 1));
    mergedMesh = new THREE.Mesh(mg, new THREE.MeshLambertMaterial({ vertexColors: true }));
    scene.add(mergedMesh);
}


// ── Straßen ──────────────────────────────────────────
let _rawStreets = null;

function updateOffset() {
    const ox = 0;
    const oz = 0;
    if (!_rawStreets) return;

    // Straßen-Gruppe neu aufbauen
    if (streetGroup) {
        scene.remove(streetGroup);
        streetGroup.children.forEach(c => { c.geometry.dispose(); c.material.dispose(); });
    }
    streetGroup = new THREE.Group();

    const COLS = { 'm': 0x4a7fff, 't': 0x3a6fef, 'p': 0x2055cc, 's': 0x163a7a, 'e': 0x0f2550, 'r': 0x0a1a38 };
    const groups = {};
    for (const s of _rawStreets) { if (!groups[s.t]) groups[s.t] = []; groups[s.t].push(s); }

    for (const [type, streets] of Object.entries(groups)) {
        const pts = [];
        for (const s of streets) {
            for (let i = 0; i < s.c.length - 2; i += 2) {
                pts.push(new THREE.Vector3(s.c[i]     + ox, 0.5, -s.c[i + 1] + oz));
                pts.push(new THREE.Vector3(s.c[i + 2] + ox, 0.5, -s.c[i + 3] + oz));
            }
        }
        if (!pts.length) continue;
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const op = type === 'r' ? 0.3 : type === 'e' ? 0.45 : 0.7;
        const mat = new THREE.LineBasicMaterial({ color: COLS[type] || 0x1a3a6a, opacity: op, transparent: true });
        streetGroup.add(new THREE.LineSegments(geo, mat));
    }
    scene.add(streetGroup);
}

function buildStreets(data) {
    _rawStreets = data.streets;
    updateOffset();
    document.getElementById('s-streets').textContent = data.meta.count.toLocaleString('de-DE');
}


// ── Farbmodus ────────────────────────────────────────
function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach((b, i) =>
        b.classList.toggle('active', ['height', 'era', 'ground'][i] === mode)
    );
    document.getElementById('height-legend').style.display = mode === 'era' ? 'none' : 'block';
    document.getElementById('era-legend').style.display    = mode === 'era' ? 'block' : 'none';

    if (mode === 'ground') {
        drawLegendBar(groundColor);
        document.getElementById('leg-max').textContent = Math.round(maxG) + ' m';
        document.getElementById('leg-title-text').textContent = 'Meereshöhe Boden';
    } else if (mode === 'height') {
        drawLegendBar(heightColor);
        document.getElementById('leg-max').textContent = Math.round(maxH) + ' m';
        document.getElementById('leg-title-text').textContent = 'Dachhöhe';
    }

    if (!mergedMesh) return;
    const src = mode === 'height' ? colH : mode === 'era' ? colE : colG;
    const ca = mergedMesh.geometry.attributes.color;
    const arr = ca.array;
    for (const m of buildingMeta) {
        for (let v = 0; v < m.vc; v++) {
            arr[(m.vs + v) * 3    ] = src[(m.vs + v) * 3];
            arr[(m.vs + v) * 3 + 1] = src[(m.vs + v) * 3 + 1];
            arr[(m.vs + v) * 3 + 2] = src[(m.vs + v) * 3 + 2];
        }
    }
    ca.needsUpdate = true;
}

function applyHeightFilter(val) {
    document.getElementById('filter-val').textContent = val + ' m';
    if (!mergedMesh) return;
    const minH = parseFloat(val);
    const src = currentMode === 'height' ? colH : currentMode === 'era' ? colE : colG;
    const ca = mergedMesh.geometry.attributes.color, arr = ca.array;
    for (const m of buildingMeta) {
        const hide = m.b.h < minH;
        for (let v = 0; v < m.vc; v++) {
            if (hide) {
                arr[(m.vs + v) * 3    ] = 0;
                arr[(m.vs + v) * 3 + 1] = 0;
                arr[(m.vs + v) * 3 + 2] = 0;
            } else {
                arr[(m.vs + v) * 3    ] = src[(m.vs + v) * 3];
                arr[(m.vs + v) * 3 + 1] = src[(m.vs + v) * 3 + 1];
                arr[(m.vs + v) * 3 + 2] = src[(m.vs + v) * 3 + 2];
            }
        }
    }
    ca.needsUpdate = true;
}


// ── Kamera Controls: WASD + Maus + Scroll ────────────────
let keys      = {};
let mouseDown = false;
let lastMouse = { x: 0, y: 0 };
let camYaw    = -0.3;   // horizontale Rotation
let camPitch  = 0.8;    // vertikale Neigung (0=oben, π/2=horizontal)
let camPos    = new THREE.Vector3(-55, 200, 300);
const CAM_SPEED       = 1.5;
const CAM_SENSITIVITY = 0.003;

function updateCamera() {
    // Blickrichtung aus yaw/pitch
    const dir = new THREE.Vector3(
        Math.sin(camYaw) * Math.cos(camPitch),
        -Math.sin(camPitch),
        Math.cos(camYaw) * Math.cos(camPitch)
    );
    // Rechts-Vektor
    const right = new THREE.Vector3(
        Math.cos(camYaw), 0, -Math.sin(camYaw)
    );

    // WASD Bewegung
    if (keys['w'] || keys['W'] || keys['ArrowUp'])    camPos.addScaledVector(dir,   CAM_SPEED);
    if (keys['s'] || keys['S'] || keys['ArrowDown'])  camPos.addScaledVector(dir,  -CAM_SPEED);
    if (keys['a'] || keys['A'] || keys['ArrowLeft'])  camPos.addScaledVector(right, -CAM_SPEED);
    if (keys['d'] || keys['D'] || keys['ArrowRight']) camPos.addScaledVector(right,  CAM_SPEED);
    if (keys['q'] || keys['Q']) camPos.y += CAM_SPEED;
    if (keys['e'] || keys['E']) camPos.y -= CAM_SPEED;

    camera.position.copy(camPos);
    camera.lookAt(camPos.clone().addScaledVector(dir, 100));
}

document.addEventListener('keydown', e => { keys[e.key] = true; });
document.addEventListener('keyup',   e => { keys[e.key] = false; });

document.addEventListener('mousedown', e => {
    if (e.target.id === 'height-filter') return; //wenn Slider benutzt wird keine Kamerabewegung
    if (e.button === 0) { mouseDown = true; lastMouse = { x: e.clientX, y: e.clientY }; }
});
document.addEventListener('mouseup', e => {
    if (e.button === 0) mouseDown = false;
});
document.addEventListener('mousemove', e => {
    if (!mouseDown) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    lastMouse = { x: e.clientX, y: e.clientY };
    camYaw   -= dx * CAM_SENSITIVITY;
    camPitch  = Math.max(-1.4, Math.min(1.4, camPitch + dy * CAM_SENSITIVITY));
});

document.addEventListener('wheel', e => {
    const dir = new THREE.Vector3(
        Math.sin(camYaw) * Math.cos(camPitch),
        -Math.sin(camPitch),
        Math.cos(camYaw) * Math.cos(camPitch)
    );
    camPos.addScaledVector(dir, -e.deltaY * 0.3);
}, { passive: true });

document.addEventListener('contextmenu', e => e.preventDefault());

function animate() { requestAnimationFrame(animate); updateCamera(); renderer.render(scene, camera); }

function finishLoading() {
    setProgress(100, 'Fertig');
    setTimeout(() => {
        const el = document.getElementById('loading');
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 1000);
    }, 400);
}


// ── Init ─────────────────────────────────────────────
async function init() {
    setProgress(5, 'Three.js initialisieren…');
    initScene(); updateCamera(); animate();

    setProgress(15, 'Gebäudedaten laden…');
    const res = await fetch('buildings.json');
    const data = await res.json();
    const buildings = data.buildings;
    const heights = buildings.map(b => b.h), grounds = buildings.map(b => b.g);
    maxH = Math.max(...heights); minG = Math.min(...grounds); maxG = Math.max(...grounds);

    document.getElementById('s-count').textContent = buildings.length.toLocaleString('de-DE');
    document.getElementById('s-max').textContent   = Math.round(maxH) + ' m';
    document.getElementById('s-avg').textContent   = Math.round(heights.reduce((a, b) => a + b, 0) / heights.length) + ' m';
    document.getElementById('height-filter').max   = Math.round(maxH);

    drawLegendBar(heightColor);
    document.getElementById('leg-max').textContent = Math.round(maxH) + ' m';

    setProgress(30, 'Geometrien aufbauen…');
    await buildMerged(buildings);

    setProgress(92, 'Straßen laden…');
    try {
        const sr = await fetch('streets.json');
        if (sr.ok) { const sd = await sr.json(); buildStreets(sd); }
        else document.getElementById('s-streets').textContent = '—';
    } catch { document.getElementById('s-streets').textContent = '—'; }

    finishLoading();
}

init();
