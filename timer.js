var active = false
function startTimer () {
    if (active) {
        var timer = document.getElementById("timer").innerHTML 
        var arr = timer.split(":")
        var hour = arr[0]
        var min = arr[1]
        var sec = arr[2]
        if (sec == 59){
            if (min == 59 ){
                hour ++
                min = 0;
                if (hour < 10) hour = "0" + hour
            } else min ++
        if (min < 10) min = "0" + min
        sec = 0
        } else {
            sec ++
            if (sec < 10) sec = "0" + sec
        }
        document.getElementById("timer").innerHTML = hour + ":" + min + ":" + sec
        setTimeout(startTimer,1000) 
    } 
} 
function toggleState (){
    if (active == false) {
        active = true 
        startTimer();
       // document.getElementById("main-img")
    } else {
        active = false;
    } 
}
function ResetTimer () {  
    document.getElementById("timer").innerHTML = "00" + ":" + "00" + ":" + "00"; 
} 
 
window.addEventListener('load', (event) => { 
    toggleState () 
}); 
  
