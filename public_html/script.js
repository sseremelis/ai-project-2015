function handleFileSelect() {

    var fileInput = document.getElementById('fileInput'); //get the file selector
    var file = fileInput.files[0]; //store the reference to the file
    var textType = /text.*/;

    if (file.type.match(textType)) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var text = e.target.result;
            var lines = text.split(/\n/g); //split the text to every line
            var newTable = document.createElement("table");
            table_rows = lines.length;

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
            cont.innerHTML = "";
            cont.appendChild(newTable);
            findNeighbours();
        };

        reader.readAsText(file);
    } else {
        fileDisplayArea.innerText = "File not supported!";
    }
}

function findNeighbours() {
    var start = document.getElementsByClassName("S")[0];
    var coord = start.id.split(":"); //get the coordinates of the starting node
    var x = parseInt(coord[0]);
    var y = parseInt(coord[1]);
    var neigh = new Array();
    if (y >= 1) {
        neigh.push(document.getElementById(x + ":" + (y - 1)));
    }
    if (y + 1 < table_columns) {
        neigh.push(document.getElementById(x + ":" + (y + 1)));
    }
    if (x >= 1) {
        neigh.push(document.getElementById((x - 1) + ":" + y));
    }
    if (x + 1 < table_rows) {
        neigh.push(document.getElementById((x + 1) + ":" + y));
    }
    for (var i = 0; i < neigh.length; i++) {
        if (neigh[i].getAttribute("value") != "-1") {
            neigh[i].setAttribute("style", "background-color: palegreen;")
        }
    }
}

