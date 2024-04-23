var level = 0;
var words = [];
var mistakes = [];
var currentMistake = 0;
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
var checkTimer = 0;
var screenSize = [0, 0];
var resized = false;
var currentBanner = "";
var conjugationsCompleted = 0;
// 1 - Fill in the blank, 2 - Regular/Irregular, 3 - Conjugation, 4 - Unscramble

// Banners
var banners = [
    "media/plcLogo.png",
    "media/bitcoinbanner.png",
    "media/shirtsEtc.png",
    "media/shirtsEtc2.png",
];

var links = [
    "https://play.google.com/store/apps/details?id=com.tmdstudios.python",
    "https://freebitco.in/?r=15749838",
    "https://www.redbubble.com/people/shirtsetcetera/shop",
    "https://www.tostadora.com/shop/shirtsetceterashop/"
];

// Detect virtual keyboard
window.onload = getWindowSize;
window.onresize = checkWindowSize;

function getWindowSize(){
    screenSize = [window.innerWidth, window.innerHeight];
    console.log("get size "+screenSize);
}

function checkWindowSize(){
    if(screenSize[0]>0 && !resized && activityType==3 && totalTime>0){ //make sure the screen size has been detected and conjugation activity is active
        if(window.innerWidth==screenSize[0] && (screenSize[1]-window.innerHeight)>50){
            resized = true;
            hideBanner();
        }
    }
}

function showOptions() {
    document.getElementById("openMenu").innerHTML = "Select Activity";
    document.getElementById("options").style.display = "flex";
    document.getElementById("options").style.height = "auto";
    document.getElementById("options").style.overflow = "auto";
    document.getElementById("options").style.opacity = "1";
    document.getElementById("option1").style.display = "flex";
    document.getElementById("option2").style.display = "flex";
    document.getElementById("option3").style.display = "flex";
    document.getElementById("option4").style.display = "flex";
    showBanner();
}

function showBanner(){
    var randomBannerIndex = Math.floor(Math.random() * banners.length);
    currentBanner = banners[randomBannerIndex];
    document.getElementById("banner").innerHTML = '<a onclick="bannerClick()" href="'+links[randomBannerIndex]+'" target="_blank"><img src="'+banners[randomBannerIndex]+'"/></a>';
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
            document.getElementById("option4").style.display = "none";

            activityOptions(1);
            break;
        case 2:
            document.getElementById("option1").className = "selected";
            document.getElementById("option1").innerHTML = '<p>Regular & Irregular Verbs</p>';

            document.getElementById("option2").innerHTML = '';
            document.getElementById("option3").innerHTML = '<p onClick="reset()">Reset</p>';
            document.getElementById("option4").style.display = "none";

            activityOptions(2);
            break;
        case 3:
            document.getElementById("option1").className = "selected";
            document.getElementById("option1").innerHTML = '<p>Count & Noncount Nouns</p>';

            document.getElementById("option2").innerHTML = '';
            document.getElementById("option3").innerHTML = '<p onClick="reset()">Reset</p>';
            document.getElementById("option4").style.display = "none";

            activityOptions(3);
            break;
        case 4:
            document.getElementById("option1").className = "selected";
            document.getElementById("option1").innerHTML = '<p>Unscramble the Word</p>';

            document.getElementById("option2").innerHTML = '';
            document.getElementById("option3").innerHTML = '<p onClick="reset()">Reset</p>';
            document.getElementById("option4").style.display = "none";

            activityOptions(4);
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
        case 4:
            document.getElementById("option2").innerHTML = levelSelection(5);
            break;
        default:
            console.log("Activity Option OTHER");
    }
}

function levelSelection(numOfLevels){
    var selectionString = '<select id="level" onchange="selectLevel()"><option value="0">Select Word Set</option>';
    var wordSet = 1;
    for(var i=1; i<numOfLevels+1; i++){
        selectionString+='<option value="'+i+'">Words '+wordSet+' to '+(i*100)+'</option>';
        wordSet+=100;
    }
    selectionString+='<option value="0">Random (Advanced)</option>';
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
        case 0:
            getJsonApi(0);
            break;
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
            getJsonApi();
    }

    switch(activityType) {
        case 1:
            if(level==0){
                document.getElementById("menu").innerHTML = '<h3 id="openMenu">Fill in the Blanks</h3>';
            }else{
                document.getElementById("menu").innerHTML = '<h3 id="openMenu">Fill in the Blanks '+level+'</h3>';
            }  
            break;
        case 2:
            if(level==0){
                document.getElementById("menu").innerHTML = '<h3 id="openMenu">Regular or Irregular</h3>';
            }else{
                document.getElementById("menu").innerHTML = '<h3 id="openMenu">Regular or Irregular '+level+'</h3>';
            }
            
            break;
        case 3:
            if(level==0){
                document.getElementById("menu").innerHTML = '<h3 id="openMenu">Conjugation</h3>';
            }else{
                document.getElementById("menu").innerHTML = '<h3 id="openMenu">Conjugation '+level+'</h3>';
            }
            break;
        case 4:
            if(level==0){
                document.getElementById("menu").innerHTML = '<h3 id="openMenu">Unscramble the Word</h3>';
            }else{
                document.getElementById("menu").innerHTML = '<h3 id="openMenu">Unscramble the Word '+level+'</h3>';
            }
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
            case 4:
                unscrambleTheWord(data);
                break;
            default:
                console.log("Coming soon");
        }
    }
    req.send();
}

