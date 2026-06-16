function createSessionId() {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const randomPart = Math.random().toString(36).slice(2, 8);
    return `session-${stamp}-${randomPart}`;
}

function downloadText(filename, content) {
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export function createEventLogger({ getState }) {
    const sessionId = createSessionId();
    const events = [];
    let taskId = null;
    let taskActive = false;
    let taskStartedAt = null;

    const sessionIdEl = document.getElementById('log-session-id');
    const eventCountEl = document.getElementById('log-event-count');
    const taskStatusEl = document.getElementById('log-task-status');
    const exportButton = document.getElementById('log-export-btn');
    const resetButton = document.getElementById('log-reset-btn');
    const taskStartButton = document.getElementById('log-task-start-btn');
    const taskEndButton = document.getElementById('log-task-end-btn');
    const taskInput = document.getElementById('log-task-id');

    function syncUi() {
        if (sessionIdEl) sessionIdEl.textContent = sessionId;
        if (eventCountEl) eventCountEl.textContent = `${events.length}`;
        if (taskStatusEl) taskStatusEl.textContent = taskActive ? 'running' : 'idle';
        if (taskInput && taskInput.value !== (taskId ?? '')) taskInput.value = taskId ?? '';
        if (taskStartButton) taskStartButton.disabled = taskActive;
        if (taskEndButton) taskEndButton.disabled = !taskActive;
    }

    function getSnapshot() {
        const state = getState();
        if (!state) return {};

        return {
            viewMode: state.viewMode ?? null,
            currentMode: state.currentMode ?? null,
            minHeight: state.minHeightFilter ?? null,
            selectedBin: state.pinnedMapMeta?.bin ?? null,
            selectedName: state.pinnedMapMeta?.name ?? null
        };
    }

    function log(eventType, details = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            sessionId,
            taskId,
            eventType,
            details,
            snapshot: getSnapshot()
        };

        events.push(entry);
        syncUi();
        return entry;
    }

    function exportLogs() {
        downloadText(`${sessionId}.json`, JSON.stringify({
            sessionId,
            exportedAt: new Date().toISOString(),
            eventCount: events.length,
            events
        }, null, 2));
    }

    function clearLogs() {
        events.length = 0;
        taskActive = false;
        taskStartedAt = null;
        log('session_reset', {});
    }

    function setTaskId(nextTaskId) {
        taskId = nextTaskId?.trim() || null;
        syncUi();
        log('task_context_change', { taskId });
    }

    function startTask() {
        const nextTaskId = taskInput?.value?.trim() || taskId;
        if (!nextTaskId) return;
        taskId = nextTaskId;
        taskActive = true;
        taskStartedAt = performance.now();
        syncUi();
        log('task_start', { taskId });
    }

    function endTask() {
        if (!taskActive) return;
        const durationMs = taskStartedAt == null ? null : Math.round(performance.now() - taskStartedAt);
        taskActive = false;
        taskStartedAt = null;
        syncUi();
        log('task_end', { taskId, durationMs });
    }

    if (taskInput) {
        taskInput.addEventListener('change', () => {
            setTaskId(taskInput.value);
        });
    }

    if (exportButton) {
        exportButton.addEventListener('click', () => {
            log('log_export', { eventCount: events.length });
            exportLogs();
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            clearLogs();
        });
    }

    if (taskStartButton) {
        taskStartButton.addEventListener('click', () => {
            startTask();
        });
    }

    if (taskEndButton) {
        taskEndButton.addEventListener('click', () => {
            endTask();
        });
    }

    window.addEventListener('beforeunload', () => {
        if (taskActive) endTask();
        log('session_end', { reason: 'beforeunload' });
    });

    syncUi();
    log('session_start', {});

    return {
        log,
        setTaskId,
        getEvents: () => events.slice(),
        getSessionId: () => sessionId,
        exportLogs,
        clearLogs,
        startTask,
        endTask
    };
}
