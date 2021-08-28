jsPsych.plugins["Battleships_replay_2players"] = (function() {

	var plugin = {};

	plugin.info = {
		name: 'Battleships_replay_2players',

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
`To win, you need to sink one 3-square submarine
and two 2-square patrol boats.`,
			 description: 'Text to display on top of grid.'
		 },
		 description: {
			 type: jsPsych.plugins.parameterType.STRING,
			 pretty_name:'description',
			 default: {right: `Replaying player 2's game:`, left: `Replaying Player 1's game`},
			 description: 'Description'
		 },
		 click_log: {
			 type: jsPsych.plugins.parameterType.OBJECT,
			 pretty_name:'click_log',
			 default: {'right':{"i":[1,2,3,1,1,2,2,3,2,3,3,4,4,4],
			 "j":[0,0,0,1,2,3,4,4,2,3,2,3,1,0],
			 "t":[3559,3906,4284,5152,6111,7086,7696,7993,8532,9145,9580,10129,11173.5,11552],
			 "hit":["A","0","0","A","A","0","0","0","0","B","0","B","C","C"]},
			 "left":{"i":[1,2,3,1,1,2,2,3,2,3,3,4,4,4],
			 "j":[0,0,0,1,2,3,4,4,2,3,2,3,1,0],
			 "t":[3559,3906,4284,5152,6111,7086,7696,7993,8532,9145,9580,10129,11173.5,11552],
			 "hit":["A","0","0","A","A","0","0","0","0","B","0","B","C","C"]}},
			 description: 'Click log'
		 }
		}
	}

	plugin.trial = function(display_element, trial) {

		display_element.innerHTML = '';

		//open a p5 sketch
		let sketch = function(p) {

		const du = p.min([window.innerWidth, window.innerHeight])*2/5 //drawing unit
		const left_margin = p.round((window.innerWidth-window.innerHeight)/2);
		const top_margin = p.round((window.innerHeight-du)*2/5);
		const square_size = Math.floor(du/trial.grid.length);
		const colors = {
			'sea':p.color(100,155,200),
			'unknown':p.color(255,230,166),
			'ship':p.color(200,50,55)
		}
		var grid_state = trial.grid.map(([...rest]) => rest.map(x => 'unknown'));
		const num_nonzero = trial.grid.flat().reduce((a,b)=>a+(b=='0'? 0 : 1),0);
		var hits = 0;;
		var last_click_time = p.millis()
		var click_number = 0;
		var click_log = {i:[],j:[],t:[],hit:[]};
		var playing_side = 'waiting_for_input';
		var starting_time = p.millis();
		var played_left = false;
		var played_right = false;
		trial.click_log.right.t.push(Infinity);
		trial.click_log.left.t.push(Infinity);

		function grid_coordinates_to_screen_coordinates(i,j,which_grid) {

			if (which_grid=='left') {
				x=left_margin+j*square_size+Math.round(square_size/2);
				y=top_margin+i*square_size+Math.round(square_size/2);
			} else if (which_grid=='right') {
				x=left_margin+du*1.5+j*square_size+Math.round(square_size/2);
				y=top_margin+i*square_size+Math.round(square_size/2);
			} else if (which_grid=='center') {
				x=p.round(window.innerWidth/2-du/4)+j*square_size/2+Math.round(square_size/4);
				y=i*square_size/2+Math.round(square_size/4);
			}
			return({x:x,y:y})
		}

		// function screen_coordinates_to_grid_coordinates(x,y) {
		// 	i = Math.floor((y-top_margin)/square_size);
		// 	j = Math.floor((x-left_margin)/square_size);
		// 	return({i:i,j:j})
		// }

		function msToTime(duration) {
		  var milliseconds = Math.floor((duration % 1000) / 10),
		    seconds = Math.floor((duration / 1000) % 60),
		    minutes = Math.floor((duration / (1000 * 60)) % 60),
		    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

		  hours = (hours < 10) ? "0" + hours : hours;
		  minutes = (minutes < 10) ? "0" + minutes : minutes;
		  seconds = (seconds < 10) ? "0" + seconds : seconds;
			milliseconds = (milliseconds<10)? "0"+milliseconds:milliseconds;
		  return hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
		}

		p.preload = function() {
			img = p.loadImage('https://matanmazor.github.io/ignorance/experiments/demos/Battleships/assets/hit.png');
		}

		//sketch setup
		p.setup = function() {

			p.createCanvas(p.windowWidth, p.windowHeight);
			p.strokeWeight(0);
			p.frameRate(trial.frame_rate);
			p.rectMode(p.CENTER)
			p.imageMode(p.CENTER)
		}

		//organize everything in one sequence
		p.draw = function() {

			p.background(255);

			// Display true positions
			for (var i=0; i<trial.grid.length; i++) {
				for (var j=0; j<trial.grid.length; j++) {
					xy = grid_coordinates_to_screen_coordinates(i,j, 'center');
					p.fill(trial.grid[i][j]=='0'? colors['sea'] : colors['ship']);
					p.stroke(255);
					p.strokeWeight(1)
					p.square(xy.x,xy.y,square_size/2);
				}
			}

				// emulate clicks
				if (playing_side !='waiting_for_input') {
					if (p.millis()-starting_time>=trial.click_log[playing_side].t[click_number]) {
					ij = {
						i:trial.click_log[playing_side].i[click_number],
						j:trial.click_log[playing_side].j[click_number]};
					if (trial.grid[ij.i][ij.j]=='0') {
						grid_state[ij.i][ij.j]='sea'
					} else {
						grid_state[ij.i][ij.j]='ship';
						hits+= 1;
					}
					last_click_time = p.millis();
					click_log.i.push(ij.i);
					click_log.j.push(ij.j);
					click_log.t.push(p.millis())
					click_log.hit.push((trial.grid[ij.i][ij.j]))
					click_number = click_number+1
					}
				}

				// Description
				if (playing_side != 'waiting_for_input') {
					p.push()
					p.textFont("monospace", 15)
					text=trial.description[playing_side]+' '+msToTime(p.millis()-starting_time);
					p.textAlign(p.Left, p.TOP)
					p.fill(100);
					p.strokeWeight(0)
					p.text(text,playing_side=='left'? left_margin : left_margin + du*1.5 ,top_margin+du+20)
					p.pop()
				}

				for (var i=0; i<trial.grid.length; i++) {
					for (var j=0; j<trial.grid.length; j++) {

						xy = grid_coordinates_to_screen_coordinates(i,j, 'left');
						p.fill(playing_side=='left'? colors[grid_state[i][j]] : colors['unknown']);
						p.stroke(127,182,177);
						p.strokeWeight(1)
						p.square(xy.x,xy.y,square_size);
						if (playing_side == 'left' & grid_state[i][j]=='ship') {
							mark_hit(xy.x,xy.y,square_size/2)
						}

						xy = grid_coordinates_to_screen_coordinates(i,j, 'right');
						p.fill(playing_side=='right'? colors[grid_state[i][j]] : colors['unknown']);
						p.stroke(127,182,177);
						p.strokeWeight(1)
						p.square(xy.x,xy.y,square_size);
						if (playing_side == 'right' & grid_state[i][j]=='ship') {
							mark_hit(xy.x,xy.y,square_size/2)
						}

					}
				}

				if (hits<num_nonzero) {
// 					var text =
// `You clicked on ${click_log.t.length} squares.
// ${trial.text}`
// 					p.textSize(15)
// 					p.push()
// 					p.textAlign(p.Left, p.TOP)
// 					p.fill(0);
// 					p.strokeWeight(0)
// 					// p.text(text,left_margin,top_margin-70)
// 					p.pop()
} else if (p.millis() - last_click_time < trial.end_screen_time){
				for (var i=0; i<trial.grid.length; i++) {
					for (var j=0; j<trial.grid.length; j++) {
						if (trial.grid[i][j]!='0') {
							xy = grid_coordinates_to_screen_coordinates(i,j, playing_side);
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
			} else if (playing_side!='waiting_for_input'){
				for (var i=0; i<trial.grid.length; i++) {
					for (var j=0; j<trial.grid.length; j++) {
						if (trial.grid[i][j]!='0') {
							xy = grid_coordinates_to_screen_coordinates(i,j, playing_side);
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
				if (playing_side=='right') {
					played_right = true;
				} else if (playing_side=='left') {
					played_left = true;
				}
				playing_side='waiting_for_input';
			}

								var text =
`Press 1 to see the game of Player 1. Press 2 to see the game of Player 2.
${(played_right & played_left)? `Press Enter when you are ready to decide who played fair and who knew where the ships were hiding.` : ''}`
								p.textSize(15)
								p.push()
								p.textAlign(p.CENTER, p.TOP)
								p.fill(0);
								p.strokeWeight(0)
								p.text(text,window.innerWidth/2,top_margin+du+50)
								p.pop()

}

mark_hit = function(x,y,size) {
	p.image(img, x, y, size, size);
}

p.keyPressed = function() {
	if (p.keyCode==49 & playing_side=='waiting_for_input') {
		playing_side='left';
		starting_time = p.millis();
		hits = 0;
		last_click_time = p.millis()
		click_number = 0;
		click_log = {i:[],j:[],t:[],hit:[]};
		grid_state = trial.grid.map(([...rest]) => rest.map(x => 'unknown'));
	} else if (p.keyCode==50 & playing_side=='waiting_for_input') {
		playing_side='right';
		starting_time = p.millis();
		hits = 0;;
		last_click_time = p.millis()
		click_number = 0;
		click_log = {i:[],j:[],t:[],hit:[]};
		grid_state = trial.grid.map(([...rest]) => rest.map(x => 'unknown'));
	} else if (p.keyCode==13 & played_left & played_right) {
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
		};

		// start sketch!
		let myp5 = new p5(sketch);

}

//Return the plugin object which contains the trial
return plugin;
})();
