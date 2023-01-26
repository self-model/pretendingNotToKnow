/**
 * jspsych-type-this
 * a jspsych plugin to get a subject to type a word, for the hangman games
 * based on the jspsych survey text plugin. Since I don't fully understand
 * JQuery, I'm sure there are many redundancies and inefficient code lines here.
 * It's good enough for my purpose though!
 *
 * Matan Mazor
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['type-this'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'type-this',
    description: '',
    parameters: {
          word: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Word',
            default: 'banana',
            description: 'The word the subject is asked to type'
          }
        }
      }

  plugin.trial = function(display_element, trial) {

    var responses = [];
    var html = `<div id="jspsych-survey-text-preamble" class="jspsych-survey-text-preamble"><p>The next word is ${trial.word.toUpperCase()}, but your task is to pretend you don't know that.</p>
      <p>Type ${trial.word.toUpperCase()} to confirm:</p></div>
      <form id="jspsych-survey-text-form">
      <div id="jspsych-survey-text-question" class="jspsych-survey-text-question" style="margin: 2em 0em;">
      <input type="text" id="input-0"  name="#jspsych-survey-text-response-0" size="${trial.word.length}" autofocus required placeholder=""></input>
      </div>
      <input type="submit" id="jspsych-survey-text-next" class="jspsych-btn jspsych-survey-text" value="pretend!"></input>
      </form>`

    display_element.innerHTML = html;

    // backup in case autofocus doesn't work
    display_element.querySelector('#input-0').focus();

    display_element.querySelector('#jspsych-survey-text-form').addEventListener('submit', function(e) {
      e.preventDefault();
      // measure response time
      var endTime = performance.now();
      var response_time = endTime - startTime;
      var val = document.querySelector('#jspsych-survey-text-question').querySelector('textarea, input').value;
      responses.push(val);

      // if the subject types in the correct word:
      if (val.toUpperCase()==trial.word.toUpperCase()) {

        // save data
        var trialdata = {
          "rt": response_time,
          "response": val,
          "responses": responses
        };

        display_element.innerHTML = '';
        new Promise(resolve => setTimeout(resolve, 500)).then(() => jsPsych.finishTrial(trialdata));

      } else {
        document.querySelector('#jspsych-survey-text-question').querySelector('textarea, input').value = ''
      }

    });

    var startTime = performance.now();
  };

  return plugin;
})();
