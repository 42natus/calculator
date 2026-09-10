const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;

let firstNumber = "";
let secondNumber = "";
let operator;

let clickDecimalEvent = new Event("click");

// execute one maths operation
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

// map digit buttons' id values to actual digits
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

// map operations buttons' id values to actual operators
const operators = {
    "divide": "/",
    "minus": "-",
    "plus": "+",
    "multiply": "*",
}

// "equals": "=",
// "backspace": "",

const numpad = document.querySelector(".numpad");
numpad.addEventListener("click", receiveDigit);

const operations = document.querySelector(".operations");
operations.addEventListener("click", receiveOperation);

let operatorSelected = false;

let newOperation = true; 

let stack = [];

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
        let clickEvent = new Event("click");
        equals.dispatchEvent(clickEvent);
    }
    
    // clicking on `=` bubbles here and no other operator triggers a new calculation
    if (target !== "equals") {
        newOperation = false;
    }
    
    // set operator; expression incomplete
    if (operators[target] !== undefined) {
        operator = operators[target];
        operatorSelected = true;

        // operand entered and operator selected — toggle `.` button
        if (decimalPoint.disabled) {
            decimalPoint.dispatchEvent(clickDecimalEvent);
        }
    }
}

function updateDisplay(output) {
    const display = document.querySelector(".display");
    display.textContent = output;
}

const equals = operations.querySelector("#equals");
equals.addEventListener("click", () => {
    if (firstNumber && !secondNumber && !operator) {
        updateDisplay(firstNumber);
        return;
    }

    if (firstNumber && operator && !secondNumber) {
        updateDisplay(firstNumber);
        return;
    }

    if (secondNumber === "0") {
        updateDisplay("Divide by zero. You do it!");
        // reset state
        return;
    }

    // check if either operand is empty
    if ((!firstNumber || !secondNumber) && (firstNumber !== 0 && secondNumber !== 0)) {
        updateDisplay("Not enough operands");
        // reset state
        return;
    }

    stack.push(firstNumber);
    stack.push(operator);
    stack.push(secondNumber);

    console.log(stack);
    // stack is now a complete expression
    let result;
    result = Math.round(operate(stack[1], stack[0], stack[2]) * 10000) / 10000;
    updateDisplay(result); // round result to 4 d.p. if necessary

    // empty stack for result
    stack = [];

    // setup for next operation
    firstNumber = String(result);
    secondNumber = ""; // to store next operand
    operator = "";
    operatorSelected = false;
    newOperation = true; // the next operation is a new calculation
    decimalPoint.disabled = false;
});

const clearAll = numpad.querySelector("#clear");
clearAll.addEventListener("click", () => {
    updateDisplay("");
    firstNumber = "";
    secondNumber = "";
    operator = "";
    operatorSelected = false;
    newOperation = true;
    decimalPoint.disabled = false;
});

// toggle decimal point button
const decimalPoint = numpad.querySelector("#decimal-point");
decimalPoint.addEventListener("click", (event) => {
    if (!event.isTrusted) { // `.` button toggled internally
        decimalPoint.disabled = !decimalPoint.disabled;
    } else { // user selected `.` — toggle after single use for each operand
        if (!operatorSelected) {
            firstNumber += ".";
            decimalPoint.disabled = true;
        } 
        
        if (operatorSelected) {
            secondNumber += ".";
            decimalPoint.disabled = true;
        }
    }
});

const backspace = operations.querySelector("#backspace");
backspace.addEventListener("click", () => {
    if (!operatorSelected) {
        firstNumber = firstNumber.slice(0, -1);
        console.log(firstNumber);
        updateDisplay(firstNumber);
    } else {
        secondNumber = secondNumber.slice(0, -1);
        updateDisplay(secondNumber);
    }
})