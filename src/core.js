const regex = /[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}/;
const regexRessource = /\[Ressource:(\S*)\]/;
const datePattern = "HH:mm:ss,SSS";
// var ressource_name = "";

var converted = false;
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");

var TextMode = require("ace/mode/text").Mode;
var dynamicMode = new TextMode();
dynamicMode.HighlightRules = require("DynHighlightRules").DynHighlightRules;

editor.session.setMode(dynamicMode);

// editor.resize(true);
editor.$blockScrolling = Infinity;
editor.setOption("showPrintMargin", false)
editor.session.setOption('indentedSoftWrap', false);

editor.getSession().on('change', function() {
  setTimeout(function() {
      editor_content = editor.getValue();
      if (!converted){
          localStorage.setItem("editor_log_content", editor_content);
      }
  }, 100);
});


if (localStorage.getItem("editor_log_content") != null){
    editor.setValue(localStorage.getItem("editor_log_content"));
    findRessources(editor.getValue());
    editor.setValue(editor.getValue(), -1);
}

// https://stackoverflow.com/a/22497543
function resizeAce() {
    var h = window.innerHeight;
    if (h > 360) {
        $('#editor').css('height', (h - 120).toString() + 'px');
    }
};
$(window).on('resize', function () {
        resizeAce();
});
resizeAce();


function useWrapMode() {
    if (editor.session.getUseWrapMode() === true){
        editor.session.setUseWrapMode(false);
    } else {
        editor.session.setUseWrapMode(true);
    }
};

//listen for changes
// $(window).resize(resizeAce('#editor'));

// When page is ready
// $(function() {
  // compute();
  // resizeAce('#editor')
// });

var input_text;


editor.on("paste", function() {
    input_text = undefined;
});


editor.on("change", function() {
    if (input_text === undefined){
        findRessources();
    }
});


function findRessources(text){
    if (text === undefined){
        text = editor.getSession().getValue();
    }
    var ressource_names = [];
    var lines = text.split('\n');
    for(var i = 0;i < lines.length; i++){
        ressource_name = lines[i].match(regexRessource);
        if (ressource_name != null){
            if (ressource_name.length > 0 & ressource_names.indexOf(ressource_name[1]) == -1){
                ressource_names.push(ressource_name[1]);
            }
        }
    }

    htmlContent = "";
    for (let ress of ressource_names) {
        htmlContent += '<li><a class="dropdown-item" href="#" onclick="filterByRessource(\'' + ress + '\')">' + ress + '</a></li>';
    }
    $("#ressource-items").html(htmlContent);
}


editor.getSession().selection.on('changeSelection', function() {
    // Time calculation
    selectionRange = editor.getSelectionRange();
    startLine = editor.session.getLine(selectionRange.start.row);
    endLine = editor.session.getLine(selectionRange.end.row);
    start = regex.exec(startLine);
    end = regex.exec(endLine);

    if (start == null | end == null){
        return;
    }
    delta = moment(end, datePattern) - moment(start, datePattern);
    if (delta === undefined){
        return;
    }
    $("#timer").html(end + " - " + start + " = " + delta + " ms");
});


function filterLevel(){
    var filtered_text = "";
    var logLevels = [];
    $.each($("input[name='log-level']:checked"), function(){
        logLevels = logLevels.concat($(this).val().split(";"));
    });

    if (input_text === undefined){
        input_text = editor.getValue();
    }
    var lines = input_text.split('\n');
    for(var i = 0;i < lines.length; i++){
        for (let logLevel of logLevels) {
              if (lines[i].includes(logLevel) ){
                  filtered_text += lines[i] + '\n';
                  break;
              }
        }
    }
    editor.setValue(filtered_text, -1);
};


function filterByRessource(ressource_name){
    var filtered_text = "";
    if (input_text === undefined){
        input_text = editor.getValue();
    }
    var lines = input_text.split('\n');
    for(var i = 0;i < lines.length; i++){
          if (lines[i].includes(ressource_name) ){
              filtered_text += lines[i] + '\n';
          }
    }
    editor.setValue(filtered_text, -1);
};


function clean() {
  var content = editor.getValue();

  // Useful tool for Regex -> https://regex101.com/
  content = content.replace(/\[acteur:\]\s/g, "");
  content = content.replace(/\[distribCanalID:\]\s/g, "");
  content = content.replace(/\[userTypeCASA:\]\s/g, "");
  content = content.replace(/\[consommateur::\]\s/g, "");
  content = content.replace(/\[versionConsommateur:\S*\]\s/g, "");
  content = content.replace(/\[consommateurOrigine::\]\s/g, "");
  content = content.replace(/\[::\]\s/g, "");
  content = content.replace(/\[idPart:\]\s/g, "");
  content = content.replace(/\[bankNetwork:\]\s/g, "");
  content = content.replace(/\[\]\s/g, "");
  content = content.replace(/\[CR:[0-9]*\]\s/g, "");

  // Correlation id
  content = content.replace(/\[87800\S*\]\s/g, "");
  content = content.replace(/\[verbeHttp\S*\]\s/g, "");
  // content = content.replace(/\[Ressource\S*\]\s/g, "");
  content = content.replace(/\[consommateurOrigine\S*\]\s/g, "");
  content = content.replace(/\[consommateur\S*\]\s/g, "");
  // content = content.replace(/\[MOSTCODE\S*\]\s/g, "");

  editor.setValue(content, -1)
  // copyToClipboard(content)
};

function copyToClipboard(str) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(str).select();
  document.execCommand("copy");
  $temp.remove();
}
