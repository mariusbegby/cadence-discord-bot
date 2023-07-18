let audio = new Audio('.mp3');
let play =document.getElementById("");
play.addEventListener("click" , () =>{

    if(audio.paused || audio.currentTime <= 0){
        audio.play();
        wave.classList.add('active1');
        

    }
    else{
        audio.pause();
        wave.classList.remove('active1');
       
}
});

