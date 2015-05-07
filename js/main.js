ptext = ''
function checkResults(result){
	var text = result.transcript
	if (result.confidence > 0.5 && text != ptext){
		$.ajax({
		    url: 'https://twinword-sentiment-analysis.p.mashape.com/analyze/',
		    type: 'POST',
			data : { text: text},
		    datatype: 'json',
		    success: function(data) {
				if(data.result_msg != 'success'){
					//console.log(data)
					return false
				}else{
					parseResults(data.score, data.ratio, data.type)
				}
			},
		    error: function(err) {
				// console.log(err)
			},
		    beforeSend: function(xhr) {
				xhr.setRequestHeader("X-Mashape-Authorization", "fDwPJzVFjImshWHxWgGyJ55xvUgDp1DeLYSjsnrXrEoAc6GN3B");
		    }
		});
		ptext = text
	}
}

var emostate = 0;
var previousState = 0;
var maxsad = -2;
var maxhappy = 2; 
var faces = {
	verysmily 	: ' :-D ',
	smily 		: ' :-) ',
	neutral		: ' :-| ',
	confused    : ' :-S ',
	sad 		: ' :-( ',
	verysad 	: ' :-C ',
}

function parseResults(score, confidence, category){
	emostate = emostate + score
	emotions.innerHTML = linebreak(emostate)
}

function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}

var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
}


var recognizing = false;
var ignore_onend;
var start_timestamp;

showInfo('info_start');

$(document).ready(function(){
	$('#start_button').click(function(){
	    if (recognizing) {
	      recognition.stop();
	      return;
	    }
	    final_transcript = '';
	    recognition.lang = select_dialect.value;
	    recognition.start();
	    ignore_onend = false;
	    start_img.src = 'mic-slash.gif';
	    showInfo('info_allow');
	    showButtons('none');
	    start_timestamp = event.timeStamp;
	})
})