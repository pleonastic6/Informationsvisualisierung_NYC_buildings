% Vorlage fuer LaTeX-Beamer nach dem Corporate Design der OTH Amberg-Weiden
% Autoren: Andreas Assmuth, Matthias Soellner, Daniel Loebenberger, Sophie Spies, Tobias Bauer, Eduard Hirsch
% Aktuelle Version: v0.06a
% Stand: 05.01.2026
%
% Changelog:
% v0.06a: Bugfix fuer toc=twocolumn, Hinzufuegen der Option compressedtitleimages (05.01.2026)
% v0.05h: Layout-Fix der Titelseite fuer neuere Beamer-Versionen [3.70+] (02.12.2025)
% v0.05g: Quality-of-Life-Verbesserungen (01.12.2025)
% + toc=fancy ignoriert section*-Definitionen am Ende der Praesentation (z.B. wegen Literaturverzeichnis oder Anhang)
% + Verschachtelte itemize-Listen nutzen jetzt circle, triangle, square statt circle, triangle, triangle
% v0.05f: Layout-Verbesserungen in Fusszeile & Titelfolie (10.04.2025)
% + Neue Optionen numberstyle=old, numberstyle=inline, numberstyle=pageref-inline
% + Neues Makro \additionalfootlinecontent fuer weitere Inhalte in Fusszeile
% + Stern-Version \additionalfootlinecontent* fuer selbiges ohne automatischen Whitespace
% + Neues Makro \additionaltitlelogo fuer weitere Logos auf Titelseite
% + Stern-Version \additionaltitlelogo* fuer selbiges ohne automatisches \includegraphics
% v0.05e: Verbesserungen beim Laden der Hausschrift MetaOT [nicht pdf(La)TeX] (13.02.2025)
% + Wenn kursive Schriftschnitte von MetaOT gefunden werden, werden sie automatisch geladen
% + Neue Option condensedmetaot, um kompakter Version der Schrift zu laden (auch hier: automatisches Laden von Kursivschnitten, wenn vorhanden)
% v0.05d: Wartungsupdate mit kleineren Bugfixes (11.02.2025)
% + Subsubsections werden bei toc=fancy jetzt nur noch im richtigen Kapitel angezeigt
% + Darstellung von subsubsections bei toc=fancy verbessert
% + Fehler behoben, der zum Kompilierfehler bei toc=fancy gefuehrt hat, wenn die Praesentation nur eine Section hatte
% v0.05c: Farbschema korrigiert (06.09.2024)
% v0.05b: Kleinere Aenderungen und Bugfixes (05.09.2024)
% + Neue Option toc=altstyle und toc=cdstyle
% + Springen des TOCs bei Option toc=fancy vermieden
% + Funktionalitaet indicatelastpageofframeminpages hinzugefuegt
% + Aenderung an der Schriftfamilienauswahl
% + Laengenregister titlepagetitlewidth kann zum Ueberschreiben der Titelbreite auf einer white-Titelfolie genutzt werden
% v0.05: Umsetzung des neuen Corporate Designs (31.08.2024)
% + Titelfolien: Optionen amberg, weiden, amwen, white, orange
% + Break-Seite: Umgebung breakframe
% + Abschluss-Seite: Umgebungen contactframe, thankyouframe
% + Inhaltsverzeichnis an PowerPoint-Vorlage angepasst und erweitert
% + Handout-Modus mit Karopapier fuer Notizen
% + MetaOT als Standardschriftart (deaktivierbar fuer Studierende)
% + Farbauswahlanpassung an CD, rot[1-4] entfernt, blau[1-4] angepasst, cyan[1-4] hinzugefuegt
% + OTH-Logo in Ecke oben rechts zweifarbig: \logowhite \logocolor
% + Quality of Life
% + Bildformat 16:9 nun standardmaessig gesetzt
% + Fusszeile springt nicht mehr bei Aenderung der Anzahl der Stellen der Seitenangabe
% + Option indicatelastpageofframe faerbt Seitenangabe ein, wenn es sich um die letzte Seite eines Frames handelt
% + Automatische Inhaltsverzeichnisse bei Abschnittbeginn
% v0.04: Neues Corporate Design umgesetzt (27.03.2023)
% v0.03: Ueberarbeitung Titelfolie, Ausrichtung Information Fusszeile,
% + Positionierung Logos, Optionen lecture, tochead (09.01.2019)
% v0.02: Anpassung der Vorlage (14.08.2015)
% + Ermoeglichung der Option "aspectratio=169" fuer Praesentationen mit Bildformat 16:9
% v0.01: Erstellung der Klassendatei (20.11.2013)
%

\ProvidesClass{OTHAWbeamer}[2026/01/05 v0.06a Vorlage Ostbayerische Technische Hochschule Amberg-Weiden]

\PassOptionsToPackage{english,greek,ngerman}{babel}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{beamer}}

\newif\if@lecture
\@lecturefalse

\newif\if@tochead
\@tocheadfalse

\newif\if@footlinebox
\@footlineboxfalse

\newif\if@showerlaeuterung
\@showerlaeuterungfalse

\newif\if@notes
\@notesfalse
\newif\if@noteswithsquaredgrid
\@noteswithsquaredgridfalse

\newif\if@amberg
\@ambergfalse

\newif\if@weiden
\@ambergfalse

\newif\if@amwen
\@amwenfalse

\newif\if@usecompressedtitleimages
\@usecompressedtitleimagesfalse

\newif\if@minimal
\@minimaltrue

\newif\if@orangetitle
\@orangetitlefalse

\newif\if@titleshapes
\@titleshapestrue

\newif\if@thankyoushapes
\@thankyoushapestrue

\newif\if@breakshapes
\@breakshapestrue

\newif\if@indicatelastpageofframe
\@indicatelastpageofframefalse
\def\indicatelastpageofframeminpages{0}

\newif\if@autotoc
\@autotocfalse
\newif\if@autotocshowonhandout
\@autotocshowonhandoutfalse

\newif\if@fancytoc
\@fancytocfalse

\newif\if@twocolumntoc
\@twocolumntocfalse

\newif\if@legacytoc
\@legacytocfalse

\newif\if@squeezetoc
\@squeezetocfalse

\newif\if@tocaltstyle
\@tocaltstylefalse

\newif\if@usefontmetaot
\@usefontmetaottrue
\newif\if@ignoremetaot
\@ignoremetaotfalse
\newif\if@usefontcondensedmetaot
\@usefontcondensedmetaotfalse

\DeclareOption{tochead}{%
 \@tocheadtrue
}
\DeclareOption{notochead}{
 \@tocheadfalse
}

\DeclareOption{footlinebox}{
 \@footlineboxtrue
}
\DeclareOption{nofootlinebox}{
 \@footlineboxfalse
}

\DeclareOption{lecture}{%
 \@lecturetrue
}

