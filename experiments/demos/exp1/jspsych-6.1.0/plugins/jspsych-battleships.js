jsPsych.plugins["Battleships"] = (function() {

	var plugin = {};

	plugin.info = {
		name: 'Battleships',

		parameters: {
			grid: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: "Grid",
				default: [[0,0,0,0,0],[0,1,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],
				description: "Grid"
			}
		}
	}

	plugin.trial = function(display_element, trial) {

		display_element.innerHTML = '';

		//open a p5 sketch
		let sketch = function(p) {

		const du = p.min([window.innerWidth, window.innerHeight], 600)*7/10 //drawing unit
		const left_margin = p.round((window.innerWidth-du)/2);
		const top_margin = p.round((window.innerHeight-du)/2);
		console.log(top_margin)
		const square_size = Math.floor(du/trial.grid.length);
		console.log(square_size)
		const colors = {
			'sea':p.color(50,55,100),
			'unknown':p.color(50),
			'ship':p.color(100,50,55)
		}
		var grid_state = trial.grid.map(([...rest]) => rest.map(x => 'unknown'));
		function grid_coordinates_to_screen_coordinates(i,j) {
			x=left_margin+i*square_size+Math.round(square_size/2);
			y=top_margin+j*square_size+Math.round(square_size/2);
			return({x:x,y:y})
		}

		function screen_coordinates_to_grid_coordinates(x,y) {
			i = Math.floor((x-left_margin)/square_size);
			j = Math.floor((y-top_margin)/square_size);
			return({i:i,j:j})
		}

		//sketch setup
		p.setup = function() {

			p.createCanvas(p.windowWidth, p.windowHeight);
			p.background(128); //gray
			p.strokeWeight(0);
			p.frameRate(trial.frame_rate);
			p.rectMode(p.CENTER)
		}



		//organize everything in one sequence
		p.draw = function() {
			// First, draw fixation cross
			// if (p.millis()<10000) {
				for (var i=0; i<trial.grid.length; i++) {
					for (var j=0; j<trial.grid.length; j++) {
						xy = grid_coordinates_to_screen_coordinates(i,j);
						window.grid_state = grid_state;
						p.fill(colors[grid_state[i][j]]);
						p.stroke(2);
						p.strokeWeight(2)
						p.square(xy.x,xy.y,square_size);
					}
				}

				// } else { //trial ended
				// 	p.remove()
				// 	// data saving
				// 	var trial_data = {
				// 		grid: trial.grid
				// 	};
				//
				// 	// end trial
				// 	jsPsych.finishTrial(trial_data);
				// }
			}

			// p.keyPressed = function() {
			// 	// it's only possible to query the key code once for each key press,
			// 	// so saving it as a variable here:
			// 	var key_code = p.keyCode
			// 	// only regard relevant key presses during the response phase
			// 	if (trial.status=='collecting response' &&
			// 			trial.choices.includes(String.fromCharCode(key_code).toLowerCase())) {
			// 		trial.response = String.fromCharCode(key_code).toLowerCase();
			// 		trial.RT = p.millis()-trial.fixation_duration;
			// 	}
			// }
			//
			p.mouseClicked = function() {
				ij = screen_coordinates_to_grid_coordinates(p.mouseX,p.mouseY)
				// make sure click is on the board
				if (ij.i>=0 & ij.i<trial.grid.length & ij.j>=0 & ij.j<trial.grid.length) {
					if (trial.grid[i][j]==0) {
						grid_state[i][j]='sea'
					} else if (trial.grid[i][j]==1) {
						grid_state[i][j]='ship'
					}
				}
			}
			//
			// // only present confidence circle after the mouse has moved
			// p.mouseMoved = function() {
			// 	if (trial.status=='collecting confidence') {
			// 		trial.present_circle = 1
			// 	}
			// }
		};

		// start sketch!
		let myp5 = new p5(sketch);

}

//Return the plugin object which contains the trial
return plugin;
})();
