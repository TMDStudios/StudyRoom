var level = 0;
var words = [];
var correctWord = "";
var wordIndex = -1;
var minutes = 0;
var seconds = 0;
var timer = null;
var totalTime = 0;
var username = "Anonymous";
var penalty = 0;
var activityType = 1;
var isRegular = false;
var preterite = "";
var pastParticiple = "";
var activityOver = false;
var wordMax = 10;
// 1 - Fill in the blank, 2 - Regular/Irregular, 3 - Conjugation

// Banners
var banners = [
    "media/plcLogo.png",
    "media/bitcoinbanner.png",
    "media/shirtsEtc.png"
]

var links = [
    "https://play.google.com/store/apps/details?id=com.tmdstudios.python",
	"https://freebitco.in/?r=15749838",
	"https://www.redbubble.com/people/shirtsetcetera/shop"
]

function showOptions() {
    document.getElementById("start").innerHTML = "Select Activity";
    document.getElementById("options").style.display = "flex";
    document.getElementById("options").style.height = "auto";
    document.getElementById("options").style.overflow = "auto";
    document.getElementById("options").style.opacity = "1";
    document.getElementById("option1").style.display = "flex";
    document.getElementById("option2").style.display = "flex";
    document.getElementById("option3").style.display = "flex";
    showBanner();
}

function showBanner(){
    var randomBannerIndex = Math.floor(Math.random() * banners.length);
    document.getElementById("banner").innerHTML = '<a href="'+links[randomBannerIndex]+'"><img src="'+banners[randomBannerIndex]+'"/></a>';
}

function hideBanner(){
    document.getElementById("banner").innerHTML = "";
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
            document.getElementById("option1").className = "selected";
            document.getElementById("option1").innerHTML = '<p>Regular & Irregular Verbs</p>';

            document.getElementById("option2").innerHTML = '';
            document.getElementById("option3").innerHTML = '<p onClick="reset()">Reset</p>';

            activityOptions(2);
            break;
        case 3:
            document.getElementById("option1").className = "selected";
            document.getElementById("option1").innerHTML = '<p>Count & Noncount Nouns</p>';

            document.getElementById("option2").innerHTML = '';
            document.getElementById("option3").innerHTML = '<p onClick="reset()">Reset</p>';

            activityOptions(3);
            break;
        default:
            console.log("Activity OTHER");
    }
}

function activityOptions(num) {
    activityType = num;
    switch(num) {
        case 1:
            document.getElementById("option2").innerHTML = levelSelection(5);
            break;
        case 2:
            document.getElementById("option2").innerHTML = levelSelection(5);
            break;
        case 3:
            document.getElementById("option2").innerHTML = levelSelection(5);
            break;
        default:
            console.log("Activity Option OTHER");
    }
}

function levelSelection(numOfLevels){
    var selectionString = '<select id="level" onchange="selectLevel()"><option value="0">Select Level</option>';
    for(var i=1; i<numOfLevels+1; i++){
        selectionString+='<option value="'+i+'">'+i+'</option>'
    }
    return selectionString+'</select>';
}

function selectLevel() {
    level = parseInt(document.getElementById("level").value);
    document.getElementById("option2").className = "selected";
    document.getElementById("option2").innerHTML = '<p>Level '+level+'</p>';

    startLevel();
}

function startLevel() {
    document.getElementById("credits").style.display = "none";
    document.getElementById("banner").style.marginBottom = "0px";
    switch(level) {
        case 1:
            getLocalJson("level1.json");     
            break;
        case 2:
            getLocalJson("level2.json");   
            break;
        case 3:
            getLocalJson("level3.json");
            break;
        case 4:
            getLocalJson("level4.json");
            break;
        case 5:
            getLocalJson("level5.json");
            break;
        default:
            console.log("Coming soon");
    }

    switch(activityType) {
        case 1:
            document.getElementById("menu").innerHTML = '<h3 id="start">Fill in the Blanks '+level+'</h3>';    
            break;
        case 2:
            document.getElementById("menu").innerHTML = '<h3 id="start">Regular or Irregular '+level+'</h3>'; 
            break;
        case 3:
            document.getElementById("menu").innerHTML = '<h3 id="start">Conjugation '+level+'</h3>'; 
            break;
        default:
            console.log("Coming soon");
    }
    console.log("Starting level "+level);
    
    document.getElementById("activity").style.transition = "opacity 2s ease-out";
    document.getElementById("activity").style.opacity = 1;    
    startTimer(); 
}

function reset() {
    window.location.replace("/");
}

