// Immediately Invoked function Expressions (IIFE)


(function chai(){

    // named IIFE
    console.log(`DB CONNECTED`);
})();

( () =>{
    console.log(`DB CONNECTED TWO ${name}`);
})('vivek')
