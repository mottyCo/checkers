//logic functions:
const cellClicked = (rowClicked,columnClicked, boardElement)=>{
    if (!boardElement.isGameOver) {
        if(playerCanCompleteMovement(rowClicked,columnClicked, boardElement)){
            DeletePiecesCouldEat(boardElement,rowClicked,columnClicked);
            movePiece(rowClicked,columnClicked, boardElement);
            removeCellMarks(boardElement);  
            if(boardElement.isMultipleEating && getDirectionsThisPieceCanEat(rowClicked,columnClicked,boardElement).length > 0){
                markCellClicked(rowClicked,columnClicked, boardElement);
                markPossibleMovment(rowClicked,columnClicked, boardElement);
            }else{
                boardElement.isMultipleEating = false
                if(isPieceCameToEdge(rowClicked))
                    TurnPieceIntoKing(rowClicked,columnClicked, boardElement);
                boardElement.isBlueTurn = !boardElement.isBlueTurn;
                if(isWinSitation(boardElement)){
                    boardElement.isGameOver = true;
                }
            }
        }else if(!boardElement.isMultipleEating && isCellClickedContainPlayerColorTurn(rowClicked,columnClicked, boardElement)){
            removeCellMarks(boardElement);
            markCellClicked(rowClicked,columnClicked, boardElement);
            markPossibleMovment(rowClicked,columnClicked, boardElement);
        }
        render(boardElement)
    }
}
const isWinSitation = (boardElement) =>{
    const colorToLookAt = boardElement.isBlueTurn ? "blue" : "red";
    let numOfMoveblePiecesLeft = 0;
    for(let row = 0; row < 8 ; row++){
        for(let column = 0; column <8 ; column++){
            const cellContent = boardElement.logicBoard[row][column] + '';
            if(cellContent.includes(colorToLookAt)){
                if(markPossibleMovment(row,column,boardElement,false)){
                    numOfMoveblePiecesLeft++
                }
            }
        }
    }
    if (numOfMoveblePiecesLeft === 0)
        return true;
    return false;
}
const playerCanCompleteMovement = (rowClicked,columnClicked, boardElement)=>{
    logicboardCellContent = boardElement.logicBoard[rowClicked][columnClicked] + '';
    if(logicboardCellContent.includes("optional-movement")){
        return true
    }
    return false;
}
const isPieceCameToEdge = (rowClicked)=>{
    if(rowClicked === 7 || rowClicked === 0)
        return true;
    return false;
}
const TurnPieceIntoKing = (row,column, boardElement)=>{
    const cellContent = boardElement.logicBoard[row][column] + '';
    boardElement.logicBoard[row][column] = cellContent.includes("blue") ? "blue-piece-king" : "red-piece-king";
       
}
const DeletePiecesCouldEat = (boardElement,rowClicked,columnClicked)=>{
    for(let row = 0; row < 8; row++){
        for(let cell = 0 ; cell < 8 ; cell++){
            let content = boardElement.logicBoard[row][cell] + "";
            if(!content.includes("piece-clicked") && content.includes(boardElement.isBlueTurn ? "blue" : "red")){
                let directions = getDirectionsThisPieceCanEat(row,cell,boardElement);
                let iCanEatButOtherPieceThose = false
                if(directions.length > 0){
                    for(let direction of directions){
                        let next2cellsUpContent,next2cellsDownContent,next2cellsLeftContent,next2cellsRightContent;
                        switch(direction){
                            case "upLeft":
                                next2cellsUpContent = boardElement.logicBoard[row-2][cell] + '';
                                next2cellsLeftContent = boardElement.logicBoard[row][cell-2] + '';
                                if((next2cellsUpContent.includes("optional-movement") && next2cellsLeftContent.includes("iCanEat")) || (next2cellsUpContent.includes("iCanEat") && next2cellsLeftContent.includes("optional-movement")))
                                    iCanEatButOtherPieceThose = true
                                break;
                            case "upRight":
                                next2cellsUpContent = boardElement.logicBoard[row-2][cell] + '';
                                next2cellsRightContent = boardElement.logicBoard[row][cell+2] + '';
                                if((next2cellsUpContent.includes("optional-movement") && next2cellsRightContent.includes("iCanEat")) || (next2cellsUpContent.includes("iCanEat") && next2cellsRightContent.includes("optional-movement")))
                                    iCanEatButOtherPieceThose = true
                                break;
                            case "downLeft":
                                next2cellsDownContent = boardElement.logicBoard[row+2][cell] + '';
                                next2cellsLeftContent = boardElement.logicBoard[row][cell-2] + '';
                                if((next2cellsDownContent.includes("optional-movement") && next2cellsLeftContent.includes("iCanEat")) || (next2cellsDownContent.includes("iCanEat") && next2cellsLeftContent.includes("optional-movement")))
                                    iCanEatButOtherPieceThose = true
                                break;
                            case "downRight":
                                next2cellsDownContent = boardElement.logicBoard[row+2][cell] + '';
                                next2cellsRightContent = boardElement.logicBoard[row][cell+2] + '';
                                if((next2cellsDownContent.includes("optional-movement") && next2cellsRightContent.includes("iCanEat")) || (next2cellsDownContent.includes("iCanEat") && next2cellsRightContent.includes("optional-movement")))
                                    iCanEatButOtherPieceThose = true
                                break;
                        }
                    }   
                }
                if(iCanEatButOtherPieceThose && directions.length === 1)
                    break;
                if(directions.length > 0)
                    boardElement.logicBoard[row][cell] = null;
            }
        }
    }
}
const movePiece = (rowClicked,columnClicked, boardElement)=>{
    for(let row = 0; row < 8; row++){
        for(let cell = 0 ; cell < 8 ; cell++){
            let content = boardElement.logicBoard[row][cell] + "";
            if(content.includes("iCanEat")){
                eatPiece(rowClicked,columnClicked, boardElement,row,cell)
            }
            if(content.includes("piece-clicked")){
                content = content.replace("piece-clicked", ' ').trim()
                boardElement.logicBoard[row][cell] = null
                boardElement.logicBoard[rowClicked][columnClicked] =content;
                return true;
            }
        }
    }
}
const eatPiece = (rowToMove,columnToMove, boardElement,rowCameFrom,columnCameFrom)=>{
    const rowOfRemoveblePiece = rowToMove > rowCameFrom ? rowToMove-1 : rowToMove+1;
    const columnOfRemoveblePiece = columnToMove > columnCameFrom ? columnToMove-1 : columnToMove+1;
    boardElement.logicBoard[rowOfRemoveblePiece][columnOfRemoveblePiece] = null;
    boardElement.isMultipleEating = true;
}
const removeCellMarks = (boardElement)=>{
    for(let row = 0; row < 8; row++){
        for(let cell = 0 ; cell < 8 ; cell++){
            let content = boardElement.logicBoard[row][cell] + ""
            if(content.includes("piece-clicked"))
                content = content.replace("piece-clicked", " ").trim();
            if(content.includes("optional-movement"))
                content = "";
            if(content.includes("iCanEat"))
                content = content.replace("iCanEat", " ").trim();
            if(content === 'null'|| content === null || content.length < 2)
                boardElement.logicBoard[row][cell] = null;
            else
                boardElement.logicBoard[row][cell] = content;
        }
    }
}
const isCellClickedContainPlayerColorTurn = (rowClicked,columnClicked, boardElement)=>{
    if((boardElement.isBlueTurn && logicboardCellContent.includes("blue")) || (!boardElement.isBlueTurn && logicboardCellContent.includes("red")))
        return true
    return false
}