function getJsonApi() {
    document.getElementById("overlay").style.display = "flex";
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://devroboto.pythonanywhere.com/level/"+level+"/"+activityType);
    xhttp.onload = function(){
        document.getElementById("overlay").style.display = "none";
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
            case 4:
                unscrambleTheWord(data);
                break;
            default:
                console.log("Coming soon");
        }
    }
    xhttp.send();
}

function fillInTheBlanks(data) {
    var wordRow = '<p class="wordRow">';
    var indexPositions = [];
    if(level<6 && level!=0){
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
    }else{
        indexPositions = [0,1,2,3,4,5,6,7,8,9];
        for(var i=0; i<10; i++){
            words.push({"word":data[indexPositions[i]].word,"sentence":data[indexPositions[i]].sentence});
            var word = data[indexPositions[i]].word;
            var wordSpan = '<span id="'+word+'" onclick="chooseWord(\''+word+'\')">'+word+'</span>';
            wordRow += wordSpan;
            if((i+1)%3==0){
                wordRow += '</p><p class="wordRow">';
            }
        }
    }
    wordRow += '</p>';
    document.getElementById("wordBank").innerHTML = wordRow;
    
    getSentence();
}

function regularAndIrregularVerbs(data) {
    var indexPositions = [];
    if(level<6 && level!=0){
        while(indexPositions.length<10){
            var randomNumber = Math.floor(Math.random() * data.words.length);
            if(!indexPositions.includes(randomNumber) && data.words[randomNumber].regular!=undefined){
                indexPositions.push(randomNumber);
            }
        }
        for(var i=0; i<10; i++){
            words.push({"word":data.words[indexPositions[i]].word,"regular":data.words[indexPositions[i]].regular});
        }
    }else{
        indexPositions = [0,1,2,3,4,5,6,7,8,9];
        for(var i=0; i<10; i++){
            words.push({"word":data[indexPositions[i]].word,"regular":data[indexPositions[i]].regular});
        }
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
    if(level<6 && level!=0){
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
            words.push({"word":data.words[indexPositions[i]].word,"conjugation":data.words[indexPositions[i]].conjugation});
        }
    }else{
        for(var i=0; i<data.length; i++){
            if(data[i].conjugation!=undefined){
                count++;
            }
        }
        wordMax = count;
        var wordCount = 0;
        while(indexPositions.length<wordMax){
            indexPositions.push(wordCount);
            wordCount++;
        }
    
        for(var i=0; i<wordMax; i++){
            words.push({"word":data[indexPositions[i]].word,"conjugation":data[indexPositions[i]].conjugation});
        }
    }

    document.getElementById("question").style.textAlign = 'center';
    document.getElementById("activity").innerHTML += '<div id="conjugation"></div>';
    document.getElementById("conjugation").innerHTML += '<span><input type="text" id="preterite" placeholder="Simple Past"></span><span><input type="text" id="pastParticiple" placeholder="Past Participle"></span><span id="submitBtn" onclick="checkConjugation()">Submit</span>';
    document.getElementById("wordsRemaining").innerHTML = '<p>Words Remaining: '+wordMax+'/'+wordMax+'</p>';
    pickWord();
}

function unscrambleTheWord(data) {
    var indexPositions = [];
    if(level<6 && level!=0){
        while(indexPositions.length<10){
            var randomNumber = Math.floor(Math.random() * data.words.length);
            if(!indexPositions.includes(randomNumber) && data.words[randomNumber].word.length>3){
                indexPositions.push(randomNumber);
            }
        }
        for(var i=0; i<10; i++){
            words.push({"word":data.words[indexPositions[i]].word,"sentence":data.words[indexPositions[i]].sentence});
        }
    }else{
        indexPositions = [0,1,2,3,4,5,6,7,8,9];
        for(var i=0; i<10; i++){
            words.push({"word":data[indexPositions[i]].word,"sentence":data[indexPositions[i]].sentence});
        }
    }
    document.getElementById("question").style.textAlign = 'center';
    document.getElementById("activity").innerHTML += '<div id="unscramble"></div>';
    document.getElementById("wordsRemaining").innerHTML = '<p>Words Remaining: '+wordMax+'/10</p>';
    
    getSentence();
}