function getLocalJson (file) {
    let req = new XMLHttpRequest();
    req.open("GET", 'json/'+file);
    req.onload = function(){
        var data = JSON.parse(this.responseText);
        switch(activityType) {
            case 1:
                fillInTheBlanks(data);   
                break;
            case 2:
                regularAndIrregularVerbs(data);
                break;
            case 3:
                conjugation(data);
                break;
            default:
                console.log("Coming soon");
        }
    }
    req.send();
}

function fillInTheBlanks(data) {
    var wordRow = '<p class="wordRow">';
    var indexPositions = [];
    while(indexPositions.length<10){
        var randomNumber = Math.floor(Math.random() * data.words.length);
        if(!indexPositions.includes(randomNumber)){
            indexPositions.push(randomNumber);
        }
    }
    for(var i=0; i<10; i++){
        words.push({"word":data.words[indexPositions[i]].word,"sentence":data.words[indexPositions[i]].sentence})
        var word = data.words[indexPositions[i]].word;
        var wordSpan = '<span id="'+word+'" onclick="chooseWord(\''+word+'\')">'+word+'</span>';
        wordRow += wordSpan;
        if((i+1)%3==0){
            wordRow += '</p><p class="wordRow">';
        }
    }
    wordRow += '</p>';
    document.getElementById("wordBank").innerHTML = wordRow;  
    
    getSentence();
}

function regularAndIrregularVerbs(data) {
    var indexPositions = [];
    while(indexPositions.length<10){
        var randomNumber = Math.floor(Math.random() * data.words.length);
        if(!indexPositions.includes(randomNumber) && data.words[randomNumber].regular!=undefined){
            indexPositions.push(randomNumber);
        }
    }
    for(var i=0; i<10; i++){
        words.push({"word":data.words[indexPositions[i]].word,"regular":data.words[indexPositions[i]].regular})
    }

    document.getElementById("question").style.textAlign = 'center';
    document.getElementById("activity").innerHTML += '<div id="regularIrregular"></div>';
    document.getElementById("regularIrregular").innerHTML += '<span onclick="regOrNot(\'true\')">Regular</span><span onclick="regOrNot(\'false\')">Irregular</span>';
    document.getElementById("wordsRemaining").innerHTML = '<p>Words Remaining: 10/10</p>';
    pickWord();
}

function conjugation(data) {
    var indexPositions = [];
    var count = 0;
    for(var i=0; i<data.words.length; i++){
        if(data.words[i].conjugation!=undefined){
            count++;
        }
    }
    wordMax = count;
    while(indexPositions.length<wordMax){
        var randomNumber = Math.floor(Math.random() * data.words.length);
        if(!indexPositions.includes(randomNumber) && data.words[randomNumber].conjugation!=undefined){
            indexPositions.push(randomNumber);
        }
    }

    for(var i=0; i<wordMax; i++){
        words.push({"word":data.words[indexPositions[i]].word,"conjugation":data.words[indexPositions[i]].conjugation})
    }

    document.getElementById("question").style.textAlign = 'center';
    document.getElementById("activity").innerHTML += '<div id="conjugation"></div>';
    document.getElementById("conjugation").innerHTML += '<span><input type="text" id="preterite" placeholder="Simple Past"></span><span><input type="text" id="pastParticiple" placeholder="Past Participle"></span><span id="submitBtn" onclick="checkConjugation()">Submit</span>';
    document.getElementById("wordsRemaining").innerHTML = '<p>Words Remaining: '+wordMax+'/'+wordMax+'</p>';
    pickWord();
}

document.addEventListener('keydown', (event) => {
    if(event.key.match("Enter")){
        if(document.getElementById("preterite")==document.activeElement){
            document.getElementById("pastParticiple").focus();
        }else{
            checkConjugation()
        } 
    }
}, false);

function pickWord() {
    if(words.length>0){
        wordIndex = Math.floor(Math.random() * words.length);
        if(activityType==2){
            isRegular = words[wordIndex].regular;
        }else{
            var conjugationAnswer = words[wordIndex].conjugation.split(",");
            preterite = conjugationAnswer[1].trim();
            pastParticiple = conjugationAnswer[2].trim();
        }
        document.getElementById("question").innerHTML = words[wordIndex].word;
    }else{
        clearInterval(timer);
        saveScore();
        document.getElementById("timer").innerHTML = '<p class="timer"><span>Time: </span><span id="totalTime">'+convertTime(totalTime+penalty*1000)+'</span></p>';
        document.getElementById("question").innerHTML = "Great job!\nYour total time was "+document.getElementById("totalTime").innerHTML;
        document.getElementById("activity").innerHTML += '<div class="centerDiv"><p id="tryAgain" class="leaderboardRow" onClick="reset()">Try Again</p></div>';
    }
}