const markCellClicked = (rowClicked,columnClicked, boardElement)=>{
    logicboardCellContent = boardElement.logicBoard[rowClicked][columnClicked] + '';
    if((boardElement.isBlueTurn && logicboardCellContent.includes("blue")) || (!boardElement.isBlueTurn && logicboardCellContent.includes("red"))){
        let cell = boardElement.logicBoard[rowClicked][columnClicked];
        cell+=" piece-clicked";
        boardElement.logicBoard[rowClicked][columnClicked] = cell; 
    }
}
const markPossibleMovment = (rowClicked,columnClicked, boardElement, markCells = true)=>{
    let pieceCanMove = false
    const cellContent = boardElement.logicBoard[rowClicked][columnClicked] + '';
    const direcrtionPieceCanEat = getDirectionsThisPieceCanEat(rowClicked,columnClicked, boardElement);
    if(direcrtionPieceCanEat.length === 0){
        if(cellContent.includes("king")){
            if(markKIngMovement(rowClicked,columnClicked, boardElement, markCells)){
                pieceCanMove = true;
            }
        }else{
            if(markOneStep(rowClicked,columnClicked, boardElement, markCells)){
                pieceCanMove = true;
            } 
        }         
    }else{
        if(markCells)
            markOptionToEat(rowClicked,columnClicked, boardElement,direcrtionPieceCanEat)
        else
            pieceCanMove = true;
    }
    return pieceCanMove
}
const markOneStep = (rowClicked,columnClicked, boardElement, markCells)=>{
    console.log(markCells);
    let pieceCanMove = false;
    logicboardCellContent = boardElement.logicBoard[rowClicked][columnClicked] + '';
    if(boardElement.isBlueTurn && logicboardCellContent.includes("blue") && rowClicked-1 > -1){
        let cellToMark = boardElement.logicBoard[rowClicked-1][columnClicked-1] +'';
        if( !cellToMark.includes('red') && !cellToMark.includes('blue') && rowClicked-1 > -1 && columnClicked-1 > -1){
            if(markCells)
                boardElement.logicBoard[rowClicked-1][columnClicked-1] = "optional-movement";
            else
                pieceCanMove = true
        }
        cellToMark = boardElement.logicBoard[rowClicked-1][columnClicked+1] +'';
        if( !cellToMark.includes('red') && !cellToMark.includes('blue') && rowClicked-1 > -1 && columnClicked+1 < 8){
            if(markCells)
                boardElement.logicBoard[rowClicked-1][columnClicked+1] = "optional-movement";
            else
                pieceCanMove = true
        }
    }else if(!boardElement.isBlueTurn && logicboardCellContent.includes("red") && rowClicked+1 < 8){
        let cellToMark = boardElement.logicBoard[rowClicked+1][columnClicked-1] +'';
        if( !cellToMark.includes('red') && !cellToMark.includes('blue') && rowClicked+1 < 8 && columnClicked-1 > -1){
            if(markCells)
                boardElement.logicBoard[rowClicked+1][columnClicked-1] = "optional-movement";
            else
                pieceCanMove = true
        }    
        cellToMark = boardElement.logicBoard[rowClicked+1][columnClicked+1] +'';
        if( !cellToMark.includes('red') && !cellToMark.includes('blue') && rowClicked+1 < 8 && columnClicked+1 < 8){
            if(markCells)
                boardElement.logicBoard[rowClicked+1][columnClicked+1] = "optional-movement";
            else
                pieceCanMove = true
        }     
    }
    return pieceCanMove
}
const markKIngMovement = (row,column, boardElement, markCells)=>{
    let pieceCanMove = false
    for(let i = 1 ; i<8 ; i++){//down right
        if([row + i] < 8  && [column + i] < 8 && boardElement.logicBoard[row + i][column + i] === null){
            if(markCells)
                boardElement.logicBoard[row + i][column + i] = "optional-movement";
            else
                pieceCanMove = true
        }else
            break;
    }
    for(let i = 1 ; i<8 ; i++){//down left
        if([row + i] < 8  && [column - i] > -1 && boardElement.logicBoard[row + i][column - i] === null){
            if(markCells)
                boardElement.logicBoard[row + i][column - i] = "optional-movement";
            else
                pieceCanMove = true
        }else
            break;
    }
    for(let i = 1 ; i<8 ; i++){//up left
        if([row - i] > -1 && [column - i] > -1 && boardElement.logicBoard[row - i][column - i] === null){
            if(markCells)
                boardElement.logicBoard[row - i][column - i] = "optional-movement";
            else
                pieceCanMove = true
        }else
            break;
    }
    for(let i = 1 ; i<8 ; i++){//up right
        if([row - i] > -1 && [column + i] < 8 && boardElement.logicBoard[row - i][column + i] === null){
            if(markCells)
                boardElement.logicBoard[row - i][column + i] = "optional-movement";
            else
                pieceCanMove = true
        }else
            break;
    }
    return pieceCanMove;
}
const markOptionToEat = (row,column, boardElement,direcrtionPieceCanEat)=>{
    boardElement.logicBoard[row][column] += " iCanEat";
    for(let direction of direcrtionPieceCanEat){
        switch(direction){
            case "upLeft":
                for(let i = 1 ; i < 8 ; i++){
                    let cellContent = boardElement.logicBoard[row-i][column-i]+ "";
                    if(cellContent.includes(boardElement.isBlueTurn ? "red" : "blue")){
                        boardElement.logicBoard[row-i-1][column-i-1] = "optional-movement";
                        break;
                    }
                }
                break;
            case "upRight":
                for(let i = 1 ; i < 8 ; i++){
                    let cellContent = boardElement.logicBoard[row-i][column+i]+ "";
                    if(cellContent.includes(boardElement.isBlueTurn ? "red" : "blue")){
                        boardElement.logicBoard[row-i-1][column+i+1] = "optional-movement";
                        break;
                    }
                }
                break;
            case "downLeft":
                for(let i = 1 ; i < 8 ; i++){
                    let cellContent = boardElement.logicBoard[row+i][column-i]+ "";
                    if(cellContent.includes(boardElement.isBlueTurn ? "red" : "blue")){
                        boardElement.logicBoard[row+i+1][column-i-1] = "optional-movement";
                        break;
                    }
                }
                break;
            case "downRight":
                for(let i = 1 ; i < 8 ; i++){
                    let cellContent = boardElement.logicBoard[row+i][column+i]+ "";
                    if(cellContent.includes(boardElement.isBlueTurn ? "red" : "blue")){
                        boardElement.logicBoard[row+i+1][column+i+1] = "optional-movement";
                        break;
                    }
                }
                break;
        }
    }
}
const addEventListenerToEachCell = (board,  boardElement)=>{
    const cellsArray = board.children;
    for(let i = 0; i< cellsArray.length ; i++){
        const row = Math.floor(i/8);
        const column = i % 8;
        cellsArray[i].addEventListener('click', ()=>{cellClicked(row,column , boardElement)})
    }
}
const getDirectionsThisPieceCanEat = (row,column, boardElement)=>{
    let logicboardCellContent = boardElement.logicBoard[row][column] + '';
    let possibleDirectionToEat = [];
    if(logicboardCellContent.includes("king")){
        possibleDirectionToEat = getDirectionsKingPieceCanEat(row,column, boardElement);
    }else{
        possibleDirectionToEat = getDirectionsRegularPieceCanEat(row,column, boardElement);
    }
    return possibleDirectionToEat;
}
const getDirectionsRegularPieceCanEat = (row,column, boardElement)=>{
    let logicboardCellContent = boardElement.logicBoard[row][column] + '';
    let possibleDirectionToEat = [];
    if(logicboardCellContent.includes("red") || logicboardCellContent.includes("blue")){
        let isRed = logicboardCellContent.includes("red") ? true : false;
        if (row-2 > -1 && column-2 > -1) {
            let nextCellContent = boardElement.logicBoard[row-1][column-1] + '';//up left
            let nextToNextCellContent = boardElement.logicBoard[row-2][column-2] + '';
            if(nextCellContent.includes(isRed?"blue":"red") && !nextToNextCellContent.includes("red") && !nextToNextCellContent.includes("blue"))
                possibleDirectionToEat.push("upLeft")
        }
        if (row-2 > -1 && column+2 < 8) {
            let nextCellContent = boardElement.logicBoard[row-1][column+1] + '';//up right
            let nextToNextCellContent = boardElement.logicBoard[row-2][column+2] + '';
            if(nextCellContent.includes(isRed?"blue":"red") && !nextToNextCellContent.includes("red") && !nextToNextCellContent.includes("blue"))
                possibleDirectionToEat.push("upRight")
        }
        if (row+2 < 8 && column+2 < 8) {
            let nextCellContent = boardElement.logicBoard[row+1][column+1] + '';//down right
            let nextToNextCellContent = boardElement.logicBoard[row+2][column+2] + '';
            if(nextCellContent.includes(isRed?"blue":"red") && !nextToNextCellContent.includes("red") && !nextToNextCellContent.includes("blue"))
                possibleDirectionToEat.push("downRight")
        }
        if (row+2 < 8 && column-2 > -1) {
            let nextCellContent = boardElement.logicBoard[row+1][column-1] + '';//down left
            let nextToNextCellContent = boardElement.logicBoard[row+2][column-2] + '';
            if(nextCellContent.includes(isRed?"blue":"red") && !nextToNextCellContent.includes("red") && !nextToNextCellContent.includes("blue"))
                possibleDirectionToEat.push("downLeft")
        }
    }
    return possibleDirectionToEat;
}
const getDirectionsKingPieceCanEat = (row,column, boardElement)=>{
    let possibleDirectionToEat = [];
    for(let i = 1; i < 8 ; i++){//up left
        if (row -i - 1 > -1 && column -i -1 > -1) {
            let CellContent = boardElement.logicBoard[row-i][column-i] + '';
            let nextCellContent = boardElement.logicBoard[row-i-1][column-i-1] + '';
            if(CellContent.includes(boardElement.isBlueTurn ? "red" : "blue") && !nextCellContent.includes("red") && !nextCellContent.includes("blue")){
                possibleDirectionToEat.push("upLeft");
                break;
            }else if(CellContent.includes(boardElement.isBlueTurn ? "blue" : "red") || (CellContent.includes(boardElement.isBlueTurn ? "red" : "blue") && (nextCellContent.includes("red") || nextCellContent.includes("blue")))){
                break;
            }
        }else{
            break;
        }
    }
    for(let i = 1; i < 8 ; i++){//up right
        if (row -i - 1 > -1 && column +i +1 < 8) {
            let CellContent = boardElement.logicBoard[row-i][column+i] + '';
            let nextCellContent = boardElement.logicBoard[row-i-1][column+i+1] + '';
            if(CellContent.includes(boardElement.isBlueTurn ? "red" : "blue") && !nextCellContent.includes("red") && !nextCellContent.includes("blue")){
                possibleDirectionToEat.push("upRight");
                break;
            }else if(CellContent.includes(boardElement.isBlueTurn ? "blue" : "red") || (CellContent.includes(boardElement.isBlueTurn ? "red" : "blue") && (nextCellContent.includes("red") || nextCellContent.includes("blue")))){
                break;
            }
        }else break;
    }
    for(let i = 1; i < 8 ; i++){//down right
        if (row +i +1 < 8 && column +i +1 < 8) {
            let CellContent = boardElement.logicBoard[row+i][column+i] + '';
            let nextCellContent = boardElement.logicBoard[row+i+1][column+i+1] + '';
            if(CellContent.includes(boardElement.isBlueTurn ? "red" : "blue") && !nextCellContent.includes("red") && !nextCellContent.includes("blue")){
                possibleDirectionToEat.push("downRight");
                break;
            }else if(CellContent.includes(boardElement.isBlueTurn ? "blue" : "red") || (CellContent.includes(boardElement.isBlueTurn ? "red" : "blue") && (nextCellContent.includes("red") || nextCellContent.includes("blue")))){
                break;
            }
        }else break;
    }
    for(let i = 1; i < 8 ; i++){//down left
        if (row +i +1 < 8 && column -i -1 > -1) {
            let CellContent = boardElement.logicBoard[row+i][column-i] + '';
            let nextCellContent = boardElement.logicBoard[row+i+1][column-i-1] + '';
            if(CellContent.includes(boardElement.isBlueTurn ? "red" : "blue") && !nextCellContent.includes("red") && !nextCellContent.includes("blue")){
                possibleDirectionToEat.push("downLeft");
                break;
            }else if(CellContent.includes(boardElement.isBlueTurn ? "blue" : "red") || (CellContent.includes(boardElement.isBlueTurn ? "red" : "blue") && (nextCellContent.includes("red") || nextCellContent.includes("blue")))){
                break;
            }
        }else{
            break;
        } 
    }
    return possibleDirectionToEat;
}
const createElementOfBoard = ()=>{
    const newBoard = document.createElement("div");
    newBoard.classList.add("game-erea");
    const gameInformation = document.createElement("div");
    gameInformation.classList.add("game-information")
    newBoard.appendChild(gameInformation);
    const statusBar = document.createElement("div");
    statusBar.classList.add("status-bar");
    gameInformation.appendChild(statusBar);
    const bluePlayerStatus = document.createElement("span");
    bluePlayerStatus.classList.add("blue-player-status");
    statusBar.appendChild(bluePlayerStatus);
    const redPlayerStatus = document.createElement("span");
    redPlayerStatus.classList.add("red-player-status");
    statusBar.appendChild(redPlayerStatus);
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-board-button");
    removeButton.addEventListener('click',()=>{
        newBoard.remove();
        boardsCounter--
        renderBoardsCount();
    })
    gameInformation.appendChild(removeButton);
    const removeButtonIcon = document.createElementNS("http://www.w3.org/2000/svg","svg");
    removeButtonIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    removeButtonIcon.setAttribute("class", "ionicon");
    removeButtonIcon.setAttribute("viewBox", "0 0 512 512");
    removeButton.appendChild(removeButtonIcon);
    const pathOfRemoveBtnIcon = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathOfRemoveBtnIcon.setAttribute("fill","none");
    pathOfRemoveBtnIcon.setAttribute("stroke","currentColor");
    pathOfRemoveBtnIcon.setAttribute("stroke-linecap","round");
    pathOfRemoveBtnIcon.setAttribute("stroke-linejoin","round");
    pathOfRemoveBtnIcon.setAttribute("stroke-width","32");
    pathOfRemoveBtnIcon.setAttribute("d","M368 368L144 144M368 144L144 368");
    removeButtonIcon.appendChild(pathOfRemoveBtnIcon);
    const board = document.createElement("div");
    board.classList.add("board");
    newBoard.appendChild(board);
    const gameOverScreen = document.createElement("div");
    gameOverScreen.innerHTML = "GAME OVER!"
    gameOverScreen.classList.add("game-over");
    newBoard.appendChild(gameOverScreen);
    for(let i = 0 ; i < 64 ; i++){
        const cell = document.createElement("div");
        board.appendChild(cell);
    }
    return [newBoard, board,redPlayerStatus,bluePlayerStatus,gameOverScreen];
}





