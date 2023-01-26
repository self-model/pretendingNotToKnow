jsPsych.plugins["Hangman"] = (function() {

	var plugin = {};

	plugin.info = {
		name: 'Hangman',

		parameters: {

			word: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: "Word",
				default: "ZEBRA",
				description: "The target word"
			},

			cheat: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name:'cheat',
				default: true,
				description: 'When true, participants see the position of the ships.'
			},

			end_screen_time: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name:'end screen time',
				default: 2000,
				description: 'For how many milliseconds is the end screen presented?'
			},

		 text: {
			 type: jsPsych.plugins.parameterType.STRING,
			 pretty_name:'text',
			 default:
`Use your keyboard to reveal the letter with as few clicks as possible.`,
			 description: 'Text to display on top of grid.'
		 },

		 category: {
			 type: jsPsych.plugins.parameterType.STRING,
			pretty_name:'category',
			default: `an animal`,
			description: 'Category of word (as hint)'
		},

		 draw_attention_to_instructions_time: {
				 type: jsPsych.plugins.parameterType.INT,
				 pretty_name: 'draw attention to instructions time',
				 default: 0,
				 description: 'For how many milliseconds is will the instructions be flashing?'
		 },

		 asked: {
 				type: jsPsych.plugins.parameterType.STRING,
 				pretty_name: "Already asked_letters",
 				default: [],
 				description: "For half games. List of letters that are already revealed"
		 },

		 draw_attention_to_instructions_time: {
				 type: jsPsych.plugins.parameterType.INT,
				 pretty_name: 'draw attention to instructions time',
				 default: 0,
				 description: 'For how many milliseconds is will the instructions be flashing?'
		 },
		}
	}

	plugin.trial = function(display_element, trial) {

		trial.word = trial.word.toUpperCase();

		display_element.innerHTML = '';

		//open a p5 sketch
		let sketch = function(p) {

		const du = p.min([window.innerWidth, window.innerHeight, 500])*7/10 //drawing unit
		const left_margin = p.round((window.innerWidth-du)/2);
		const top_margin = p.round((window.innerHeight-du)/3);
		const square_size = Math.floor(du/7);
		const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
		const letter_size = Math.floor(du/10);
		const postclick_time=1000; //ms


		window.last_click_time = p.millis()

		function grid_coordinates_to_screen_coordinates(i) {
			x=(window.innerWidth-square_size*trial.word.length)/2+i*square_size+Math.round(square_size/2);
			return(x)
		}

		function letter_to_screen_coordinates(letter) {
			i = alphabet.indexOf(letter);
			row = p.floor(i/9);
			column = i%9;
			x=window.innerWidth/2+column*letter_size*1.2+Math.round(letter_size*1.2/2)-letter_size*4.5*1.2;
			y=window.innerHeight*5/12 + row*letter_size*1.5;
			return([x,y])
		};

		function pad(num, size) {
		    num = num.toString();
		    while (num.length < size) num = "0" + num;
		    return num;
		}

		class LetterBox {
		  constructor(letter, size, serial_position, position, revealed, pretend) {
		    this.letter = letter;
		    this.size =  size;
		    this.position = position;
				this.revealed = revealed;
				this.reveal_time = -Infinity
				this.serial_position = serial_position;
				this.pretend = pretend
		  }
		  plot(p){
				if (this.letter != ' ') {
					p.stroke(127,182,177);
					p.strokeWeight(1)
					p.square(this.position,window.innerHeight/4,this.size);
					if (this.revealed | this.pretend) {
						p.push()
						p.fill(this.revealed? 0: p.color('hsl(160, 100%, 50%)'))
						p.noStroke()
						p.textSize(this.size/2);
						p.textStyle(this.revealed? p.BOLD: p.NORMAL)
						p.text(this.letter,this.position,window.innerHeight/4,)
						p.pop()
					}
		  	}
			}

			updateStatus(clicked){
				if (!this.revealed & clicked==this.letter) {
					this.revealed = true;
					this.reveal_time = p.millis()
					return 1
				} else {
					return 0
				}
			}
		};

		class AlphabetLetter {
			constructor(letter,size, position, asked, hit) {
				this.letter = letter;
				this.size = size;
				this.position = position;
				this.asked = asked;
				this.hit = hit;
			}

		}

		class Game {
			constructor(word, asked, size, pretend) {

				this.word = word;
				this.wordLength = word.length;
				this.asked = asked;
				this.size = size;
				this.pretend = pretend;
				this.wordState = [];
				this.points = 15;
				this.presented_points = 15;
				this.started_point_transition = p.millis();
				this.won = false;
				this.winning_time = undefined;
				this.click_log = {letter:[''],t:[0],hit:[undefined],asked:[this.asked.join('')], word_state: [this.printWordState()]};
				this.letter_click_times = Object.assign({}, ...alphabet.map((x) => ({[x]: -Infinity})));
				this.hover_log = {letter:[],t:[],hit:[undefined],x:[], y:[]}
				this.last_click_time = p.millis()
				this.num_clicks = 0;

				for (i=0; i<this.wordLength; i++) {
					this.wordState.push(new LetterBox(
							this.word[i],
							this.size,
							i,
							grid_coordinates_to_screen_coordinates(i),
							this.asked.includes(this.word[i]),
							this.pretend
						))
					}

				this.unknown_positions = this.wordState.filter(x => !x.revealed).length

				};

				printWordState() {
					let wordstring = '';
					for (i=0; i<this.wordLength; i++) {
						if (this.asked.includes(this.word[i]) | this.word[i]==' ') {
							wordstring += this.word[i]
						} else {
							wordstring += '_'
						}
					}
					return wordstring

				}


				updateWordState(clicked) {
					let hits = 0
					for (i=0; i<this.wordLength; i++) {
						hits += this.wordState[i].updateStatus(clicked)
					}
					return hits;
				}

				update(letter) {
						console.log(letter);
						if (!this.asked.includes(letter)) {
							this.asked.push(letter);
							this.letter_click_times[letter] = p.millis()
							let hits = this.updateWordState(letter)
							if (hits==0) {
								this.points -=1;
								this.started_point_transition = p.millis()
							} else if (!this.printWordState().includes('_')) {
								this.won = true;
								this.winning_time = p.millis();
							};
							window.last_click_time = p.millis()
							this.click_log.letter.push(letter);
							this.click_log.t.push(p.millis());
							this.click_log.hit.push(hits);
							this.click_log.asked.push(this.asked.join(''));
							this.click_log.word_state.push(this.printWordState());
							console.log(this.click_log)
						}
				};

				plotWord(p) {
					for (var i=0; i<this.wordLength; i++) {
						this.wordState[i].plot(p)
					}
				};

				plotInstructions(p) {

					if (this.pretend) {
						p.push()
						p.rectMode(p.CORNERS)
						p.textSize(15)
						p.textAlign(p.CENTER, p.CENTER)
						p.fill(0);
						p.strokeWeight(0)
						p.textFont('Quicksand');
						p.text(`Remember, your real task is to play like you don't know what the word is`, left_margin,top_margin+du+50,du);

						if (p.millis()<trial.draw_attention_to_instructions_time) {
							p.push()
							p.textSize(50);
							var red_value = 128+p.sin(p.millis()/200)*127
							p.fill([255,255-red_value,255-red_value]);
							p.text('!',left_margin-20,top_margin+du+50,20)
							p.pop()
						}

						p.pop()



				}

				}

				plotCategory(p) {

						p.push()
						p.rectMode(p.CORNERS)
						p.textSize(30)
						p.textAlign(p.CENTER, p.CENTER)
						p.fill(0);
						p.strokeWeight(0)
						p.textFont('Quicksand');
						p.text(trial.category, left_margin,top_margin-50,du);
						p.pop()

				}

				plotScore(p) {

					let change_time = 500; //ms
					let first_digit = pad(this.presented_points,2)[0];
					let second_digit = pad(this.presented_points,2)[1];
					let first_next_digit = pad(this.presented_points-1,2)[0];
					let second_next_digit = pad(this.presented_points-1,2)[1];

					p.push()
					p.fill(this.won? p.color('#7DD87D') : 0)
					p.noStroke()
					p.textSize(this.size/2);
					p.textFont('monospace	');
					p.textAlign(p.RIGHT, p.CENTER);
					p.text(`Your points:   `, left_margin-this.size*2, window.innerHeight/2);

					if (pad(this.points,2)[0] == pad(this.presented_points,2)[0]) {
						p.text(`${first_digit} `, left_margin-this.size*2, window.innerHeight/2)
					} else {
						let time_since_transition = p.millis()-this.started_point_transition;
						let position_factor = (time_since_transition**3)/(change_time**3);
						p.text(`${first_digit} `, left_margin-this.size*2, window.innerHeight/2-position_factor*this.size/2)
						p.text(`${first_next_digit} `, left_margin-this.size*2, window.innerHeight/2+this.size/2-position_factor*this.size/2)
					};


					if (this.points == this.presented_points) {
						p.text(`${second_digit}`, left_margin-this.size*2, window.innerHeight/2)
					} else if (p.millis()- this.started_point_transition<change_time){
						let time_since_transition = p.millis()-this.started_point_transition;
						let position_factor = (time_since_transition**3)/(change_time**3);

						p.text(`${second_digit}`, left_margin-this.size*2, window.innerHeight/2-position_factor*this.size/2)
						p.text(`${second_next_digit}`, left_margin-this.size*2, window.innerHeight/2+this.size/2-position_factor*this.size/2)
					} else {
						p.text(`${second_next_digit}`, left_margin-this.size*2, window.innerHeight/2)
						this.started_point_transition = p.millis();
						this.presented_points-=1;
					}
					p.pop()

					p.push()
					p.fill(255);
					p.noStroke();
					p.rectMode(p.CORNERS)
					p.rect(left_margin-this.size*4,window.innerHeight/2+this.size,left_margin-this.size,window.innerHeight/2+this.size/4)
					p.rect(left_margin-this.size*4,window.innerHeight/2-this.size,left_margin-this.size,window.innerHeight/2-this.size/4)

					p.pop()
				};

				plotAlphabet(p) {
					for (var i=0; i<alphabet.length; i++) {
						let letter = alphabet[i];
						let xy = letter_to_screen_coordinates(letter)
						var distance_to_mouse = Math.sqrt((xy[0]-p.mouseX)**2+(xy[1]-p.mouseY)**2);
						p.push()
						p.fill(0)
						p.noStroke()
						if (distance_to_mouse < letter_size/2 & !this.asked.includes(letter)) {
							p.textStyle(p.BOLD)
						}
						if (p.millis()-this.letter_click_times[letter]<postclick_time) {
							var time_left_ratio = (postclick_time+this.letter_click_times[letter]-p.millis())/postclick_time;
							p.fill(p.color(255*time_left_ratio**0.5,0,0))
						}
						p.textSize(this.size/2);
						p.text(letter, xy[0] , xy[1])
						p.pop()

						p.push()
						p.stroke(0);
						p.noFill()
						p.strokeWeight(2)
						if (this.asked.includes(letter) & !this.word.includes(letter)) {
							p.line(
								xy[0]-this.size/4,
								xy[1]-this.size/4,
								xy[0]+this.size/4,
								xy[1]+this.size/4,
							)
						} else if (this.asked.includes(letter) & this.word.includes(letter)) {
							p.circle(xy[0],xy[1],this.size*0.6)
						}
						p.pop()
					}
				}
		}

		thisGame = new Game(trial.word, trial.asked, square_size, trial.cheat);
		window.thisGame=thisGame

		//sketch setup
		p.setup = function() {

			p.createCanvas(p.windowWidth, p.windowHeight);
			p.strokeWeight(0);
			p.frameRate(trial.frame_rate);
			p.rectMode(p.CENTER);
			p.textAlign(p.CENTER,p.CENTER)
			console.log(trial.category)
		}

		//organize everything in one sequence
		p.draw = function() {

			p.background(255);

			if (!thisGame.won | p.millis()-thisGame.winning_time<trial.end_screen_time) {

				thisGame.plotWord(p)

				thisGame.plotScore(p)

				thisGame.plotAlphabet(p)

				thisGame.plotInstructions(p)

				thisGame.plotCategory(p)


				// if (trial.cheat) {
				// 	// Description
				// 	p.push()
				// 	p.textSize(this.size/2);
				// 	p.textFont('monospace	');
				// 	p.textAlign(p.RIGHT, p.CENTER);
				// 	p.text(`Remember:   `, left_margin-this.size*2, window.innerHeight/2);
				// 	p.pop()
				//
				// 	if (p.millis() <2000) {
				// 		p.push()
				// 		p.textSize(50);
				// 		var red_value = 128+p.sin(p.millis()/200)*127
				// 		p.fill([255,255-red_value,255-red_value]);
				// 		p.text('!',left_margin-20,top_margin+du+40,20)
				// 		p.pop()
				// 	}
				// }


			} else {
				p.remove()
				// data saving
				var trial_data = {
					word: trial.word,
			    click_log: thisGame.click_log,
					hover_log: thisGame.hover_log,
					final_keyboard_state: thisGame.asked,
					num_clicks: thisGame.click_log.t.length-1,
					points: thisGame.points,
					cheat: trial.cheat
				};
				console.log(trial_data)
				// end trial
				jsPsych.finishTrial(trial_data);

			}

			var xy = [p.mouseX, p.mouseY];
			var hovered_letter = '?'
			for (var i=0; i<alphabet.length; i++) {
				let letter = alphabet[i];
				let xy = letter_to_screen_coordinates(letter)
				var distance_to_mouse = Math.sqrt((xy[0]-p.mouseX)**2+(xy[1]-p.mouseY)**2);
				if (distance_to_mouse < letter_size/2) {
					hovered_letter = alphabet[i];
				}
			}
			thisGame.hover_log.letter.push(hovered_letter)
			thisGame.hover_log.t.push(p.round(p.millis()));
			thisGame.hover_log.x.push(xy[0]);
			thisGame.hover_log.y.push(xy[1]);
		}

		p.keyPressed = function() {
			if (p.key.toUpperCase()=='X') {
				var letter = p.key.toUpperCase();
				p.remove()
				// data saving
				var trial_data = {
					word: trial.word,
					click_log: thisGame.click_log,
					hover_log: thisGame.hover_log,
					final_keyboard_state: thisGame.asked,
					num_clicks: thisGame.click_log.t.length-1,
					points: thisGame.points,
					cheat: trial.cheat
				};
				console.log(trial_data)
				// end trial
				jsPsych.finishTrial(trial_data);
			}
		}

		p.mouseClicked = function() {
			for (var i=0; i<alphabet.length; i++) {
				let letter = alphabet[i];
				let xy = letter_to_screen_coordinates(letter)
				var distance_to_mouse = Math.sqrt((xy[0]-p.mouseX)**2+(xy[1]-p.mouseY)**2);
				if (distance_to_mouse < letter_size/2) {
					thisGame.update(letter.toUpperCase())
				}
			}
		}



		};

		// start sketch!
		let myp5 = new p5(sketch);

}



//Return the plugin object which contains the trial
return plugin;
})();
