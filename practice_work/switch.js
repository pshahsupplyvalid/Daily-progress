const month = 3
switch (month){
    case "jan":
        console.log("January");
        break;
    
    case "feb":
        console.log("January");
        break;
    
    case "mar":
        console.log("January");
        break;
    
    case "april":
        console.log("January");
        break;

    default:
        console.log("default case match");
        break;
    
    
}


//truthy
const userEmail ="V@vivek.ai"

if (userEmail){
    console.log("Got user email ");
}  else{
    console.log("Don't have user email");
}

//falsy values

// false, 0, -0, BigInt 0n,   "", null , undefined ,NAN


//truthy values 
// "0" , 'false' , "" , [] , {} ,  function()