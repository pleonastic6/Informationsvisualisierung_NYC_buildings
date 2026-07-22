# Manhattan Building Heights

Interaktive 3D-Informationsvisualisierung von 45.125 Gebäuden in Manhattan. Die Anwendung verbindet die räumliche Lage und den Grundriss jedes Gebäudes mit Dachhöhe, Baujahr, Geländehöhe und Identifikationsdaten. Dadurch lassen sich Hochhauscluster, historische Bebauungsmuster und Extremwerte sowohl im Stadtraum als auch in einer Top-100-Ansicht untersuchen.

## Live-Version

**[Visualisierung über GitHub Pages öffnen](https://pleonastic6.github.io/Informationsvisualisierung_NYC_buildings/)**

Die Anwendung läuft vollständig im Browser. Für die Desktop-Nutzung werden eine aktuelle Version von Chrome, Edge oder Firefox und aktivierte Hardwarebeschleunigung empfohlen.

## Ziel und Fragestellung

Gebäudehöhe ist in tabellarischen Daten nur abstrakt erfassbar. Die 3D-Extrusion überträgt diesen Wert direkt in eine räumliche Form und erleichtert damit die Wahrnehmung von Höhenunterschieden und Clustern. Die Visualisierung beantwortet insbesondere folgende Fragen:

- Wo befinden sich die höchsten Gebäude Manhattans?
- Welche räumlichen Muster zeigt die Höhenverteilung?
- Wie unterscheiden sich ältere und neuere Gebäudebestände?
- Welchen Einfluss hat die Geländehöhe auf das Stadtbild?
- Welche Gebäude bilden die 100 höchsten Einträge des Datensatzes?

Die Kartenansicht erhält den geografischen Kontext; die Top-100-Ansicht verdichtet dieselben Daten zu einem direkten Größenvergleich. Beide Ansichten ergänzen sich: Die Karte beantwortet das „Wo?“, das Ranking das „Wie hoch im Vergleich?“.

## Visualisierte Daten und Quellen

Primäre Grundlage ist der Datensatz **BUILDING** aus dem [NYC Open Data Portal](https://data.cityofnewyork.us/widgets/5zhs-2jue), bereitgestellt im Projekt als `data/raw/building_footprints.csv`. Er enthält die Gebäudegrundrisse sowie unter anderem folgende Felder:

| Datenfeld | Verwendung in der Visualisierung |
| --- | --- |
| `the_geom` | geografischer Gebäudegrundriss |
| `height_roof` | Dachhöhe und 3D-Extrusion |
| `ground_elevation` | Höhe des Geländes am Gebäude |
| `construction_year` | Einordnung in Baujahresklassen |
| `bin` | Building Identification Number für Suche und Tooltip |
| `name` | Gebäudename für Suche und Tooltip, sofern vorhanden |

Die Ausgangswerte für Dach- und Geländehöhe liegen in Fuß vor und werden bei der Aufbereitung mit dem Faktor `0,3048` in Meter umgerechnet. Die Anwendung verwendet den auf Manhattan zugeschnittenen und für den Browser optimierten Export in `src/frontend/buildings.json` sowie die Suchdaten in `src/frontend/building-metadata.json`.

Zusätzlich befinden sich PLUTO-Daten für Manhattan, Brooklyn und die Bronx sowie die zugehörige Dokumentation der Version **16v2** unter `data/raw/`. PLUTO (Primary Land Use Tax Lot Output) wird vom [NYC Department of City Planning](https://nycplanning.github.io/db-pluto/) veröffentlicht und beschreibt Grundstücks- und Landnutzungsdaten. Für die aktuell gerenderte Gebäudegeometrie ist jedoch der BUILDING-/Building-Footprints-Datensatz maßgeblich.

## Datenaufbereitung und visuelles Mapping

Die Multipolygon-Geometrien werden aus dem WKT-Feld gelesen, auf das lokale Koordinatensystem der Szene projiziert und als Three.js-Geometrien aufgebaut. Außenkonturen und Innenhöfe bleiben dabei erhalten. Die Darstellung verwendet folgende Zuordnungen:

| Datenvariable | Visuelle Variable | Mapping |
| --- | --- | --- |
| geografischer Grundriss | Form und Position | Grundriss wird als Polygon an seiner Position in Manhattan dargestellt |
| Dachhöhe | Höhe des 3D-Körpers | lineare Extrusion mit `height_roof × 0,1` Szeneneinheiten |
| Dachhöhe | Farbe im Modus „Höhe“ | kontinuierliche, auf die maximale Höhe normierte Skala von dunklem Violett bis hellem Pink |
| Baujahr | Farbe im Modus „Baujahr“ | diskrete Klassen: vor 1900, 1900–1939, 1940–1969, 1970–1999, ab 2000 sowie unbekannt |
| Geländehöhe | vertikaler Sockel | `ground_elevation × 0,02` Szeneneinheiten |
| Geländehöhe | Farbe im Modus „Meereshöhe“ | kontinuierliche Skala, normiert zwischen minimaler und maximaler Geländehöhe |
| Dachhöhe | Top-100-Ranking | absteigend sortierte 10×10-Anordnung; die zehn höchsten Gebäude erhalten Rang- und Höhenlabels |

Die Geometriehöhe und die vertikale Geländeposition sind bewusst unterschiedlich skaliert: Gebäudekörper sollen deutlich vergleichbar bleiben, ohne dass das Relief die Lesbarkeit der Stadtstruktur dominiert. Die Farblegenden machen den jeweils aktiven Modus sichtbar. Gebäude mit unbekanntem Baujahr erhalten eine neutrale graue Farbe.

## Interaktion

### Navigation und Detailabfrage

- **Ziehen:** Kamera drehen
- **Mausrad bzw. Pinch:** zoomen
- **W/A/S/D oder Pfeiltasten:** horizontal bewegen
- **Q/E:** Kamera anheben oder absenken
- **Hover:** Gebäude hervorheben und Detailinformationen anzeigen

Beim Umschalten zwischen Karte und Ranking fährt die Kamera animiert in die passende Perspektive. Die Statistik zeigt je nach Ansicht Anzahl, maximale und durchschnittliche Höhe sowie in der Karte die Zahl der Straßen.

### Suche

Die Suche akzeptiert eine **BIN** oder einen **Gebäudenamen**. Während der Eingabe werden bis zu acht Treffer angezeigt. Exakte Treffer und Präfix-Treffer werden priorisiert, danach wird nach Höhe sortiert. Ein Klick auf einen Treffer oder Enter beim ersten Ergebnis wechselt in die Kartenansicht, fokussiert das Gebäude und hebt es dauerhaft hervor.

### Filter und Ansichten

- Der Regler **„Min. Höhe“** blendet Gebäude unterhalb des gewählten Schwellenwerts aus.
- Die Modi **Höhe**, **Baujahr** und **Meereshöhe** wechseln die Farbcodierung derselben Geometrien.
- **Map** zeigt alle Gebäude im räumlichen Zusammenhang mit einem abstrahierten Straßennetz.
- **Top 100 Grid** ordnet die 100 höchsten Gebäude als vergleichbares Raster an.

### Study Log

Das integrierte Study Log erfasst unter anderem Aufgabenstart und -ende, Ansichts- und Moduswechsel, Suchauswahl, Filteränderungen, Gebäudefokus und Hover-Ereignisse. Die Sitzung kann als JSON exportiert werden. Dadurch lassen sich beobachtete Bedienhandlungen zeitlich mit einer Nutzungsstudie abgleichen.

## XR

Die aktuelle Version ist eine browserbasierte 3D-Visualisierung für Desktop. **Ein WebXR-/VR-Modus ist derzeit nicht im Main-Branch implementiert.** 

## EEG-Test-Session

Für die Test-Session wurden EEG-Verlauf und Bildschirmaufnahme gemeinsam dokumentiert. Die abgegebenen Artefakte sind:

- [EEG-Report (PDF)](docs/user-study/EEG_Output.pdf)
- [EEG-Verlauf als Liniengrafik (PNG)](docs/user-study/EEG_Liniengrafik_Streifen.png)
- [Bildschirmaufnahme mit synchronisiertem EEG-Streifen (MP4)](docs/user-study/movie_with_eeg_strip.mp4)

### Ergebnis und Interpretation

Der Report fasst eine etwa **450 Sekunden** lange frontale EEG-Aufzeichnung zusammen. Von den klassifizierten Messpunkten entfallen **23,31 % auf Alpha-Wellen** und **15,41 % auf Beta-Wellen**; **61,28 %** wurden als sonstige Aktivität eingeordnet. Deskriptiv spricht der höhere Alpha- als Beta-Anteil eher für längere ruhige bzw. aufmerksam-explorative Phasen als für durchgehend stark aktivierte Phasen. Einzelne kurzfristige Ausschläge im Verlauf können mit Interaktionen oder Bewegungsartefakten zusammenfallen.

Diese Interpretation ist ausdrücklich explorativ: Aus einer einzelnen frontalen Test-Session lassen sich weder kognitive Belastung noch Usability-Probleme zuverlässig allein aus Alpha- und Beta-Anteilen ableiten. Der große Anteil „Sonstige“, die im Report ausgewiesenen hohen absoluten Amplituden (Median `32.865,77 µV`, Mittelwert `32.829,63 µV`) sowie fehlende Angaben zu Referenzierung, Filterung, Artefaktkorrektur und ereignisgenauen Markern begrenzen die Aussagekraft. Die EEG-Daten dienen daher als ergänzende Beobachtung zur Bildschirmaufnahme und zu den Interaktionslogs, nicht als eigenständiger Wirksamkeitsnachweis.

Für belastbarere Folgestudien sollten mehrere Testpersonen untersucht, Elektrodenpositionen und Geräteeinstellungen dokumentiert, Augen- und Bewegungsartefakte bereinigt und die Study-Log-Ereignisse zeitlich mit dem EEG synchronisiert werden. Dann könnten beispielsweise Suchauswahl, Wechsel zum Ranking oder Filteränderungen in definierten Zeitfenstern verglichen werden.

## Technischer Aufbau

Die Anwendung ist ohne Build-Schritt als statische Website umgesetzt:

- HTML und CSS für Oberfläche und responsives Layout
- JavaScript-Module für Szene, Geometrien, Farben, Navigation, Suche, Hover und Logging
- Three.js r128 für WebGL-Rendering
- JSON-Dateien als browseroptimierte Datenbasis


## Projektstruktur

```text
data/raw/             Rohdaten und Daten-Dokumentation
docs/user-study/      Studienplanung, EEG-Report, Grafik und Video
index.html            Einstiegspunkt für GitHub Pages
presentation/         Präsentationsmaterial
src/frontend/         Anwendungsdateien und aufbereitete Daten
tools/                Skripte zur Datenaufbereitung
```