\DeclareOption{annotate}{
 \@showerlaeuterungtrue
}

\DeclareOption{amberg}{
 \@ambergtrue
 \@weidenfalse
 \@amwenfalse
 \@minimalfalse
 \@orangetitlefalse
}

\DeclareOption{weiden}{
 \@ambergfalse
 \@weidentrue
 \@amwenfalse
 \@minimalfalse
 \@orangetitlefalse
}

\DeclareOption{amwen}{
 \@ambergfalse
 \@weidenfalse
 \@amwentrue
 \@minimalfalse
 \@orangetitlefalse
}

\DeclareOption{compressedtitleimages}{
 \@usecompressedtitleimagestrue
}

\DeclareOption{white}{
 \@ambergfalse
 \@weidenfalse
 \@amwenfalse
 \@minimaltrue
 \@orangetitlefalse
}

\DeclareOption{orange}{
 \@ambergfalse
 \@weidenfalse
 \@amwenfalse
 \@minimaltrue
 \@orangetitletrue
}

\DeclareOption{titleshapes}{
 \@titleshapestrue
}
\DeclareOption{notitleshapes}{
 \@titleshapesfalse
}
\DeclareOption{thankyoushapes}{
 \@thankyoushapestrue
}
\DeclareOption{nothankyoushapes}{
 \@thankyoushapesfalse
}
\DeclareOption{breakshapes}{
 \@breakshapestrue
}
\DeclareOption{nobreakshapes}{
 \@breakshapesfalse
}
\DeclareOption{shapes}{
 \@titleshapestrue
 \@thankyoushapestrue
 \@breakshapestrue
}
\DeclareOption{noshapes}{
 \@titleshapesfalse
 \@thankyoushapesfalse
 \@breakshapesfalse
}

\DeclareOption{indicatelastpageofframe}{
 \@indicatelastpageofframetrue
}

\DeclareOption{notes}{
 \PassOptionsToClass{handout}{beamer}
 \@notestrue
 \@indicatelastpageofframefalse
}
\DeclareOption{notes=withautotoc}{
 \PassOptionsToClass{handout}{beamer}
 \@notestrue
 \@indicatelastpageofframefalse
 \@autotoctrue
 \@autotocshowonhandouttrue
}
\DeclareOption{notes=withsquaredgrid}{
 \PassOptionsToClass{handout}{beamer}
 \@notestrue
 \@indicatelastpageofframefalse
 \@noteswithsquaredgridtrue
}

\DeclareOption{autotoc}{
 \@autotoctrue
}
\DeclareOption{noautotoc}{
 \@autotocfalse
}
\DeclareOption{squeezetoc}{
 \@squeezetoctrue
}
\DeclareOption{nosqueezetoc}{
 \@squeezetocfalse
}
\DeclareOption{toc=normal}{
 \@fancytocfalse
 \@twocolumntocfalse
 \@legacytocfalse
}
\DeclareOption{toc=fancy}{
 \@fancytoctrue
 \@twocolumntocfalse
 \@legacytocfalse
}
\DeclareOption{toc=twocolumn}{
 \@fancytocfalse
 \@twocolumntoctrue
 \@legacytocfalse
}
\DeclareOption{toc=cdstyle}{
 \@tocaltstylefalse
}
\DeclareOption{toc=altstyle}{
 \@tocaltstyletrue
}
\DeclareOption{toc=legacy}{
 \@legacytoctrue
 \@fancytocfalse
 \@squeezetocfalse
 \@tocaltstylefalse
}

\DeclareOption{nometaot}{
 \@usefontmetaotfalse
 \@ignoremetaotfalse
}
\DeclareOption{ignoremetaot}{
 \@ignoremetaottrue
}
\DeclareOption{condensedmetaot}{
 \@usefontcondensedmetaottrue
}

\def\@numberstyle{-lnum;+onum}
\def\@printnumber{liningnums}
\DeclareOption{numberstyle=old}{
 \def\@numberstyle{-lnum;+onum}
 \def\@printnumber{relax}
}
\DeclareOption{numberstyle=inline}{
 \def\@numberstyle{+lnum;-onum}
 \def\@printnumber{relax}
}
\DeclareOption{numberstyle=pageref-inline}{
 \def\@numberstyle{-lnum;+onum}
 \def\@printnumber{liningnums}
}

% Bildformat 16:9 standardmaessig setzen; Kann weiterhin bei Verwendung der Klasse ueberschrieben werden
\PassOptionsToClass{aspectratio=169}{beamer}

\ProcessOptions\relax
\LoadClass[xcolor=table, covered, hyperref={bookmarks}]{beamer}

\RequirePackage{lmodern}
\RequirePackage[T1]{fontenc}
\RequirePackage{babel}
\RequirePackage{graphicx}

\RequirePackage{tikz}
\usetikzlibrary{calc,positioning}
\RequirePackage{hyperref}

\RequirePackage{version}

\RequirePackage{adjustbox}
\RequirePackage{calc}

\RequirePackage{iftex}

\def\throwerror@metaot#1{
 \ifnum#1=0
 \def\othawbeamer@errormessage@metaot{Font 'MetaOT' cannot be used with current (La)TeX engine. Switch to LuaLaTeX or XeLaTeX to enable support for TTF fonts or disable 'MetaOT' using option 'nometaot'}
 \else
 \def\othawbeamer@errormessage@metaot{Font 'MetaOT' was not found. Try installing it again or disable 'MetaOT' using option 'nometaot'}
 \ifnum#1=2
 \def\othawbeamer@errormessage@metaot{Font 'MetaOT-Cond' was not found. Try installing it again or disable 'MetaOT-Cond' by removing option 'condensedmetaot'}
 \fi
 \fi
 \AtBeginDocument{
 \if@ignoremetaot
 \ClassWarning{OTHAWbeamer}{\othawbeamer@errormessage@metaot}
 \else
 \ClassError{OTHAWbeamer}{\othawbeamer@errormessage@metaot. In order to ignore this error message specify option 'ignoremetaot'}{}
 \fi
 }
}

