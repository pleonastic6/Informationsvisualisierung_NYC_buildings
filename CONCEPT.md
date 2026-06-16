# Konzept

## Arbeitstitel

Manhattan Building Heights: Interaktive 3D-Informationsvisualisierung urbaner Gebaeudedaten

## Zielgruppe

- Studierende und Lehrende im Kontext Stadt-/Datenvisualisierung
- Personen mit Interesse an urbanen Strukturen in New York
- Nutzerinnen und Nutzer, die hohe Gebaeude, Cluster und Muster explorativ untersuchen wollen

## Nutzungskontext

- Desktop-Nutzung im Studien- und Demo-Kontext
- explorative Analyse statt operativer Alltagsnutzung
- Einsatz in Praesentation, Nutzertest und Evaluation

## Kernfragen

- Wo befinden sich die hoechsten Gebaeude in Manhattan?
- Welche raeumlichen Muster zeigen sich bei Gebaeudehoehen?
- Wie unterscheiden sich Gebaeude nach Baujahr?
- Welche Unterschiede zeigt die Darstellung von Dachhoehe und Gelaendehoehe?

## Kernaufgaben

1. Hohe Gebaeude in Manhattan lokalisieren.
2. Einzelne Gebaeude per Suche finden.
3. Das Top-100-Ranking der Gebaeudehoehen untersuchen.
4. Baujahre und Hoehenmuster visuell vergleichen.
5. Bereiche mit niedrigen oder hohen Gebaeuden filtern.

## Informationsarchitektur

- Kartenansicht als primaerer Raumbezug
- Ranking-Ansicht als verdichteter Vergleichsraum
- Modusumschaltung fuer verschiedene Datenattribute
- Suchpanel fuer zielgerichteten Einstieg
- Tooltip und Statistikpanel fuer Detailinformationen

## Interaktionskonzept

- freie Kamerabewegung fuer Exploration
- Hover fuer schnelle Detailabfrage
- Suche fuer direkten Sprung zu Einzelobjekten
- Hoehenfilter fuer Aufgaben mit Fokus auf hohe Gebaeude
- Ranking-Ansicht fuer direkten Vergleich extremer Auspraegungen

## Visualisierungsdesign

- 3D-Extrusion der Gebaeude zur direkten Wahrnehmung von Hoehe
- Farbcodierung fuer Hoehe, Baujahr und Gelaendehoehe
- abstrahierte Strassen als Orientierungshilfe
- dunkle, kontrastreiche Inszenierung fuer Fokus auf Geometrie und Daten

## Designentscheidungen und Begruendung

- 3D statt 2D:
  Gebaeudehoehe ist die zentrale Variable. Extrusion reduziert den Uebersetzungsaufwand, den eine rein farbcodierte 2D-Karte verursachen wuerde.

- Kombination aus Karte und Ranking:
  Die Karte erklaert den Ort, das Ranking erklaert die Extremwerte. Beides alleine waere zu schwach.

- Suche nach BIN oder Name:
  Nutzer koennen sowohl bekannte Landmarken als auch konkrete Datensaetze direkt ansteuern.

- Mehrere Datenmodi:
  Die gleiche Geometrie traegt verschiedene Lesarten. Das staerkt Vergleich und Exploration.

## Offene Punkte

- Zielgruppe noch schaerfer formulieren
- verwandte Arbeiten ergaenzen
- Begruendung der Farbskalen sauber verschriftlichen
- Aufgaben final fuer Nutzertest zuschneiden
