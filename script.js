const displayEl = document.getElementById("display");
let currentInput = "0";
let previousValue = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
  displayEl.textContent = currentInput;
}

// handle digits
document.querySelectorAll(".number").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const digit = e.target.textContent;
    inputDigit(digit);
    updateDisplay();
  });
});

function inputDigit(digit) {
  if (waitingForSecondOperand) {
    currentInput = digit;
    waitingForSecondOperand = false;
  } else {
    currentInput = (currentInput === "0") ? digit : currentInput + digit;
  }
}

// decimal
document.querySelectorAll(".decimal").forEach(btn => {
  btn.addEventListener("click", () => {
    inputDecimal();
    updateDisplay();
  });
});

function inputDecimal() {
  if (waitingForSecondOperand) {
    currentInput = "0.";
    waitingForSecondOperand = false;
    return;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
}

// operators
document.querySelectorAll(".operator").forEach(btn => {
  btn.addEventListener("click", (e) => {
    handleOperator(e.target.textContent);
  });
});

function handleOperator(nextOperator) {
  const inputValue = parseFloat(currentInput);

  if (operator && waitingForSecondOperand) {
    // allow operator change before entering second operand
    operator = nextOperator;
    return;
  }

  if (previousValue == null) {
    previousValue = inputValue;
  } else if (operator) {
    const result = calculate(previousValue, inputValue, operator);
    previousValue = (result === "Error") ? null : result;
    currentInput = (result === "Error") ? "Error" : String(result);
  }

  operator = nextOperator;
  waitingForSecondOperand = true;
  updateDisplay();
}

// equals
document.getElementById("equals").addEventListener("click", () => {
  if (operator && previousValue != null && !waitingForSecondOperand) {
    const result = calculate(previousValue, parseFloat(currentInput), operator);
    currentInput = (result === "Error") ? "Error" : String(result);
    previousValue = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
  }
});

// clear
document.getElementById("clear").addEventListener("click", () => {
  currentInput = "0";
  previousValue = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
});

// calculate
function calculate(a, b, op) {
  switch (op) {
    case "+": return +(a + b).toPrecision(12) / 1;
    case "-": return +(a - b).toPrecision(12) / 1;
    case "*": return +(a * b).toPrecision(12) / 1;
    case "/": return b !== 0 ? +(a / b).toPrecision(12) / 1 : "Error";
    default: return b;
  }
}

// initialize
updateDisplay();
