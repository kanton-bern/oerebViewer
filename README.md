**INHALT**

[TOC]

# 1. EINLEITUNG #
Dieses Repository beinhaltet den vollständigen Quelltext um eine lauffähige Instanz der ÖREB-Applikation zu erstellen. Die vordefinierten Dienste sind auf den Kanton Bern zugeschnitten, können jedoch einfach für andere Kantone angepasst werden. Dieses README dient als Dokumentation und hilft bei der Installation der ÖREB-Applikation. 

## 1.1 Zu diesem Repository ##
* Dieses Repository beinhaltet die komplette ÖREB-Applikation und es kann eine selbständige Installation der Applikation aus diesem Repository erzeugt werden.
* Ebenfalls findet sich hier die komplette Historie mit Versionierung der Entwicklung. 
* Issues / Bugs und Wünsche können mit dem Issue-Tracker erfasst werden.

---

# 2. FUNKTIONSSCHEMA DER ÖREB-APPLIKATION #
![oereb_client_architektur_v1_2.png](https://bitbucket.org/repo/kbojGq/images/2306584680-oereb_client_architektur_v1_2.png)

---

# 3. TECHNISCHE VORAUSSETZUNGEN #
Damit die Applikation auf einem Webserver installiert werden kann, müssen folgende Bedingungen erfüllt sein:

* Die Applikation muss als lauffähiger "Build" vorliegen. Wie dieser Build erzeugt wird, ist weiter unten beschrieben.
* Der Webserver muss fähig sein HTML-Dokumente auszuliefern. Auf der Betreiberseite wird also nur eine minimale Infrastruktur benötigt.

## 3.1 Client-Technologie ##
Da die gesamte Anwendungs-Logik im Client implementiert ist, wurde die Applikation vollständig mit [AngularJS](https://angularjs.org/) realisiert. Für das Markup des Frontend wurde - basierend auf dem [Foundation Framework](http://foundation.zurb.com/) - ein HTML/CSS(SASS)/JS-Template erstellt.
Damit konnte eine performante und flexible Lösung gebaut werden welche kaum Anforderungen an die (Web)Server-Infrastruktur stellt: dies macht es möglich die ÖREB-Applikation sehr einfach durch einen beliebigen Kanton zu betreiben.
---

# 4. ENTWICKLUNG UND LOKALES TESTEN #
Die Applikation kann relativ einfach auf einer lokalen Entwicklungsmaschine installiert werden. [Weiterentwicklungen sind möglich und können via PR (Pull-Requests) beantragt werden](https://bitbucket.org/stubr/oereb-app/pull-requests/).

## 4.1 Installationsanleitung ##

1. Die aktuelle Version aus diesem Repository herunterladen
2. npm install
3. npm install -g bower
4. bower install
5. npm install -g gulp
6. gulp
7. gulp serve

## 4.2 Anmerkung ##
Mit **gulp serve** wird der Builder im Entwicklungsmodus gestartet: die Applikation läuft dann in einem lokalen Websverver.  
Mit **gulp build** wird eine produktive Version der App gebaut. Externe Ressourcen werden gekürzt (minified) und zusammengefasst (concatenate). Die produktive Version befindet sich im Verzeichnis /dist/. Das gesamte **/dist/** Verzeichnis muss ins Root der produktiven Umgebung kopiert werden, damit die Applikation lauffähig ist.

## 4.3 Testen der Applikation ##
Für Tests können die folgenden Parzellen verwendet werden:

* 741 in Ittigen (Grauholzstrasse 50, 3063 Ittigen)
* 1169 in Brügg (Portstrasse 38, 2555 Brügg)

---

# 5. ERSTELLEN EINES LAUFFÄHIGEN BUILD #
Damit eine lauffähige Version auf einem externen Webserver publiziert werden kann, muss zuerst ein so genannter **"Build"** aus den Source-Files der Applikation erzeugt werden. Dies geschieht direkt aus der **Entwicklungsinstallation** heraus. Zuerst wird - wie in Kapitel 4.1 beschrieben eine Entwicklungsumgebung erzeugt:

1. Die aktuelle Version aus diesem Repository herunterladen
2. npm install
3. npm install -g bower
4. bower install
5. npm install -g gulp
6. gulp
7. **gulp build**


```
Der letzte Schritt besteht aus einem gulp build. 
Damit werden alle Quelldateien komprimiert und für die Publikation auf einem externen Webserver optimiert.
```

---

# 6. DEFINITION DER SCHNITTSTELLEN #
## 6.1 ÖREB JSON/XML-Auszug ##
Der ÖREB-Auszug basiert auf der offiziellen Weisung [«ÖREB-Kataster – DATA-Extract» der swisstopo/Vermessungsdirektion](http://www.cadastre.ch/internet/kataster/de/home/services/publication/XML.html).

## 6.2 WFS-Dienste ##

## 6.3 Adressauflösung ##

---

# 7. EINSCHRÄNKUNGEN #
## 7.1 SSL-Zertifikate ##
Damit die App vollständig genutzt werden kann, müssen alle Dienste mit dem SSL-Protokoll arbeiten (ansonsten funktioniert unter Chrome die Geolokalisierung nicht). Einige Dienste besitzen nur ein manuell ausgestelltes Zertifikat. Dieses wird nicht immer akzeptiert und muss gesondert hinzugefügt werden. 

## 7.2 Browser ##
Die Applikation wurde mit folgenden Browser (jeweils mit der aktuellen und vorletzten Version des jeweiligen Browsers) getestet ([siehe auch: Browser-Test-Issue](https://bitbucket.org/stubr/oereb-app/issues/41/browser-check)):

 * Windows (7/10): Chrome, Firefox, IE, Opera
 * Android (5.x/6.x/7.x): Chrome
 * iOS (7): Safari, Chrome 

---

# 8. DIVERSES #
## 8.1 Verantwortlichkeiten ##

* Owner und Projektmanagement OEREB-App: Bernhard Sturm (bs@sturmundbreaem.ch)
* Technische Realisierung: Tobias Schmoker (schmoker@novu.ch)
* Inhaltliche Verantwortung und Projektleitung: Cornelia Nussberger (cornelia.nussberger@bve.be.ch)
* Usability-Tests: Stephan Schallenberger (stephan.schallenberger@ufive.unibe.ch)