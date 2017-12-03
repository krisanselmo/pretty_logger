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

const regex = /[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}/;
const datePattern = "HH:mm:ss,SSS";

// On manual edit change : clear this variable
editor.on("paste", function() {
    input_text = undefined;
});

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
        logLevels.push($(this).val());
    });
    // console.log(logLevels)

    if (input_text === undefined){
        input_text = editor.getValue();
    }
    var lines = input_text.split('\n');
    for(var i = 0;i < lines.length; i++){
        for (let logLevel of logLevels) {
            // console.log(logLevel)
              if (lines[i].includes(logLevel) ){
                  filtered_text += lines[i] + '\n';
                  break;
              }
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
