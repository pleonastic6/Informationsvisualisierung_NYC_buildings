# Test Tasks

## Hinweise fuer die Moderation

- Aufgaben neutral vorlesen.
- Keine Loesungswege verraten.
- Nur eingreifen, wenn die Person festhaengt oder die Aufgabe klar missversteht.
- Vor jeder Aufgabe im Study-Panel die passende `Task-ID` setzen und `Task Start` druecken.
- Nach Abschluss `Task End` druecken und Erfolg / Probleme im Protokoll notieren.

## Bewertungslogik

Empfohlene Metriken pro Task:

- `Task Completion`: erledigt / teilweise / nicht erledigt
- `Time-on-Task`: aus Log plus manuelle Plausibilisierung
- `Antwort korrekt / plausibel`: ja / teilweise / nein
- `Fehlerhafte Klicks / Umwege`: kurz notieren
- `Subjektive Unsicherheit`: niedrig / mittel / hoch

Empfohlene Event-Logs:

- `task_start`
- `task_end`
- `view_map`
- `view_ranking`
- `mode_height`
- `mode_era`
- `mode_ground`
- `search_query`
- `search_select`
- `filter_change`
- `building_focus`

## Aufgaben

### T1: Big Picture / Hoehenmuster

Instruktion:
Beschreibe in einem Satz, wo in Manhattan besonders hohe Gebaeude konzentriert sind.

Erfolgskriterium:
Die Person benennt ein plausibles raeumliches Muster und verweist auf sichtbare Hochhaus-Cluster.

Erwartete Interaktion:
freie Kartenexploration, Drehen/Zoomen, Tooltip-Nutzung

Geschaetzte Dauer:
60 bis 120 s

Bewertung:
- korrektes Hauptmuster erkannt
- Orientierung in der Kartenansicht funktioniert

Besonders beobachten:
- findet die Person schnell einen sinnvollen Blickwinkel?
- versteht sie die 3D-Darstellung ohne lange Erklaerung?

### T2: Konkretes Gebaeude suchen

Instruktion:
Suche ein konkretes Gebaeude nach Name oder BIN und fokussiere es in der Kartenansicht.

Erfolgskriterium:
Die Person nutzt die Suche erfolgreich und landet auf dem richtigen Gebaeude.

Erwartete Interaktion:
`search_query`, `search_select`, automatischer Fokus

Geschaetzte Dauer:
45 bis 90 s

Bewertung:
- Suche wird gefunden und korrekt genutzt
- Suchtreffer wird verstanden

Besonders beobachten:
- versteht die Person, was mit BIN gemeint ist?
- merkt sie, dass nach Auswahl eine Kamerafahrt / Fokussierung erfolgt?

### T3: Vergleich der Top-Gebaeude

Instruktion:
Wechsle in die Ranking-Ansicht und vergleiche mehrere der hoechsten Gebaeude miteinander.

Erfolgskriterium:
Die Person findet die Ranking-Ansicht und kann mindestens zwei hohe Gebaeude plausibel vergleichen.

Erwartete Interaktion:
`view_ranking`, Hover in der Ranking-Ansicht, evtl. Rueckwechsel zur Karte

Geschaetzte Dauer:
60 bis 120 s

Bewertung:
- View-Wechsel wird verstanden
- Ranking wird als Vergleichsansicht erkannt

Besonders beobachten:
- ist der Unterschied zwischen Karte und Ranking intuitiv?
- wirkt das Ranking hilfreich oder verwirrend?

### T4: Filter & Drill-Down

Instruktion:
Blende niedrigere Gebaeude aus und konzentriere dich nur auf hohe Gebaeude.

Erfolgskriterium:
Die Person nutzt den Hoehenfilter sinnvoll und reduziert die sichtbaren Gebaeude nachvollziehbar.

Erwartete Interaktion:
`filter_change`, Kartenexploration, ggf. Tooltip

Geschaetzte Dauer:
45 bis 90 s

Bewertung:
- Filterfunktion wird entdeckt
- Wirkung des Sliders wird korrekt interpretiert

Besonders beobachten:
- versteht die Person sofort, was der Slider macht?
- verliert sie durch den Filter die Orientierung?

### T5: Baujahre analysieren

Instruktion:
Finde heraus, ob bestimmte Bereiche eher aus aelteren oder neueren Gebaeuden bestehen.

Erfolgskriterium:
Die Person wechselt in den Baujahr-Modus und formuliert eine plausible Beobachtung zur Verteilung.

Erwartete Interaktion:
`mode_era`, Legendenlesen, Exploration, Vergleich verschiedener Bereiche

Geschaetzte Dauer:
90 bis 150 s

Bewertung:
- Moduswechsel wird korrekt genutzt
- Farblegende wird verstanden
- Beobachtung ist nachvollziehbar begruendet

Besonders beobachten:
- versteht die Person die Farbcodierung?
- braucht sie Hilfe, um die Legende zu lesen?

## Optionale Zusatzaufgabe

### T6: Freie Exploration / Insight

Instruktion:
Erkunde die Visualisierung frei fuer 3 bis 5 Minuten und formuliere eine interessante Erkenntnis, die du einer anderen Person erklaeren wuerdest.

Erfolgskriterium:
Die Person gewinnt selbststaendig eine nachvollziehbare Einsicht aus der Visualisierung.

Erwartete Interaktion:
freie Kombination aus Suche, View-Wechsel, Filter und Moduswechsel

Geschaetzte Dauer:
3 bis 5 min

Nutzen:
- gut fuer qualitative Beobachtungen
- deckt nicht antizipierte Strategien und Probleme auf

## Nachfragen im Anschluss

- Was war leicht?
- Was war unklar?
- Welche Ansicht war hilfreicher?
- Was hat irritiert?
- Welche Funktion war besonders nuetzlich?
- Was wuerdest du verbessern?
