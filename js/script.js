// possible calculations
const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => (y === 0) ? "I can't divide by 0. You try it!" : x / y;

// execute a calculation
function operate(operator, firstNumber, secondNumber) {
    const x = parseFloat(firstNumber);
    const y = parseFloat(secondNumber);

    switch(operator) {
        case "+":
            return add(x, y);
        case "-":
            return subtract(x, y);
        case "*":
            return multiply(x, y);
        case "/":
            return divide(x, y);
    }
}

let currentInput = "";
let firstNumber = "";
let operator;
let resultDisplayed = false;

// map of operations buttons' id values to actual operators
const operatorSymbols = {
    "divide": "/",
    "minus": "-",
    "plus": "+",
    "multiply": "*",
}

// DIGIT PRESS
const numpad = document.querySelector(".numpad");
numpad.addEventListener("click", receiveDigit);

// OPERATOR PRESS
const operators = document.querySelector(".operators");
operators.addEventListener("click", receiveOperator);

const display = document.querySelector(".display");

// EVALUATE EXPRESSION
const equals = document.querySelector("#equals");
equals.addEventListener("click", evaluate);

// CLEAR MEMORY AND DISPLAY
const allClear = numpad.querySelector("#all-clear");
allClear.addEventListener("click", resetState);

// TOGGLE DECIMAL POINT BUTTON
const decimalPoint = numpad.querySelector("#decimal-point");
decimalPoint.addEventListener("click", setDecimalPoint);

// CLEAR LAST ENTRY
const clearEntry = operators.querySelector("#clear-entry");
clearEntry.addEventListener("click", backSpace);

// store operands
function receiveDigit(event) {
    let target = event.target;

    if (resultDisplayed) { // just evaluated an expression
        firstNumber = "";
    }

    currentInput += target.textContent;
    updateDisplay(currentInput);
}

function updateDisplay(output) {
    display.textContent = output;
}

// operator has been pressed
function receiveOperator(event) {
    let target = event.target.id;

    if (!firstNumber) {
        firstNumber = currentInput;
        currentInput = "";
    } else if (currentInput) { // complete expression
        let result = operate(operator, firstNumber, currentInput);
        if (typeof result !== "number") { // divide by 0 error
            resetState();
            updateDisplay(result);
            return;
        }

        // round result to 10 d.p.
        result = Math.round(result * 10000000000) / 10000000000;

        updateDisplay(result);

        // set up for chained calculation
        firstNumber = result;
        currentInput = "";
    }
    
    resultDisplayed = false; // waiting for second operand
    operator = operatorSymbols[target];
}

function evaluate(event) {
    if (!firstNumber || !currentInput) { // not enough operands
        /* 
        Prevent bubbling to receiveOperator(). This prevents
        the modification of resultDisplayed right after a calculation.
        */
        event.stopPropagation();
        return;
    }

    let result = operate(operator, firstNumber, currentInput);
    if (typeof result !== "number") { // divide by 0 error
        resetState();
        updateDisplay(result);
        return;
    }

    // round result to 10 d.p.
    result = Math.round(result * 10000000000) / 10000000000;
    
    // reset state but display result
    resetState();
    updateDisplay(result);

    // set up for new calculation on digit press
    firstNumber = result;
    resultDisplayed = true;

    event.stopPropagation();
}

function resetState(event) {
    currentInput = "";
    firstNumber = "";
    operator = null;
    resultDisplayed = false;
    updateDisplay("");

    /* 
    Prevent bubbling to receiveDigits(). 
    This prevents "AC" from being displayed.
    */
    if (event && event.target.id === "all-clear") {
        event.stopPropagation();
    }
}

function setDecimalPoint(event) {
    if (!currentInput.includes(".")) { // allow one decimal point per operand
        currentInput += ".";
        updateDisplay(currentInput);
    }

    /* 
    Prevent bubbling to receiveDigits(). 
    This prevents "." from also being duplicated in the display.
    */
    event.stopPropagation();
}

function backSpace(event) {
    if (currentInput) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput);
    }

    /* 
    Prevent bubbling to receiveOperator(). 
    This stops currentInput from being set to "".
    */
    event.stopPropagation();
}

// visual cues to show a button is being interacted with
const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
        button.classList.add("button-hover");
    });

    button.addEventListener("mouseleave", () => {
        button.classList.remove("button-hover");
    });

    button.addEventListener("mousedown", () => {
        button.classList.add("button-clicked");
    });

    button.addEventListener("mouseup", () => {
        button.classList.remove("button-clicked");
    });
});

// KEYBOARD SUPPORT
const body = document.querySelector("body");
const operatorValues = Object.values(operators);
body.addEventListener("keydown", receiveKeyboardInput);
let clickEvent = new Event("click", {bubbles: true});

//numpad buttons
const one = numpad.querySelector("#one");
const two = numpad.querySelector("#two");
const three = numpad.querySelector("#three");
const four = numpad.querySelector("#four");
const five = numpad.querySelector("#five");
const six = numpad.querySelector("#six");
const seven = numpad.querySelector("#seven");
const eight = numpad.querySelector("#eight");
const nine = numpad.querySelector("#nine");
const zero = numpad.querySelector("#zero");

// operator buttons
const division = operators.querySelector("#divide");
const minus = operators.querySelector("#minus");
const plus = operators.querySelector("#plus");
const multiplication = operators.querySelector("#multiply");

function receiveKeyboardInput(event) {
    switch(event.key) { 
        // digits
        case "1":
            one.dispatchEvent(clickEvent);
            break;
        case "2":
            two.dispatchEvent(clickEvent);
            break;
        case "3":
            three.dispatchEvent(clickEvent);
            break;
        case "4":
            four.dispatchEvent(clickEvent);
            break;
        case "5":
            five.dispatchEvent(clickEvent);
            break;
        case "6":
            six.dispatchEvent(clickEvent);
            break;
        case "7":
            seven.dispatchEvent(clickEvent);
            break;
        case "8":
            eight.dispatchEvent(clickEvent);
            break;
        case "9":
            nine.dispatchEvent(clickEvent);
            break;
        case "0":
            zero.dispatchEvent(clickEvent);
            break;

        // operators
        case "/":
            division.dispatchEvent(clickEvent);
            break;
        case "-":
            minus.dispatchEvent(clickEvent);
            break;
        case "+":
            plus.dispatchEvent(clickEvent);
            break;
        case "*":
        case "x":
            multiplication.dispatchEvent(clickEvent);
            break;

        // others
        case ".":
            decimalPoint.dispatchEvent(clickEvent);
            break;
        case "Backspace":
            clearEntry.dispatchEvent(clickEvent);
            break;
        case "=":
            equals.dispatchEvent(clickEvent);
            break;
        case "Delete":
            allClear.dispatchEvent(clickEvent);
            break;
    }
}