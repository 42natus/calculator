const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;

let firstNumber = "";
let secondNumber = "";
let operator;

// execute one maths operation
function operate(operator, firstNumber, secondNumber) {
    const x = parseInt(firstNumber);
    const y = parseInt(secondNumber);

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

let stack = [];

// store operands
function receiveDigit(event) {
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

    // for chaining operations 
    if (secondNumber) { // expression is complete; evaluate it
        let clickEvent = new Event("click");
        equals.dispatchEvent(clickEvent);
    }

    // set operator; expression incomplete
    if (operators[target] !== undefined) {
        operator = operators[target];
        operatorSelected = true;
    }
}

function updateDisplay(output) {
    const display = document.querySelector(".display");
    display.textContent = output;
}

const equals = operations.querySelector("#equals");
equals.addEventListener("click", () => {
    stack.push(firstNumber);
    stack.push(operator);
    stack.push(secondNumber);

    // stack is now a complete expression
    let result;
    result = operate(stack[1], stack[0], stack[2]);
    updateDisplay(result);

    // empty stack for result
    stack = [];

    // setup for next operation
    firstNumber = result;
    secondNumber = ""; // to store next operand
});
