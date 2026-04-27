import { buildBuildings } from './js/buildings.js';
import { createControls } from './js/controls.js';
import { createScene } from './js/scene.js';
import { buildStreets } from './js/streets.js';
import {
    bindHeightFilter,
    createModeController,
    finishLoading,
    setLegendForHeight,
    setProgress,
    updateStats
} from './js/ui.js';

const state = {
    currentMode: 'height',
    mesh: null,
    buildingMeta: [],
    palettes: {
        height: [],
        era: [],
        ground: []
    },
    maxHeight: 1,
    minGround: 0,
    maxGround: 1
};

const { scene, camera, renderer } = createScene();
const controls = createControls(camera);

const modeController = createModeController({
    getState: () => state,
    setMode: (mode) => {
        state.currentMode = mode;
        modeController.applyMode(mode);
    }
});

bindHeightFilter(() => ({
    mesh: state.mesh,
    buildingMeta: state.buildingMeta,
    sourceColors: state.palettes[state.currentMode]
}));

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

    updateStats({
        count: buildings.length,
        maxHeight: state.maxHeight,
        averageHeight: heights.reduce((sum, height) => sum + height, 0) / heights.length,
        streetCount: null
    });

    setLegendForHeight(state.maxHeight);

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
    modeController.applyMode(state.currentMode);

    setProgress(92, 'Straßen laden…');
    try {
        const streetResponse = await fetch('streets.json');
        if (streetResponse.ok) {
            const streetData = await streetResponse.json();
            buildStreets(scene, streetData);
            updateStats({
                count: buildings.length,
                maxHeight: state.maxHeight,
                averageHeight: heights.reduce((sum, height) => sum + height, 0) / heights.length,
                streetCount: streetData.meta.count
            });
        }
    } catch {
        // ignore street loading failures
    }

    finishLoading();
}

init();
