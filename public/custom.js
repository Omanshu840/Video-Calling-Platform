var isMessageOpen = false;

function toggleNav() {
    if (isMessageOpen == false) {
        document.getElementById("mySidepanel").style.width = "25vw";
        document.getElementById("main-window").style.width = "75vw";
        isMessageOpen = true;
    }
    else {
        document.getElementById("mySidepanel").style.width = "0";
        document.getElementById("main-window").style.width = "100vw";
        isMessageOpen = false;
    }
}