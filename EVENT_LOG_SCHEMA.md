# Event Log Schema

## Zweck

Das Interface soll zentrale Nutzeraktionen mit Zeitstempel protokollieren, damit Nutzertest, Aufgabenverlauf und EEG-Marker spaeter nachvollziehbar bleiben.

## Minimales Event-Schema

```json
{
  "timestamp": "2026-06-16T12:00:00.000Z",
  "sessionId": "test-01",
  "taskId": "task-3",
  "eventType": "view_ranking",
  "details": {
    "source": "view-button"
  }
}
```

## Relevante Eventtypen

- `session_start`
- `session_end`
- `task_start`
- `task_end`
- `view_map`
- `view_ranking`
- `mode_height`
- `mode_era`
- `mode_ground`
- `filter_change`
- `search_query`
- `search_select`
- `building_focus`
- `hover_start`
- `hover_end`

## Detailfelder

Je nach Event:

- aktuelle Ansicht
- aktueller Modus
- Suchbegriff
- BIN
- Gebaeudename
- Filterwert
- Task-ID
- optionale Koordinaten

## Export

- JSON fuer maschinelle Auswertung
- optional CSV fuer schnelle Analyse in Tabellenform
