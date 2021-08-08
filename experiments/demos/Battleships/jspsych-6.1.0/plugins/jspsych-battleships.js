jsPsych.plugins["Battleships"] = (function() {

	var plugin = {};

	plugin.info = {
		name: 'Battleships',

		parameters: {
			grid: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: "Grid",
				default: [
					['0','0','0','0','0'],
					['A','A','A','0','0'],
					['0','0','0','0','0'],
					['0','0','0','B','0'],
					['C','C','0','B','0']
				],
				description: "Grid. 0 means water, everything else is a ship."
			},
			cheat: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name:'cheat',
				default: false,
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
`Overall you need to sink one 3-square submarine
and two 2-square patrol boats.`,
			 description: 'Text to display on top of grid.'
		 }
		}
	}

	plugin.trial = function(display_element, trial) {

		display_element.innerHTML = '';

		//open a p5 sketch
		let sketch = function(p) {

		const du = p.min([window.innerWidth, window.innerHeight, 500])*7/10 //drawing unit
		const left_margin = p.round((window.innerWidth-du)/2);
		const top_margin = p.round((window.innerHeight-du)/3);
		const square_size = Math.floor(du/trial.grid.length);
		const colors = {
			'sea':p.color(100,155,200),
			'unknown':p.color(255,230,166),
			'ship':p.color(200,50,55)
		}
		var grid_state = trial.grid.map(([...rest]) => rest.map(x => 'unknown'));
		var click_log = {i:[],j:[],t:[],hit:[]};
		const num_nonzero = trial.grid.flat().reduce((a,b)=>a+(b=='0'? 0 : 1),0);
		var hits = 0;;
		var last_click_time = p.millis()


		function grid_coordinates_to_screen_coordinates(i,j) {
			x=left_margin+j*square_size+Math.round(square_size/2);
			y=top_margin+i*square_size+Math.round(square_size/2);
			return({x:x,y:y})
		}

		function screen_coordinates_to_grid_coordinates(x,y) {
			i = Math.floor((y-top_margin)/square_size);
			j = Math.floor((x-left_margin)/square_size);
			return({i:i,j:j})
		}

		//sketch setup
		p.setup = function() {

			p.createCanvas(p.windowWidth, p.windowHeight);
			p.strokeWeight(0);
			p.frameRate(trial.frame_rate);
			p.rectMode(p.CENTER)
		}

		//organize everything in one sequence
		p.draw = function() {

			p.background(255);

			if (hits<num_nonzero | p.millis()-last_click_time<trial.end_screen_time) {

				for (var i=0; i<trial.grid.length; i++) {
					for (var j=0; j<trial.grid.length; j++) {
						xy = grid_coordinates_to_screen_coordinates(i,j);
						p.fill(colors[grid_state[i][j]]);
						p.stroke(127,182,177);
						p.strokeWeight(1)
						p.square(xy.x,xy.y,square_size);
					}
				}

				if (trial.cheat) {
					//mark ships with a cross
					for (var i=0; i<trial.grid.length; i++) {
						for (var j=0; j<trial.grid.length; j++) {
							if (trial.grid[i][j]!='0') {
								xy = grid_coordinates_to_screen_coordinates(i,j);
								p.line(xy.x-square_size/2,xy.y-square_size/2,
									xy.x+square_size/2,xy.y+square_size/2);
								p.line(xy.x+square_size/2,xy.y-square_size/2,
										xy.x-square_size/2,xy.y+square_size/2)
							}
						}
					}
				}

				if (hits<num_nonzero) {
					var text =
	`You clicked on ${click_log.t.length} squares.
${trial.text}`
					p.textSize(15)
					p.push()
					p.textAlign(p.Left, p.TOP)
					p.fill(0);
					p.strokeWeight(0)
					p.text(text,left_margin,top_margin-70)
					p.pop()
			} else {


				for (var i=0; i<trial.grid.length; i++) {
					for (var j=0; j<trial.grid.length; j++) {
						if (trial.grid[i][j]!='0') {
							xy = grid_coordinates_to_screen_coordinates(i,j);
							water_height = square_size*
								(p.millis()-last_click_time)/trial.end_screen_time;
								p.push()
								p.rectMode(p.CORNERS)
								p.fill(colors['sea'])
								p.rect(xy.x-square_size/2,
									xy.y+square_size/2-water_height,
									xy.x+square_size/2,
									xy.y+square_size/2);
								p.pop()
						}
					}
				}
				text = 'All ships are down!'
				p.textSize(25);
				p.push()
				p.textAlign(p.CENTER, p.CENTER)
				p.fill(0);
				p.strokeWeight(0)
				p.text(text,window.innerWidth/2,window.innerHeight/2)
				p.pop()
			}
			}

		else { //trial ended
					p.remove()
					// data saving
					var trial_data = {
						grid: trial.grid,
				    click_log: click_log
					};
					console.log(trial_data)
					// end trial
					jsPsych.finishTrial(trial_data);
				}
			}

			p.mouseClicked = function() {
				ij = screen_coordinates_to_grid_coordinates(p.mouseX,p.mouseY)
				// make sure click is on the board
				if (ij.i>=0 &
					ij.i<trial.grid.length &
					ij.j>=0 &
					ij.j<trial.grid.length &
					hits<num_nonzero &
					grid_state[ij.i][ij.j]=='unknown'
				) {
					if (trial.grid[ij.i][ij.j]=='0') {
						grid_state[ij.i][ij.j]='sea'
					} else {
						grid_state[ij.i][ij.j]='ship';
						hits+= 1;
					}

					click_log.i.push(ij.i);
					click_log.j.push(ij.j);
					click_log.t.push(p.millis())
					click_log.hit.push((trial.grid[ij.i][ij.j]))
					last_click_time = p.millis();

				}
			}

		};

		// start sketch!
		let myp5 = new p5(sketch);

}

//Return the plugin object which contains the trial
return plugin;
})();
