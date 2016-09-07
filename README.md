# README #

OEREB-App Repository.

## TESTS ##
Für Tests können die folgenden Parzellen verwendet werden:

* 741 in Ittigen (Grauholzstrasse 50, 3063 Ittigen)
* 1169 in Brügg (Portstrasse 38, 2555 Brügg)

## EINSCHRÄNKUNGEN ##
### SSL-Zertifikate ###
Damit die App vollständig genutzt werden kann, müssen alle Dienste mit dem SSL-Protokoll arbeiten (ansonsten funktioniert unter Chrome die Geolokalisierung nicht). Einige Dienste besitzen nur ein manuell ausgestelltes Zertifikat. Dieses wird nicht immer akzeptiert und muss gesondert hinzugefügt werden. 

## ZUM REPOSITORY ##
### Für was ist dieses Repository? ###

* Dieses Repo beinhaltet die komplette OEREB-Applikation und es kann eine selbständige Installation der Applikation aus diesem Repository erzeugt werden.
* Ebenfalls findet sich hier die komplette Historie mit Versionierung der Entwicklung. 
* Issues / Bugs und Wünsche können mit dem Issue-Tracker erfasst werden.

### Installationsanleitung ###

1. Die aktuelle Version herunterladen
2. npm install
3. npm install -g bower
4. bower install
5. npm install -g gulp
6. gulp
7. gulp build

## Anmerkung ##
Mit **gulp serve** wird der Builder im Entwicklungsmodus gestartet: die Applikation läuft dann in einem lokalen Websverver.  
Mit **gulp build** wird eine produktive Version der App gebaut. Externe Ressourcen werden minified und zusammengefasst. Die produktive Version befindet sich im Verzeichnis /dist/. Das gesamte **/dist/** Verzeichnis muss ins Root der produktiven Umgebung kopiert werden, damit die Applikation lauffähig ist.

### Verantwortlichkeiten ###

* Owner und Projektmanagement OEREB-App: Bernhard Sturm (bs@sturmundbreaem.ch)
* Technische Realisierung: Tobias Schmoker (schmoker@novu.ch)
* Inhaltliche Verantwortung und Projektleitung: Cornelia Nussberger (cornelia.nussberger@bve.be.ch)
* Usability-Tests: Stephan Schallenberger (stephan.schallenberger@ufive.unibe.ch)