\if@usefontmetaot
 \def\canusefont@metaot{0}
 \ifluatex
 \def\canusefont@metaot{1}
 \fi
 \ifxetex
 \def\canusefont@metaot{1}
 \fi
 \ifnum\canusefont@metaot=1
 \RequirePackage{fontspec}
 \IfFontExistsTF{MetaOT}{
 \if@usefontcondensedmetaot
 \IfFontExistsTF{MetaOT-Cond}{
 \IfFontExistsTF{MetaOT-CondIta}{
 \setsansfont{MetaOT-Cond}[
 Ligatures=TeX,
 BoldFont=MetaOT-CondBold.ttf,
 ItalicFont=MetaOT-CondIta.ttf,
 BoldItalicFont=MetaOT-CondBoldIta.ttf,
 UprightFont=MetaOT-Cond.ttf,
 RawFeature={\@numberstyle},
 ] % MetaOT is sans-serif
 }{
 \setsansfont{MetaOT-Cond}[
 Ligatures=TeX,
 BoldFont=MetaOT-CondBold,
 UprightFont=MetaOT-Cond,
 RawFeature={\@numberstyle},
 ] % MetaOT is sans-serif
 }
 }{
 \throwerror@metaot{2} % Condensed variants not installed
 }
 \else
 \IfFontExistsTF{MetaOT-Ita}{
 \setsansfont{MetaOT}[
 Ligatures=TeX,
 BoldFont=MetaOT-Bold.ttf,
 ItalicFont=MetaOT-Ita.ttf,
 BoldItalicFont=MetaOT-BoldIta.ttf,
 UprightFont=MetaOT.ttf,
 RawFeature={\@numberstyle},
 ] % MetaOT is sans-serif
 }{
 \setsansfont{MetaOT}[
 Ligatures=TeX,
 BoldFont=MetaOT-Bold,
 UprightFont=MetaOT,
 RawFeature={\@numberstyle},
 ] % MetaOT is sans-serif
 }
 \fi
 }{
 \throwerror@metaot{1} % Not installed
 }
 \else
 \throwerror@metaot{0} % Wrong TeX engine
 \fi
\else
 \def\@printnumber{relax} % command does not work without fontspec package
\fi
\usefonttheme{default} % default family is sans-serif
\usefonttheme[onlymath]{serif} % math mode should be serif

\if@legacytoc
\else
 \RequirePackage{etoolbox}
 \usetikzlibrary{tikzmark, decorations.pathreplacing, calligraphy}
\fi

\if@notes
 \if@noteswithsquaredgrid
 \RequirePackage{pgfpages}
 \pgfpagesdeclarelayout{1 on 1 with grid}
 {
 \def\pgfpageoptionborder{0pt}
 }
 {
 \pgfpagesphysicalpageoptions{%
 logical pages=2,
 physical height=\pgfpageoptionheight,
 physical width=\pgfpageoptionwidth,
 last logical shipout=1
 }
 \newlength{\handout@temp}\setlength\handout@temp{0pt}
 \pgfpageslogicalpageoptions{1}{%
 center={\pgfmathsetlength{\handout@temp}{\pgfphysicalheight - 0.5*(\pgfphysicalwidth/\paperwidth*\paperheight + \pgfpageoptionborder)}\pgfpoint{.5\pgfphysicalwidth}{\handout@temp}},
 resized width=\pgfphysicalwidth,
 border shrink=\pgfpageoptionborder,
 border code=\pgfusepath{clip},
 }
 \pgfpageslogicalpageoptions{2}{%
 copy from=2,
 center={\pgfmathsetlength{\handout@temp}{0.5*(\pgfphysicalwidth/\paperwidth*\paperheight + \pgfpageoptionborder)}\pgfpoint{.5\pgfphysicalwidth}{\handout@temp}},
 resized width=\pgfphysicalwidth,
 border shrink=\pgfpageoptionborder,
 border code={%
 \pgfusepath{discard}%
 \pgfmathsetmacro{\handout@scalefactor}{\paperwidth/(\pgfphysicalwidth - 2*\pgfpageoptionborder)}%
 \pgfmathsetlength{\handout@temp}{(\pgfphysicalheight - 2*\pgfpageoptionborder)*\handout@scalefactor - \paperheight - .5\pgfpageoptionborder}%
 \pgfmathsetlength{\handout@temp}{floor(\handout@temp/5mm/\handout@scalefactor)*5mm*\handout@scalefactor}%
 \pgfpathgrid%
 [step=\pgfpoint{5mm*\handout@scalefactor}{5mm*\handout@scalefactor}]%
 {\pgfpoint{0}{0}}%
 {\pgfpoint{\paperwidth}{\handout@temp}}%
 \pgfsetstrokecolor{black!35}%
 \pgfsetroundcap%
 \pgfsetlinewidth{0.2pt}%
 \pgfusepath{draw}},
 }
 }
 \pgfpagesuselayout{1 on 1 with grid}[a4paper, border shrink=5mm]
 \fi
\fi


\def\inserttoctitle{\iflanguage{ngerman}{Uebersicht}{Overview}}


\def\@totaltocsections{0}
\newcount\@maxtocsections
\@maxtocsections=0\relax
\AtEndDocument{%
 \if@filesw
 \immediate\write\@auxout{\string\@writefile{nav}%
 {\noexpand\headcommand{\noexpand\gdef\noexpand\@totaltocsections{\the\@maxtocsections}}}}
 \fi
}

% Definition of \pgfaddtoshape taken from https://tex.stackexchange.com/a/14772
\def\pgfaddtoshape#1#2{%
 \begingroup
 \def\pgf@sm@shape@name{#1}%
 \let\anchor\pgf@sh@anchor
 #2%
 \endgroup
}
% Define a new anchor "@customwest" that depends on the current section
\pgfaddtoshape{rectangle}{%
 \anchor{@customwest}{%
 \pgf@process{\northeast}%
 \pgf@ya=\pgf@y% save "north"
 \pgf@process{\southwest}%
 \pgf@yb=\pgf@y% save "south"
 \ifnum\@totaltocsections<2%
 \pgfmathparse{0.5}%
 \else%
 \pgfmathparse{(\insertsectionnumber-1)/(\@totaltocsections-1)}%
 \fi
 \pgfmathsetlength{\pgf@y}{(1-\pgfmathresult)*\pgf@ya + \pgfmathresult*\pgf@yb}%
 }%
}

