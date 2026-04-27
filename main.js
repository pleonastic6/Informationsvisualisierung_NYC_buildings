import { buildBuildings, buildRankingView } from './js/buildings.js';
import { createControls } from './js/controls.js';
import { createHoverController } from './js/interaction.js';
import { createScene } from './js/scene.js';
import { buildStreets } from './js/streets.js';
import {
    bindHeightFilter,
    createModeController,
    createViewController,
    finishLoading,
    getMinHeightFilter,
    hideTooltip,
    setLegendForHeight,
    setProgress,
    setSliderMax,
    showTooltip,
    updateStats
} from './js/ui.js';

const state = {
    currentMode: 'height',
    viewMode: 'map',
    mesh: null,
    buildingMeta: [],
    rankingGroup: null,
    rankingItems: [],
    streetGroup: null,
    palettes: {
        height: [],
        era: [],
        ground: []
    },
    maxHeight: 1,
    minGround: 0,
    maxGround: 1,
    allStats: null,
    rankingStats: null
};

const { scene, camera, renderer } = createScene();
const controls = createControls(camera);

function updateVisibleStats() {
    const stats = state.viewMode === 'ranking' ? state.rankingStats : state.allStats;
    if (!stats) return;
    updateStats(stats);
}

const modeController = createModeController({
    getState: () => state,
    setMode: (mode) => {
        state.currentMode = mode;
        modeController.applyMode(mode);
    }
});

const viewController = createViewController({
    getState: () => state,
    setViewMode: (viewMode) => {
        state.viewMode = viewMode;
        viewController.applyViewMode(viewMode);
    },
    updateVisibleStats
});

bindHeightFilter(() => ({
    mesh: state.mesh,
    buildingMeta: state.buildingMeta,
    sourceColors: state.palettes[state.currentMode],
    rankingItems: state.rankingItems,
    currentMode: state.currentMode
}), updateVisibleStats);

createHoverController({
    camera,
    getInteractiveState: () => ({
        viewMode: state.viewMode,
        mapMesh: state.mesh,
        mapMeta: state.buildingMeta,
        rankingItems: state.rankingItems
    }),
    onHover: showTooltip,
    onLeave: hideTooltip
});

function animate() {
    requestAnimationFrame(animate);
    controls.updateCamera();
    renderer.render(scene, camera);
}

async function init() {
    setProgress(5, 'Three.js initialisieren…');
    animate();

    setProgress(15, 'Gebäudedaten laden…');
    const buildingResponse = await fetch('buildings.json');
    const buildingData = await buildingResponse.json();
    const buildings = buildingData.buildings;

    const heights = buildings.map((building) => building.h);
    const grounds = buildings.map((building) => building.g);

    state.maxHeight = Math.max(...heights);
    state.minGround = Math.min(...grounds);
    state.maxGround = Math.max(...grounds);
    setSliderMax(state.maxHeight);

    state.allStats = {
        count: buildings.length,
        maxHeight: state.maxHeight,
        averageHeight: heights.reduce((sum, height) => sum + height, 0) / heights.length,
        streetCount: null
    };

    setLegendForHeight(state.maxHeight);
    updateVisibleStats();

    setProgress(30, 'Geometrien aufbauen…');
    const buildingResult = await buildBuildings({
        scene,
        buildings,
        maxHeight: state.maxHeight,
        minGround: state.minGround,
        maxGround: state.maxGround,
        setProgress
    });

    state.mesh = buildingResult.mesh;
    state.buildingMeta = buildingResult.buildingMeta;
    state.palettes = buildingResult.palettes;

    setProgress(90, 'Top-100 Ranking bauen…');
    const rankingResult = buildRankingView({
        scene,
        buildings,
        maxHeight: state.maxHeight,
        minGround: state.minGround,
        maxGround: state.maxGround
    });

    state.rankingGroup = rankingResult.group;
    state.rankingItems = rankingResult.items;
    state.rankingStats = {
        count: rankingResult.items.length,
        maxHeight: rankingResult.items[0]?.meta.height ?? 0,
        averageHeight: rankingResult.items.reduce((sum, item) => sum + item.meta.height, 0) / rankingResult.items.length,
        streetCount: 0
    };

    modeController.applyMode(state.currentMode);
    viewController.applyViewMode(state.viewMode);

    setProgress(94, 'Straßen laden…');
    try {
        const streetResponse = await fetch('streets.json');
        if (streetResponse.ok) {
            const streetData = await streetResponse.json();
            state.streetGroup = buildStreets(scene, streetData);
            state.allStats = {
                ...state.allStats,
                streetCount: streetData.meta.count
            };
            updateVisibleStats();
        }
    } catch {
        // ignore street loading failures
    }

    modeController.applyMode(state.currentMode);
    viewController.applyViewMode(state.viewMode);
    if (getMinHeightFilter() > 0) updateVisibleStats();
    finishLoading();
}

init();
