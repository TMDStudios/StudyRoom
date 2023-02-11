var level = 0;
var words = [];
var correctWord = "";
var wordIndex = -1;
var minutes = 0;
var seconds = 0;
var timer = null;
var totalTime = 0;

function showOptions() {
    document.getElementById("start").innerHTML = "Select Activity";
    document.getElementById("options").style.display = "flex";
    document.getElementById("options").style.height = "auto";
    document.getElementById("options").style.overflow = "auto";
    document.getElementById("options").style.opacity = "1";
    document.getElementById("option1").style.display = "flex";
    document.getElementById("option2").style.display = "flex";
    document.getElementById("option3").style.display = "flex";
}

function activitySelect(num) {
    switch(num) {
        case 1:
            document.getElementById("option1").className = "selected";
            document.getElementById("option1").innerHTML = '<p>Fill in the Blanks</p>';

            document.getElementById("option2").innerHTML = '';
            document.getElementById("option3").innerHTML = '<p onClick="reset()">Reset</p>';

            activityOptions(1);
            break;
        case 2:
            console.log("Activity 2");
            break;
        case 3:
            console.log("Activity 3");
            break;
        default:
            console.log("Activity OTHER");
    }
}

function activityOptions(num) {
    switch(num) {
        case 1:
            document.getElementById("option2").innerHTML = '<select id="level" onchange="selectLevel()"><option value="0">Select Level</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>';
            break;
        case 2:
            console.log("Activity Option 2");
            break;
        case 3:
            console.log("Activity Option 3");
            break;
        default:
            console.log("Activity Option OTHER");
    }
}

function selectLevel() {
    level = parseInt(document.getElementById("level").value);
    document.getElementById("option2").className = "selected";
    document.getElementById("option2").innerHTML = '<p>Level '+level+'</p>';

    switch(level) {
        case 1:
            startLevel();
            break;
        case 2:
            startLevel();
            break;
        case 3:
            console.log("Selected level 2");
            break;
        default:
            console.log("Selected level OTHER"+level);
    }
}

function startLevel() {
    switch(level) {
        case 1:
            getLocalJson("level1.json");
            console.log("Starting level 1");
            document.getElementById("menu").innerHTML = '<h3 id="start">Fill in the Blanks - Level 1</h3>';
            document.getElementById("activity").style.opacity = 1;    
            startTimer();      
            break;
        case 2:
            getLocalJson("level2.json");
            console.log("Starting level 2");
            document.getElementById("menu").innerHTML = '<h3 id="start">Fill in the Blanks - Level 2</h3>';
            document.getElementById("activity").style.opacity = 1;    
            startTimer();      
            break;
        default:
            console.log("Coming soon");
    }
}

function reset() {
    window.location.replace("/");
}

function getLocalJson (file) {
    let req = new XMLHttpRequest();
    req.open("GET", 'json/'+file);
    req.onload = function(){
        var data = JSON.parse(this.responseText);
        var wordRow = '<p class="wordRow">';
        for(var i=0; i<10; i++){
            words.push({"word":data.words[i].word,"sentence":data.words[i].sentence})
            var word = data.words[i].word;
            var wordSpan = '<span id="'+word+'" onclick="chooseWord(\''+word+'\')">'+word+'</span>';
            wordRow += wordSpan;
            if((i+1)%3==0){
                wordRow += '</p><p class="wordRow">';
            }
        }
        wordRow += '</p>';
        document.getElementById("wordBank").innerHTML = wordRow;  
        
        getQuestion();
    }
    req.send();
}

function getQuestion() {
    if(words.length>0){
        wordIndex = Math.floor(Math.random() * words.length);
        correctWord = words[wordIndex].word;
        var sentence = words[wordIndex].sentence.toLowerCase();
        sentence = sentence.replace(correctWord, "_____");
        var firstLetter = sentence[0].toUpperCase();
        sentence = firstLetter + sentence.slice(1,sentence.length);
        document.getElementById("question").innerHTML = sentence;
    }else{
        clearInterval(timer);
        saveScore();
        document.getElementById("question").innerHTML = "You have answered all the questions!\nYour total time was "+document.getElementById("totalTime").innerHTML;
    }
}

function saveScore() {
    let name = "";
    if(confirm("Upload time to leaderboard?")){
        name = prompt("Enter Name:");
    }else{
        name = "Anonymous";
    }

    let req = new XMLHttpRequest();
    req.open('GET', "https://www.purgomalum.com/service/containsprofanity?text="+name);
    req.onload = function() {
        if(this.responseText.includes("true")){
            name = "Anonymous";
        }
        console.log(name);

        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:8000/leaderboard/add/");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("name="+name+"&time="+totalTime+"&level="+level);
    }
    req.send();
}

function chooseWord(word) {
    if(word==correctWord){
        document.getElementById(word).style.textDecoration = "line-through";
        document.getElementById(word).style.cursor = "auto";
        document.getElementById(word).style.color = "#D61C4E";
        document.getElementById(word).style.backgroundColor = "rgba(0,0,0,.25)";
        document.getElementById(word).onclick = "";
        words.splice(wordIndex, 1);
        console.log("YOU GOT IT!!");
    }
    getQuestion();
}

function startTimer() {
    var start = new Date();

    timer = setInterval(_ => {
        var current = new Date();
        let count = current - start;
        totalTime = count;
        let ms = count % 1000;
        minutes = Math.floor((count / 60000)) % 60;
        seconds = Math.floor((count /  1000)) % 60;
        if(seconds<10){
            if(ms<10){
                document.getElementById("timer").innerHTML = '<p class="timer"><span>Time: </span><span id="totalTime">'+minutes+':0'+seconds+':00'+ms+'</span></p>';
            }else if(ms<100){
                document.getElementById("timer").innerHTML = '<p class="timer"><span>Time: </span><span id="totalTime">'+minutes+':0'+seconds+':0'+ms+'</span></p>';
            }else{
                document.getElementById("timer").innerHTML = '<p class="timer"><span>Time: </span><span id="totalTime">'+minutes+':0'+seconds+':'+ms+'</span></p>';
            }
        }else{
            if(ms<10){
                document.getElementById("timer").innerHTML = '<p class="timer"><span>Time: </span><span id="totalTime">'+minutes+':'+seconds+':00'+ms+'</span></p>';
            }else if(ms<100){
                document.getElementById("timer").innerHTML = '<p class="timer"><span>Time: </span><span id="totalTime">'+minutes+':'+seconds+':0'+ms+'</span></p>';
            }else{
                document.getElementById("timer").innerHTML = '<p class="timer"><span>Time: </span><span id="totalTime">'+minutes+':'+seconds+':'+ms+'</span></p>';
            }
        }
    }, 10);  
}