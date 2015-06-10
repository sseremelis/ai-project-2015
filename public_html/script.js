var neigh = new Array();  //to store the 4 neighbours of the cell
var visited = new Array(); //to store the cells that the algorithm has visited
var path = new Array(); //to store the final path

function displayMaze() { //
    var fileInput = document.getElementById('fileInput'); //get the file selector
    var file = fileInput.files[0]; //store the reference to the file
    var textType = /text.*/;

    if (file.type.match(textType)) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var text = e.target.result;
            var lines = text.split(/\n/g); //split the text to every line
            var newTable = document.createElement("table");
            table_rows = lines.length - 1;

            for (var rows = 0; rows < lines.length - 1; rows++) {
                var newRow = document.createElement("tr");
                newTable.appendChild(newRow);
                var char = lines[rows].split(" "); //

                for (var cols = 0; cols < char.length; cols++) {
                    var newCell = document.createElement("td");
                    var str = char[cols].trim();
                    var c = document.createTextNode(str);
                    switch (str) {
                        case '-1':
                            newCell.setAttribute("class", "walls");
                            newCell.setAttribute("value", "-1");
                            break;
                        case 'A':
                            newCell.setAttribute("class", "A");
                            newCell.setAttribute("value", "A");
                            break;
                        case 'B':
                            newCell.setAttribute("class", "B");
                            newCell.setAttribute("value", "B");
                            break;
                        case 'S':
                            newCell.setAttribute("class", "S");
                            newCell.setAttribute("value", "S");
                            break;
                        case 'G':
                            newCell.setAttribute("class", "G");
                            newCell.setAttribute("value", "G");
                            break;
                        default:
                            newCell.setAttribute("value", str);
                            break;

                    }
                    newCell.setAttribute("id", rows + ":" + cols);
                    newCell.appendChild(c);
                    newRow.appendChild(newCell);
                }
            }
            table_columns = char.length;
            var cont = document.getElementById("content");
            cont.innerHTML = '';
            cont.appendChild(newTable);
        };

        reader.readAsText(file);
    } else {
        fileDisplayArea.innerText = "File not supported!";
    }
}

function selectAlgorithm() {
    var dropdown = document.getElementById("algorithms");
    var alg = dropdown[dropdown.selectedIndex].value;
    window[alg]("S", "canteen"); //call the algorithm that the user chose
}

function findNeighbours(start) {
//    var start = document.getElementsByClassName(center)[0];
    var coord = start.id.split(":"); //get the coordinates of the starting node
    var x = parseInt(coord[0]);
    var y = parseInt(coord[1]);
    neigh = [];
    if (y >= 1) {
        var n1 = document.getElementById(x + ":" + (y - 1));
        if (n1.getAttribute("value") != "-1" && visited.indexOf(n1) == -1) {
            neigh.push(n1);
        }
    }
    if (y + 1 < table_columns) {
        var n2 = document.getElementById(x + ":" + (y + 1));
        if (n2.getAttribute("value") != "-1" && visited.indexOf(n2) == -1) {
            neigh.push(n2);
        }
    }
    if (x >= 1) {
        var n3 = document.getElementById((x - 1) + ":" + y);
        if (n3.getAttribute("value") != "-1" && visited.indexOf(n3) == -1) {
            neigh.push(n3);
        }
    }
    if (x + 1 < table_rows) {
        var n4 = document.getElementById((x + 1) + ":" + y);
        if (n4.getAttribute("value") != "-1" && visited.indexOf(n4) == -1) {
            neigh.push(n4);
        }

    }
}

function DFS(start, end) {
    var frontier = new Array();
    var state;
    var previousNeighLength = 0;
    var stepsTaken = 0;
    var s = document.getElementsByClassName(start)[0];
    if (end != "canteen") {
        var goal = document.getElementsByClassName(end)[0];
    }
    frontier.push(s); //put the starting element in the frontier
    state = frontier[0];
    var continueSearch = true;
    while (continueSearch == true) {
        if (end == "canteen") {
            if (state.getAttribute("value") == "A" || state.getAttribute("value") == "B") {
                continueSearch = false;
                break;
            }

        }
        else {
            if (state.getAttribute("value") == goal.getAttribute("value")) {
                continueSearch = false;
                break;
            }
        }
        console.log(state.getAttribute("value"));
        visited.push(state);
        frontier.shift(); //remove the first element from frontier
        findNeighbours(state); //get the children of the first element in the frontier
        if (neigh.length <= previousNeighLength) {
            stepsTaken = stepsTaken + 1; //count how many steps the alg takes if it starts following a path
        }
        if (neigh.length == 0) {
            for (var i = 0; i < stepsTaken; i++) {
                path.pop();  //remove stepsTaken elements from path if it finds a deadend 
            }
        }
        for (var i = 0; i < neigh.length; i++) {
            frontier.unshift(neigh[i]); //put the children of the first element in the 
        }
        for (var i = 0; i < frontier.length; i++) {
            console.log(frontier[i].id);
        }
        state = frontier[0]; //set the state as the first element of the frontier
        previousNeighLength = neigh.length;
        path.push(state);

    }
    if (end == "canteen") {
        console.log("Found canteen " + state.getAttribute("value"));
        DFS(state.getAttribute("value"), "G")

    }
    else {
        console.log("Found goal!!!!")
        colorPath(path);
        addClearButton();
    }

}

function colorPath(path) {
    for (var i = 0; i < path.length; i++) {
        if (path[i].getAttribute("value") != "G" && path[i].getAttribute("value") != "B" && path[i].getAttribute("value") != "A") {
            path[i].setAttribute("style", "background-color: #FFFF99;");
        }
    }
}

function addClearButton() {
    var b = document.createElement("button");
    var br = document.createElement("br");
    var t = document.createTextNode("Clear");
    b.appendChild(t);
    b.onclick = function () {
        document.getElementById("form").reset();
        document.getElementById("content").innerHTML = "";
        
    };
    var c = document.getElementById("content");
    c.appendChild(br);
    c.appendChild(br);
    c.appendChild(b);
}