function regOrNot(selection) {
    if(!activityOver){
        if(selection==isRegular){
            words.splice(wordIndex, 1);
            document.getElementById("wordsRemaining").innerHTML = '<p>Words Remaining:  '+words.length+'/10</p>';
        }else{
            penalty += 5;
            document.getElementById("penalty").innerHTML = '<p class="penalty"><span>Penalty: </span><span id="totalTime">'+penalty+'</span> seconds</p>';
            document.getElementById("penalty").style.color = "red";
        }
        pickWord();
    }
}

function checkConjugation() {
    if(!activityOver){
        if(preterite==document.getElementById("preterite").value.trim().toLowerCase() && pastParticiple==document.getElementById("pastParticiple").value.trim().toLowerCase()){
            words.splice(wordIndex, 1);
            document.getElementById("wordsRemaining").innerHTML = '<p>Words Remaining:  '+words.length+'/'+wordMax+'</p>';
        }else{
            penalty += 5;
            document.getElementById("penalty").innerHTML = '<p class="penalty"><span>Penalty: </span><span id="totalTime">'+penalty+'</span> seconds</p>';
            document.getElementById("penalty").style.color = "red";
        }
        document.getElementById("preterite").value = "";
        document.getElementById("pastParticiple").value = "";
        pickWord();
        document.getElementById("preterite").focus();
    }
}

function chooseWord(word) {
    if(!activityOver){
        if(word==correctWord){
            document.getElementById(word).style.textDecoration = "line-through";
            document.getElementById(word).style.cursor = "auto";
            document.getElementById(word).style.color = "#D61C4E";
            document.getElementById(word).style.borderColor = "#d61c4e4d";
            document.getElementById(word).style.backgroundColor = "rgba(0,0,0,.25)";
            document.getElementById(word).onclick = "";
            words.splice(wordIndex, 1);
        }else{
            penalty += 5;
            document.getElementById("penalty").innerHTML = '<p class="penalty"><span>Penalty: </span><span id="totalTime">'+penalty+'</span> seconds</p>';
            document.getElementById("penalty").style.color = "red";
        }
        getSentence();
    }
}

function getSentence() {
    if(words.length>0){
        wordIndex = Math.floor(Math.random() * words.length);
        correctWord = words[wordIndex].word;
        var sentence = words[wordIndex].sentence;
        document.getElementById("question").innerHTML = sentence.replace(correctWord, "_____");
    }else{
        clearInterval(timer);
        saveScore();
        document.getElementById("timer").innerHTML = '<p class="timer"><span>Time: </span><span id="totalTime">'+convertTime(totalTime+penalty*1000)+'</span></p>';
        document.getElementById("question").innerHTML = "Great job!\nYour total time was "+document.getElementById("totalTime").innerHTML;
    }
}

function saveScore() {
    activityOver=true;
    hideBanner();
    if(activityType==1){
        if(confirm("Your total time: "+convertTime(totalTime+penalty*1000)+"\nUpload time to leaderboard?")){
            username = prompt("Enter Name:\n(Up to 9 characters)");
        }
    
        let req = new XMLHttpRequest();
        req.open('GET', "https://www.purgomalum.com/service/containsprofanity?text="+username);
        req.onload = function() {
            if(this.responseText.includes("true")){
                username = "Anonymous";
            }
            if(username.length>9){
                username = username.slice(0,9);
            }
    
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", "https://devroboto.pythonanywhere.com/leaderboard/add/");
            xhttp.onload = function(){
                showLeaderboard();
            }
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("name="+username+"&time="+(totalTime+penalty*1000)+"&level="+level);
            document.getElementById("overlay").style.display = "flex";
        }
        req.send();
    }
}