document.addEventListener('keydown', (event) => {
    if(event.key.match("Enter")){
        if(activityType==3){
            if(document.getElementById("preterite")==document.activeElement){
                document.getElementById("pastParticiple").focus();
            }else{
                checkConjugation();
            } 
        }else{
            chooseWord(correctWord);
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
            handleConfetti(document.getElementById("wordsRemaining"));
        }else{
            mistakes.push({"word":words[wordIndex].word,"guess":selection,"correct":words[wordIndex].regular});
            handleWrongAnswer(document.getElementById("penalty"));
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
            handleConfetti(document.getElementById("wordsRemaining"));
        }else{
            if(document.getElementById("preterite").value.trim().length==0&&document.getElementById("pastParticiple").value.trim().length==0){
                alert("The Simple Past and Past Participle forms must be typed.");
            }

            var guess = document.getElementById("preterite").value.trim().toLowerCase() + " - " + document.getElementById("pastParticiple").value.trim().toLowerCase()
            mistakes.push({"word":words[wordIndex].word,"guess":guess,"correct":words[wordIndex].conjugation});
            handleWrongAnswer(document.getElementById("penalty"));
            penalty += 10;
            document.getElementById("penalty").innerHTML = '<p class="penalty"><span>Penalty: </span><span id="totalTime">'+penalty+'</span> seconds</p>';
            document.getElementById("penalty").style.color = "red";
        }

        conjugationsCompleted++;

        words.splice(wordIndex, 1);
        document.getElementById("wordsRemaining").innerHTML = '<p>Words Remaining:  '+words.length+'/'+wordMax+'</p>';

        document.getElementById("preterite").value = "";
        document.getElementById("pastParticiple").value = "";
        pickWord();
        document.getElementById("preterite").focus();
    }
}

function chooseWord(word) {
    if(!activityOver){
        if(activityType==1){
            if(word==correctWord){
                var wordElement = document.getElementById(word);
                wordElement.style.textDecoration = "line-through";
                wordElement.style.cursor = "auto";
                wordElement.style.color = "#AD8E70";
                wordElement.style.borderColor = "#AD8E70";
                wordElement.style.backgroundColor = "rgba(0,0,0,.25)";
                wordElement.onclick = "";
                words.splice(wordIndex, 1);
                handleConfetti(wordElement);
            }else{
                mistakes.push({"sentence":words[wordIndex].sentence.replace(correctWord, "_____"),"guess":word,"correct":correctWord});
                penalty += 5;
                handleWrongAnswer(document.getElementById("penalty"));
                document.getElementById("penalty").innerHTML = '<p class="penalty"><span>Penalty: </span><span id="totalTime">'+penalty+'</span> seconds</p>';
                document.getElementById("penalty").style.color = "red";
            }
        }else{
            if(document.getElementById("unscrambledWord").value.trim().toLowerCase()==correctWord){
                handleConfetti(document.getElementById("wordsRemaining"));
            }else{
                mistakes.push({"sentence":words[wordIndex].sentence.replace(correctWord, "_____"),"guess":document.getElementById("unscrambledWord").value.trim().toLowerCase(),"correct":correctWord});
                handleWrongAnswer(document.getElementById("penalty"));
                penalty += 20;
                document.getElementById("penalty").innerHTML = '<p class="penalty"><span>Penalty: </span><span id="totalTime">'+penalty+'</span> seconds</p>';
                document.getElementById("penalty").style.color = "red";
            }
            words.splice(wordIndex, 1);
            document.getElementById("wordsRemaining").innerHTML = '<p>Words Remaining:  '+words.length+'/10</p>';
            document.getElementById("unscrambledWord").value = "";
        }
        
        getSentence();
    }
}

function handleConfetti(wordElement){
    var correctElement = document.getElementById("correct");
        correctElement.innerHTML = '<span><lottie-player src="media/confetti.json"  background="transparent"  speed="2"  style="width: 100px; height: 50px;"    autoplay></lottie-player></span>';
        correctElement.style.display = "flex";
        checkTimer=totalTime;
        var rect = wordElement.getBoundingClientRect();
        correctElement.style.top = ""+Math.floor(rect.bottom-(rect.height*.75))+"px";
        correctElement.style.left = ""+Math.floor(rect.right-(rect.width/2))+"px";
}

function handleWrongAnswer(wordElement){
    var correctElement = document.getElementById("incorrect");
        correctElement.innerHTML = '<span><lottie-player src="media/wrong.json"  background="transparent"  speed="2"  style="width: 64px; height: 64px;"    autoplay></lottie-player></span>';
        correctElement.style.display = "flex";
        checkTimer=totalTime;
        var rect = wordElement.getBoundingClientRect();
        correctElement.style.top = ""+Math.floor(rect.bottom-(rect.height*.75))+"px";
        correctElement.style.left = ""+Math.floor(rect.right)+"px";
}

function getSentence() {
    if(words.length>0){
        wordIndex = Math.floor(Math.random() * words.length);
        correctWord = words[wordIndex].word;
        var sentence = words[wordIndex].sentence;
        document.getElementById("question").innerHTML = sentence.replace(correctWord, "_____");
        if(activityType==4){
            var scrambledChars = correctWord.split("")
            var scrambledIndex = [];
            while(scrambledIndex.length<scrambledChars.length){
                var randomNumber = Math.floor(Math.random() * scrambledChars.length);
                if(!scrambledIndex.includes(randomNumber)){
                    scrambledIndex.push(randomNumber);
                }
            }
            if(scrambledIndex[0]==0){
                var temp = scrambledIndex[scrambledChars.length-1];
                scrambledIndex[scrambledChars.length-1] = scrambledIndex[0];
                scrambledIndex[0] = temp;
            }
            var scrambledWord = ''
            for(var i=0; i<scrambledChars.length; i++){
                scrambledWord += scrambledChars[scrambledIndex[i]];
            }
            document.getElementById("question").innerHTML += '<br><br><p style="color: #243763;"><strong>'+scrambledWord+'</strong></p>'
            document.getElementById("unscramble").innerHTML = '<span><input type="text" id="unscrambledWord" placeholder="\''+scrambledWord+'\'"></span><span id="submitBtn" onclick="chooseWord(\''+correctWord+'\')">Submit</span>';
            document.getElementById("unscrambledWord").focus();
        }     
    }else{
        clearInterval(timer);
        saveScore();
        document.getElementById("timer").innerHTML = '<p class="timer"><span>Time: </span><span id="totalTime">'+convertTime(totalTime+penalty*1000)+'</span></p>';
        document.getElementById("question").innerHTML = "Great job!\nYour total time was "+document.getElementById("totalTime").innerHTML;
        document.getElementById("activity").innerHTML += '<div class="centerDiv"><p id="tryAgain" class="leaderboardRow" onClick="reset()">Try Again</p></div>';
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
                nextMistake();
            }
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("name="+username+"&time="+(totalTime+penalty*1000)+"&level="+level);
            document.getElementById("overlay").style.display = "flex";
        }
        req.send();
    }else{
        nextMistake();
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
        if(level==0){
            document.getElementById("leaderboard").innerHTML += '<p class="leaderboardTitle">ADVANCED TOP 10 TIMES</p>';
        }else{
            document.getElementById("leaderboard").innerHTML += '<p class="leaderboardTitle">LEVEL '+level+' TOP 10 TIMES</p>';
        }
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
        if(checkTimer>0){
            if(count-checkTimer>1100){
                document.getElementById("correct").innerHTML = '';
                document.getElementById("correct").style.display = "none";
                document.getElementById("incorrect").innerHTML = '';
                document.getElementById("incorrect").style.display = "none";
                checkTimer=0;
            }
        }
        if(activityType==3&&conjugationsCompleted==0){
            if(totalTime>10000){
                alert("Are you still there?\nThe Simple Past and Past Participle forms must be typed.");
                conjugationsCompleted++;
                start = new Date() - 10000;
            }
        }
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
            case 3:
                infoWindow+='<h3>Conjugation</h3>';
                infoWindow+='<p>Conjugate the verb. You only need to provide the siple past and past participle form.</p>';
                break;
            default:
                infoWindow+='<h3>Unscramble the Word</h3>';
                infoWindow+='<p>Use the provided letters to complete the sentence.</p>';
        }
        infoWindow+='<hr>';
        infoWindow+='<span id="resetLink" onclick="resetAlert()">Click here to go back to the main menu.</span>';
        infoWindow+='<span id="mistakeLink" onclick="reportMistake()">Click here to report a mistake.</span>';
        document.getElementById("activity").style.opacity = ".1";
    }else{
        document.getElementById("welcome").style.opacity = ".1";
        document.getElementById("menu").style.display = "none";
        infoWindow+='<p style="padding-top: 100px; font-size: 1.2em;">Choose an activity to get started.</p>';
    }
    document.getElementById("menu").style.opacity = ".1";  
    document.getElementById("info").style.display = "none";
    document.getElementById("infoBox").innerHTML = infoWindow;
    document.getElementById("infoBox").style.display = "flex";
}

