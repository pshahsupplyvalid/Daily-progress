//singleton


//object literals

const JsUser ={
    name: "sachin",
    "full name" : "Sachin Joshi",
    age : 18,
    location: "Jaipur",
    email: "Sachin@google.com",
    isLoggedIn : false,
    lastLoginDays:["Monday" , "Saturday"]

}

console.log(JsUser.email)
console.log(JsUser["email"])
console.log(JsUser["fullname"])



JsUser.greeting = function(){
    console.log("helllo JS user");
}

console.log(JsUser.greeting());
