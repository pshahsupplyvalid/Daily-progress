function sayMyName(){
    console.log("V");
    console.log("I");
    console.log("v");
    console.log("E");
    console.log("K");
}

//sayMyName()

//function
// function addTwoNumbers(number1 , number2){
//     console.log(number1 +number2);

// }
function addTwoNumbers(number1 , number2){
    // let result =number1 + number2
    // return result
    return number1 + number2
}

const result =addTwoNumber(3,5)

// console.log("Result:" , result);

function loginUserMessage(username){
    return `${username} just logged in`
}
//  console.log(loginUserMesssage(praveen))
 console.log(loginUserMessage())


 function loginUserMessage(username = "sam"){
    if(!username){
        console.log("Please enter a username");
        return 
    }
    return `${username} just logged in `
 }


 function calculateCarPrice(num1){
    return num1

 }

 //console.log(calculateCartPrice(200 , 400 , 500 ))


 const user ={
    username : "vivek",
    price : 199
 }

 function handleObject(anyobject){
    console.log(`username is ${anyobject.username} and price is ${anyobject.price}`);
 }

 handleObject(user)