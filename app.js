var level = 0;
var words = [];
var correctWord = "";
var wordIndex = -1;

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
            console.log("Selected level 2");
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
            words.push({"word":data.level_1[i].word,"sentence":data.level_1[i].sentence})
            var word = data.level_1[i].word;
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
        document.getElementById("question").innerHTML = words[wordIndex].sentence;
    }else{
        document.getElementById("question").innerHTML = "You have answered all the questions!";
    }
}

function chooseWord(word) {
    if(word==correctWord){
        document.getElementById(word).style.textDecoration = "line-through";
        document.getElementById(word).style.cursor = "auto";
        document.getElementById(word).onclick = "";
        words.splice(wordIndex, 1);
        console.log("YOU GOT IT!!");
    }
    getQuestion();
}