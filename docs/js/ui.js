import { drawLegendBar, groundColor, heightColor } from './colors.js';
import { applyBuildingColors, applyHeightFilter as applyMeshHeightFilter } from './buildings.js';

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
    document.getElementById('height-filter').max = Math.round(maxHeight);
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

export function createModeController({ getState, setMode }) {
    const modeButtons = document.querySelectorAll('.mode-btn');

    modeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            setMode(mode);
        });
    });

    return {
        applyMode(mode) {
            const state = getState();
            modeButtons.forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));

            document.getElementById('height-legend').style.display = mode === 'era' ? 'none' : 'block';
            document.getElementById('era-legend').style.display = mode === 'era' ? 'block' : 'none';

            if (mode === 'ground') setLegendForGround(state.maxGround);
            if (mode === 'height') setLegendForHeight(state.maxHeight);

            const sourceColors = state.palettes[mode];
            applyBuildingColors({
                mesh: state.mesh,
                buildingMeta: state.buildingMeta,
                sourceColors
            });

            const minHeight = Number.parseFloat(document.getElementById('height-filter').value);
            applyMeshHeightFilter({
                mesh: state.mesh,
                buildingMeta: state.buildingMeta,
                minHeight,
                sourceColors
            });
        }
    };
}

export function bindHeightFilter(getFilterState) {
    const slider = document.getElementById('height-filter');
    const valueEl = document.getElementById('filter-val');

    slider.addEventListener('input', () => {
        const minHeight = Number.parseFloat(slider.value);
        valueEl.textContent = `${slider.value} m`;

        const { mesh, buildingMeta, sourceColors } = getFilterState();
        applyMeshHeightFilter({ mesh, buildingMeta, minHeight, sourceColors });
    });
}
