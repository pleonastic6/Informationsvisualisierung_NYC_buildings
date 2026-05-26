const THREE = window.THREE;

const TEXTURE_SCALE = 4;
const BUTTON_HEIGHT = 0.082;
const PANEL_DISTANCE = 1.48;
const MENU_PANEL_WIDTH = 1.34;
const MENU_PANEL_HEIGHT = 1.86;
const LEGEND_PANEL_WIDTH = 0.72;
const LEGEND_PANEL_HEIGHT = 0.46;

function makeCanvasTexture(width, height, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = width * TEXTURE_SCALE;
    canvas.height = height * TEXTURE_SCALE;
    const context = canvas.getContext('2d');
    context.scale(TEXTURE_SCALE, TEXTURE_SCALE);
    draw(context, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 4;
    return texture;
}

function disposeTexture(material) {
    if (material.map) material.map.dispose();
}

function drawRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    context.fill();
    context.stroke();
}

function fitText(context, text, maxWidth, baseSize, weight = '700') {
    let size = baseSize;
    do {
        context.font = `${weight} ${size}px monospace`;
        if (context.measureText(text).width <= maxWidth) return;
        size -= 1;
    } while (size > 9);
}

function makeLabelTexture({ label, sub = '', active = false, width = 320, height = 110 }) {
    return makeCanvasTexture(width, height, (context) => {
        context.clearRect(0, 0, width, height);
        context.fillStyle = active ? 'rgba(255, 76, 166, 0.3)' : 'rgba(8, 8, 14, 0.82)';
        context.strokeStyle = active ? 'rgba(255, 76, 166, 0.95)' : 'rgba(255, 255, 255, 0.24)';
        context.lineWidth = 2;
        drawRoundedRect(context, 3, 3, width - 6, height - 6, 10);

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#ffffff';
        fitText(context, label, width - 24, sub ? 22 : 24);
        context.fillText(label, width / 2, sub ? height * 0.39 : height / 2);

        if (sub) {
            context.fillStyle = 'rgba(255, 255, 255, 0.68)';
            fitText(context, sub, width - 24, 14, '400');
            context.fillText(sub, width / 2, height * 0.68);
        }
    });
}

function makeMenuPanelTexture(lines, query, minHeight = 0) {
    return makeCanvasTexture(768, 860, (context, width, height) => {
        context.clearRect(0, 0, width, height);
        context.fillStyle = 'rgba(5, 6, 12, 0.78)';
        context.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        context.lineWidth = 2;
        drawRoundedRect(context, 2, 2, width - 4, height - 4, 18);

        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillStyle = '#ffffff';
        context.font = '700 28px monospace';
        context.fillText('XR Menu', 30, 24);

        context.fillStyle = 'rgba(255, 255, 255, 0.78)';
        context.font = '17px monospace';
        lines.forEach((line, index) => context.fillText(line, 30, 68 + index * 26));

        context.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        context.beginPath();
        context.moveTo(30, 146);
        context.lineTo(width - 30, 146);
        context.stroke();

        context.fillStyle = 'rgba(255, 255, 255, 0.52)';
        context.font = '700 14px monospace';
        context.fillText('Ansicht', 30, 214);
        context.fillText('Farbmodus', 30, 318);
        context.fillText(`Hoehenfilter ${Math.round(minHeight)} m`, 30, 422);
        context.fillText('Suche', 30, 552);
    });
}

