��    =                    �  ,   �  #     B   >  W   �  g   �     A  �   N  �   �  "   �  )   �  L   �           4     A     O  e   V     �  E   �            L   #     p     v     �     �  �   �  �   :	  �   
     �
     �
     �
  _  �
     9     E     [     l  	   z  
   �     �     �  
   �  $   �  %   �  '   �  '   '  %   O  x   u  -   �  M        j    q      �     �  G   �  H     $   ]  ;   �  �   �  �   �     �  �  �  /   ?     o  L   �  [   �  k   ,     �  �   �  �   7  (   �  (   %  <   N     �     �     �     �  e   �     0  L   =     �     �  P   �     �  %   �        	   5  �   ?  �   �  �     	   O  	   Y     c  j  p     �  	   �     �     	  	        #     0     =     K  $   W  #   |  '   �  (   �  "   �  �     F   �  m   �     d  �   k  '   -   #   U   P   y   V   �   5   !!  A   W!  �   �!  �   }"     l#   (restart of GUI - Browsersession - required) Activate parsing of slicer metadata Add custom metadata like filament brand, material,... in OctoPrint Add custom metadata like filament brand, material,... in OctoPrints current print view. Add custom metadata like filament brand, material,... in OctoPrints filebrowser after uploading a file. Add metadata Additional support or a manual is available on <a href="https://github.com/NilsRo/OctoPrint-SlicerEstimator" target="_blank">Github</a>. All not matching components are ignored so the remaining time calculation will be wrong in case of a mistake.
                Initial settings are fine with Cura for example. Auto-Detect slicer before printing Based on information added by the slicer. Change the orientation in the filelist above or below the standard metadata. Comment to look for Create issue Current print Custom Defindes if the Plugin should look for GCODE during print or scan the file once for a slicer comment. Description Developer settings - use at your own risk / enable it on request only Development Filelist For help use RegEx Tester like: <a href="https://regex101.com/">RegEx101</a> GCODE GCODE or Slicer Comment Search GCODE to watch General How to add custom metadata to OctoPrints filelist see <a href="https://github.com/NilsRo/OctoPrint-SlicerEstimator" target="_blank">here</a>! If you do want spend time about the settings or if you use diffrent slicers leave this setting active. The slicer will be detected automatically before printing. If the slicer is not found the manual slicer selection is used. M117 is read out of M117 commands added by Cura if the following Post-Processing actions are activated. This will continuously update the remaining printing time. Main Metadata Metadata ID Metadata has to be added in the Start GCODE in this format: (;Slicer info:&lt;key&gt;;&lt;value&gt;). You can add as much metadata as you like. Actually only the first 5000 rows are read after upload. You can find an
                            example <a href="https://github.com/NilsRo/Cura_Anycubic_MegaS_Profile" target="_blank">here</a> for Cura. Orientation Print time estimation Refresh Metadata RegEx Comment RegEx Day RegEx Hour RegEx Minute RegEx Second RegEx Week RegEx and Position of match for Days RegEx and Position of match for Hours RegEx and Position of match for Minutes RegEx and Position of match for Seconds RegEx and Position of match for Weeks Remaining time is read out of M73 commands added by PrusaSlicer. This will update continuously the remaining print time. Select slicer or custom for your own settings Select your slicer or custom setting which as to be configured in Custom-Tab. Slicer The average estimation is based on the last prints (green dot is shown). It can be more accurate in the first minutes compared to the slicer estimation as it also includes the heatup time of the printer and is based on the print-history. After print-start slicer estimation is fine. Update estimation on file upload Update from development branch Update the estimation in OctoPrints filebrowser after uploading a file. Use Refresh to update metadata from files. It will not delete entries... Use average estimation before slicer Use development branch <b>Restart of OctoPrint required</b> With Cura native no changes have to be applied to Cura. The overall print time is read out of a comment in the GCODE. For a correct estimation OctoPrints percentage done is used as there is only the overall print time available. With Simplify3D no changes has to be applied to Simplify3D. The overall print time is read out of a comment in the GCODE. For a correct estimation OctoPrints percentage done is used as there is only the overall print time available. filament change Project-Id-Version: OctoPrint-SlicerEstimator 1.3.5
Report-Msgid-Bugs-To: i18n@octoprint.org
POT-Creation-Date: 2022-05-07 16:26+0200
PO-Revision-Date: 2022-05-05 19:16+0200
Last-Translator: FULL NAME <EMAIL@ADDRESS>
Language: de
Language-Team: de <LL@li.org>
Plural-Forms: nplurals=2; plural=(n != 1)
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.9.1
 (Neustart der GUI - Browsersession - notwendig) Aktiviere Metadaten Zeige eigene Metadaten wie Filamenthersteller, Material, ... in OctoPrint an Zeige eigene Metadaten wie Filamenthersteller, Material, ... in OctoPrints Druckbereich an. Ergänze eigene Metadaten wie Filamenthersteller, Material, ... in OctoPrints Dateibrowser nach dem Upload. Metadaten hinzufügen Support und eine Anleitung sind verfügbar auf <a href="https://github.com/NilsRo/OctoPrint-SlicerEstimator" target="_blank">Github</a>. Alle nicht erkannten Komponenten aus dem RegEx werden ignoriert. Das führt dazu, dass die ermittelte Druckzeit nicht korrekt ist.
                Die Standardeinstellungen sind passend für Cura. Slicer vor dem Druck auomatisch erkennen basierend aus der Schätzung des Slicers Ändere die Ausrichtung im Dateibrowser auf oben oder unten. nach Kommentar suchen Ticket erstellen Druckstatus Individuell Definiert ob das Plugin auf GCODE während des Drucks reagiert oder die Datei nach Kommentaren sucht. Beschreibung Entwickler-Einstellungen - auf eigene Gefahr / nur auf Rückfrage aktivieren Entwicklung Dateibrowser Beim testen hilft der RegEx Tester: <a href="https://regex101.com/">RegEx101</a> GCODE GCODE oder Slicer Kommentar-Erkennung Ausschau halten nach Allgemein Wie man eigene Metadaten zu OctoPrints Dateibrowser hinzufügen kann findet man <a href="https://github.com/NilsRo/OctoPrint-SlicerEstimator" target="_blank">hier</a>! Wer es sich einfach machen möchte kann den Slicer automatisch erkennen lassen. Wenn er nicht erkannt werden kann wird der ausgewählte Slicer genutzt. Wird aus den M117 Kommandos von Cura ausgelesen. Dafür muss die entsprechende Nachbearbeitung in Cura aktiviert werden. Dies aktualisiert kontinuierlich die Druckzeit und ermöglicht eine genaue Berechnung. Allgemein Metadaten Metadaten ID Metadaten müssen im Start GCODE im folgenden Format ergänzt werden: (;Slicer info:&lt;key&gt;;&lt;value&gt;). Du kannst so viele Metadaten hinzufügen wie du magst. Aktuell werden jedoch nur die ersten 5000 Zeilen durchsucht. Du kannst ein Beispiel hier <a href="https://github.com/NilsRo/Cura_Anycubic_MegaS_Profile" target="_blank">hier</a> für Cura finden. Ausrichtung Druckzeit Metadaten aktualisieren RegEx Kommentar RegEx Tag RegEx Stunde RegEx Minute RegEx Sekunde RegEx Woche RegEx und die Position für die Tage RegEx und die Position für Stunden RegEx und die Position für die Minuten RegEx und die Position für die Sekunden RegEx und Position für die Wochen Die Druckzeit wird aus den M73 Kommandos vom PrusaSlicer ermittelt. Dies aktualisiert kontinuierlich die Druckzeit und ermöglicht eine genaue Berechnung. Wähle deinen Slicer oder individuell für deine eigenen Einstellungen Wählen deinen Slicer oder individuell, wenn du eigene Einstellungen im Individuell-Tab einstellen möchtest. Slicer Die 'durchschittliche Druckzeit' wird aus den letzten Drucken ermittelt (grüner Punkt). Dies ist meistens genauer als die vom Slicer ermittelte Zeit und berücksichtigt auch die Aufwärmphase. Aktualisiere Druckzeit nach Dateiupload Aktualisieren aus Entwickler-Branch Aktualisiere die erwartete Druckzeit in OctoPrints Dateibrowser nach dem Upload. Nutze 'Aktualisieren' um die Metadaten neu einzulesen. Dies löscht keine Einträge... Nutze die 'durchschittliche Druckzeit' wenn vorhanden Benutze Entwickler-Branch <b>Neustart von OctoPrint notwendig</b> Es müssen keine Änderungen an Cura durchgeführt werden. Die Druckzeit wird aus den GCODE Kommentaren gelesen. Für die Berechnung während des Drucks wird auf die prozentuelle Druckfortschritt von OctoPrint zurückgegriffen. Bei Simplify3D müssen keine Änderungen am Slicer durchgeführt werden, da diese aus den GCODE Kommentaren gelesen werden. Für die Berechnung während des Drucks wird auf die prozentuelle Druckfortschritt von OctoPrint zurückgegriffen. Filamentwechsel 