const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;

let firstNumber;
let secondNumber;
let operator;

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

console.log(operate("*", "3", "9")); // test