\newcommand<>{\insertfancytoc}{%
 \begingroup%
 \setbeamertemplate{frametitle}[OTHAW]%
 \setbeamertemplate{footline}[OTHAW]%
 \logowhite%
 \setbeamertemplate{background}{%
 \begin{tikzpicture}[remember picture, overlay]
 \path[fill=orange1]
 let \p1=(current page.north east),
 \p2=($(current page.south west)!0.55!(current page.south east) + (0, \beamerbotmargin + 5mm)$),
 \p3=($(pic cs:toc-\insertsectionnumber) + (0, 1mm)$) in
 (\p1) -- (\x2, \y1)
 \ifnum\insertsectionnumber=0\else % if section == 0, there is no entry to point the "arrow" to
 [rounded corners=2mm]-- ($(\x2, \y3 + 6mm)$)
 [sharp corners]-- ($(\x2 - 8mm, \y3)$)
 \ifdim\dimexpr\y3-8mm>\y2 [rounded corners=2mm]-- ($(\x2, \y3 - 6mm)$)\fi\fi
 \ifdim\dimexpr\y3-16mm<\y2[rounded corners=4mm]\else[rounded corners=10mm]\fi -- (\p2)
 [sharp corners]-- (\x1, \y2)
 -- cycle;
 \end{tikzpicture}%
 }%
 \ifnum\insertsectionnumber=0%
 \begin{frame}#1%
 \frametitle{\inserttoctitle}%
 \begingroup%
 \setlength{\textwidth}{0.49\textwidth}%
 \tableofcontents[hideallsubsections]%
 \endgroup%
 \begin{tikzpicture}[remember picture, overlay]% insert dummy picture to avoid "jumping" frames
 \end{tikzpicture}%
 \end{frame}%
 \else%
 \begin{frame}#1%
 \frametitle{\inserttoctitle}%
 \begingroup%
 \setlength{\textwidth}{0.49\textwidth}%
 \tableofcontents[currentsection,hideallsubsections]%
 \endgroup%
 \ifnum\@totaltocsections<2%
 \pgfmathsetmacro{\@pos}{0.5}%
 \else%
 \pgfmathsetmacro{\@pos}{(\insertsectionnumber-1)/(\@totaltocsections-1)}%
 \fi%
 \begin{tikzpicture}[remember picture, overlay]
 \path let \p1=(current page.north east),
 \p2=($(current page.south west)!0.58!(current page.south east) + (0, \beamerbotmargin + 5mm)$),
 \p3=($(pic cs:toc-1) + (0, 1mm)$),
 \p4=($(pic cs:toc-\@totaltocsections) + (0, 1mm)$),
 \n5={max(\y2+4mm, \y4)} in
 ($(\x2, \y3) + (0, 2mm)$) -- ($(\x2, \n5) + (0, -2mm)$)
 node (sub-toc) [pos=\@pos, anchor=@customwest] [text width=0.4\paperwidth, inner sep=0pt, outer sep=0pt] {\vskip0pt minus 1filll\tableofcontents[sectionstyle=hide/hide,subsectionstyle=show/show/hide,subsubsectionstyle=show/show/show/hide]\vspace*{-3mm}\vskip0pt minus 1filll};
 \end{tikzpicture}%
 \end{frame}%
 \fi%
 \endgroup%
 \if@squeezetoc\ifnum\@totaltocsections>7\ClassWarning{OTHAWbeamer}{There are \@totaltocsections\space sections, which will make the TOC page overflow. Consider using a different TOC layout, such as 'toc=twocolumn'}\fi\else\ifnum\@totaltocsections>4\ClassWarning{OTHAWbeamer}{There are \@totaltocsections\space sections, which will make the TOC page overflow. Using option 'squeezetoc' is strongly recommended}\fi\fi%
}

\newcommand<>{\insertnormaltoc}{%
 \begingroup%
 \setbeamertemplate{frametitle}[OTHAW]%
 \setbeamertemplate{footline}[OTHAW]%
 \begin{frame}#1%
 \frametitle{\inserttoctitle}%
 \ifnum\insertsectionnumber=0%
 \tableofcontents[hideallsubsections]%
 \else%
 \tableofcontents[currentsection,hideallsubsections]%
 \fi%
 \end{frame}%
 \endgroup%
 \if@squeezetoc\ifnum\@totaltocsections>7\ClassWarning{OTHAWbeamer}{There are \@totaltocsections\space sections, which will make the TOC page overflow. Consider using a different TOC layout, such as 'toc=twocolumn'}\fi\else\ifnum\@totaltocsections>4\ClassWarning{OTHAWbeamer}{There are \@totaltocsections\space sections, which will make the TOC page overflow. Consider using options 'squeezetoc' or switching to a different TOC layout with 'toc=twocolumn'}\fi\fi%
}

\newcommand<>{\inserttwocolumntoc}{%
 \begingroup%
 \setbeamertemplate{frametitle}[OTHAW]%
 \setbeamertemplate{footline}[OTHAW]%
 \begin{frame}#1%
 \frametitle{\inserttoctitle}%
 \pgfmathparse{int(round(\@totaltocsections/2))}%
 \begin{minipage}{0.49\textwidth}%
 \ifnum\insertsectionnumber=0%
 \tableofcontents[hideallsubsections,sections={-\pgfmathresult}]%
 \else%
 \tableofcontents[currentsection,hideallsubsections,sections={-\pgfmathresult}]%
 \fi%
 \end{minipage}%
 \hfill%
 \pgfmathparse{int(round(\@totaltocsections/2)+1)}%
 \begin{minipage}{0.49\textwidth}%
 \ifnum\insertsectionnumber=0%
 \tableofcontents[hideallsubsections,sections={\pgfmathresult-}]%
 \else%
 \tableofcontents[currentsection,hideallsubsections,sections={\pgfmathresult-}]%
 \fi%
 \end{minipage}%
 \end{frame}%
 \endgroup%
 \if@squeezetoc\ifnum\@totaltocsections>14\ClassWarning{OTHAWbeamer}{There are \@totaltocsections\space sections, which will make the TOC page overflow. Try to reduce the number of sections}\fi\else\ifnum\@totaltocsections>8\ClassWarning{OTHAWbeamer}{There are \@totaltocsections\space sections, which will make the TOC page overflow. Using option 'squeezetoc' is strongly recommended}\fi\fi%
}

\newcommand<>{\insertlegacytoc}{%
 \begingroup%
 \setbeamertemplate{frametitle}[OTHAW]%
 \setbeamertemplate{footline}[OTHAW]%
 \begin{frame}#1%
 \frametitle{\inserttoctitle}%
 \ifnum\insertsectionnumber=0%
 \tableofcontents[hideothersubsections]%
 \else%
 \tableofcontents[currentsection,hideothersubsections]%
 \fi%
 \end{frame}%
 \endgroup%
}

\newcommand<>{\inserttoc}{%
 \if@fancytoc\insertfancytoc#1%
 \else\if@legacytoc\insertlegacytoc#1%
 \else\if@twocolumntoc\inserttwocolumntoc#1%
 \else\insertnormaltoc#1%
 \fi%
 \fi%
 \fi%
 \ifnum\@maxtocsections<\insertsectionnumber\@maxtocsections=\insertsectionnumber\fi%
}%

\if@autotoc
 \AtBeginSection[]{%
 \if@autotocshowonhandout%
 \inserttoc%
 \else%
 \inserttoc<beamer>%
 \fi%
 }%
\fi


