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
    getJson("level1.json")
    switch(num) {
        case 1:
            document.getElementById("option1").className = "selected";
            document.getElementById("option1").innerHTML = '<p>Fill in the Blanks</p>';

            document.getElementById("option2").innerHTML = '';
            document.getElementById("option3").innerHTML = '<p onClick="reset()">Reset</p>';

            activityOptions(1);
            break;
        case 2:
            break;
        case 3:
            // code block
            break;
        default:
            // code block
    }
}

function activityOptions(num) {
    switch(num) {
        case 1:
            document.getElementById("option2").innerHTML = '<select id="level" onchange="activityOptions(2)"><option value="0">Select Level</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>';
            break;
        case 2:
            level = document.getElementById("level").value;
            document.getElementById("option2").className = "selected";
            document.getElementById("option2").innerHTML = '<p>Level '+level+'</p>';
            break;
        case 3:
            // code block
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