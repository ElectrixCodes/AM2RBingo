var sideBySideLayout = true;
var cellSize = 100;

// Handle seed. Seeds are 6-character strings containing only digits. The same seed will produce the same board every time.
var seed;
const params = new URLSearchParams(window.location.search); // get parameters from URL
if (params.has("seed") && /^\d+$/.test(params.get("seed"))) { // check if URL provided a valid seed provided
	seed = params.get("seed").padStart(6, "0"); // use seed from URL
} else { // generate random seed if none provided
	seed = (Math.floor(Math.random() * 1000000)).toString().padStart(6, "0");
}
window.history.replaceState("", "", "?seed=" + seed); // modify URL without forcing page refresh
if (window.name != "popout") {
	document.getElementById("copySeedText").innerHTML = "Seed: " + seed;
	document.getElementById("resetBoardButton").addEventListener("click", resetBoard);
	document.getElementById("newBoardButton").addEventListener("click", function() {
		window.location.href = 'board.html';
	});
	document.getElementById("copySeedButton").addEventListener("click", copySeedToClipboard);
	document.getElementById("loadSeedButton").addEventListener("click", function() {
		window.location.href = 'board.html?seed=' + document.getElementById('seedTextBox').value;
	});
	document.getElementById("cellShrinkButton").addEventListener("click", function() {
		setCellSize(cellSize - 10);
	});
	document.getElementById("cellSizeButton").addEventListener("click", function() {
		setCellSize(100);
	});
	document.getElementById("cellGrowButton").addEventListener("click", function() {
		setCellSize(cellSize + 10);
	});
	document.getElementById("layoutButton").addEventListener("click", changeLayout);
	document.getElementById("popoutButton").addEventListener("click", popoutBoard);
}

// Set up board
const cells = document.querySelectorAll("td, th:not(#tableHeader)"); // select all cells except header (th=line labels, td=tiles)
resetBoard();
Math.seedrandom(seed); // from seedrandom.js
const tiles = document.getElementsByTagName("TD");

const objectives = []; // 25 random objectives
while (objectives.length < 25) { // get a random objective from objectives.js until the board is filled, and all lines are completable
	var index = objectives.length;
	var randomObjective = flattenedObjectives[Math.floor(Math.random() * flattenedObjectives.length)];
	if (objectives.includes(randomObjective)) // if objective already in array, skip
		continue;
	
	if (!nestedObjectives[0].includes(randomObjective)) { // if objective is in an array of mutually exclusive objectives
		for (var i = 1; i < nestedObjectives.length; i++) { // find which array the objective is in
			if (nestedObjectives[i].includes(randomObjective)) {
				innerArray = nestedObjectives[i];
				break;
			}
		}
		var lines = [];
		for (var w = index - index % 5; w < index; w++) // add tiles in same row
			lines.push(objectives[w]);
		for (var x = index % 5; x < index; x += 5) // add tiles in same column
			lines.push(objectives[x]);
		if (index % 6 == 0) { // in diag 1
			for (var y = 0; y < index; y += 6) // add tiles in same diagonal
				lines.push(objectives[y]);
		}
		if (index % 4 == 0 && index <= 20) { // in diag 2
			for (var z = 4; z < index; z += 4) // add tiles in same diagonal
				lines.push(objectives[z]);
		}
		
		var foundMutuallyExclusiveObjective = false;
		for (var i = 0; i < innerArray.length; i++) {
			if (lines.includes(innerArray[i])) {
				foundMutuallyExclusiveObjective = true;
				break;
			}
		}
		if (foundMutuallyExclusiveObjective) { // if mutually exclusive objective already in the row, column, or diagonal, skip
			continue;
		}
	}
	
	// all checks passed
	objectives.push(randomObjective);
	tiles[index].innerHTML = randomObjective;
}

// Set up EventListeners
for(var i = 0; i < cells.length; i++) {
	cells[i].addEventListener("mouseover", mouseoverFunction);
	cells[i].addEventListener("mouseout", mouseoutFunction);
	cells[i].addEventListener("click", clickFunction);
}

if (window.name == "popout") {
	window.onload = resizeTable;
	window.onresize = resizeTable;
	function resizeTable() { // Resize table to match window size
		for(var i = 0; i < cells.length; i++) {
			cells[i].style.height = ((window.innerHeight - (16 + 14)) / 7).toString() + "px";
		}
	}
}

