# Studienarbeit Gap-Checkliste

Stand: 2026-06-16
Projekt: `Informationsvisualisierung_NYC_buildings`
Grundlage: Aufgaben-PDF `09_studienarbeit`

## Kurzfazit

Der interaktive Prototyp ist bereits auf einem brauchbaren Stand.
Für die eigentliche Studienarbeit fehlen aber noch fast alle wissenschaftlichen und evaluativen Bestandteile:

- schriftlicher Bericht
- sauber dokumentiertes Konzept
- Nutzertest-Design
- Consent- und Testunterlagen
- Event-Logging fuer die Studie
- EEG-Synchronisation und EEG-Auswertung
- dokumentierte Revisionen auf Basis der Ergebnisse
- Praesentationsmaterial

## Pflichtpunkte aus der Aufgabenstellung

### 1. Thema und Datensatz

Status: `teilweise erledigt`

Schon da:
- Thema ist klar erkennbar: Visualisierung von Gebaeudehoehen in Manhattan.
- Datensatz ist lokal vorhanden (`buildings.json`, `streets.json`, Metadaten).

Fehlt:
- kurze, saubere Begruendung, warum genau dieses Thema relevant ist
- klare Formulierung der Erkenntnisziele
- Quellenangabe und Beschreibung des Datensatzes im Bericht
- kurze Diskussion von Grenzen oder Verzerrungen des Datensatzes

Minimum fuer Abgabe:
- 1 Abschnitt im Bericht zu Thema, Motivation, Datensatzquelle, Datenumfang, Datenqualitaet

### 2. Konzeptentwurf

Status: `fehlt weitgehend`

Schon da:
- implizite Designentscheidungen im UI und in den Interaktionen

Fehlt:
- Zielgruppe
- konkrete Nutzeraufgaben / Tasks
- Informationsarchitektur
- Interaktionskonzept
- begruendete Visualisierungsentscheidungen
- Alternativen und warum sie verworfen wurden

Minimum fuer Abgabe:
- 1 sauberer Konzeptabschnitt mit:
- Zielgruppe
- 3 bis 5 Kernaufgaben
- warum 3D / why not 2D
- warum Hoehe, Baujahr, Gelaendehoehe als Modi
- warum Suche, Filter, Ranking, Hover sinnvoll sind

### 3. Hi-Fidelity-Prototyp

Status: `groesstenteils erledigt`

Schon da:
- interaktive Web-Anwendung
- Map-Ansicht
- Ranking-Ansicht
- Suchfunktion
- Hover-Tooltip
- Hoehenfilter
- mehrere Farb-/Datenmodi
- Kamera-Interaktion

Beleg im Repo:
- [index.html](/root/.openclaw/workspace/Informationsvisualisierung_NYC_buildings/index.html:29)
- [main.js](/root/.openclaw/workspace/Informationsvisualisierung_NYC_buildings/main.js:27)
- [`ui.js`](../../src/frontend/js/ui.js)

Was noch fehlt, um den Prototyp fuer eine Studie tauglich zu machen:
- Event-Logging fuer relevante Interaktionen
- definierte Startzustaende fuer Testpersonen
- klare Task-Unterstuetzung im Interface
- optional kurze Onboarding-/Task-Hinweise fuer Testlauf

### 4. Nutzertest-Session

Status: `fehlt`

Fehlt komplett:
- Testplan
- Rekrutierung / Liste von Testpersonen
- Testskript / Moderatorleitfaden
- Aufgabenblaetter
- Consent-Formular
- Test-Logs
- dokumentierte Metadaten pro Sitzung

Minimum fuer Abgabe:
- mind. 5 Testpersonen
- definierte Aufgaben
- Erfassungsbogen pro Person
- dokumentierte Zeiten, Fehler, Beobachtungen, Kommentare

### 5. EEG-Aufzeichnung

Status: `fehlt komplett`

Fehlt komplett:
- EEG-Rohdaten
- Beschreibung des Messaufbaus
- Synchronisation zwischen Interface-Events und EEG-Markern
- Angaben zu Samplingrate, Referenz, Filtern, Artefaktbehandlung
- Auswertungsskripte

Das ist nicht optional. Laut PDF ist der EEG-Teil Kern der Aufgabe.

### 6. Analyse der Testergebnisse

Status: `fehlt`

