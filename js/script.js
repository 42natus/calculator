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

const numpad = document.querySelector(".numpad");
numpad.addEventListener("click", receiveInput);

function receiveInput(event) {
    let target = event.target.id;
    
    // ensure only digit buttons are picked up
    if (numbers[target] !== undefined) {
        firstNumber += numbers[target];
    }
    
    updateDisplay(firstNumber);
}

function updateDisplay(output) {
    const display = document.querySelector(".display");
    display.textContent = output;
}
