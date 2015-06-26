var neigh = new Array();  //to store the 4 neighbours of the cell
var visited = new Array(); //to store the cells that the algorithm has visited
var path = new Array(); //to store the final path

function getText() {
    var xmlhttp;
    var txt = '';
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            txt = xmlhttp.responseText;
            textToGraphics(txt);
        }
    }
    xmlhttp.open("GET", "maze_file.txt", true);
    xmlhttp.send();
}


function textToGraphics(e) {
    var text = e;
    var lines = text.split(/\n/g); //split the text to every line
    var newTable = document.createElement("table");
    newTable.setAttribute("class", "mazeTable");
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
                    newCell.setAttribute("cost", "0");
                    break;
                case 'B':
                    newCell.setAttribute("class", "B");
                    newCell.setAttribute("value", "B");
                    newCell.setAttribute("cost", "0");
                    break;
                case 'S':
                    newCell.setAttribute("class", "S");
                    newCell.setAttribute("value", "S");
                    newCell.setAttribute("cost", "0");
                    break;
                case 'G':
                    newCell.setAttribute("class", "G");
                    newCell.setAttribute("value", "G");
                    newCell.setAttribute("cost", "0");
                    break;
                default:
                    newCell.setAttribute("value", str);
                    newCell.setAttribute("cost", str);
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
}


function displayMaze(par) { //
    if (par == "file") {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var textType = /text.*/;
            var fileInput = document.getElementById('fileInput'); //get the file selector
            var file = fileInput.files[0]; //store the reference to the file

            if (file.type.match(textType)) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    textToGraphics(reader.result);
                };
                reader.readAsText(file);
            } else {
                fileDisplayArea.innerText = "File not supported!";
            }
        } else {
            alert('The File APIs are not fully supported by your browser.');
        }
    }
    else {
        getText();
    }
}


function selectAlgorithm() {
    document.getElementById("searchButton").disabled = true;
    var dropdown = document.getElementById("algorithms");
    var alg = dropdown[dropdown.selectedIndex].value;
    displaySearchTable();
    window[alg]("S", "canteen"); //call the algorithm that the user chose
}


function findNeighbours(start) {
//    var start = document.getElementsByClassName(center)[0];
    var coord = start.id.split(":"); //get the coordinates of the starting node
    var x = parseInt(coord[0]);
    var y = parseInt(coord[1]);
    neigh = [];
    if (x >= 1) {
        var n3 = document.getElementById((x - 1) + ":" + y);
        if (n3.getAttribute("value") != "-1" && visited.indexOf(n3) == -1) {
            neigh.push(n3);
        }
    }
    if (y >= 1) {
        var n1 = document.getElementById(x + ":" + (y - 1));
        if (n1.getAttribute("value") != "-1" && visited.indexOf(n1) == -1) {
            neigh.push(n1);
        }
    }
    if (x + 1 < table_rows) {
        var n4 = document.getElementById((x + 1) + ":" + y);
        if (n4.getAttribute("value") != "-1" && visited.indexOf(n4) == -1) {
            neigh.push(n4);
        }

    }
    if (y + 1 < table_columns) {
        var n2 = document.getElementById(x + ":" + (y + 1));
        if (n2.getAttribute("value") != "-1" && visited.indexOf(n2) == -1) {
            neigh.push(n2);
        }
    }
}

function displaySearchTable() {
    var table = document.createElement("table");
    table.id = "searchTable";
    var header = table.createTHead();
    var row = header.insertRow(0);
    var cell = row.insertCell(0);
    cell.innerHTML = "<b>Frontier</b>";
    cell = row.insertCell(1);
    cell.innerHTML = "<b>State</b>";
    var c = document.getElementById("content");
    var br = document.createElement("br");
    c.appendChild(br);
    c.appendChild(table);
}

function refreshSearchTable(state, frontier) {
    var table = document.getElementById("searchTable");
    var newRow = table.insertRow();
    var newCell = newRow.insertCell();
    var newText = "< ";
    for (var i = 0; i < frontier.length; i++) {
        newText = newText + frontier[i].id + " , ";
    }
    newText = newText.substring(0, newText.length - 2);
    newText = newText + " >";
    newCell.innerHTML = newText;

    newCell = newRow.insertCell();
    newCell.innerHTML = state.id;
    newRow.appendChild(newCell);
    table.appendChild(newRow);
}

