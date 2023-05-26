// GET https://words.dev-apis.com/word-of-the-day
// POST https://words.dev-apis.com/validate-word

const wordURL = "https://words.dev-apis.com/word-of-the-day";
const checkURL = "https://words.dev-apis.com/validate-word"
let wordChar = new Set();
let pointer = [0,0]; //points the first empty slot
let count = 0;
let word = "";

async function getWord() {
    const res = await fetch(wordURL);
    const { word: wordRes } = await res.json();
    word = wordRes.toUpperCase();

    for (let i = 0; i < word.length; i++) {
        wordChar.add(word[i]);
    }
}

async function checkWord(givenWord) {
    const res = await fetch(checkURL, {
        method: "POST",
        body: JSON.stringify({ word: givenWord }),
    });

    const { validWord } = await res.json();
    
    if (validWord) {
        setColor();
    }
    else {
        invalidWord();
    }
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function backspace(){
    console.log("BACKSPACE");
    console.log(pointer);
    console.log(count);
    if (pointer[0] <= 0 && pointer[1] <= 0) {
        return
    } else if (pointer[1] == 0) {
        if (count != pointer[0]) {
            pointer = [pointer[0]-1, 4];
            //delete the character at the pointer spot
            let loc = document.querySelector("[id='b"+ pointer[0] + pointer[1] + "']");
            loc.innerText= "";
            return
        } else {
            return
        }
    } else {
        pointer = [pointer[0], pointer[1]-1];
        //delete the character at the pointer spot
        let loc = document.querySelector("[id='b"+ pointer[0] + pointer[1] + "']");
        loc.innerText= "";
        return
    }
}

function addChar(char){
    console.log("ADD CHAR");
    console.log(pointer);
    console.log(count);
    char = char.toUpperCase();
    if (pointer[0] >= 5) {
        return //game finished
    } else if (pointer[1] == 4) {
        //add the character at the pointer spot
        let loc = document.querySelector("[id='b"+ pointer[0] + pointer[1] + "']");
        loc.innerText = char;
        //set pointer to the next empty spot (next row, 0)
        pointer = [pointer[0]+1, 0];
        return
    } else if (pointer[0] != count) {
        //add the character at the pointer[0]-1, 4 spot
        let loc = document.querySelector("[id='b"+ (pointer[0]-1) + 4 + "']");
        loc.innerText = char;
    } else {
        //add the character at the pointer spot
        let loc = document.querySelector("[id='b"+ pointer[0] + pointer[1] + "']");
        loc.innerText = char;
        //set pointer to the next empty spot 
        pointer = [pointer[0], pointer[1]+1];
        return
    }
}

function enter(){
    if (count == pointer[0] - 1){
        let givenWord = "";
        for (let i = 0; i < 5; i++) {
            let tmp = document.querySelector("[id='b"+ (pointer[0]-1) + pointer[i] + "']");
            givenWord = givenWord + tmp;
        }
        if (givenWord == word) {
            correctWord();
        } else {
            checkWord(givenWord);
        }
    } else {
        return
    }
    count += 1;
}

function invalidWord(){
    let elems = document.querySelectorAll(".row " + (pointer[0]-1)).children;
    for (let i = 0; i < 5; i++) {
        elems[i].style.transition = "0.5s linear";
        elems[i].style.border = "5px solid rgb(203, 44, 44)";
    }
    for (let i = 0; i < 5; i++) {
        elems[i].style.transitionDelay = "1s"
        elems[i].style.transition = "0.5s linear";
        elems[i].style.border = "5px solid rgb(203, 44, 44)";
    }
    count -= 1;
}

function setColor(){
    let elems = document.querySelectorAll(".row " + (pointer[0]-1)).children;
    for (let i = 0; i < 5; i++) {
        if (wordChar.has(elems[i].innerText) && (word[i] == elems[i].innerText)) {
            elems[i].style.transition = "0.5s linear";
            elems[i].style.backgroundColor = "rgb(75, 184, 45)"; //green
        } else if (wordChar.has(elems[i].innerText)) {
            elems[i].style.transition = "0.5s linear";
            elems[i].style.backgroundColor = "rgb(223, 184, 40)"; //yellow
        } else {
            elems[i].style.transition = "0.5s linear";
            elems[i].style.backgroundColor = "rgb(139, 137, 137)"; //gray
        }
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key; // "a", "1", "Shift", etc.
    if (key.length === 1 && isLetter(key)) {
        addChar(key);
    } else if (key == "Backspace") {
        backspace();
    } else if (key == "Enter") {
        enter();
    }
});

getWord();
console.log(word);