function showLeaderboard() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://devroboto.pythonanywhere.com/leaderboard/"+level);
    xhttp.onload = function(){
        document.getElementById("overlay").style.display = "none";
        document.getElementById("activity").style.display = "none"; 
        document.getElementById("leaderboard").style.transition = "opacity 2s ease-out";
        document.getElementById("leaderboard").style.height = "auto";
        document.getElementById("leaderboard").style.opacity = 1;
        var data = JSON.parse(this.responseText);
        document.getElementById("leaderboard").innerHTML += '<p class="leaderboardTitle">LEVEL '+level+' TOP 10 TIMES</p>';
        document.getElementById("leaderboard").innerHTML += '<p class="leaderboardRow"><span class="rank">#</span><span class="name">NAME</span><span class="time">TIME</span></p>';
        for(var i=0; i<data.length; i++){
            if(i<10){
                try{
                    var convertedTime = convertTime(data[i].time);
                    if(data[i].time==totalTime+penalty*1000){
                        document.getElementById("leaderboard").innerHTML += '<p class="currentTimeRow"><span class="rank">'+(i+1)+'</span><span class="name">'
                        +data[i].name+'</span><span class="time">'+convertedTime+'</span></p>';
                    }else{
                        document.getElementById("leaderboard").innerHTML += '<p class="leaderboardRow"><span class="rank">'+(i+1)+'</span><span class="name">'
                        +data[i].name+'</span><span class="time">'+convertedTime+'</span></p>';
                    }
                }catch(e){
    
                }
            }else{
                if(data[i].time==totalTime+penalty*1000){
                    document.getElementById("leaderboard").innerHTML += '<p class="leaderboardTitle">YOUR RANK</p>';
                    document.getElementById("leaderboard").innerHTML += '<p class="currentTimeRow"><span class="rank">'+(i+1)+'</span><span class="name">'
                            +username+'</span><span class="time">'+convertTime(totalTime+penalty*1000)+'</span></p>';
                }
            }
        }
        document.getElementById("leaderboard").innerHTML += '<p id="tryAgain" class="leaderboardRow" onClick="reset()">Try Again</p>';
    }
    xhttp.send();
}

function convertTime(totalMs) {
    let ms = totalMs % 1000;
    let minutes = Math.floor((totalMs / 60000)) % 60;
    let seconds = Math.floor((totalMs / 1000)) % 60;
    if(seconds<10){
        if(ms<10){
            return ''+minutes+':0'+seconds+':00'+ms+'';
        }else if(ms<100){
            return ''+minutes+':0'+seconds+':0'+ms+'';
        }else{
            return ''+minutes+':0'+seconds+':'+ms+'';
        }
    }else{
        if(ms<10){
            return ''+minutes+':'+seconds+':00'+ms+'';
        }else if(ms<100){
            return ''+minutes+':'+seconds+':0'+ms+'';
        }else{
            return ''+minutes+':'+seconds+':'+ms+'';
        }
    }
}

function startTimer() {
    document.getElementById("welcome").style.display = "none";
    document.getElementById("menu").style.margin = "2vh";
    var start = new Date();

    timer = setInterval(_ => {
        var current = new Date();
        let count = current - start;
        totalTime = count;
        document.getElementById("timer").innerHTML = '<p class="timer"><span>Time: </span><span id="totalTime">'+convertTime(count)+'</span></p>';
    }, 10);  
}

function showInfo(){
    var infoWindow = '<div><span onclick="hideInfo()">x</span></div>';
    if(totalTime>0){
        switch(activityType) {
            case 1:
                infoWindow+='<h3>Fill in the Blanks</h3>';
                infoWindow+='<p>Click on a word to complete the sentece.</p>';
                break;
            case 2:
                infoWindow+='<h3>Regular & Irregular Verbs</h3>';
                infoWindow+='<p>Identify the word as a regular or irregular verb.</p>';
                break;
            default:
                infoWindow+='<h3>Conjugation</h3>';
                infoWindow+='<p>Conjugate the verb. You only need to provide the siple past and past participle form.</p>';
        }
        infoWindow+='<hr>';
        infoWindow+='<span id="resetLink" onclick="resetAlert()">Click here to go back to the main menu.</span>';
        infoWindow+='<span id="mistakeLink" onclick="reportMistake()">Click here to report a mistake.</span>';
        document.getElementById("activity").style.opacity = ".1";
    }else{
        document.getElementById("welcome").style.opacity = ".1";
        document.getElementById("menu").style.display = "none";
        infoWindow+='<p style="padding-top: 100px;">Choose an activity to get started.</p>';
    }
    document.getElementById("menu").style.opacity = ".1";  
    document.getElementById("info").style.display = "none";
    document.getElementById("infoBox").innerHTML = infoWindow;
    document.getElementById("infoBox").style.display = "flex";
}

function hideInfo(){
    if(totalTime>0){
        document.getElementById("activity").style.opacity = "1";
    }else{
        document.getElementById("menu").style.display = "flex";
        document.getElementById("welcome").style.opacity = "1";
    }
    document.getElementById("info").style.display = "block";
    document.getElementById("menu").style.opacity = "1";
    document.getElementById("infoBox").innerHTML = '';
    document.getElementById("infoBox").style.display = "none";
}

function resetAlert(){
    if(confirm("Quit activity and return to main menu?")){
        reset();
    }
}

function reportMistake(){
    alert("Coming soon");
}