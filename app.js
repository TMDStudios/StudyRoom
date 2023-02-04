var level = 0;

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
            getJson("level1.json");
            console.log("Starting level 1");
            break;
        default:
            // code block
    }
}


function reset() {
    window.location.replace("/");
}

function getJson (file) {
    fetch('json/'+file)
        .then((response) => response.json())
        .then((json) => console.log(json));
}