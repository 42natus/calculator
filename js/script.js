let firstNumber = "";
let secondNumber = "";
let operator;

// map of digit buttons' id values to actual digits
const numbers = {
    "seven": "7",
    "eight": "8",
    "nine": "9",
    "four": "4",
    "five": "5",
    "six": "6",
    "one": "1",
    "two": "2",
    "three": "3",
    "zero": "0",
};

// map of operations buttons' id values to actual operators
const operators = {
    "divide": "/",
    "minus": "-",
    "plus": "+",
    "multiply": "*",
}

// FLAGS
let operatorSelected = false;
let newOperation = true; 

let stack = [];

// DIGIT PRESS
const numpad = document.querySelector(".numpad");
numpad.addEventListener("click", receiveDigit);

// OPERATOR PRESS
const operations = document.querySelector(".operations");
operations.addEventListener("click", receiveOperation);

// EVALUATE EXPRESSION
const equals = operations.querySelector("#equals");
equals.addEventListener("click", evaluate);

// CLEAR MEMORY AND DISPLAY
const allClear = numpad.querySelector("#clear");
allClear.addEventListener("click", resetState);

// TOGGLE DECIMAL POINT BUTTON
const decimalPoint = numpad.querySelector("#decimal-point");
decimalPoint.addEventListener("click", toggleDecimalButton);

// CLEAR LAST ENTRY
const backspace = operations.querySelector("#backspace");
backspace.addEventListener("click", clearEntry);

// KEYBOARD SUPPORT
const body = document.querySelector("body");
const numberValues = Object.values(numbers);
const operatorValues = Object.values(operators);
body.addEventListener("keydown", receiveKeyboardInput);

// PSEUDO-CLICK EVENTS
let clickEvent = new Event("click");
let clickDecimalButton = new Event("click");

// calculator operations
const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;

// execute one calculation
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
    return "operator unknown";
}

// store operands
function receiveDigit(event) {
    if (newOperation) { 
	// abandon previous result; start new calculation
        firstNumber = "";
        newOperation = false;
    }

    let target = event.target.id;
    
    // ensure only digit buttons are picked up
    if (numbers[target] !== undefined) {
        if (!operatorSelected) {
            firstNumber += numbers[target];
            updateDisplay(firstNumber);
        } else { // after operator is selected
            secondNumber += numbers[target];
            updateDisplay(secondNumber);
        }
    }
}

// operator has been pressed
function receiveOperation(event) {
    let target = event.target.id;

    // don't run calculation when backspace pressed and secondNumber has content
    if (target === "backspace") {
        return;
    }

    // for chaining operations 
    if (secondNumber) { // expression is complete; evaluate it
        equals.dispatchEvent(clickEvent);
    }
    
    // clicking on `=` bubbles here and no other operator triggers a new calculation (for chained calculations)
    if (target !== "equals") {
        newOperation = false;
    }
    
    // set operator; expression incomplete
    if (operators[target] !== undefined) {
        operator = operators[target];
        operatorSelected = true;

        // operand entered and operator selected — toggle `.` button
        if (decimalPoint.disabled) {
            decimalPoint.dispatchEvent(clickDecimalButton);
        }
    }
}

function updateDisplay(output) {
    const display = document.querySelector(".display");
    display.textContent = output;
}

function evaluate(event) {
    if (firstNumber && !secondNumber && !operator) {
        updateDisplay(firstNumber);
        return;
    }

    if (firstNumber && operator && !secondNumber) {
        updateDisplay(firstNumber);
        return;
    }

    if (secondNumber === "0" && operator === "/") {
        resetState();
        updateDisplay("I can't divide by 0. You try it!");
        return;
    }

    // check if either operand is empty
    if ((!firstNumber || !secondNumber) && (firstNumber !== 0 && secondNumber !== 0)) {
        resetState();
        updateDisplay("Not enough operands");
        return;
    }

    stack.push(firstNumber);
    stack.push(operator);
    stack.push(secondNumber);

    let result;
    
    // round result to 7 d.p. if necessary
    result = Math.round(operate(stack[1], stack[0], stack[2]) * 10000000) / 10000000;
    updateDisplay(result);

    // empty stack for result
    stack = [];

    setUpNextCalculation(result);
}

function resetState() {
    updateDisplay("");
    firstNumber = "";
    secondNumber = "";
    operator = "";
    operatorSelected = false;
    newOperation = true;
    decimalPoint.disabled = false;
}

function setUpNextCalculation(currentResult) {
    resetState();
    firstNumber = String(currentResult);
    updateDisplay(currentResult);
}

function toggleDecimalButton(event) {
    if (!event.isTrusted) { 
        // `.` button toggled internally
        decimalPoint.disabled = !decimalPoint.disabled;
    } else { 
        // user selected `.` — toggle after single use for each operand
        if (!operatorSelected) {
            firstNumber += ".";
            updateDisplay(firstNumber);
            decimalPoint.disabled = true;
        } 
        
        if (operatorSelected) {
            secondNumber += ".";
            updateDisplay(secondNumber);
            decimalPoint.disabled = true;
        }
    }
}

function clearEntry() {
    if (!operatorSelected) {
        firstNumber = firstNumber.slice(0, -1);
        console.log(firstNumber);
        updateDisplay(firstNumber);
    } else {
        secondNumber = secondNumber.slice(0, -1);
        updateDisplay(secondNumber);
    }
}

function receiveKeyboardInput(event) {
    if (newOperation) {
        // digits entered via keyboard start new calculation after result displayed (for chained calculations)
        if (operatorValues.includes(event.key)) {
            operator = event.key;
            operatorSelected = true;
        }

        if (!operatorSelected) {
            firstNumber = "";
            newOperation = false;
        }
    }

    if (!operatorSelected) {
        // store first number and operator
        if (numberValues.includes(event.key)) {
            firstNumber += event.key;
            updateDisplay(firstNumber);
        }

        if (operatorValues.includes(event.key) && firstNumber.length > 0) {
            operator = event.key;
            operatorSelected = true;
        }
    } else { // store second number
        if (numberValues.includes(event.key)) {
            secondNumber += event.key;
            updateDisplay(secondNumber);
        }
    }

    // evaluate a complete expression in a chain
    if (operatorSelected && firstNumber && secondNumber) {
        if (operatorValues.includes(event.key)) {
            equals.dispatchEvent(clickEvent);
        }
    }

    if (event.key === "." && !operatorSelected) {
        if (!firstNumber.includes(".")) {
            firstNumber += event.key;
            updateDisplay(firstNumber);
        }
        decimalPoint.dispatchEvent(clickEvent);
    } else if (event.key === "." && operatorSelected) {
        if (!secondNumber.includes(".")) {
            secondNumber += event.key;
            updateDisplay(secondNumber);
        }
        decimalPoint.dispatchEvent(clickEvent);
    }

    if (event.key === "Backspace") {
        backspace.dispatchEvent(clickEvent);
    }

    if (event.key === "=") {
        equals.dispatchEvent(clickEvent);
    }
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
