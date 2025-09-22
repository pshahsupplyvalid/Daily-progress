function SetUsername(username){
    // complex DB calls
    this.username= username
    console.log("called");
}
function createUser (username, email,passsword){
    SetUsername.call(username)

    this.email = email
    this.password = password
}

const chai = new createUser("chai" , "chai@f.com" , "123")
console.log(chai);