\newcommand*{\email}[1]{\def\insertemail{#1}}
\email{}

% Define \place{} command, defaulting to Amberg
\newcommand*{\place}[1]{\def\insertplace{#1}}
\place{Amberg}

% Define \faculty{} command, defaulting to an empty string
\newcommand*{\faculty}[1]{\ifx\empty#1\empty\institute{}\else\institute{\iflanguage{ngerman}{Fakultaet}{Faculty} #1}\fi}

% Define \copyrightby{} command, defaulting to an empty string
\newcommand*{\copyrightby}[1]{\def\insertcopyrightby{#1}}
\copyrightby{}

% Define \photo{} command
\newcommand*{\photo}[1]{\def\insertphotouri{#1}}
\photo{}

% Define \institution{} command
\newcommand*{\institution}[1]{\def\insertinstitution{#1}}
\institution{}

% Define \position{} command
\newcommand*{\position}[1]{\def\insertposition{#1}}
\position{}

% Define \address{} command
\newcommand*{\address}[1]{\def\insertaddress{#1}}
\address{}

% Define \telephone{} command
\newcommand*{\telephone}[1]{\def\inserttelephone{#1}}
\telephone{}

% Define \fax{} command
\newcommand*{\fax}[1]{\def\insertfax{#1}}
\fax{}

% Define \additionalfootlinecontent{} command
\def\additionalfootlinecontent{\@ifstar\@additionalfootlinecontent\@@additionalfootlinecontent}
\newcommand{\@additionalfootlinecontent}[1]{\def\insertadditionalfootlinecontent{#1}}
\newcommand{\@@additionalfootlinecontent}[1]{\def\insertadditionalfootlinecontent{\hfill{}#1\hspace{0.5cm}}}
\additionalfootlinecontent{}

% Define \additionaltitlelogo{} command
\def\additionaltitlelogo{\@ifstar\@additionaltitlelogo\@@additionaltitlelogo}
\newcommand{\@additionaltitlelogo}[1]{\def\insertadditionaltitlelogo{#1}}
\newcommand{\@@additionaltitlelogo}[1]{\def\insertadditionaltitlelogo{\includegraphics[width=3.5cm,height=0.91cm,keepaspectratio]{#1}}}
\additionaltitlelogo*{}

% Load repeatedly used images
\pgfdeclareimage[width=3.5cm]{logo-color}{images/logo-color.pdf}
\pgfdeclareimage[width=3.5cm]{logo-white}{images/logo-white.pdf}

% Logo colorization functionality
\newif\if@logowhite\@logowhitefalse
\newcommand{\logowhite}{\@logowhitetrue}
\newcommand{\logocolor}{\@logowhitefalse}


% OTH corporate design color scheme
\definecolor{schwarz}{RGB}{0,0,0}
\definecolor{weiss}{RGB}{255,255,255}

\definecolor{orange1}{RGB}{250,125,25}
\colorlet{orange2}{orange1!60!weiss}
\colorlet{orange3}{orange1!40!weiss}
\colorlet{orange4}{orange1!20!weiss}

\definecolor{grau1}{RGB}{83,85,90}
\colorlet{grau2}{grau1!60!weiss}
\colorlet{grau3}{grau1!40!weiss}
\colorlet{grau4}{grau1!20!weiss}

\definecolor{cyan1}{RGB}{31,177,204}
\colorlet{cyan2}{cyan1!60!weiss}
\colorlet{cyan3}{cyan1!40!weiss}
\colorlet{cyan4}{cyan1!20!weiss}

\definecolor{gruen1}{RGB}{69,177,121}
\colorlet{gruen2}{gruen1!60!weiss}
\colorlet{gruen3}{gruen1!40!weiss}
\colorlet{gruen4}{gruen1!20!weiss}

\definecolor{blau1}{RGB}{0,103,159}
\colorlet{blau2}{blau1!60!weiss}
\colorlet{blau3}{blau1!40!weiss}
\colorlet{blau4}{blau1!20!weiss}

\definecolor{lila1}{RGB}{108,53,128}
\colorlet{lila2}{lila1!60!weiss}
\colorlet{lila3}{lila1!40!weiss}
\colorlet{lila4}{lila1!20!weiss}

% Define beamer page layout
\newlength{\beamerleftmargin}
\newlength{\beamerrightmargin}
\newlength{\beamertopmargin}
\newlength{\beamerbotmargin}
\setlength{\beamerleftmargin}{.5cm}
\setlength{\beamerrightmargin}{\beamerleftmargin}
\setlength{\beamertopmargin}{.3cm}
\setlength{\beamerbotmargin}{.3cm}

\setbeamersize{text margin left=\beamerleftmargin}
\setbeamersize{text margin right=\beamerrightmargin}
\setbeamersize{sidebar width left=0cm}
\setbeamersize{sidebar width right=0cm}

% Define color theme
\setbeamercolor*{title}{fg=weiss, bg=grau1}
\setbeamercolor*{frametitle}{fg=grau1, bg=weiss}
\setbeamercolor*{normal text}{fg=grau1, bg=weiss}
\setbeamercolor*{alerted text}{fg=orange1, bg=weiss}
\setbeamercolor*{gray text}{fg=grau1, bg=weiss}
\setbeamercolor*{footline}{fg=grau1, bg=weiss}
\setbeamercolor*{contact}{fg=grau1, bg=weiss}
\setbeamercolor*{thankyou}{fg=weiss, bg=grau1}
\setbeamercolor*{structure}{fg=orange1}
\setbeamercolor*{currentsection}{fg=orange1}
\setbeamercolor*{example text}{fg=gruen1, bg=weiss}
\setbeamertemplate{blocks}[rounded][shadow=true]
\setbeamercolor*{block title}{use=structure, fg=weiss, bg=orange1}
\setbeamercolor*{block title alerted}{use=alerted text, fg=weiss, bg=lila1}
\setbeamercolor*{block title example}{use=example text, fg=weiss, bg=gruen1}
\setbeamercolor*{block body}{parent=normal text, use=block title, bg=orange4}
\setbeamercolor*{block body alerted}{parent=normal text, use=block title, bg=lila4}
\setbeamercolor*{block body example}{parent=normal text, use=block title, bg=gruen4}
\setbeamercolor*{button}{fg=weiss, bg=orange1}
\setbeamercolor{bibliography entry author}{fg=,bg=}
\setbeamercolor{bibliography entry title}{fg=,bg=}
\setbeamercolor{bibliography entry location}{fg=,bg=}
\setbeamercolor{bibliography entry note}{fg=,bg=}

% Define fonts
\setbeamerfont{tiny structure}{series=\mdseries, size=\tiny}
\setbeamerfont{title}{series=\bfseries, size=\Huge}
\setbeamerfont{subtitle}{series=\mdseries, size=\normalsize}
\if@squeezetoc
 \setbeamerfont{tocsectionnumber}{series=\bfseries, size=\huge}
 \setbeamerfont{tocsectionnumber shaded}{series=\bfseries, size=\huge}
\else
 \setbeamerfont{tocsectionnumber}{series=\bfseries, size=\Huge}
 \setbeamerfont{tocsectionnumber shaded}{series=\bfseries, size=\Huge}
\fi
\setbeamerfont{tocsectionname}{series=\bfseries, size=\normalsize}
\if@tocaltstyle
 \setbeamerfont{tocsectionname shaded}{series=\bfseries, size=\normalsize}
\else
 \setbeamerfont{tocsectionname shaded}{series=\mdseries, size=\normalsize}
\fi
\setbeamerfont*{contact}{series=\mdseries, size=\normalsize}
\setbeamerfont*{thankyou}{series=\mdseries, size=\small}
\setbeamerfont*{author}{series=\bfseries, size=\normalsize}
\setbeamerfont{frametitle}{series=\bfseries, size=\large}
\setbeamerfont{framesubtitle}{series=\mdseries, size=\normalsize}
\setbeamerfont*{footline}{series=\mdseries, size=\tiny}
\setbeamerfont*{date}{series=\mdseries, size=\tiny}
\setbeamerfont{block title}{series=\bfseries, size=\normalsize}

\setbeamertemplate{itemize item}[circle]
\setbeamertemplate{itemize subitem}[triangle]
\setbeamertemplate{itemize subsubitem}[square]
\setbeamercolor{section in toc}{fg=grau1, bg=orange1}
\if@tocaltstyle
 \setbeamercolor{section in toc shaded}{fg=grau4, bg=grau4}
\else
 \setbeamercolor{section in toc shaded}{fg=grau1, bg=grau4}
\fi
\if@fancytoc
 \setbeamercolor{subsection in toc}{fg=weiss, bg=grau1}
\else
 \setbeamercolor{subsection in toc}{fg=grau1, bg=weiss}
\fi
\setbeamertemplate{headline}{}
\setbeamertemplate{navigation symbols}{}
\def\beamer@andinst{\quad}

\def\vc#1{$\vcenter{\hbox{#1}}$}
\if@squeezetoc
 \patchcmd{\beamer@sectionintoc}{\vskip1.5em}{\vskip0.5em}{}{}
\fi
\def\@sectionintoc#1{%
 \parbox{9mm}{\vc{\usebeamerfont{tocsectionnumber#1}\usebeamercolor[bg]{section in toc#1}\ifnum\inserttocsectionnumber<10\relax0\fi\inserttocsectionnumber}\hspace*{-3pt}}~\vc{\usebeamerfont{tocsectionnumber}\usebeamercolor[bg]{section in toc#1}\,|\hfill}~~%
 \tikzmark{toc-\inserttocsectionnumber}%
 \vc{\parbox{\textwidth-15mm}{\raggedright\usebeamerfont{tocsectionname#1}\usebeamercolor[fg]{section in toc#1}\inserttocsection}}%
}
\defbeamertemplate*{section in toc}{large-numbers}{\@sectionintoc{}}
\defbeamertemplate*{section in toc shaded}{large-numbers}{\@sectionintoc{ shaded}}
\defbeamertemplate*{subsection in toc}{large-numbers}{%
 \tikzmark{toc-\inserttocsectionnumber-\inserttocsubsectionnumber}%
 \tikzmark{toc-\inserttocsectionnumber-last}%
 \usebeamerfont{subsection in toc}\usebeamercolor{subsection in toc}\inserttocsubsection\par\vskip3mm%
}
\defbeamertemplate*{subsubsection in toc}{large-numbers}{%
 \usebeamerfont{subsection in toc}\usebeamercolor{subsection in toc}\vskip-2mm\hskip5mm\parbox{\textwidth-5mm}{\inserttocsubsubsection\par}\vskip3mm%
}

\if@legacytoc
 \setbeamertemplate{section in toc}[default]
 \setbeamertemplate{section in toc shaded}[default]
 \setbeamertemplate{subsection in toc}[default]
 \setbeamertemplate{subsubsection in toc}[default]
\else
 \setbeamertemplate{section in toc}[large-numbers]
 \setbeamertemplate{section in toc shaded}[large-numbers]
 \setbeamertemplate{subsection in toc}[large-numbers]
 \setbeamertemplate{subsubsection in toc}[large-numbers]
\fi

\newlength{\othruleheadlinetop}
\newlength{\othruleheadlinetoplength}
\newlength{\othruletitlelength}
\setlength{\othruleheadlinetop}{1.5pt}
\setlength{\othruleheadlinetoplength}{1cm}
\setlength{\othruletitlelength}{2.5cm}

\newlength{\contactphotoborder}
\setlength{\contactphotoborder}{3pt}

\newlength{\titlewidth}
\setlength\titlewidth{\paperwidth}
\addtolength\titlewidth{-4.75cm}

\newlength{\titlelowerbarheight}
\setlength\titlelowerbarheight{3.25cm}
\newlength{\titlerightshapeswidth}
\setlength\titlerightshapeswidth{6.5cm}
\newlength{\titlepagetitlewidth}
\setlength\titlepagetitlewidth{0cm} % 0 = calculate automatically, override if necessary

% beamer changed some internal spacings between versions 3.68 and 3.72, probably in version 3.70 to fix https://github.com/josephwright/beamer/issues/840
% This leads to title page issues with broken layouts in newer beamer versions.
% In order to mitigate this issue, the following switch defines corrective vertical spacings
\IfClassAtLeastTF{beamer}{2023/05/15}{ % version 3.70
 % new version
 \def\beamer@titlepage@fixlayoutspacing{\vspace*{\beamerbotmargin}}
 }{
 % old version
 \def\beamer@titlepage@fixlayoutspacing{\vspace*{-2mm-5pt}}
}

\defbeamertemplate*{title page}{OTHAW}{%
 \begin{tikzpicture}[remember picture,overlay]
 \node[inner sep=0pt, outer sep=0pt] at (current page.center) [yshift=0.5*\titlelowerbarheight] {
 \minsizebox{!}{\paperheight-\titlelowerbarheight}{%
 \minsizebox{\paperwidth}{!}{%
 \includegraphics[height=1cm]{%
 images/%
 \if@amberg amberg.\if@usecompressedtitleimages jpg\else png\fi\fi%
 \if@weiden weiden.\if@usecompressedtitleimages jpg\else png\fi\fi%
 \if@amwen amwen.\if@usecompressedtitleimages jpg\else png\fi\fi%
 }%
 }%
 }%
 };
 \node (logo) [inner sep=0pt, outer sep=0pt, below right=\beamertopmargin and \beamerleftmargin of current page.north west] {\pgfuseimage{logo-white}};
 \node (additional-logo) [inner sep=0pt, outer sep=0pt, below right=0 and \beamerleftmargin of logo.north east] {\insertadditionaltitlelogo};
 \node (title-lowerbar) [inner sep=0pt, outer sep=0pt, above=0cm of current page.south] [fill=orange1, rectangle, minimum width=\paperwidth, minimum height=\titlelowerbarheight] {};
 \if@titleshapes
 \node[inner sep=0pt, outer sep=0pt, above left=0cm of title-lowerbar.north east] {\includegraphics[width=0.75\titlerightshapeswidth]{images/shapes-4.pdf}};
 \fi
 \end{tikzpicture}%
 \vskip0pt plus 1filll%
 \usebeamercolor[fg]{title}{\usebeamerfont{title}\inserttitle}\vskip0.25em%
 \ifx\insertsubtitle\@empty\else%
 {\usebeamerfont{subtitle}\insertsubtitle}%
 \fi%
 \ifx\insertsubtitle\@empty\else\ | \fi\insertauthor\ifx\insertinstitute\@empty\else\ | \insertinstitute\fi%
 \par%
 \tikz{\draw[line width=\othruleheadlinetop, line cap=round, draw=weiss] (0,0) -- +(\othruletitlelength,0);}\\%
 \usebeamerfont{date}\insertplace, \insertdate%
 \ifx\insertcopyrightby\@empty\else~~~\copyright\ \insertcopyrightby\fi\vphantom{Ijg}\beamer@titlepage@fixlayoutspacing%
}

\defbeamertemplate*{title page}{OTHAWminimal}{%
 \begin{tikzpicture}[remember picture,overlay]
 \if@orangetitle
 \node (orange-bar) [inner sep=0pt, outer sep=0pt, left=0cm of current page.east] [fill=orange1, rectangle, minimum width=0.9\titlerightshapeswidth, minimum height=\paperheight] {};
 \if@titleshapes
 \node (shapes) [inner sep=0pt, outer sep=0pt, above left=\beamerbotmargin and -0.14\titlerightshapeswidth of current page.south east] {\includegraphics[width=0.9\titlerightshapeswidth]{images/shapes-1.pdf}};
 \fi
 \else
 \if@titleshapes
 \node (shapes) [inner sep=0pt, outer sep=0pt, above left=\beamerbotmargin and -0.12\titlerightshapeswidth of current page.south east] {\includegraphics[width=\titlerightshapeswidth]{images/shapes-2.pdf}};
 \fi
 \fi
 \node (logo) [inner sep=0pt, outer sep=0pt, below left=\beamertopmargin and \beamerrightmargin of current page.north east] {\if@orangetitle\pgfuseimage{logo-white}\else\pgfuseimage{logo-color}\fi};
 \node (additional-logo) [inner sep=0pt, outer sep=0pt, below left=\beamertopmargin and 0 of logo.south east] {\insertadditionaltitlelogo};
 \end{tikzpicture}%
 \vskip0pt plus 1filll%
 \pgfmathsetlength{\titlepagetitlewidth}{\titlepagetitlewidth > 0pt ? \titlepagetitlewidth : \textwidth-\titlerightshapeswidth}%
 \begin{minipage}{\titlepagetitlewidth}%
 \usebeamercolor[bg]{title}{\usebeamerfont{title}\inserttitle}\vskip0.5em%
 \ifx\insertsubtitle\@empty\else%
 {\usebeamerfont{subtitle}\insertsubtitle}\\%
 \fi%
 \insertauthor\ifx\insertinstitute\@empty\else\ | \insertinstitute\fi%
 \par%
 \tikz{\draw[line width=\othruleheadlinetop, line cap=round, draw=orange1] (0,0) -- +(\othruletitlelength,0);}%
 \end{minipage}%
 \vskip0pt plus 1filll%
 \usebeamerfont{date}\insertplace, \insertdate%
 \ifx\insertcopyrightby\@empty\else~~~\copyright\ \insertcopyrightby\fi\vphantom{Ijg}\beamer@titlepage@fixlayoutspacing%
}

\def\@footlinecontent{%
 \vskip5pt%
 \hskip\beamerleftmargin%
 \parbox[b][2mm]{\dimexpr\textwidth-\beamerleftmargin-\beamerrightmargin}{%
 \usebeamercolor{footline}\usebeamerfont{footline}\inserttitle\if@lecture: \insertsubtitle\fi\ | \insertauthor \insertadditionalfootlinecontent\insertdate\hspace{0.5cm}%
 \parbox{\widthof{\inserttotalframenumber}}{\raggedleft\if@indicatelastpageofframe\ifnum\insertpagenumber=\insertframeendpage\ifnum\insertslidenumber>\indicatelastpageofframeminpages\color{orange1}\fi\fi\fi\expandafter\csname\@printnumber\endcsname\insertframenumber}%
 }%
 \vskip\beamerbotmargin%
}
\defbeamertemplate*{footline}{OTHAW}{%
 \if@footlinebox%
 \fboxsep0pt%
 {\usebeamercolor[bg]{footline}}\colorbox{footline.bg}{\parbox{\textwidth}{\@footlinecontent}}
 \else%
 \@footlinecontent%
 \fi%
}
\defbeamertemplate*{footline}{empty}{}

\defbeamertemplate*{headline}{OTHAW}{%
 \begin{tikzpicture}[remember picture,overlay]%
 \node (logo) [inner sep=0pt, outer sep=0pt, below left=\beamertopmargin and \beamerrightmargin of current page.north east] {\if@logowhite\pgfuseimage{logo-white}\else\pgfuseimage{logo-color}\fi};
 \end{tikzpicture}%
}
\defbeamertemplate*{headline}{empty}{}

\defbeamertemplate*{frametitle}{OTHAW}{%
 \vskip\beamertopmargin
 \if@tochead%
 \vbox{%
 \tinyline{\hspace{.2cm}\insertsection\hfill}%
 \setbox\beamer@tempbox=\hbox{\insertsubsection}%
 \tinyline{\ifdim\wd\beamer@tempbox>1pt{\hspace{.2cm}\hskip2pt\raise1.9pt\hbox
 {\vrule width0.4pt height1.875ex\vrule width 5pt height0.4pt}}
 \hskip1pt\insertsubsection\fi\hfill}%
 }
 \vskip.3cm
 \fi%
 \edef\@frametitle{\insertframetitle}\edef\@emptyframetitle{{{}}}%
 \ifx\@frametitle\@emptyframetitle%
 % "Empty" title -> draw nothing, but reserve space
 \parbox[b][8mm]{\titlewidth}{}\mbox{}\\[-.15cm]\tikz{}%
 \else%
 % Draw title and subtitle
 \parbox[b][8mm]{\titlewidth}{%
 \usebeamerfont*{frametitle}\usebeamercolor{frametitle}\insertframetitle%
 \ifx\insertframesubtitle\@empty\\[-2mm]\else\\\usebeamerfont*{framesubtitle}\usebeamercolor{framesubtitle}\insertframesubtitle\fi\mbox{}%
 }%
 \\[-.15cm]%
 \begin{tikzpicture}[overlay, remember picture]%
 \draw[line width=\othruleheadlinetop, line cap=round, draw=orange1] (0,0) -- +(\othruleheadlinetoplength,0);
 \end{tikzpicture}%
 \fi%
}
\defbeamertemplate*{frametitle}{empty}{}

\setbeamertemplate{footline}[OTHAW]%
\setbeamertemplate{frametitle}[OTHAW]%
\setbeamertemplate{headline}[OTHAW]%
\if@minimal\setbeamertemplate{title page}[OTHAWminimal]\else\setbeamertemplate{title page}[OTHAW]\fi%

\def\maketitle{%
 \begingroup%
 \setbeamertemplate{headline}[empty]%
 \setbeamertemplate{footline}[empty]%
 \setbeamertemplate{frametitle}[empty]%
 \ifbeamer@inframe\titlepage\else\frame{\titlepage}\fi%
 \endgroup%
}

\newenvironment{annotation}{%
 \addtocounter{framenumber}{-1}
 \begin{frame}
 \frametitle{\iflanguage{ngerman}{Erlaeuterungen}{Annotations}}
 }{ \end{frame}}
\newenvironment{erlaeuterung}{\begin{annotation}}{\end{annotation}}
\if@showerlaeuterung\else\excludeversion{annotation}\excludeversion{erlaeuterung}\fi

\newenvironment{contactframe}[1][]{%
 \setbeamertemplate{background}{%
 \begin{tikzpicture}[remember picture,overlay]
 \node (left-box) [inner sep=0pt, outer sep=0pt] [right=-1cm of current page.west, yshift=-5mm, rectangle, rounded corners=6mm, fill=orange1, minimum height=0.6\paperheight, minimum width=0.4\paperwidth + 1cm] {};
 \ifx\insertphotouri\@empty\else
 \node (photo-border) [inner sep=0pt, outer sep=0pt] at (left-box.east) [circle, draw=weiss, fill=grau4, minimum width=0.35\paperheight, line width=\contactphotoborder] {};
 \begin{scope}
 \path [clip] (left-box.east) circle (0.175\paperheight);
 \node (photo) [inner sep=0pt, outer sep=0pt] at (left-box.east) {\minsizebox{!}{0.35\paperheight}{\includegraphics[width=0.35\paperheight]{\insertphotouri}}};
 \end{scope}
 \fi
 \node (name) [inner sep=0pt, outer sep=0pt] [above left=0cm and 0.25\paperheight of left-box.east, text width=0.2\paperwidth] {\raggedleft\usebeamerfont{frametitle}\usebeamercolor[bg]{frametitle}\insertauthor\par};
 \node (position) [inner sep=0pt, outer sep=0pt] [below left=0.05\paperheight and 0cm of name.south east, text width=0.3\paperwidth] {\usebeamerfont{contact}\usebeamercolor[bg]{contact}\raggedleft\insertposition\par};
 \draw[line width=\othruleheadlinetop, line cap=round, draw=weiss] (name.south east) ++(0, -0.025\paperheight) -- +(-\othruleheadlinetoplength,0);
 \end{tikzpicture}}%
 \begin{frame}[environment=contactframe,t,#1]%
 \frametitle{\iflanguage{ngerman}{Kontakt}{Contact}}
 \vskip5mm
 \hfill\begin{adjustbox}{minipage=[c][0.6\paperheight][c]{0.42\paperwidth}, margin=0pt}%
 \usebeamerfont{contact}\usebeamercolor[fg]{contact}\raggedright\ifx\insertinstitution\@empty\else\insertinstitution\\\fi%
 \ifx\insertaddress\@empty\else\insertaddress\\[2mm]\fi%
 \ifx\inserttelephone\@empty\else{}Tel.:~\inserttelephone\\\fi%
 \ifx\insertfax\@empty\else{}Fax:~\insertfax\\\fi%
 \ifx\insertemail\@empty\else\href{mailto:\insertemail}{\texttt{\insertemail}}\fi%
 \end{adjustbox}\par%
 }{\end{frame}%
}

\newenvironment{thankyouframe}[1][]{%
 \setbeamertemplate{footline}[empty]%
 \setbeamertemplate{frametitle}[empty]%
 \setbeamertemplate{background}{%
 \begin{tikzpicture}[remember picture,overlay]
 \fill [orange1] (current page.south west) rectangle (current page.north east);
 \node (title) [above right=0cm and \beamerleftmargin of current page.west, anchor=base west, align=left, text width=0.8\paperwidth] {\hspace*{-2mm}\usebeamerfont{title}\usebeamercolor[fg]{title}\insertframetitle\vphantom{Ijg}};
 \draw[line width=\othruleheadlinetop, line cap=round, draw=weiss] (title.south west) ++(0, -0.0125\paperheight) -- ++(\othruletitlelength,0);
 \if@thankyoushapes
 \node (shapes) [inner sep=0pt, outer sep=0pt, above left=\beamerbotmargin and -0.14\titlerightshapeswidth of current page.south east] {\includegraphics[width=\titlerightshapeswidth]{images/shapes-1.pdf}};
 \fi
 \end{tikzpicture}}%
 \logowhite%
 \begin{frame}[environment=thankyouframe,t,#1]%
 \xdef\@thankyouframetitle{\iflanguage{ngerman}{Vielen~~Dank!}{Thank~~you!}}%
 \frametitle{\@thankyouframetitle}%
 \vskip0.5\paperheight
 \begin{adjustbox}{minipage=[c][0.365\paperheight][c]{0.6\paperwidth}, margin=0pt}%
 \raggedright%
 \usebeamerfont{author}\usebeamercolor[bg]{author}\insertauthor\\
 \usebeamerfont{thankyou}\usebeamercolor[fg]{thankyou}\ifx\insertinstitution\@empty\else\insertinstitution\\\fi%
 \ifx\insertaddress\@empty\else\insertaddress\\[2mm]\fi%
 \ifx\inserttelephone\@empty\else{}Tel.:~\inserttelephone\\\fi%
 \ifx\insertfax\@empty\else{}Fax:~\insertfax\\\fi%
 \ifx\insertemail\@empty\else\href{mailto:\insertemail}{\texttt{\insertemail}}\fi%
 \end{adjustbox}\par%
 }{%
 \end{frame}%
}


\newenvironment{breakframe}[1][]{%
 \setbeamertemplate{footline}[empty]%
 \setbeamertemplate{frametitle}[empty]%
 \setbeamertemplate{headline}[empty]%
 \setbeamertemplate{background}{%
 \begin{tikzpicture}[remember picture,overlay]
 \fill [orange1] (current page.south west) rectangle (current page.north east);
 \if@breakshapes
 \node (shapes) [inner sep=0pt, outer sep=0pt, below right=0cm of current page.north west] {\includegraphics[width=1.09\paperwidth]{images/shapes-5.pdf}};
 \fi
 \end{tikzpicture}}%
 \begin{frame}[environment=breakframe,t,#1]%
 \vskip0.45\paperheight
 \usebeamerfont{title}\usebeamercolor[fg]{title}
 }{%
 \end{frame}%
}