function makeLegendTexture({ state, open, minHeight }) {
    return makeCanvasTexture(460, open ? 300 : 90, (context, width, height) => {
        context.clearRect(0, 0, width, height);
        context.fillStyle = 'rgba(5, 6, 12, 0.76)';
        context.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        context.lineWidth = 2;
        drawRoundedRect(context, 2, 2, width - 4, height - 4, 16);

        context.fillStyle = '#ffffff';
        context.font = '700 23px monospace';
        context.fillText('Legende', 24, 20);

        if (!open) return;

        context.fillStyle = 'rgba(255, 255, 255, 0.72)';
        context.font = '16px monospace';
        context.fillText(`Modus: ${state.currentMode}`, 24, 68);
        context.fillText(`Min: ${Math.round(minHeight)} m`, 24, 96);

        const colors = state.currentMode === 'era'
            ? ['#8b6914', '#c45c1a', '#1a6fc4', '#1a9c4a', '#8b1ac4']
            : ['#273f9f', '#1a9c8f', '#f0c04a', '#ff4ca6'];
        colors.forEach((color, index) => {
            context.fillStyle = color;
            context.fillRect(24 + index * 76, 138, 62, 20);
        });

        context.fillStyle = 'rgba(255, 255, 255, 0.72)';
        context.font = '14px monospace';
        context.fillText(state.currentMode === 'era' ? 'Alt -> Neu' : 'Niedrig -> Hoch', 24, 178);
        context.fillText(`Gebaeude: ${state.allStats?.count?.toLocaleString('de-DE') ?? '-'}`, 24, 214);
    });
}

function createPlane(width, height, material) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    mesh.renderOrder = 1000;
    mesh.frustumCulled = false;
    return mesh;
}