Fehlt:
- qualitative Auswertung
- quantitative Auswertung
- EEG-bezogene Auswertung
- Vergleich zwischen Erwartung und Beobachtung
- priorisierte Findings

Minimum fuer Abgabe:
- welche Tasks liefen gut / schlecht
- Bearbeitungszeiten
- typische Fehler oder Verwirrungspunkte
- subjektives Feedback
- Bezug zu EEG-Ereignissen oder Last-/Aufmerksamkeitsindikatoren

### 7. Ableitung von Verbesserungen

Status: `fehlt als Studiennachweis`

Schon da:
- es gibt laufende UI-Verbesserungen im Git-Verlauf

Fehlt:
- direkter Nachweis, welche Aenderungen aus Test und Analyse resultieren
- vorher/nachher-Argumentation

Minimum fuer Abgabe:
- Tabelle oder Abschnitt:
- Problem
- Evidenz aus Test / EEG
- Designaenderung
- erwarteter Effekt

### 8. Bericht (PDF)

Status: `fehlt`

Laut Aufgabenstellung benoetigte Kapitel:
- Motivation
- verwandte Arbeiten
- Konzept
- Prototyp-Beschreibung
- Testdesign
- Ergebnisse inkl. EEG-Auswertung
- Revisionen
- Fazit

Repo-Iststand:
- [README.md](/root/.openclaw/workspace/Informationsvisualisierung_NYC_buildings/README.md:1) ist nur Minimaltext

### 9. Technische Abgabe

Status: `teilweise erledigt`

Schon da:
- Quellcode
- Daten
- Skripte zur Datenaufbereitung

Fehlt:
- lauffaehige Setup-Anleitung
- klare Startanleitung
- saubere Abgabestruktur
- Test-Logs
- EEG-Rohdaten
- EEG-Auswertungsskripte

### 10. Praesentation / Demo

Status: `fehlt`

Fehlt:
- 10-15 min Demo-Struktur
- Slides oder Stichpunkte
- Storyline fuer Problem, Loesung, Evaluation, Learnings

## Aktuelle Repo-Einschaetzung

### Stark

- sichtbarer, interaktiver Prototyp statt nur Mockup
- gutes Fundament fuer eine Demonstration
- klare Datenbasis
- bereits mehrere Interaktionsideen integriert

### Schwach

- praktisch keine wissenschaftliche Dokumentation
- keine Studieninfrastruktur
- kein Mess- oder Logging-Backbone
- kein EEG-Pfad
- keine nachvollziehbare Evaluation

## Priorisierte To-do-Reihenfolge

### Prioritaet A: Muss als naechstes passieren

1. Konzept schriftlich festziehen
2. konkrete Test-Tasks definieren
3. Event-Logging im Prototyp einbauen
4. Testunterlagen vorbereiten
5. EEG-Marker-Strategie festlegen

### Prioritaet B: Danach

1. Nutzertests mit mind. 5 Personen durchfuehren
2. Testdaten und Beobachtungen sammeln
3. EEG-Daten auswerten
4. Findings in Designaenderungen uebersetzen

### Prioritaet C: Zum Schluss

1. Bericht schreiben
2. Revisionen sauber dokumentieren
3. Demo/Slides vorbereiten

## Konkrete Artefakte, die noch fehlen

Diese Dateien oder Inhalte solltest du realistisch noch anlegen:

- `REPORT_OUTLINE.md`
- `CONCEPT.md`
- `USER_STUDY_PLAN.md`
- `TEST_TASKS.md`
- `CONSENT_FORM.md`
- `SESSION_LOG_TEMPLATE.md`
- `EEG_PROTOCOL.md`
- `EVENT_LOG_SCHEMA.md`
- `analysis/` mit Auswertungsskripten
- `results/` mit Test- und EEG-Ergebnissen
- `PRESENTATION_OUTLINE.md`

## Meine klare Empfehlung

Wenn du jetzt weiter nur Rendering oder UI polish machst, ist das fachlich der falsche Hebel.
Der groesste Risikoblock ist nicht das Interface, sondern dass dir fuer die Abgabe der komplette Evaluations- und Dokumentationsstrang fehlt.

Deshalb ist der sinnvollste naechste Schritt:

1. Studienstruktur und Doku-Dateien anlegen
2. Logging/Event-Marker in den Prototyp integrieren
3. erst danach wieder Feature-Polish
