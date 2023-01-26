jsPsych.plugins["Hangman_replay"] = (function() {

	var plugin = {};

	plugin.info = {
		name: 'Hangman_replay',

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
		 click_log: {
			 type: jsPsych.plugins.parameterType.OBJECT,
			 pretty_name:'click_log',
			 default: {"letter":["","A","E","T","N","M","O","I","B","Z","R"],"t":[0,1617.9000000059605,3590.1000000089407,8778.10000000894,10677.60000000894,11455.60000000894,12367.90000000596,13581.90000000596,17436.10000000894,18935.90000000596,21308.20000000298],"hit":[null,1,1,0,0,0,0,0,1,1,1],"asked":["","A","AE","AET","AETN","AETNM","AETNMO","AETNMOI","AETNMOIB","AETNMOIBZ","AETNMOIBZR"],"word_state":["_____","____A","_E__A","_E__A","_E__A","_E__A","_E__A","_E__A","_EB_A","ZEB_A","ZEBRA"]},
			 description: 'Click log'
		 },
		 hover_log:{
			 type: jsPsych.plugins.parameterType.OBJECT,
			 pretty_name:'hover_log',
			 default: {"letter":["?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","A","B","B","B","B","B","B","B","B","B","B","C","C","C","C","C","C","C","C","C","C","C","C","C","D","D","D","D","D","D","D","D","D","D","D","E","E","E","E","E","E","E","E","E","E","E","E","F","F","F","F","F","F","?","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","H","H","H","H","H","H","H","H","H","H","H","H","H","?","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","I","?","?","H","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","P","P","P","P","P","P","P","?","?","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","O","?","?","?","?","?","?","?","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","F","F","F","F","F","F","F","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","G","?","?","?","?","?","?","P","P","P","P","P","P","P","P","O","O","O","O","?","N","N","N","N","N","N","N","N","?","?","?","?","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","M","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","?","?","?","?","X","X","X","X","X","X","X","X","X","X","X","X","X","X","X","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","V","V","U","?","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","T","?","?","K","K","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","C","C","C","C","C","C","C","C","B","B","B","B","B","B","B","B","B","B","B","B","?","C","C","C","C","C","C","D","D","D","D","D","C","C","C","C","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","?","?","?","?","?","?","?","?","?","?","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","?","?","O","P","?","?","?","?","?","?","?","?","?","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Z","Y","Y","?","?","?","?","?","?","?","?","?","?","N","N","N","?","?","?","?","?","?","?","?","?","V","V","V","?","W","W","W","W","W","W","W","W","V","V","V","U","U","T","T","T","T","T","T","T","T","T","T","U","U","V","?","?","?","P","P","P","P","?","?","?","?","?","Q","Q","Q","Q","Q","Q","Q","Q","Q","Q","Q","Q","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","Q","Q","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","P"],"t":[30,41,57,74,92,109,125,142,159,173,193,208,225,243,259,275,293,310,325,343,359,376,392,409,424,442,459,475,492,508,524,542,558,575,593,608,625,642,659,674,691,707,725,742,758,775,793,808,824,842,858,875,892,908,925,942,958,974,991,1008,1025,1042,1058,1075,1092,1110,1125,1142,1159,1180,1191,1208,1225,1242,1259,1276,1293,1308,1324,1342,1357,1375,1392,1408,1426,1442,1459,1475,1491,1508,1525,1543,1558,1575,1591,1606,1625,1642,1658,1675,1692,1708,1725,1742,1758,1776,1792,1809,1825,1842,1858,1875,1892,1908,1925,1942,1961,1976,1993,2009,2025,2042,2058,2075,2092,2108,2125,2142,2158,2175,2192,2208,2225,2242,2263,2274,2292,2309,2324,2342,2358,2374,2392,2408,2425,2441,2458,2474,2491,2508,2524,2542,2558,2574,2592,2608,2625,2641,2658,2674,2691,2708,2725,2741,2758,2775,2792,2809,2825,2841,2858,2875,2891,2908,2925,2942,2958,2974,2991,3007,3025,3041,3058,3076,3091,3108,3125,3142,3158,3174,3192,3208,3224,3242,3258,3274,3291,3308,3325,3342,3357,3374,3393,3408,3426,3441,3459,3475,3491,3508,3524,3542,3558,3575,3591,3608,3624,3641,3658,3675,3692,3708,3724,3741,3758,3774,3791,3807,3824,3841,3859,3874,3892,3907,3925,3942,3958,3975,3991,4008,4024,4042,4058,4074,4092,4108,4125,4141,4158,4174,4193,4207,4225,4241,4258,4275,4292,4308,4325,4342,4358,4375,4391,4408,4424,4441,4459,4474,4492,4507,4524,4542,4558,4574,4592,4608,4624,4641,4658,4674,4694,4708,4725,4742,4758,4775,4792,4808,4825,4842,4858,4873,4891,4908,4925,4942,4958,4975,4993,5007,5024,5041,5058,5074,5092,5108,5125,5141,5158,5174,5192,5208,5225,5242,5258,5274,5291,5307,5325,5341,5358,5374,5392,5408,5424,5441,5459,5475,5493,5508,5526,5541,5556,5575,5592,5607,5624,5642,5658,5675,5692,5708,5724,5740,5757,5773,5791,5808,5824,5842,5858,5874,5891,5907,5923,5941,5958,5974,5991,6008,6024,6041,6058,6075,6092,6108,6124,6141,6157,6174,6192,6208,6223,6242,6259,6274,6290,6307,6323,6340,6357,6374,6391,6408,6425,6442,6457,6474,6491,6509,6524,6541,6558,6574,6592,6608,6624,6641,6658,6674,6692,6708,6724,6742,6758,6775,6792,6808,6824,6841,6858,6874,6891,6908,6926,6942,6958,6974,6992,7007,7024,7041,7059,7074,7091,7107,7124,7142,7157,7174,7192,7207,7224,7241,7258,7274,7291,7308,7325,7341,7358,7374,7392,7407,7424,7441,7458,7474,7493,7508,7524,7541,7556,7574,7591,7608,7624,7641,7659,7675,7692,7708,7724,7742,7758,7774,7792,7808,7824,7841,7858,7875,7891,7908,7924,7942,7957,7975,7993,8007,8024,8041,8058,8074,8092,8108,8125,8141,8157,8174,8189,8208,8224,8241,8256,8274,8292,8309,8325,8342,8357,8374,8392,8408,8424,8441,8457,8474,8491,8508,8524,8541,8559,8574,8592,8608,8624,8641,8658,8675,8690,8707,8724,8741,8758,8774,8792,8810,8824,8842,8857,8875,8892,8910,8925,8941,8957,8975,8991,9007,9025,9042,9058,9074,9093,9108,9125,9142,9158,9174,9191,9208,9224,9241,9258,9274,9291,9308,9324,9342,9358,9374,9391,9408,9424,9441,9458,9474,9491,9508,9524,9541,9558,9574,9591,9608,9624,9641,9658,9674,9691,9707,9725,9741,9758,9774,9792,9809,9824,9841,9858,9875,9891,9908,9924,9941,9958,9974,9992,10008,10024,10041,10058,10074,10092,10108,10125,10141,10158,10175,10193,10207,10225,10242,10258,10274,10291,10307,10324,10341,10358,10374,10391,10408,10424,10441,10458,10474,10492,10507,10525,10542,10557,10574,10591,10608,10625,10642,10658,10674,10691,10707,10725,10742,10758,10774,10791,10808,10825,10841,10858,10875,10891,10907,10924,10940,10957,10975,10991,11007,11024,11041,11058,11075,11092,11108,11124,11141,11158,11174,11192,11208,11224,11242,11258,11274,11291,11308,11325,11341,11358,11372,11392,11408,11424,11442,11459,11474,11491,11508,11524,11541,11556,11574,11590,11608,11625,11641,11658,11675,11692,11708,11725,11741,11758,11774,11792,11808,11824,11842,11859,11875,11892,11907,11924,11942,11957,11973,11993,12008,12024,12041,12058,12073,12091,12108,12124,12142,12158,12174,12191,12207,12225,12241,12257,12274,12290,12307,12324,12342,12358,12374,12392,12408,12424,12442,12458,12474,12491,12508,12524,12541,12557,12574,12591,12608,12624,12641,12658,12674,12691,12707,12724,12741,12757,12774,12791,12809,12826,12842,12858,12874,12891,12907,12925,12942,12957,12974,12992,13008,13024,13042,13059,13074,13092,13108,13125,13141,13158,13174,13192,13208,13224,13241,13258,13274,13293,13308,13324,13341,13358,13374,13392,13408,13424,13441,13458,13474,13492,13508,13524,13542,13558,13574,13592,13608,13624,13641,13657,13674,13691,13707,13725,13741,13758,13775,13794,13807,13824,13841,13858,13874,13892,13907,13924,13941,13958,13974,13992,14007,14024,14041,14058,14074,14091,14107,14124,14141,14157,14174,14192,14207,14224,14242,14258,14274,14291,14308,14324,14340,14358,14374,14392,14408,14424,14442,14458,14474,14491,14508,14524,14541,14558,14574,14591,14608,14624,14641,14658,14674,14692,14710,14724,14740,14757,14774,14792,14809,14824,14841,14860,14874,14891,14908,14924,14942,14957,14974,14991,15006,15024,15041,15057,15073,15090,15107,15124,15141,15157,15174,15192,15207,15224,15241,15257,15274,15291,15307,15324,15342,15358,15375,15392,15408,15424,15440,15458,15474,15491,15507,15523,15540,15558,15575,15591,15607,15623,15642,15657,15674,15691,15707,15723,15741,15758,15775,15792,15807,15824,15841,15858,15875,15892,15908,15924,15942,15958,15974,15992,16007,16024,16041,16058,16075,16092,16108,16124,16141,16157,16174,16192,16207,16223,16241,16258,16274,16292,16307,16326,16341,16357,16374,16392,16407,16424,16441,16458,16474,16491,16508,16524,16541,16558,16574,16592,16608,16624,16641,16659,16674,16691,16708,16725,16742,16758,16774,16792,16808,16824,16841,16858,16874,16891,16907,16925,16941,16958,16974,16992,17009,17024,17042,17060,17074,17091,17107,17124,17142,17158,17175,17191,17207,17224,17241,17258,17274,17291,17307,17325,17341,17358,17374,17393,17408,17425,17441,17458,17474,17491,17508,17524,17542,17558,17574,17591,17608,17624,17641,17658,17674,17691,17707,17724,17742,17757,17774,17792,17808,17825,17840,17857,17874,17891,17908,17924,17942,17958,17974,17992,18008,18024,18041,18058,18074,18091,18108,18124,18142,18158,18175,18192,18207,18224,18241,18258,18274,18292,18307,18324,18342,18359,18374,18391,18407,18425,18441,18457,18474]},
			 description: 'hover log'
			 }
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
    var test_part='replay';

		var click_number=1;
		var frame_number = 0;


		window.last_click_time = p.millis()

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

		function grid_coordinates_to_screen_coordinates(i) {
			x=(window.innerWidth-square_size*trial.word.length)/2+i*square_size+Math.round(square_size/2);
			return(x)
		}

		function letter_to_screen_coordinates(letter) {
			i = alphabet.indexOf(letter);
			row = p.floor(i/9);
			column = i%9;
			x=window.innerWidth/2+column*letter_size*1.2+Math.round(letter_size*1.2/2)-letter_size*4.5*1.2;
			y=window.innerHeight*5/12 + row*letter_size*1.7;
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
				this.letter_click_times = Object.assign({}, ...alphabet.map((x) => ({[x]: -Infinity})));
				this.click_log = {letter:[''],t:[0],hit:[undefined],asked:[this.asked.join('')], word_state: [this.printWordState()]};
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
						p.textSize(25)
						p.textAlign(p.CENTER, p.CENTER)
						p.fill(0);
						p.strokeWeight(0)
						p.textFont('Quicksand');
						p.text(`${trial.category} (${trial.word})`, left_margin,top_margin-50,du);
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
					p.text(`Points:   `, left_margin-this.size*2, window.innerHeight/2);

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
					while (trial.hover_log.t[frame_number+1]<p.millis()) {
						frame_number++
					}
					var hovered_letter = trial.hover_log.letter[frame_number]
					for (var i=0; i<alphabet.length; i++) {
						let letter = alphabet[i];
						let xy = letter_to_screen_coordinates(letter)
						p.push()
						p.fill(0)
						p.noStroke()
						// if (hovered_letter==letter & !this.asked.includes(letter)) {
						// 	// p.textStyle(p.BOLD)
						// }
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

		}

		//organize everything in one sequence
		p.draw = function() {

			p.background(255);

			if (!thisGame.won | p.millis()-thisGame.winning_time<trial.end_screen_time) {

				// emulate clicks
				if (p.millis()>=trial.click_log.t[click_number]) {

					thisGame.update(trial.click_log.letter[click_number].toUpperCase())
					click_number++
				}

				thisGame.plotWord(p)

				thisGame.plotScore(p)

				thisGame.plotAlphabet(p)

				thisGame.plotInstructions(p)

				thisGame.plotCategory(p)

				p.push()
				p.textFont("monospace", 15)
				text='Replaying game: '+msToTime(p.millis());
				p.textAlign(p.CENTER, p.CENTER);
				p.fill(100);
				p.strokeWeight(0)
				p.text(text,window.innerWidth/2,window.innerHeight/2+100)
				p.pop()


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


				// end trial
				jsPsych.finishTrial(trial_data);

			}

			var xy = [p.mouseX, p.mouseY];
			for (var i=0; i<alphabet.length; i++) {
				let letter = alphabet[i];
				let xy = letter_to_screen_coordinates(letter)
				var distance_to_mouse = Math.sqrt((xy[0]-p.mouseX)**2+(xy[1]-p.mouseY)**2);
				if (distance_to_mouse < letter_size/2) {
					thisGame.hover_log.letter.push(alphabet[i]);
				} else {
					thisGame.hover_log.letter.push('?')
				}
			}
			thisGame.hover_log.t.push(p.millis());
			thisGame.hover_log.x.push(xy[0]);
			thisGame.hover_log.y.push(xy[1]);
		}

		// p.keyPressed = function() {
		// 	if (p.key.toUpperCase()=='X') {
		// 		var letter = p.key.toUpperCase();
		// 		p.remove()
		// 		// data saving
		// 		var trial_data = {
		// 			word: trial.word,
		// 			click_log: thisGame.click_log,
		// 			hover_log: thisGame.hover_log,
		// 			final_keyboard_state: thisGame.asked,
		// 			num_clicks: thisGame.click_log.t.length-1,
		// 			points: thisGame.points,
		// 			cheat: trial.cheat
		// 		};
		//
		// 		// end trial
		// 		jsPsych.finishTrial(trial_data);
		// 	}
		// }

		// p.mouseClicked = function() {
		// 	for (var i=0; i<alphabet.length; i++) {
		// 		let letter = alphabet[i];
		// 		let xy = letter_to_screen_coordinates(letter)
		// 		var distance_to_mouse = Math.sqrt((xy[0]-p.mouseX)**2+(xy[1]-p.mouseY)**2);
		// 		if (distance_to_mouse < letter_size/2) {
		// 			thisGame.update(letter.toUpperCase())
		// 		}
		// 	}
		// }



		};

		// start sketch!
		let myp5 = new p5(sketch);

}



//Return the plugin object which contains the trial
return plugin;
})();