function hideInfo(){
    if(document.getElementById("mistakeForm").style.display != "flex"){
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
}

function nextMistake(){
    if(mistakes.length>0){
        if(currentMistake>=mistakes.length){
            currentMistake=0;
        }
        var recapWindow = '<div><span onclick="clearMistakes()">x</span></div>';
        recapWindow+='<h3>Review</h3>';
        switch(activityType) {
            case 1:
                recapWindow+='<p style="color: #D61C4E;">Mistake '+(currentMistake+1)+' of '+mistakes.length+'</p>';
                recapWindow+='<p>'+mistakes[currentMistake].sentence+'</p><hr>';
                recapWindow+='<p style="color: #D61C4E;">Your answer: '+mistakes[currentMistake].guess+'</p>';
                recapWindow+='<p>Correct answer: '+mistakes[currentMistake].correct+'</p>';
                break;
            case 2:
                recapWindow+='<p style="color: #D61C4E;">Mistake '+(currentMistake+1)+' of '+mistakes.length+'</p>';
                recapWindow+='<p>'+mistakes[currentMistake].word+'</p><hr>';
                if(mistakes[currentMistake].guess=='true'){
                    recapWindow+='<p style="color: #D61C4E;">Your answer: Regular</p>';
                    recapWindow+='<p>Correct answer: Irregular</p>';
                }else{
                    recapWindow+='<p style="color: #D61C4E;">Your answer: Irregular</p>';
                    recapWindow+='<p>Correct answer: Regular</p>';
                }
                break;
            case 3:
                recapWindow+='<p style="color: #D61C4E;">Mistake '+(currentMistake+1)+' of '+mistakes.length+'</p>';
                recapWindow+='<p>'+mistakes[currentMistake].word+'</p><hr>';
                recapWindow+='<p style="color: #D61C4E;">Your answer: '+mistakes[currentMistake].guess+'</p>';
                recapWindow+='<p>Correct conjugation: '+mistakes[currentMistake].correct+'</p>';
                break;
            default:
                recapWindow+='<p style="color: #D61C4E;">Mistake '+(currentMistake+1)+' of '+mistakes.length+'</p>';
                recapWindow+='<p>'+mistakes[currentMistake].sentence+'</p><hr>';
                recapWindow+='<p style="color: #D61C4E;">Your answer: '+mistakes[currentMistake].guess+'</p>';
                recapWindow+='<p>Correct answer: '+mistakes[currentMistake].correct+'</p>';
        }
        document.getElementById("recapBox").innerHTML = recapWindow;
        document.getElementById("recapBox").style.display = "flex";
        currentMistake++;
    }else{
        hideRecap();
    }
}

function hideRecap(){
    document.getElementById("recapBox").innerHTML = '';
    document.getElementById("recapBox").style.display = "none";
}

function clearMistakes(){
    mistakes = [];
}

function resetAlert(){
    if(confirm("Quit activity and return to main menu?")){
        reset();
    }
}

function reportMistake(){
    document.getElementById("infoBox").style.display = "none";
    document.getElementById("mistakeForm").style.display = "flex";
}

function submitMistake(){
    document.getElementById("mistakeForm").style.display = "none";

    if(document.getElementById("mistakeWord").value.length>0 && document.getElementById("mistakeIssue").value.length>0){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "https://devroboto.pythonanywhere.com/mistakes/add/");
        xhttp.onload = function(){
            alert("Thank you! Your mistake has been reported.");
            hideInfo();
        }
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        if(document.getElementById('mistakeAuthor').value.length<1){
            xhttp.send("word="+document.getElementById('mistakeWord').value+"&issue="+document.getElementById('mistakeIssue').value+"&author=Anonymous");
        }else{
            xhttp.send("word="+document.getElementById('mistakeWord').value+"&issue="+document.getElementById('mistakeIssue').value+"&author="+document.getElementById('mistakeAuthor').value);
        }
    }else{
        alert("The 'word' and 'issue' fields are required. Please resubmit the form.");
        hideInfo();
    }
}

function bannerClick(){
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://devroboto.pythonanywhere.com/bannerclicks/add/");
    xhttp.onload = function(){
        console.log("Banner Click Submitted");
    }
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("banner="+currentBanner+"&time="+new Date());
}