function showSuccessInTable(state) {
    var table = document.getElementById("searchTable");
    var newRow = table.insertRow();
    var newCell = newRow.insertCell();
    newCell.colSpan = "2";
    if (state.getAttribute("value") == "G") {
        newCell.innerHTML = "<b>Found canteen " + state.getAttribute("value") + "</b>";
    }
    else {
        newCell.innerHTML = "<b>Found canteen " + state.getAttribute("value") + "</b>";
    }
}

function showTotalCost(heuristic, state) {
    var newCell = document.getElementById("searchTable").insertRow().insertCell();
    newCell.colSpan = "2";
    newCell.innerHTML = "Total path cost: " + calculatePathCost(heuristic,state);
}

function DFS(start, end) {

    var frontier = new Array();
    var state;
    var map = new Map();
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

        for (var i = 0; i < neigh.length; i++) {
            frontier.unshift(neigh[i]); //put the children of the first element in the
            map.set(neigh[i], state);
        }
        for (var i = 0; i < frontier.length; i++) {
            console.log(frontier[i].id);
        }
        refreshSearchTable(state, frontier);
        state = frontier[0]; //set the state as the first element of the frontier
    }
    findShortestPath(state, s, map);
    showSuccessInTable(state);
    if (end == "canteen") {
        console.log("Found canteen " + state.getAttribute("value"));
        visited.length = 0;

        DFS(state.getAttribute("value"), "G");
    }
    else {
        console.log("Found goal!!!!" + calculatePathCost())
        showTotalCost();
        colorPath(path);
        addClearButton();
    }
}


function BFS(start, end) {
    var map = new Map(); //store node and the next node it went
    var frontier = new Array();
    var state;
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
        for (var i = 0; i < neigh.length; i++) {
            frontier.push(neigh[i]); //put the children of the first element in the
            map.set(neigh[i], state);
        }
        for (var i = 0; i < frontier.length; i++) {
            console.log(frontier[i].id);
        }
        refreshSearchTable(state, frontier);
        state = frontier[0]; //set the state as the first element of the frontier
    }
    findShortestPath(state, s, map);
    showSuccessInTable(state);
    if (end == "canteen") {
        console.log("Found canteen " + state.getAttribute("value"));
        visited.length = 0;
        BFS(state.getAttribute("value"), "G");
    }
    else {
        console.log("Found goal !!!");
        showTotalCost();
        colorPath(path);
        addClearButton();
    }
}


function BnB(start, end) {
    var frontier = new Array();
    var map = new Map();
    var state;
    var cost = 0;
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
        cost = parseInt(state.getAttribute("cost"));
        frontier.shift(); //remove the first element from frontier
        findNeighbours(state); //get the children of the first element in the frontier
        for (var i = neigh.length -1; i >=0 ; i--) {
            frontier.push(neigh[i]); //put the children of the first element in the
            node_cost = parseInt(neigh[i].getAttribute("value"));
            if (isNaN(node_cost)) {  //cost of A,B,G returns NaN so we make it zero
                node_cost = 0;
            }
            
            if (!map.has(neigh[i])) {
                neigh[i].setAttribute("cost", node_cost + cost);
                map.set(neigh[i], state);
            }
            else{
                neigh.slice(i,1);
            }
        }
        frontier.sort(function (a, b) {
            return parseInt(a.getAttribute("cost")) - parseInt(b.getAttribute("cost"));
        });
        for (var i = 0; i < frontier.length; i++) {
            console.log(frontier[i].id);
        }
        refreshSearchTable(state, frontier);
        state = frontier[0];

    }
    findShortestPath(state, s, map);
    showSuccessInTable(state);
    if (end == "canteen") {
        console.log("Found canteen " + state.getAttribute("value"));
        visited.length = 0;
        colorPath(path);
        BnB(state.getAttribute("value"), "G");
    }
    else {
        showTotalCost(true,state);
        console.log("Found goal !!! cost: ");
        colorPath(path);
        addClearButton();
    }

}


