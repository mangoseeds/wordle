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

    for (let i = 0; i < 5; i++) {
        wordChar.add(word[i]);
    }
    console.log(word);
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
    if (pointer[0] <= 0 && pointer[1] <= 0) {
        return
    } else if (pointer[1] == 0) {
        if (count != pointer[0]) {
            pointer = [pointer[0]-1, 4];
            //delete the character at the pointer spot
            let loc = document.querySelector("[id='h"+ pointer[0] + pointer[1] + "']");
            loc.innerText= "";
            return
        } else {
            return
        }
    } else {
        pointer = [pointer[0], pointer[1]-1];
        //delete the character at the pointer spot
        let loc = document.querySelector("[id='h"+ pointer[0] + pointer[1] + "']");
        loc.innerText= "";
        return
    }
}

function addChar(char){
    char = char.toUpperCase();
    if (pointer[0] >= 5) {
        return //game finished
    } else if (pointer[1] == 4) {
        //add the character at the pointer spot
        let loc = document.querySelector("[id='h"+ pointer[0] + pointer[1] + "']");
        loc.innerText = char;
        //set pointer to the next empty spot (next row, 0)
        pointer = [pointer[0]+1, 0];
        return
    } else if (pointer[0] != count) {
        //add the character at the pointer[0]-1, 4 spot
        let loc = document.querySelector("[id='h"+ (pointer[0]-1) + 4 + "']");
        loc.innerText = char;
    } else {
        //add the character at the pointer spot
        let loc = document.querySelector("[id='h"+ pointer[0] + pointer[1] + "']");
        loc.innerText = char;
        //set pointer to the next empty spot 
        pointer = [pointer[0], pointer[1]+1];
        return
    }
}

function enter(){
    if (count == (pointer[0] - 1)){
        let givenWord = "";
        for (let i = 0; i < 5; i++) {
            let tmp = document.querySelector("[id='h"+ (pointer[0]-1) + i + "']");
            givenWord = givenWord + tmp.innerText;
        }
        if (givenWord == word) {
            setColor();
            pointer = [5,0];
            //CORRECT!!
        } else {
            checkWord(givenWord);
        }
    } else {
        return
    }
    count += 1;
}

function invalidWord(){

    for (let i = 0; i < 5; i++) {
        let box = document.querySelector("[id='b" + (pointer[0]-1) + i + "']");
        box.style.transition = "0.3s linear";
        box.style.border = "5px solid rgb(203, 44, 44)";
        setTimeout(function(){
            box.style.transition = "0.3s linear";
            box.style.border = "5px solid rgb(164, 164, 164)";
          }, 500);   
    }
    count -= 1;
}

function setColor(){
    for (let i = 0; i < 5; i++) {
        let txt = document.querySelector("[id='h" + (pointer[0]-1) + i + "']");
        let box = document.querySelector("[id='b" + (pointer[0]-1) + i + "']");
        
        if (word[i] == txt.innerText){
            box.style.transition = "0.5s linear";
            box.style.backgroundColor = "rgb(75, 184, 45)"; //green   
        } else if (wordChar.has(txt.innerText)) {
            box.style.transition = "0.5s linear";
            box.style.backgroundColor = "rgb(223, 184, 40)"; //yellow
        } else {
            box.style.transition = "0.5s linear";
            box.style.backgroundColor = "rgb(139, 137, 137)"; //gray
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
