window.addEventListener('load', (event) => {
    ApplyGameSettings() 
});    
var mines = [];  // array of mines
var mineCountSquares = [] // array of mine count of all squares
function SquareClick(obj){   
    
    var size = 0 // number of squares 
    var mineNum = 0 // number of mines
    var cols = 0 // number of columns
      
    //Getting settings:
    if (document.getElementById("beg").checked) {size = 81; mineNum = 10; cols = 9; }
    else if (document.getElementById("med").checked) {size = 256; mineNum = 40; cols = 16; }  
    else if (document.getElementById("exp").checked) {size = 480; mineNum = 99; cols = 30; } 
    
    if (!document.querySelectorAll(".field-grid")[0].classList.contains('active')) {    // checking if the field is active
        
        document.querySelectorAll(".field-grid")[0].classList.add("active") // activate field if it's not
    
        let squares = document.querySelectorAll(".field-grid")[0].children // all squares    
        let posArray = [];   // array of square positions
        
        for (let i = 0; i < squares.length; i++) { 
            posArray[i] = i; 
            squares[i].id = i;
        }  
        
        obj.classList.remove("hide") // reveal the clicked square

        UnFlagWithLeftClick (obj) // unmark clicked square 

        let initPos = parseInt(obj.id); // getting position of clicked square

        mines = GetAllMines (mineNum, posArray, initPos, cols) 

        mineCountSquares = GetNeighborsOfAllSquares (squares, cols) 

        AutomaticRevealOfZeroNeighbors (squares, cols)     
    } 
    else {  
 
        const squares = document.querySelectorAll(".field-grid")[0].children   // getting all squares   
        let posObj = parseInt(obj.id) // position of the clicked square

        RevealClickedSquare(obj, posObj, mineCountSquares, squares) 

        ClickingMine (mines, posObj, squares) 

        CheckVictory (squares, mineNum)

        UnFlagWithLeftClick (obj)
   
        AutomaticRevealOfZeroNeighbors (squares, cols) 
    }  
};
function GetAllMines (mineNum, posArray, initPos, cols)
{
    let rnd = 0;  
    for (let i = 0; i < mineNum; i++) {      
        rnd = posArray[Math.floor(Math.random() * posArray.length)];
        while (mines.includes(rnd) ||(rnd == initPos) || (rnd == (initPos+1)) || (rnd == (initPos-1)) || (rnd == (initPos+ cols - 1))|| (rnd == (initPos+cols))|| (rnd == (initPos+cols+1)) ||(rnd == (initPos-cols +1 )) || (rnd == (initPos-cols)) || (rnd == (initPos-cols-1))) { 
        rnd = posArray[Math.floor(Math.random() * posArray.length)];
        }   
        mines[i] = rnd  
    } 
     
    return mines
}
function GetNeighborsOfAllSquares (squares, cols) 
{
    counter = 0;
    for (let i =0; i<squares.length; i++)
    {
        for (let j = 0; j < Neighbors(i,cols).length; j++){
                if (mines.includes(Neighbors(i,cols)[j])) counter ++ 
        }
         
        mineCountSquares[i] = counter  
        counter = 0;  
    }
    return mineCountSquares
}
function UnFlagWithLeftClick (obj)
{
    if (obj.classList.contains("marked")) {
        obj.classList.remove("marked")
        document.getElementById("mineCount").innerHTML = parseInt (document.getElementById("mineCount").innerHTML) + 1; 
    }
}
function CheckVictory (squares, mineNum)
{
    let victory = false; 
    for (let i = 0; i< squares.length; i ++)  
        if (!squares[i].classList.contains("hide") ) 
        counter ++; 
    if (counter == (squares.length - mineNum)) victory = true 
    if (victory) {
        document.getElementById("main-img").classList.add("victory-img")
        document.getElementById("gameField").classList.add("disable")
    }
}
function ClickingMine (mines, posObj, squares) 
{
    if (mines.includes(posObj))  { 
        for (let i = 0; i< squares.length; i ++)   
            {      
                if (squares[i].classList.contains("marked")) squares[i].classList.remove("marked")  
                if ( mines.includes(i))  {
                    squares[i].classList.remove("hide")
                    squares[i].classList.add("mine");
                }  
            }  
            document.getElementById("main-img").classList.add("loss-img") 
            document.getElementById("gameField").classList.add("disable");  
            toggleState() 
        } 
}
function RevealClickedSquare (obj, posObj, mineCountSquares, squares) 
{
    if (obj.classList.contains("hide")) obj.classList.remove("hide")  
    squares[posObj].innerHTML = mineCountSquares[posObj];
}
function AutomaticRevealOfZeroNeighbors (squares, cols)
{
    counter = 0 
    repeat = true;
    while (repeat){
        for (let i = 0; i< squares.length; i++){
            if (( mineCountSquares[i] == 0) &&(!squares[i].classList.contains("hide") ) ){ 
                squares[i].innerHTML = ""; 
                for(let j =0; j< Neighbors(i, cols).length;j++){  
                    if ( ( squares[Neighbors(i, cols)[j]].classList.contains( "hide" ) ) && (!mines.includes(Neighbors(i, cols)[j]))) { 
                        squares[Neighbors(i, cols)[j]].classList.remove("hide")
                        squares[Neighbors(i, cols)[j]].innerHTML = mineCountSquares[Neighbors(i, cols)[j]]   
                        if  ( squares[Neighbors(i, cols)[j]].classList.contains( "marked" ) ) {
                            squares[Neighbors(i, cols)[j]].classList.remove("marked") 
                            document.getElementById("mineCount").innerHTML = parseInt (document.getElementById("mineCount").innerHTML) + 1; 
                        }
                        counter ++;
                    } 
                }     
            }  
        }
        if (counter==0) repeat = false;  
        counter = 0;     
    }    
}
function Neighbors(position, cols)
{
    const squares = document.querySelectorAll(".field-grid")[0].children 
    arr = []
    if (position == 0){
        arr.push(1)
        arr.push(cols) 
        arr.push(cols + 1)
    }
    else if (position == (cols-1)){ 
        arr.push(cols - 2)
        arr.push(2*cols - 1)
        arr.push(2*cols - 2)
    }
    else if (position == (squares.length - cols)){
        arr.push(squares.length - cols + 1)
        arr.push(squares.length - 2*cols)
        arr.push(squares.length - 2*cols + 1)
    }
    else if (position == (squares.length - 1)){
        arr.push(squares.length - cols - 2)
        arr.push(squares.length - cols - 1)
        arr.push(squares.length - 2) 
    } 
    else if (position < (cols-1)){ 
        arr.push(position + 1);
        arr.push(position - 1);
        arr.push(position + cols -1);
        arr.push(position + cols);
        arr.push(position + cols + 1); 
    }
    else if (position>(squares.length - cols)){
        arr.push(position + 1);
        arr.push(position - 1);
        arr.push(position - cols +1);
        arr.push(position - cols );
        arr.push(position - cols - 1); 
    }
    else if (( position + 1 ) %cols == 0){
        arr.push(position - 1);
        arr.push(position + cols -1);
        arr.push(position + cols);
        arr.push(position - cols); 
        arr.push(position - cols - 1);
    }
    else if (( position %cols == 0 )&&(position <(squares.length - cols -1))) {
        arr.push(position + 1);
        arr.push(position - cols + 1);
        arr.push(position + cols);
        arr.push(position - cols); 
        arr.push(position + cols + 1);
    } 
    else {
        arr.push(position + 1);
        arr.push(position - 1);
        arr.push(position + cols - 1);
        arr.push(position + cols);
        arr.push(position + cols +1);
        arr.push(position - cols + 1);
        arr.push(position - cols); 
        arr.push(position - cols - 1);
    }
    return arr;
}      
function GetFlagged(obj)
{
    // mySound.play() 
    if (obj.classList.contains("hide"))
    if (!obj.classList.contains("marked")){
        obj.classList.add("marked")   
        document.getElementById("mineCount").innerHTML = parseInt (document.getElementById("mineCount").innerHTML) - 1; 
    }
    else {
        obj.classList.remove("marked")
        document.getElementById("mineCount").innerHTML = parseInt (document.getElementById("mineCount").innerHTML) + 1; 
    }

   
}
function ResetGameFieldAndHeader ()
{
    document.querySelectorAll(".field-grid")[0].classList.remove("active")  
    if (document.getElementById("main-img").classList.contains("victory-img")) document.getElementById("main-img").classList.remove("victory-img") 
    if (document.getElementById("main-img").classList.contains("loss-img")) document.getElementById("main-img").classList.remove("loss-img")
    document.querySelectorAll(".field-grid")[0].innerHTML = "" ; 
    document.getElementById("gameField").classList.remove("disable") 
    mines = [];  // array of mines = 0
    mineCountSquares = [] // array of mine count of all squares  = 0 
} 
function ApplyGameSettings ()
{
    let size = 0
    let mineNum = 0
    if (document.getElementById("beg").checked) {
        mineNum = 10;
        size = 81; 
        document.getElementById("gameField").style.gridTemplateColumns ="auto auto auto auto auto auto auto auto auto";  
        document.getElementById("gameField").style.maxWidth = "360px";
    }
    else if (document.getElementById("med").checked) {
        mineNum = 40
        size = 256;
        document.getElementById("gameField").style.gridTemplateColumns ="auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto "; 
        document.getElementById("gameField").style.maxWidth = "620px";
    }  
    else if (document.getElementById("exp").checked) {
        mineNum = 99
        size = 480; 
        document.getElementById("gameField").style.gridTemplateColumns ="auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto"; 
        document.getElementById("gameField").style.maxWidth = "1800px";  
    } 
    document.getElementById("mineCount").innerHTML = mineNum; 
    for (let i=0; i<size; i++){  
        var iDiv = document.createElement('div');
        iDiv.classList.add ('hide');  
        iDiv.onclick = function() {  
            SquareClick(this);
          }
        iDiv.oncontextmenu = function() { 
            GetFlagged(this); 
          } 
            document.querySelectorAll(".field-grid")[0].appendChild(iDiv)
        }  
}
 function Reset()
 {   
     
     ResetTimer() 
     if (!active) toggleState()  
    ResetGameFieldAndHeader ()  
    ApplyGameSettings()   
}
document.addEventListener('contextmenu', event => event.preventDefault());  // prevent context menu  
      
