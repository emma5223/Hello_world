var player_turn = "X";
var win = [
  [1, 1, 1, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 1, 0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 0, 1],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1],
  [0, 0, 1, 0, 1, 0, 1, 0, 0]
];

var totalturns = 0;
var selections = {
  'X': Array(9).fill(0),
  'O': Array(9).fill(0)
};
var unique_id = 0;
var game_over = false;
var scores = {
  'X': 0,
  'O': 0
};
var with_computer = true;
var optional_selections_for_computer = [0,0,0,0,0,0,0,0,0];
function generateGame() {
  document.getElementById('game-board').innerHTML = '';
  player_turn = "X";
  selections['X'] = Array(9).fill(0);
  selections['O'] = Array(9).fill(0);
  totalturns = 0;
  unique_id = 0;
  	// is auto player selected 
	auto_player = document.getElementById('with_computer');
	optional_selections_for_computer = [0,0,0,0,0,0,0,0,0]; 
	if (auto_player.checked === true) with_computer = true; 
	else  with_computer = false;
 game_over = false;

  for (var row = 0; row < 3; row++) {
    for (var nrow = 0; nrow < 3; nrow++) {
      var button = document.createElement("input");
      button.value = ' ';
      button.className = 'grid-cell';
      button.type = 'button';
      button.onclick = function () { markCheck(this); };
      document.getElementById('game-board').appendChild(button);
      button.id = unique_id;
      unique_id++;
    }
    var breakline = document.createElement("br");
    document.getElementById('game-board').appendChild(breakline);
  }
}
function autoTurn() {
	available_cells = []

	// find available indexes
	for(var i=0; i< optional_selections_for_computer.length; i++){
		if (optional_selections_for_computer[i] == 0){
			available_cells.push(i);
		} 
	}

	// choose randomly where to mark check
	var chosen_cell = available_cells[Math.floor(Math.random() * available_cells.length)];//8
	var desired_obj = document.getElementById(chosen_cell);
	if(!desired_obj.disabled) markCheck(desired_obj);
} 
function markCheck(obj) {
  obj.value = player_turn;
  var cell = Number(obj.id);
  selections[player_turn][cell] = 1;
  optional_selections_for_computer[cell] = 1;
  console.log(`player ${player_turn} marked ${obj.id}`);

  obj.className = (player_turn === 'X') ? 'green-player' : 'red-player';
  player_turn = (player_turn === 'X') ? 'O' : 'X';
  totalturns++;

  obj.disabled = true;
  checkPlayerHasAnyWinningPattern();


}

function checkPlayerHasAnyWinningPattern() {
	game_over = false;
  
	for (var index = 0; index < win.length; index++) {
	  if (!game_over) {
		game_over = isContainingThisWinningPattern(selections['X'], win[index]) ||
		  isContainingThisWinningPattern(selections['O'], win[index]);
  
		if (game_over) {
		  disableAllCells();
		  setTimeout(function () {
			player_turn = (player_turn === "X") ? "O" : "X";
			alert('Player ' + player_turn + ' Won!');
			scoreUpdate(player_turn);
		  }, 100); // Adjust the delay time (in milliseconds) as needed
		  break;
		}
	  }
	}
  
	if (!game_over && totalturns === 9) {
	  setTimeout(function () {
		alert('Game Draw!');
		
	  }, 100); // Adjust the delay time (in milliseconds) as needed
	}
  }
  

function isContainingThisWinningPattern(selections, win) {
  var match = 0;
  for (var i = 0; i < 9; i++) {
    if (selections[i] + win[i] === 2) {
      match++;
    }
  }
  return match === 3;
}

function disableAllCells() {
  var elements = document.getElementsByClassName("grid-cell");
  for (var hi = 0; hi < elements.length; hi++) {
    elements[hi].disabled = true;
  }
}

function scoreUpdate(turn) {
  document.getElementById('score-' + turn).innerHTML = 'Player Score ' + turn + ': ' + ++scores[turn];
}

function restartGame() {
  if (scores['X'] === 0 && scores['O'] === 0) {
    alert("Nothing to restart!");
  } else {
    for (var key in scores) {
      document.getElementById('score-' + key).innerHTML = 'Player Score ' + key + ': 0';
      scores[key] = 0;
    }
  }
  player_turn = "X";
  selections['X'] = Array(9).fill(0);
  selections['O'] = Array(9).fill(0);
  totalturns = 0;
  game_over = false;

  var elements = document.getElementsByClassName("grid-cell");
  for (var hi = 0; hi < elements.length; hi++) {
    elements[hi].value = ' ';
    elements[hi].disabled = false;
    elements[hi].className = 'grid-cell';
  }
}