// Functions
function resetBoard() {
	for(var i = 0; i < cells.length; i++) {
		var cell = cells[i];
		cell.state = 0;
		if (cell.tagName === "TD") {
			cell.style.backgroundColor = "rgb(0, 0, 0, 0.8)";
		} else {
			cell.style.backgroundColor = "rgb(0, 72, 144, 0.8)";
			cell.style.fontStyle = "normal";
			cell.style.textDecoration = "";
		}
	}
}

/*	States
	Tiles					Line Labels
	0 = default (white)		default (green)
	1 = completed (green)	player 1 line (purple)
	2 = failed (red)		player 2 line (orange)
*/
function mouseoverFunction(e) { // handle mouse hovering over cell
	var cell = e.target;
	var newColor;
	if (cell.tagName === "TD") { // cell is tile
		switch (cell.state) {
			case 0: newColor = "rgb(0, 92, 0, 0.8)"; break;
			case 1: newColor = "rgb(0, 208, 0, 0.8)"; break;
			case 2: newColor = "rgb(208, 0, 0, 0.8)"; break;
		}
	} else { // cell is line label
		switch (cell.state) {
			case 0: newColor = "rgb(0, 127, 255, 0.8)"; break;
			case 1: newColor = "rgb(255, 0, 127, 0.8)"; break;
			case 2: newColor = "rgb(255, 127, 0, 0.8)"; break;
		}
	}
	cell.style.backgroundColor = newColor;
}

function mouseoutFunction(e) { // handle mouse leaving cell
	var cell = e.target;
	var newColor;
	if (cell.tagName === "TD") {
		switch (cell.state) {
			case 0: newColor = "rgb(0, 0, 0, 0.8)"; break;
			case 1: newColor = "rgb(0, 144, 0, 0.8)"; break;
			case 2: newColor = "rgb(144, 0, 0, 0.8)"; break;
		}
	} else {
		switch (cell.state) {
			case 0: newColor = "rgb(0, 72, 144, 0.8)"; break;
			case 1: newColor = "rgb(144, 0, 72, 0.8)"; break;
			case 2: newColor = "rgb(144, 72, 0, 0.8)"; break;
		}
	}
	cell.style.backgroundColor = newColor;
}

function clickFunction(e) { // handle cell clicked
	var cell = e.target;
	cell.state++;
	if (cell.state == 3) cell.state = 0;
	var newColor;
	if (cell.tagName === "TD") {
		switch (cell.state) {
			case 0: newColor = "rgb(0, 0, 0, 0.8)"; break;
			case 1: newColor = "rgb(0, 144, 0, 0.8)"; break;
			case 2: newColor = "rgb(144, 0, 0, 0.8)"; break;
		}
	} else {
		switch (cell.state) {
			case 0: newColor = "rgb(0, 72, 144, 0.8)"; cell.style.textDecoration = ""; break;
			case 1: newColor = "rgb(144, 0, 72, 0.8)"; cell.style.fontStyle = "italic"; break;
			case 2: newColor = "rgb(144, 72, 0, 0.8)"; cell.style.fontStyle = "normal"; cell.style.textDecoration = "underline"; break;
		}
	}
	cell.style.backgroundColor = newColor;
	mouseoverFunction(e); // immediately highlights cell after it is clicked
}

function copySeedToClipboard() {
	var temp = document.createElement("textarea"); // seems like a weird method of copying something, but it works
	document.body.appendChild(temp);
	temp.value = seed;
	temp.select();
	document.execCommand("copy");
	document.body.removeChild(temp);
}

function setCellSize(value) { // Resize the board cells
	cellSize = Math.min(150, Math.max(value, 50));
	document.getElementById("cellSizeButton").innerHTML = (cellSize + "%").padStart(4, " ");
	for(var i = 0; i < cells.length; i++) {
		cells[i].style.width = cellSize + "px";
		cells[i].style.height = cellSize + "px";
	}
}

function changeLayout() { // Move text box and buttons to the bottom of the page so that the board is in focus
	if (sideBySideLayout) {
		document.getElementById("layout").style.flexDirection = "column";
		document.getElementById("board").style.margin = "0px auto";
	} else {
		document.getElementById("layout").style.flexDirection = "row";
		document.getElementById("board").style.margin = "";
	}
	sideBySideLayout = !sideBySideLayout;
}

function popoutBoard() { // Pop out board as a separate window
	var popoutWindow = window.open("popout.html?seed=" + seed, "popout", "toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no,width=626,height=730");
}
