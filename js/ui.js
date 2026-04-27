import { drawLegendBar, groundColor, heightColor } from './colors.js';
import { applyBuildingColors, applyHeightFilter as applyMeshHeightFilter, updateRankingView } from './buildings.js';

export function setProgress(progress, message) {
    document.getElementById('loading-bar').style.width = `${progress}%`;
    document.getElementById('loading-msg').textContent = message;
}

export function finishLoading() {
    setProgress(100, 'Fertig');
    setTimeout(() => {
        const element = document.getElementById('loading');
        element.style.opacity = '0';
        setTimeout(() => element.remove(), 1000);
    }, 400);
}

export function updateStats({ count, maxHeight, averageHeight, streetCount }) {
    document.getElementById('s-count').textContent = count.toLocaleString('de-DE');
    document.getElementById('s-max').textContent = `${Math.round(maxHeight)} m`;
    document.getElementById('s-avg').textContent = `${Math.round(averageHeight)} m`;
    document.getElementById('s-streets').textContent = streetCount == null ? '—' : streetCount.toLocaleString('de-DE');
}

export function setSliderMax(maxHeight) {
    document.getElementById('height-filter').max = Math.round(maxHeight);
}

export function getMinHeightFilter() {
    return Number.parseFloat(document.getElementById('height-filter').value);
}

export function setLegendForHeight(maxHeight) {
    drawLegendBar(heightColor);
    document.getElementById('leg-max').textContent = `${Math.round(maxHeight)} m`;
    document.getElementById('leg-title-text').textContent = 'Dachhöhe';
}

export function setLegendForGround(maxGround) {
    drawLegendBar(groundColor);
    document.getElementById('leg-max').textContent = `${Math.round(maxGround)} m`;
    document.getElementById('leg-title-text').textContent = 'Meereshöhe Boden';
}

function syncColorMode(getState) {
    const state = getState();
    const sourceColors = state.palettes[state.currentMode];

    applyBuildingColors({
        mesh: state.mesh,
        buildingMeta: state.buildingMeta,
        sourceColors
    });

    applyMeshHeightFilter({
        mesh: state.mesh,
        buildingMeta: state.buildingMeta,
        minHeight: getMinHeightFilter(),
        sourceColors
    });

    updateRankingView({
        rankingItems: state.rankingItems,
        mode: state.currentMode,
        minHeight: getMinHeightFilter()
    });
}

export function createModeController({ getState, setMode }) {
    const modeButtons = document.querySelectorAll('.mode-btn');

    modeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setMode(button.dataset.mode);
        });
    });

    return {
        applyMode(mode) {
            const state = getState();
            modeButtons.forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));

            document.getElementById('height-legend').style.display = mode === 'era' ? 'none' : 'block';
            document.getElementById('era-legend').style.display = mode === 'era' ? 'block' : 'none';

            if (mode === 'ground') setLegendForGround(state.maxGround);
            else if (mode === 'height') setLegendForHeight(state.maxHeight);

            syncColorMode(getState);
        }
    };
}

export function createViewController({ getState, setViewMode, updateVisibleStats }) {
    const viewButtons = document.querySelectorAll('.view-btn');

    viewButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setViewMode(button.dataset.view);
        });
    });

    return {
        applyViewMode(viewMode) {
            const state = getState();
            viewButtons.forEach((button) => button.classList.toggle('active', button.dataset.view === viewMode));

            if (state.mesh) state.mesh.visible = viewMode === 'map';
            if (state.streetGroup) state.streetGroup.visible = viewMode === 'map';
            if (state.rankingGroup) state.rankingGroup.visible = viewMode === 'ranking';

            updateVisibleStats();
        }
    };
}

export function bindHeightFilter(getFilterState, onAfterFilter) {
    const slider = document.getElementById('height-filter');
    const valueEl = document.getElementById('filter-val');

    slider.addEventListener('input', () => {
        const minHeight = Number.parseFloat(slider.value);
        valueEl.textContent = `${slider.value} m`;

        const { mesh, buildingMeta, sourceColors, rankingItems, currentMode } = getFilterState();
        applyMeshHeightFilter({ mesh, buildingMeta, minHeight, sourceColors });
        updateRankingView({ rankingItems, mode: currentMode, minHeight });
        onAfterFilter();
    });
}

export function showTooltip(meta, pointer) {
    const tooltip = document.getElementById('hover-tooltip');
    const title = meta.rank ? `#${meta.rank}` : 'Gebäude';
    tooltip.innerHTML = `
        <div class="tooltip-title">${title}</div>
        <div class="tooltip-row">Höhe <span>${meta.height.toFixed(1)} m</span></div>
        <div class="tooltip-row">Baujahr <span>${meta.eraLabel}</span></div>
    `;
    tooltip.style.left = `${pointer.x + 16}px`;
    tooltip.style.top = `${pointer.y + 16}px`;
    tooltip.style.opacity = '1';
}

export function hideTooltip() {
    document.getElementById('hover-tooltip').style.opacity = '0';
}
