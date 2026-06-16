# EEG Protocol

## Ziel

Die EEG-Aufzeichnung soll mit relevanten Interface-Ereignissen synchronisiert werden, um Belastung, Aufmerksamkeit oder auffaellige Reaktionen waehrend der Aufgabenerfuellung spaeter mit Interaktionsmomenten zu verbinden.

## Zu dokumentieren

- verwendete Hardware
- Kanalanzahl
- Samplingrate
- Referenz
- Elektrodenpositionen
- Impedanz- oder Qualitaetschecks
- verwendete Software

## Marker-Strategie

Geplante Marker:

- `task_start`
- `task_end`
- `view_map`
- `view_ranking`
- `mode_height`
- `mode_era`
- `mode_ground`
- `search_select`
- `filter_change`
- `building_focus`
- `hover_start`

## Synchronisation

- gleiche Zeitbasis fuer Interface-Events und EEG-Stream definieren
- bei jedem relevanten Event Marker ausloesen oder loggen
- dokumentieren, wie Marker technisch in EEG-Software uebernommen werden

## Preprocessing

Zu dokumentieren:

- Filterung
- Resampling falls noetig
- Artefaktbehandlung
- Ausschlusskriterien

## Analyseideen

- Ereignisbezogene Auswertung um Aufgabenstart, View-Wechsel oder Suchauswahl
- Vergleich einfacher Aufgaben gegen schwierigere Aufgaben
- Zusammenhang zwischen beobachteten Problemen und EEG-Markern

## Offene Punkte

- konkretes EEG-Tooling festlegen
- technisches Marker-Interface im Prototyp definieren
- Exportformat und Auswertungsskripte festlegen