function BF(start, end) {
    var frontier = new Array();
    var map = new Map();
    var state;
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
        for (var i = 0; i < neigh.length; i++) {
            frontier.push(neigh[i]); //put the children of the first element in the
            map.set(neigh[i], state);
        }
        frontier.sort(function (a, b) {
            if (a.getAttribute("value") == 'A' || a.getAttribute("value") == 'B' || a.getAttribute("value") == 'G') {
                return -1;
            }
            else if (b.getAttribute("value") == 'A' || b.getAttribute("value") == 'B' || b.getAttribute("value") == 'G') {
                return 1;
            }
            else {
                return parseInt(a.getAttribute("value")) - parseInt(b.getAttribute("value"));
            }
        });
        for (var i = 0; i < frontier.length; i++) {
            console.log(frontier[i].id);
        }
        refreshSearchTable(state, frontier);
        state = frontier[0];
    }
    findShortestPath(state, s, map);
    showSuccessInTable(state);
    if (end == "canteen") {
        console.log("Found canteen " + state.getAttribute("value"));
        visited.length = 0;
        colorPath(path);
        BF(state.getAttribute("value"), "G");
    }
    else {
        showTotalCost();
        console.log("Found goal !!! cost: " + calculatePathCost());
        colorPath(path);
        addClearButton();
    }

}


function Astar(start, end) {
    var map = new Map(); //store node and the next node it went
    var frontier = new Array();
    var state;
    var s = document.getElementsByClassName(start)[0];
    if (end != "canteen") {
        var goal = document.getElementsByClassName(end)[0];
    }
    else {
        var canteenA = document.getElementsByClassName("A")[0];
        var canteenB = document.getElementsByClassName("B")[0];

    }
    frontier.push(s); //put the starting element in the frontier
    state = s;
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
        cost = parseInt(state.getAttribute("cost"));
        frontier.shift(); //remove the first element from frontier
        findNeighbours(state); //get the children of the first element in the frontier
        for (i = 0; i < neigh.length; i++) {
            frontier.push(neigh[i]); //put the children of the first element in the
            var nc = parseInt(neigh[i].getAttribute("value")); //nc = node cost
            if (isNaN(nc)) {  //cost of A,B,G returns NaN so we make it zero
                nc = 0;
            }
            d = cost + nc;
            if (end == "canteen") {
                h1 = calculateManhanttanDistance(neigh[i], canteenA);
                h2 = calculateManhanttanDistance(neigh[i], canteenB);
                var h;
                if (h1 > h2) {
                    h = h1;
                }
                else {
                    h = h2;
                }
            }
            else {
                h = calculateManhanttanDistance(neigh[i], goal);
            }
            neigh[i].setAttribute("cost", d);
            neigh[i].setAttribute("fs", d + h); // cost is f(s)=d(s)+h(s)
            map.set(neigh[i], state);
        }
        frontier.sort(function (a, b) {
            return parseInt(a.getAttribute("fs")) - parseInt(b.getAttribute("fs"));
        });
        for (var i = 0; i < frontier.length; i++) {
            console.log(frontier[i].id);
        }
        state = frontier[0];

    }
    findShortestPath(state, s, map);
    if (end == "canteen") {
        console.log("Found canteen " + state.getAttribute("value"));
        visited.length = 0;
        colorPath(path);
        Astar(state.getAttribute("value"), "G");
    }
    else {

        console.log("Found goal !!! cost: " + calculatePathCost(true, state));

        colorPath(path);
        addClearButton();
    }


}


function calculateManhanttanDistance(a, b) {
    var coord1 = a.id.split(":"); //get the coordinates of the node a
    var x1 = parseInt(coord1[0]);
    var y1 = parseInt(coord1[1]);

    var coord2 = b.id.split(":"); //get the coordinates of the node b
    var x2 = parseInt(coord2[0]);
    var y2 = parseInt(coord2[1]);

    var result = Math.abs(x1 - x2) + Math.abs(y1 - y2);
    return result;

}


function findShortestPath(curNode, start, map) {
    while (curNode.getAttribute("value") != start.getAttribute("value")) {
        path.push(curNode);
        curNode = map.get(curNode);
    }
}

function calculatePathCost(heuristic, state) {
    var total_cost = 0;
    if (heuristic) {
        total_cost = state.getAttribute("cost");
    }
    else {
        for (var i = 0; i < path.length; i++) {
            total_cost = total_cost + parseInt(path[i].getAttribute("cost"));
        }
    }
    return total_cost;

}


function colorPath(path) {
    for (var i = 0; i < path.length; i++) {
        if (path[i].getAttribute("value") != "G" && path[i].getAttribute("value") != "B" && path[i].getAttribute("value") != "A" && path[i].getAttribute("value") != "S") {
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
        document.getElementById("searchButton").disabled = false;

    };
    var c = document.getElementById("content");
    c.appendChild(br);
    c.appendChild(br);
    c.appendChild(b);
}


function colorFrontier(front) {
    for (var i = 0; i < front.length; i++) {
        front[i].setAttribute("style", "background-color:grey");
    }
}