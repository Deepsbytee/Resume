const display = document.getElementById("result");
const buttons = document.querySelectorAll("button");

let lastAnswer = 0;

buttons.forEach(button => {

button.addEventListener("click", () => {

const value = button.innerText;

if(value === "clear"){
display.value = "";
}

else if(value === "del"){
display.value = display.value.slice(0,-1);
}

else if(value === "ans"){
display.value += lastAnswer;
}

else if(value === "√"){
display.value = "Math.sqrt(" + display.value + ")";
}

else if(value === "%"){
display.value = "(" + display.value + ")/100";
}

else if(value === "±"){

if(display.value !== ""){
display.value = (-1 * eval(display.value)).toString();
}

}

else if(value === "ENTER"){

try{

let expression = display.value;

expression = expression.replace(/×/g,"*");
expression = expression.replace(/÷/g,"/");

lastAnswer = eval(expression);

display.value = lastAnswer;

}
catch{
display.value = "Error";
}

}

else{
display.value += value;
}

});

});