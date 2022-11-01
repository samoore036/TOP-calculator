let currNum = '';
let prevNum = '';
let currFunc = '';


let currDisplay = document.getElementById('curr-display');
let prevDisplay = document.getElementById('prev-display');

const numberBtns = Array.from(document.getElementsByClassName('number-button'))
    .forEach(btn => btn.addEventListener('click', displayNum));

const oneFuncBtns = Array.from(document.getElementsByClassName('one-func'))
    .forEach(func => func.addEventListener('click', executeOneFunc));

const twoFuncBtns = Array.from(document.getElementsByClassName('two-func'))
    .forEach(func => func.addEventListener('click', executeTwoFunc));


let clearBtn = document.getElementById('clear').addEventListener('click', clear);

let deleteBtn = document.getElementById('delete').addEventListener('click', delNum);

let decBtn = document.getElementById('decimal').addEventListener('click', addDecimal);
let equalsBtn = document.getElementById('equals').addEventListener('click', equals);

let posNegBtn = document.getElementById('pos-neg').addEventListener('click', togglePosNeg);

let infoBox = document.getElementById('info');

function displayNum(e) {
    if (currNum === 'ERROR' || prevNum === 'ERROR') {
        clear();
        return;
    }
    let num = '';
    if (e.key === undefined) {
        num = e.target.textContent;
    } else {
        num = e.key;
    }
    if (currNum.length < 10) {
        currNum += num;
        displayCurr();
    } else if (currNum.length < 14) {
        currDisplay.classList.add('smaller-curr-display');
        currNum += num;
        displayCurr();
    } 
}

function displayCurr() {
    currNum = currNum.toString();
    if (currNum.length > 10) {
        currDisplay.classList.add('smaller-curr-display');
    }
    if (currNum.length > 14) {
        alert(`Full number is: ${currNum}`);
        currNum = currNum.substring(0, 14);
    }
    currDisplay.textContent = currNum;
}

function displayPrev() {
    prevDisplay.textContent = prevNum;
}

function switchDisplays() {
    if (prevNum === 'ERROR') {
        clear();
        return;
    }
    prevNum = currNum;
    currNum = '';
    displayPrev();
    displayCurr();
}

function delNum() {
    if (currNum.length <= 11) {
        currDisplay.classList.remove('smaller-curr-display');
    }
    if (currNum.length > 0) {
        currNum = currNum.substring(0, currNum.length - 1);
        displayCurr();
    } else {
        prevNum = prevNum.substring(0, prevNum.length - 1);
        displayPrev();
    }
}

function togglePosNeg() {
    if (currNum === '') {
        return;
    }
    currNum = parseFloat(currNum);
    if (currNum === 0) {
        return;
    }
    currNum *= -1;
    displayCurr();
}

function clear() {
    currNum = '';   
    displayCurr();
    prevNum = '';
    displayPrev();
    currFunc = '';
    currDisplay.classList.remove('smaller-curr-display');
}

function addDecimal() {
    if (currNum.includes('.')) {
        return;
    } else if (currNum.length > 0) {
        currNum += '.';
    } else if (currNum.length === 0) {
        currNum = '0.';
    }
    displayCurr();
}

function executeOneFunc(e) {
    if (currNum === 'ERROR') {
        clear();
        return;
    }
    prevNum = '';
    displayPrev();
    if (currNum.length === 0) { 
        return;
    }
    if (e.key === undefined) {
        currFunc = e.target.textContent;
    } else {
        currFunc = e.key;
    }
    currNum = parseFloat(currNum);
    switch (currFunc) {
        case '^':
        case 'X2': square();
            break;
        case 'z':
        case '√': sqrt();
            break;
        case '!':
        case 'x!': factorial();
            break;
        case '%': percent();
            break;
    }
    displayCurr();
}

function square() {
    currNum = currNum ** 2;
}

function sqrt() {
    if (currNum < 0) {
        currNum = 'ERROR';
    }
    currNum = Math.sqrt(currNum);
}

function factorial() {
    if (currNum == 0) {
        currNum = 1;
        return;
    }
    let fact = 1;
    for (let i = 1; i <= currNum; i++) {
        fact *= i;
    }
    currNum = fact;
}

function percent() {
    currNum = currNum / 100;
}

function executeTwoFunc(e) {
    if (currNum === 'ERROR' || prevNum === 'ERROR') {
        clear();
        return;
    }
    if (currNum.length === 0) {
        return;
    }
    //first time you click on a function, it will load that function up in prevDisplay
    if (currFunc === '') {
        if (e.key === undefined) {
            currFunc = e.target.textContent;
        } else {
            currFunc = e.key;
        }
        currNum += ' ' + currFunc;
        switchDisplays();
        return;
    }
    
    if (currFunc !== '') {
        /*when clicking on a function after one has already been registered, 
            treat this new function press as an equals function and save the clicked
            function to be used as the next func up
        */
        let storedFunc = '';
        if (e.key === undefined) {
            storedFunc = e.target.textContent;
        } else {
            storedFunc = e.key;
        }
        equals();
        currFunc = storedFunc;
        currNum += ' ' + currFunc;
        switchDisplays();
    }
}

function equals() {
    if (currNum.length === 0 || prevNum.length === 0) {
        return;
    }
    prevNum = prevNum.split(' ')[0];
    currNum = parseFloat(currNum);
    prevNum = parseFloat(prevNum);
    switch (currFunc) {
        case '`':
        case 'x√': varRoot();
            break;
        case '~':
        case 'Xy': varPower();
            break;
        case '/':
        case '÷': divide();
            break;
        case '*':
        case 'X': multiply();
            break;
        case '-': subtract();
            break;
        case '+': add();
            break;
    }

    prevNum = '';
    displayPrev();
    displayCurr();
    currFunc = '';
}

function varRoot() {
    if (prevNum < 0) {
        currNum = 'ERROR';
    }
    currNum = Math.pow(prevNum, 1 / currNum);
}

function varPower() {
    currNum = prevNum ** currNum;
}

function divide() {
    if (currNum === 0) {
        currNum = 'ERROR';
        return;
    }
    currNum = prevNum / currNum;
}

function multiply() {
    currNum = currNum * prevNum;
}

function subtract() {
    currNum = prevNum - currNum;
}

function add() {
    currNum = currNum + prevNum;
}

window.addEventListener('keydown', registerKey);

/*group the below by one and two func. call one or two func depending on grouping
    add the e.key === undefined conditional for each func to ensure proper funcitonality
*/

function registerKey(e) {
    switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0': 
            displayNum(e);
            break;
        case '.': addDecimal();
            break;
        case 'Escape':
        case 'C':
            clear();
            break;
        case 'Backspace':
        case 'Delete':
            delNum();
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            togglePosNeg();
        case '%':
        case '!':
        case 'z':
        case '^':
            executeOneFunc(e);
            break;
        case '`':
        case '~':
        case '/':
        case '*':
        case '-':
        case '+':
            executeTwoFunc(e);
            break;
        case '=':
        case 'Enter':
            equals();
            break;
        case 'Control':
            toggleMenu();
    }
} 

function toggleMenu() {
    console.log(infoBox.classList);
    if (infoBox.classList.contains('hidden')) {
        infoBox.classList.remove('hidden');
    } else {
        infoBox.classList.add('hidden');
    }
}