function createButton(label, action, position, size = { width: 0.28, height: BUTTON_HEIGHT }, textureSize = { width: 320, height: 110 }) {
    const material = new THREE.MeshBasicMaterial({
        map: makeLabelTexture({ label, width: textureSize.width, height: textureSize.height }),
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    const mesh = createPlane(size.width, size.height, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.userData.label = label;
    mesh.userData.action = action;
    mesh.userData.textureWidth = textureSize.width;
    mesh.userData.textureHeight = textureSize.height;
    mesh.renderOrder = 1002;
    return mesh;
}

function createSearchField(label, action, position, size) {
    const material = new THREE.MeshBasicMaterial({
        map: makeLabelTexture({
            label,
            sub: 'klicken zum suchen',
            active: false,
            width: 520,
            height: 120
        }),
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    const mesh = createPlane(size.width, size.height, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.userData.label = label;
    mesh.userData.action = action;
    mesh.userData.textureWidth = 520;
    mesh.userData.textureHeight = 120;
    mesh.renderOrder = 1002;
    return mesh;
}

function setButtonState(button, active, sub = '') {
    if (button.userData.active === active && button.userData.sub === sub) return;
    button.userData.active = active;
    button.userData.sub = sub;
    disposeTexture(button.material);
    button.material.map = makeLabelTexture({
        label: button.userData.label,
        sub,
        active,
        width: button.userData.textureWidth ?? 320,
        height: button.userData.textureHeight ?? 110
    });
    button.material.needsUpdate = true;
}

function setSearchFieldState(button, active, label, sub) {
    if (button.userData.active === active && button.userData.label === label && button.userData.sub === sub) return;
    button.userData.active = active;
    button.userData.label = label;
    button.userData.sub = sub;
    disposeTexture(button.material);
    button.material.map = makeLabelTexture({
        label,
        sub,
        active,
        width: button.userData.textureWidth,
        height: button.userData.textureHeight
    });
    button.material.needsUpdate = true;
}

export function createXRUi({ xrOrigin, webXR, getState, actions }) {
    const searchInput = document.createElement('input');
    searchInput.id = 'xr-search-input';
    searchInput.type = 'search';
    searchInput.autocomplete = 'off';
    searchInput.placeholder = 'Name / BUID';
    searchInput.style.position = 'fixed';
    searchInput.style.left = '50%';
    searchInput.style.bottom = '28px';
    searchInput.style.transform = 'translateX(-50%)';
    searchInput.style.zIndex = '40';
    searchInput.style.width = 'min(420px, calc(100vw - 40px))';
    searchInput.style.padding = '14px 16px';
    searchInput.style.border = '1px solid rgba(255, 76, 166, 0.75)';
    searchInput.style.borderRadius = '10px';
    searchInput.style.background = 'rgba(0, 0, 0, 0.78)';
    searchInput.style.color = '#fff';
    searchInput.style.font = '16px monospace';
    searchInput.style.display = 'none';
    document.body.appendChild(searchInput);

    const root = new THREE.Group();
    root.name = 'xr-ui';
    root.visible = false;
    root.position.set(0, 1.62, -PANEL_DISTANCE);
    root.rotation.set(-0.05, 0, 0);
    xrOrigin.add(root);

    const legendRoot = new THREE.Group();
    legendRoot.name = 'xr-legend';
    legendRoot.visible = false;
    legendRoot.position.set(-0.78, 1.74, -PANEL_DISTANCE);
    legendRoot.rotation.set(-0.08, 0.28, 0);
    xrOrigin.add(legendRoot);

    let menuOpen = false;
    let legendOpen = true;
    let searchQuery = '';
    let searchResults = [];
    let searchInputOpen = false;
    let lastMenuText = '';
    let lastLegendText = '';

    const menuContent = new THREE.Group();
    menuContent.visible = false;
    menuContent.position.set(0, 0, 0);
    root.add(menuContent);

    const menuPanelMaterial = new THREE.MeshBasicMaterial({
        map: makeMenuPanelTexture([], ''),
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    const menuPanel = createPlane(MENU_PANEL_WIDTH, MENU_PANEL_HEIGHT, menuPanelMaterial);
    menuContent.add(menuPanel);

    const legendPanelMaterial = new THREE.MeshBasicMaterial({
        map: makeLegendTexture({ state: getState(), open: legendOpen, minHeight: actions.getMinHeight() }),
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide
    });
    const legendPanel = createPlane(LEGEND_PANEL_WIDTH, LEGEND_PANEL_HEIGHT, legendPanelMaterial);
    legendRoot.add(legendPanel);

    const buttons = [];
    const add = (label, action, x, y, size, textureSize) => {
        const button = createButton(label, action, { x, y, z: 0.014 }, size, textureSize);
        buttons.push(button);
        menuContent.add(button);
        return button;
    };

    const viewButtons = {
        map: add('Map', () => actions.setViewMode('map'), -0.46, 0.25, { width: 0.3, height: BUTTON_HEIGHT }),
        ranking: add('Top 100', () => actions.setViewMode('ranking'), -0.1, 0.25, { width: 0.36, height: BUTTON_HEIGHT })
    };
    const modeButtons = {
        height: add('Hoehe', () => actions.setMode('height'), -0.46, 0.02),
        era: add('Baujahr', () => actions.setMode('era'), -0.13, 0.02),
        ground: add('Boden', () => actions.setMode('ground'), 0.2, 0.02)
    };
    const filterDown = add('-10 m', () => actions.adjustMinHeight(-10), -0.46, -0.21);
    const filterReset = add('0 m', () => actions.setMinHeight(0), -0.13, -0.21);
    const filterUp = add('+10 m', () => actions.adjustMinHeight(10), 0.2, -0.21);
    const searchField = createSearchField('Name / BUID', () => {
        searchInputOpen = true;
        searchInput.style.display = 'block';
        searchInput.value = searchQuery;
        searchInput.focus();
        searchInput.select();
    }, { x: 0, y: -0.5, z: 0.018 }, { width: 1.03, height: 0.105 });
    buttons.push(searchField);
    menuContent.add(searchField);

    const resultButtons = [0, 1, 2].map((index) => add(
        `Treffer ${index + 1}`,
        () => {
            const item = searchResults[index];
            if (item) actions.selectSearchResult(item);
        },
        0,
        -0.63 - index * 0.125,
        { width: 1.08, height: 0.112 },
        { width: 640, height: 132 }
    ));

    searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.slice(0, 40);
        searchResults = actions.search(searchQuery);
        lastMenuText = '';
        sync();
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        const firstResult = searchResults[0];
        if (!firstResult) return;
        event.preventDefault();
        actions.selectSearchResult(firstResult);
        searchInputOpen = false;
        searchInput.blur();
        searchInput.style.display = 'none';
    });

    searchInput.addEventListener('blur', () => {
        searchInputOpen = false;
    });

    const raycaster = new THREE.Raycaster();
    const rayOrigin = new THREE.Vector3();
    const rayDirection = new THREE.Vector3();
    const rayRotation = new THREE.Matrix4();

    function setMenuPanel(lines, minHeight) {
        const text = `${lines.join('|')}|${searchQuery}|${minHeight}`;
        if (text === lastMenuText) return;
        lastMenuText = text;
        disposeTexture(menuPanel.material);
        menuPanel.material.map = makeMenuPanelTexture(lines, searchQuery, minHeight);
        menuPanel.material.needsUpdate = true;
    }

    function setLegendPanel(state, minHeight) {
        const text = `${legendOpen}|${state.currentMode}|${minHeight}|${state.allStats?.count ?? ''}`;
        if (text === lastLegendText) return;
        lastLegendText = text;
        disposeTexture(legendPanel.material);
        legendPanel.material.map = makeLegendTexture({ state, open: legendOpen, minHeight });
        legendPanel.material.needsUpdate = true;
    }

    function sync() {
        root.visible = webXR.isPresenting();
        legendRoot.visible = webXR.isPresenting();
        searchInput.style.display = root.visible && menuOpen && searchInputOpen ? 'block' : 'none';
        if (!root.visible) return;

        menuContent.visible = menuOpen;
        legendPanel.visible = legendOpen;
        root.updateMatrixWorld(true);
        legendRoot.updateMatrixWorld(true);

        const state = getState();
        const selected = state.pinnedMapMeta ?? state.hoveredMapMeta ?? state.hoveredRankingItem?.meta ?? null;
        const stats = state.viewMode === 'ranking' ? state.rankingStats : state.allStats;
        const minHeight = actions.getMinHeight();

        Object.entries(modeButtons).forEach(([mode, button]) => setButtonState(button, state.currentMode === mode));
        Object.entries(viewButtons).forEach(([view, button]) => setButtonState(button, state.viewMode === view));
        setButtonState(filterDown, false);
        setButtonState(filterReset, minHeight === 0);
        setButtonState(filterUp, false);
        setSearchFieldState(
            searchField,
            searchInputOpen,
            searchQuery || 'Name / BUID',
            searchQuery ? 'klicken zum bearbeiten' : 'klicken zum suchen'
        );

        resultButtons.forEach((button, index) => {
            const item = searchResults[index];
            button.visible = Boolean(searchQuery && item);
            button.userData.label = item ? (item.name || item.bin || `Treffer ${index + 1}`) : `Treffer ${index + 1}`;
            setButtonState(button, Boolean(item), item ? `${item.bin || 'ohne BUID'} | ${Math.round(item.height)} m` : '');
        });

        const selectedLabel = selected
            ? (selected.name || 'Gebaeude')
            : 'Kein Gebaeude selektiert';

        setMenuPanel([
            selectedLabel,
            selected?.bin ? `BIN ${selected.bin}` : 'BIN -',
            selected ? `Hoehe ${selected.height.toFixed(1)} m | Baujahr ${selected.eraLabel}` : `Ansicht ${state.viewMode === 'ranking' ? 'Top 100' : 'Map'} | Modus ${state.currentMode}`
        ], minHeight);
        setLegendPanel(state, minHeight);
    }

    function select(controller) {
        if (!root.visible) return false;

        const raySource = controller.userData.ray ?? controller;
        controller.updateMatrixWorld(true);
        raySource.updateMatrixWorld(true);
        rayOrigin.setFromMatrixPosition(raySource.matrixWorld);
        rayRotation.identity().extractRotation(raySource.matrixWorld);
        rayDirection.set(0, 0, -1).applyMatrix4(rayRotation);
        raycaster.set(rayOrigin, rayDirection);

        const activeButtons = menuOpen ? buttons : [];
        const hit = raycaster.intersectObjects(activeButtons, false)[0];
        if (!hit) return false;

        hit.object.userData.action();
        sync();
        return true;
    }

    return {
        update: sync,
        select,
        toggleMenu() {
            menuOpen = !menuOpen;
            menuContent.visible = menuOpen;
            sync();
        },
        toggleLegend() {
            legendOpen = !legendOpen;
            legendPanel.visible = legendOpen;
            lastLegendText = '';
            sync();
        },
        root
    };
}
