# README #

OEREB-App Repository.

## TESTS ##
Für Tests können die folgenden Parzellen verwendet werden:

* 741 in Ittigen (Grauholzstrasse 50, 3063 Ittigen)
* 1169 in Brügg (Portstrasse 38, 2555 Brügg)

## EINSCHRÄNKUNGEN ##
### SSL-Zertifikate ###
Damit die App vollständig genutzt werden kann, müssen alle Dienste mit dem SSL-Protokoll arbeiten (ansonsten funktioniert unter Chrome die Geolokalisierung nicht). Einige Dienste besitzen nur ein manuell ausgestelltes Zertifikat. Dieses wird nicht immer akzeptiert und muss gesondert hinzugefügt werden. Diese Dienste müssen manuell hinzugefügt werden:

* https://adue03.myqnapcloud.com/

### Manuelles anfügen von SSL-Zertifikaten ###
1. Link des Dienstes im Browser aufrufen (https://adue03.myqnapcloud.com/)
2. Es erscheint ein Warnung, dass dies keine sichere Verbindung sei:
![ssl_ausnahme_1.png](https://bitbucket.org/repo/kbojGq/images/832371156-ssl_ausnahme_1.png)
3. Auf "ERWEITERT" klicken. Danach den Link "Weiter zu [Website] (unsicher)" klicken:
![ssl_ausnahme_2.png](https://bitbucket.org/repo/kbojGq/images/3186890283-ssl_ausnahme_2.png)
4. Jetzt erscheint unter Umständen noch eine 403-Fehlerseite. Diese ist jedoch nicht relevant:
![ssl_ausnahme_3.png](https://bitbucket.org/repo/kbojGq/images/1727280335-ssl_ausnahme_3.png) 
5. Nun kann die ÖREB-App normal aufgerufen werden.

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

### Verantwortlichkeiten ###

* Owner und Projektmanagement OEREB-App: Bernhard Sturm (bs@sturmundbreaem.ch)
* Technische Realisierung: Tobias Schmoker (schmoker@novu.ch)
* Inhaltliche Verantwortung und Projektleitung: Cornelia Nussberger (cornelia.nussberger@bve.be.ch)
* Usability-Tests: Stephan Schallenberger (stephan.schallenberger@ufive.unibe.ch)