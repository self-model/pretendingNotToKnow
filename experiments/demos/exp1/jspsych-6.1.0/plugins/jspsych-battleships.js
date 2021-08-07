jsPsych.plugins["Battleships"] = (function() {

	var plugin = {};

	plugin.info = {
		name: 'Battleships',

		parameters: {
			grid: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: "Grid",
				default: [
					['J','J','0','0','0','0','0','0','0','0'],
					['0','0','0','F','F','F','0','0','C','0'],
					['0','0','0','0','0','0','0','0','C','0'],
					['B','B','B','B','0','0','I','0','C','0'],
					['0','0','0','0','A','0','I','0','C','0'],
					['G','G','0','0','A','0','0','0','0','0'],
					['0','0','0','0','A','0','0','0','H','0'],
					['0','D','0','0','A','0','0','0','H','0'],
					['0','D','0','0','A','0','0','0','0','0'],
					['0','D','0','0','0','0','0','E','E','E'],
				],
				description: "Grid"
			},
			cheat: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name:'cheat',
				default: false,
				description: 'Cheat'
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
		const square_size = Math.floor(du/trial.grid.length);
		const colors = {
			'sea':p.color(100,155,200),
			'unknown':p.color(255,230,166),
			'ship':p.color(200,50,55)
		}
		var grid_state = trial.grid.map(([...rest]) => rest.map(x => 'unknown'));
		var click_log = {i:[],j:[],t:[],hit:[]};
		const num_ones = trial.grid.flat().reduce((a,b)=>a+b,0);
		var ships_hit = 0;;

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

			// if (ships_hit<num_ones) {

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

				var text = `
You clicked on ${click_log.t.length} squares.
Overall you need to drown one 5-square carrier, two 4-square battleships,
three 3-square submarines, and four 2-square patrol boats.`
				p.push()
				p.textAlign(p.Left, p.TOP)
				p.textSize(15)
				p.fill(0);
				p.strokeWeight(0)
				p.text(text,left_margin,top_margin-70)
				p.pop()
				// } else { //trial ended
				// 	p.remove()
				// 	// data saving
				// 	var trial_data = {
				// 		grid: trial.grid,
				//    click_log: click_log
				// 	};
				// 	console.log(trial_data)
				// 	// end trial
				// 	jsPsych.finishTrial(trial_data);
				// }
			}

			p.mouseClicked = function() {
				ij = screen_coordinates_to_grid_coordinates(p.mouseX,p.mouseY)
				// make sure click is on the board
				if (ij.i>=0 & ij.i<trial.grid.length & ij.j>=0 & ij.j<trial.grid.length) {
					if (trial.grid[ij.i][ij.j]=='0') {
						grid_state[ij.i][ij.j]='sea'
					} else {
						grid_state[ij.i][ij.j]='ship';
						ships_hit+=1
					}

					click_log.i.push(ij.i);
					click_log.j.push(ij.j);
					click_log.t.push(p.millis())
					click_log.hit.push((trial.grid[ij.i][ij.j]))
				}
			}

		};

		// start sketch!
		let myp5 = new p5(sketch);

}

//Return the plugin object which contains the trial
return plugin;
})();
