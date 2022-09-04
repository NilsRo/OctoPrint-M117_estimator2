/*
 * View model for OctoPrint-SlicerEstimator
*/

$(function() {
  function slicerEstimatorViewModel(parameters) {
    var self = this;

    self.printerStateViewModel = parameters[0];
    self.filesViewModel = parameters[1];
    self.settingsViewModel = parameters[2];

    self.currentMetadataArr = ko.observableArray([]);
    self.filamentChangeArr = ko.observableArray([]);

    //Helpers
    self.mapDictionaryToArray = function(dictionary) {
      var result = [];
      for (var key in dictionary) {
          if (dictionary.hasOwnProperty(key)) {
              result.push({ key: key, value: dictionary[key] });
          }
      }
      return result;
    };

    self.filamentChangeTimeFormat = function(changeTime) {
      let fmt = self.settingsViewModel.appearance_fuzzyTimes()
      ? formatFuzzyPrintTime
      : formatDuration;
      return fmt(changeTime);
    };

    // receive data from server
    self.onDataUpdaterPluginMessage = function (plugin, data) {
      // NotificationMessages
      if (data.notifyType) {
        var notfiyType = data.notifyType;
        var notifyTitle = data.notifyTitle;
        var notifyMessage = data.notifyMessage;
        var notifyHide = data.notifyHide;
              new PNotify({
                  title: notifyTitle,
                  text: notifyMessage,
                  type: notfiyType,
                  hide: notifyHide
                  });
      }
      if (data.notifyMessageID) {
        switch (data.notifyMessageID) {
          case "no_estimation":
            new PNotify({
              title: "Slicer Estimator",
              text: gettext("No print time estimation from slicer available. Please upload GCODE file again."),
              type: "info",
              hide: true
              });
            break;
          case "no_slicer_detected":
            new PNotify({
              title:  "Slicer Estimator",
              text: gettext("Slicer not detected. Please open a ticket if the slicer should be known..."),
              type: "warning",
              hide: false
              });
            break;
          case "no_timecodes_found":
            new PNotify({
              title:  "Slicer Estimator",
              text: gettext("No timecodes found. Please check if the remaining time feature in the slicer is active."),
              type: "warning",
              hide: false
              });
            break;
        }
      }
    };


    // --- Estimator

    // Overwrite the printTimeLeftOriginString function
    ko.extenders.addSlicerEstimator = function(target, option) {
      let result = ko.pureComputed(function () {
        let value = self.printerStateViewModel.printTimeLeftOrigin();
        switch (value) {
          case "slicerestimator": {
            return option;
          }
          default: {
            return target();
          }
        }
      });
      return result;
    };

    // Add the new hover text
    self.printerStateViewModel.printTimeLeftOriginString =
        self.printerStateViewModel.printTimeLeftOriginString.extend({
          addSlicerEstimator: gettext("Based on information added by the slicer.")});

    // Overwrite the printTimeLeftOriginClass function
    self.originalPrintTimeLeftOriginClass = self.printerStateViewModel.printTimeLeftOriginClass;
    self.printerStateViewModel.printTimeLeftOriginClass = ko.pureComputed(function() {
      let value = self.printerStateViewModel.printTimeLeftOrigin();
      switch (value) {
        case "slicerestimator": {
          return "slicerestimator";
        }
        default: {
          return self.originalPrintTimeLeftOriginClass();
        }
      }
    });
    self.printerStateViewModel.printTimeLeftOrigin.valueHasMutated();


    //API Example - actually not used---------------------------------------------------------------
    // self.get_api_data = function(){
    //   self.filament_results([]);

    //   $.ajax({
    //     url: API_BASEURL + "plugin/SlicerEstimator",
    //     type: "POST",
    //     dataType: "json",
    //     data: JSON.stringify({
    //       command: "getSlicerData"
    //     }),
    //     contentType: "application/json; charset=UTF-8"
    //   }).done(function(data){
    //     for (key in data) {
    //       if(data[key].length){
    //         self.filament_results.push({name: ko.observable(key), filament: ko.observableArray(data[key])});
    //       }
    //     }
    //     self.filesViewModel.requestData({force: true});
    //   })
    // };

    //--- Additional Metadata filelist

    //Activate flag filelist
    self.filelistEnabled = ko.pureComputed(function() {
      return self.settingsViewModel.settings.plugins.SlicerEstimator.metadata_filelist()
    });

    //Activate flag printer
    self.printerEnabled = ko.pureComputed(function() {
      return self.settingsViewModel.settings.plugins.SlicerEstimator.metadata_printer()
    });

    // Overwrite the enableAdditionalData function to handle available metadata
    self.filesViewModel.slicerEnableAdditionalData = function(data) {
      if ((data.slicer_metadata != null && Object.keys(data.slicer_metadata).length > 0) || (data.slicer_filament_change != null && Object.keys(data.slicer_filament_change).length > 0)) {
          return true;
      } else {
          return self.filesViewModel.originalEnableAdditionalData(data);
      }
    };
    self.filesViewModel.originalEnableAdditionalData = self.filesViewModel.enableAdditionalData;
    self.filesViewModel.enableAdditionalData = self.filesViewModel.slicerEnableAdditionalData;

    //Add the slicer metadata to "additionalMetadata"
    self.filesViewModel.getSlicerData = function(data) {
      let return_value = "";

      //custom metadata
      if (data.slicer_metadata != null && Object.keys(data.slicer_metadata).length > 0) {
        for (const [key, value] of Object.entries(data.slicer_metadata)) {
          meta = self.settingsViewModel.settings.plugins.SlicerEstimator.metadata_list().find(elem => elem.id() === key && elem.targets["SlicerEstimator"]["filelist"]() === true);
          let description = "No description";
          if (meta != null) {
            description = meta.description();
            return_value += description + ": " + value + "<br>";
          }
        }

        //filament changes
        if (data.slicer_filament_change != null && Object.keys(data.slicer_filament_change).length > 0 && data.slicer_additional["printtime"] != null) {
          let cnt = 0;
          for (const [key, value] of Object.entries(data.slicer_filament_change)) {
            cnt += 1;
            let changeTimeString = self.filamentChangeTimeFormat(data.slicer_additional["printtime"] - value[1]);
            let changeType;
            if (value[0] == "M600") {
              changeType = gettext("filament change (M600)");
            } else {
              changeType = gettext("filament") + " (" + gettext("tool") + " " + value[0].substring(1,2) +")";
            }
            return_value += cnt + ". " + changeType + ": " + changeTimeString +'<br>';
          }
        }

        if (self.settingsViewModel.settings.plugins.SlicerEstimator.metadata_filelist_align() === "top") {
          return_value += self.filesViewModel.originalGetAdditionalData(data);
        } else {
          return_value = self.filesViewModel.originalGetAdditionalData(data) + return_value;
        }

        return return_value;
      } else {
        return self.filesViewModel.originalGetAdditionalData(data)
      }
    };
    self.filesViewModel.originalGetAdditionalData = self.filesViewModel.getAdditionalData;
    self.filesViewModel.getAdditionalData = self.filesViewModel.getSlicerData;


    //--- Additional Metadata current print

    // adds metadata to printerStateViewModel
    self.addMetadata = function(origin, path) {
      // start jquery request for metadata
      OctoPrint.files.get(origin, path)
      .done(function(response) {
        let enabledMeta = self.settingsViewModel.settings.plugins.SlicerEstimator.metadata_list().filter(elem => elem.targets["SlicerEstimator"]["printer"]() === true);
        let actualFile = response;

        self.currentMetadataArr.removeAll();
        if (typeof actualFile !== 'undefined') {
          enabledMeta.forEach(function(data) {
            if (actualFile.slicer_metadata != null && Object.keys(actualFile.slicer_metadata).length > 0) {
              item = actualFile.slicer_metadata[data.id()];
              if (item != null) {
                let returnArr = [];
                returnArr["description"] = data.description;
                returnArr["value"] = item;
                self.currentMetadataArr.push(returnArr);
              }
            }
          });
        }

        self.filamentChangeArr.removeAll();
        if (typeof actualFile !== 'undefined' && actualFile.slicer_additional != null) {
          if (actualFile.slicer_filament_change != null && Object.keys(actualFile.slicer_filament_change).length > 0) {
            changeList = actualFile.slicer_filament_change;
            if (changeList != null) {
              let cnt = 0
              for (let item of changeList) {
                let returnArr = [];
                let changeType;
                let changeTime;
                cnt += 1;
                if (self.filamentChangeArr.length < 10) {
                  // Return list shown is smaller than 10 filament changes
                  if (item[0] == "M600") {
                    changeType = gettext("filament change (M600)");
                  } else {
                    changeType = gettext("filament") + " (" + gettext("tool") + " " + item[0].substring(1,2) +")";
                  }
                  returnArr["description"] = cnt + ". " + changeType;
                  if (item[1] != null) {
                    // SlicerEstimator based calculation - time
                    if (self.printerStateViewModel.printTimeLeft() === null) {
                      changeTime = self.printerStateViewModel.estimatedPrintTime() - item[1];
                    } else {
                      changeTime = (self.printerStateViewModel.estimatedPrintTime() - item[1]) - (self.printerStateViewModel.estimatedPrintTime() - self.printerStateViewModel.printTimeLeft());
                    }
                  } else {
                    // progress based calculation
                    changeTime = (self.printerStateViewModel.estimatedPrintTime() * (item[3] / self.printerStateViewModel.filesize())) - ((self.printerStateViewModel.estimatedPrintTime() * ( item[3] / self.printerStateViewModel.filesize() )) * ( self.printerStateViewModel.filepos() / item[3] ))
                  }
                  if (self.printerStateViewModel.filepos() <= item[3]) {
                    let changeTimeString = self.filamentChangeTimeFormat(changeTime);
                    returnArr["value"] = changeTimeString;
                    self.filamentChangeArr.push(returnArr);
                  }
                } else {
                  if (changeList[changeList.length - 1][0] == "M600") {
                    changeType = gettext("filament change (M600)");
                  } else {
                    changeType = gettext("filament") + " (" + gettext("tool") + " " + changeList[changeList.length - 1][0].substring(1,2) +")";
                  }
                  returnArr["description"] = gettext("up to") + " " + changeList.length + ". " + changeType;

                  if (item[1] != null) {
                    //SlicerEstimator based calculation - time
                    if (self.printerStateViewModel.printTimeLeft() === null) {
                      changeTime = self.printerStateViewModel.estimatedPrintTime() - changeList[changeList.length - 1][1];
                    } else {
                      changeTime = (self.printerStateViewModel.estimatedPrintTime() - changeList[changeList.length - 1][1]) - (self.printerStateViewModel.estimatedPrintTime() - self.printerStateViewModel.printTimeLeft());
                    }
                  } else {
                    //progress based calculation
                    changeTime = (self.printerStateViewModel.estimatedPrintTime() * ( item[3] / self.printerStateViewModel.filesize() )) - ((self.printerStateViewModel.estimatedPrintTime() * ( item[3] / self.printerStateViewModel.filesize() )) * ( self.printerStateViewModel.filepos() / item[3] ))
                  }
                  let changeTimeString = self.filamentChangeTimeFormat(changeTime);
                  returnArr["value"] = changeTimeString;
                  self.filamentChangeArr.push(returnArr);
                  break;
                }
              }
            }
          }
        }
      });
    };

    //get list of enabled metadata and filament change if a file is selected
    self.onEventFileSelected = function(payload) {
      self.addMetadata(payload["origin"], payload["path"]);
    }

    //on reload if GUI refresh selected file
    ko.when(function () {
      return self.printerStateViewModel.sd() !== undefined && self.printerStateViewModel.filepath() !== undefined;
    }, function (result) {
      if (result == true && self.printerStateViewModel.sd() == false && self.printerStateViewModel.filepath() !== null) {
        self.addMetadata("local", self.printerStateViewModel.filepath());
      }
    });

    //reset metadata list in printerStateViewModel
    self.removeMetadata = function() {
      self.filamentChangeArr.removeAll();
      self.currentMetadataArr.removeAll();
    };

    self.onEventFileDeselected = self.removeMetadata;
    self.onEventDisconnected = self.removeMetadata;


    //enhance printerStateViewModel
    self.onBeforeBinding = function() {
      // inject filament metadata into template
      if (self.printerEnabled()) {
        var element = $("#state").find(".accordion-inner .progress");
        if (element.length) {
          element.before(
              "<div id='filamentChange_list' data-bind='foreach: filamentChangeArr'><span data-bind='text: description'></span>: <strong data-bind='text: value'> - </strong><br></div>"
              + "<div id='metadata_list' data-bind='foreach: currentMetadataArr'><span data-bind='text: description'></span>: <strong data-bind='text: value'> - </strong><br></div>"
          );
        }
      }
    };


    //--- Settings
    self.settingsViewModel.selectedPlugin = ko.observable();
    self.settingsViewModel.filterTable = ko.observable('Bla');


    //Delete an entry in the settings
    self.settingsViewModel.deleteMeta = function(data) {
      let delIndex = self.settingsViewModel.settings.plugins.SlicerEstimator.metadata_list().findIndex(elem => elem.id() === data.id());
      self.settingsViewModel.settings.plugins.SlicerEstimator.metadata_list.splice(delIndex,1);
    };


    self.getActivePlugins = function() {
      return Object.entries(self.settingsViewModel.settings.plugins.SlicerEstimator.plugins).filter(elem => elem[1]["targets"] != null);
    };

    // Update available metadata from files in the settings
    self.settingsViewModel.crawlMetadata = function() {
      self.filesViewModel.filesOnlyList().forEach(function (data) {
        if (data.slicer_metadata != null) {
        Object.keys(data.slicer_metadata).forEach(function (slicerData) {
          if (self.settingsViewModel.settings.plugins.SlicerEstimator.metadata_list().find(elem => elem.id() === slicerData) == null) {
            let targets = {};
            for (plugin of self.getActivePlugins()) {
              targets[plugin[0]] = {};
              for (key of Object.keys(plugin[1]["targets"])) {
                targets[plugin[0]][key] = ko.observable(false);
              }
            }
            var meta = {
                id: ko.observable(slicerData).extend({stripQuotes: true}),
                description: ko.observable(slicerData).extend({stripQuotes: true}),
                targets: targets
            };
            self.settingsViewModel.settings.plugins.SlicerEstimator.metadata_list.push(meta);
          }
        });
        };
      });
    };

    self.settingsViewModel.pluginsSelection = function() {
      var returnArr = [];
      for (plugin of self.getActivePlugins()) {
        let plugin_identifier = plugin[0];
        let targets = plugin[1]["targets"];
        let plugin_name = plugin[1]["name"];
        for (const key of Object.keys(targets)) {
          returnArr.push({plugin_identifier: plugin_identifier, plugin_name: plugin_name, target: key, target_name: targets[key]});
        }
      }
      return returnArr;
    };

    self.settingsViewModel.selectedPluginId = ko.pureComputed(function () {
      return self.settingsViewModel.selectedPlugin() && self.settingsViewModel.selectedPlugin().plugin_identifier;
    });

    self.settingsViewModel.selectedPluginTarget = ko.pureComputed(function () {
      return self.settingsViewModel.selectedPlugin() && self.settingsViewModel.selectedPlugin().target;
    });

    self.settingsViewModel.getFilteredMetadataList = ko.pureComputed(function () {
      return ko.utils.arrayFilter(self.settingsViewModel.settings.plugins.SlicerEstimator.metadata_list(), function (rec) {  
          return ((self.settingsViewModel.filterTable.length == 0 || ko.utils.stringStartsWith(rec.id().toLowerCase(), self.settingsViewModel.filterTable().toLowerCase())));
      });  
    });


    self.settingsViewModel.filterTable.subscribe(function(data) {alert(data);});    




    //Settings Report Bug
    self.settingsViewModel.createIssue = function() {
      // Send the bug report
      url = 'https://github.com/NilsRo/OctoPrint-SlicerEstimator/issues/new';
      var body = "## Description\n\n**ENTER DESCRIPTION HERE\n\nDescribe your problem?\nWhat is the problem?\nCan you recreate it?\nDid you try disabling plugins?\nWhat slicer are you using?\nDid you uploaded the GCODE file causing the issue?\nDid you remember to update the subject?**\n\n\n**Plugins installed**\n";

      // Get plugin info
      OctoPrint.coreui.viewmodels.pluginManagerViewModel.plugins.allItems.forEach(function(item) {
        if (item.enabled && item.bundled == false){
          var version = "";
          if (item.version != null){
            version = " v"+ item.version;
          }
          body += '- ' + item.name +"["+item.key+"]" + version + "\n";
          }
      });

      // Settings
      body += "\n\n**Settings**\n";
      Object.entries(self.settingsViewModel.settings.plugins.SlicerEstimator).forEach(function(item) {
        if (item[0] == 'metadata_list') {
          body += '- ' + item[0] + ": ";
          item[1]().forEach(function(meta_item) {
            body += ' (id: ' + meta_item["id"]();
            body += ', description: ' + meta_item["description"]() + ')';
          });
          body += "\n";
        } else if (item[0] == 'plugins') {
          body += 'Installed plugins: '
          Object.entries(item[1]).forEach(function (plugin) {
            body += '(' + plugin[0] + ')'
          })
          body += "\n";
        } else {
          body += '- ' + item[0] + ": " +item[1]() + "\n";
        }

      });
      body += "\n\n**Software versions**\n- "+$('#footer_version li').map(function(){return $(this).text()}).get().join("\n- ");
      body += "\n\n\n**Browser**\n- "+navigator.userAgent
      window.open(url+'?body='+encodeURIComponent(body));
    };
  }


  OCTOPRINT_VIEWMODELS.push({
    construct: slicerEstimatorViewModel,
    dependencies: ["printerStateViewModel", "filesViewModel", "settingsViewModel"],
    elements: ['#metadata_list', '#filamentChange_list']
  });
});