// global variables and functions
let boardsCounter = 0;
function renderBoardsCount(){
    document.getElementById("boards-counter").innerHTML = boardsCounter;
}
function render(boardObjcet){
    const cells = boardObjcet.Board.children
    let cellNum = 0;
    for(let i = 0 ; i < 8 ; i++){
        let isBlackCell = i % 2 === 0 ? true : false
        for(let x = 0 ; x < 8 ; x++){
            isBlackCell = !isBlackCell
            cells[cellNum].className = isBlackCell ? "black-cell" : "white-cell";
            cellNum++;
        }
    }
    cellNum = 0;
    let numOfRedPieces = 0;
    let numOfBluePieces = 0;
    for(let i = 0 ; i < 8 ; i++){
        for(let x = 0 ; x < 8 ; x++){
            const logicCellContent = boardObjcet.logicBoard[i][x] + "";
            if(logicCellContent.includes("red"))
                numOfRedPieces++
            if(logicCellContent.includes("blue"))
                numOfBluePieces++
            if(boardObjcet.logicBoard[i][x] != null){
                const classesToAdd = boardObjcet.logicBoard[i][x].split(" ");
                for(let i = 0 ; i < classesToAdd.length ; i++)
                    if(classesToAdd[i] !== " " && classesToAdd[i] != null && classesToAdd[i].length > 0)
                        cells[cellNum].classList.add(classesToAdd[i]); 
            }
            cellNum++;
        }
    }
    const sumOfpieces = numOfBluePieces+numOfRedPieces;
    let redPresent = (numOfRedPieces / sumOfpieces) * 90;
    let bluePresent = (numOfBluePieces / sumOfpieces) * 90;
    bluePresent = bluePresent + '%'
    redPresent = redPresent + '%'
    boardObjcet.blueStatusBar.style.width = bluePresent;
    boardObjcet.redStatusBar.style.width = redPresent;
    if(boardObjcet.isBlueTurn){
        boardObjcet.blueStatusBar.classList.add("blue-led-light");
        boardObjcet.blueStatusBar.style.zIndex = "1";
        boardObjcet.redStatusBar.classList.remove("red-led-light");
        boardObjcet.redStatusBar.style.zIndex = "0";
    }
    else{
        boardObjcet.blueStatusBar.classList.remove("blue-led-light");
        boardObjcet.blueStatusBar.style.zIndex = "0";
        boardObjcet.redStatusBar.classList.add("red-led-light");
        boardObjcet.redStatusBar.style.zIndex = "1";
    }
    if(boardObjcet.isGameOver){
        boardObjcet.gameOverScreen.style.display = "block"
        boardObjcet.gameOverScreen.innerHTML = boardObjcet.isBlueTurn ? "RED PLAYER WON!" : "BLUE PLAYER WON!";
        boardObjcet.redStatusBar.classList.remove("red-led-light");
        boardObjcet.blueStatusBar.classList.remove("blue-led-light");
        boardObjcet.redStatusBar.style.style.borderRadius = "15px 15px 15px 15px";
        boardObjcet.blueStatusBar.style.style.borderRadius = "15px 15px 15px 15px";
    }
}
function addNewBoard(){
    const newDomBoard = createElementOfBoard();
    const boardElement = {
        isMultipleEating: false,
        boardDom: newDomBoard,
        Board: newDomBoard[1],
        redStatusBar:newDomBoard[2],
        blueStatusBar:newDomBoard[3],
        gameOverScreen:newDomBoard[4],
        logicBoard: [["red-piece",null,"red-piece",null,"red-piece",null,"red-piece",null],
                    [null,"red-piece",null,"red-piece",null,"red-piece",null,"red-piece"],
                    ["red-piece",null,"red-piece",null,"red-piece",null,"red-piece",null],
                    [null,null,null,null,null,null,null,null],
                    [null,null,null,null,null,null,null,null],
                    [null,"blue-piece",null,"blue-piece",null,"blue-piece",null,"blue-piece"],
                    ["blue-piece",null,"blue-piece",null,"blue-piece",null,"blue-piece",null],
                    [null,"blue-piece",null,"blue-piece",null,"blue-piece",null,"blue-piece"]],
        isBlueTurn: true,
        isGameOver: false
    }
    addEventListenerToEachCell(newDomBoard[1] , boardElement);
    document.getElementById("primery-grid").appendChild(newDomBoard[0]);
    render(boardElement);
    boardsCounter++;
    renderBoardsCount();
}