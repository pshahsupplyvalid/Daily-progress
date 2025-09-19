const promiseOne =new Promise(function(resolve , reject){
    //Do an async task
    //DB calls , Cryptography , network
    setTimeout(function(){
        console.log('Async task is complete');
        resolve()
    } , 1000)
})

promiseOne.then(function(){
    console.log("Promise consumed");
})

new Promise(function(resolve , reject){
    setTimeout(function(){
        console.log("Async task 2");
        resolve()
    }, 1000)

}).then(function(){
    console.log("Async 2 resolved");
})

const promiseThree = new Promise(function(resolve,reject){
    setTimeout(function(){

    },1000)
})

promiseThree.then(function(){
    console.log(user);

})

const promisefour = new Promise(function(resolve, reject){
    setTimeout(function(){
        let error = ture
        if (!error){
            resolve({username:"hitesh", password :"123"})
        }else{
            reject ('ERROR : Something went wrong')
        }
    } , 1000)
})

promisefour.then((user) =>{
    console.log(user);
    return user.username

})
.then((username)=>{
    console.log(username);

})
.catch(function(error){
    console.log(error);
})
.finally(() => console.log("The promise is either resolved or rejected"))



const promiseFive = new Promise(function(resolve , reject){
    setTimeout(function(){
        let error = true
        if (!error){
            resolve({username:"javascript", password: "123"})
        } else {
            reject('ERROR: JS Something went wrong')
        }
    } , 1000)
});

// async function comePromiseFive(){
//     try {
//         const response = await  promiseFive
//     console.log(reponse);
// }
        
//  } catch (error) {
        
//     }
// comsumePromiseFive()

fetch('https://jsonplaceholder.typicode.com/user')
.then ((reponse)=>{
    return reponse.json()
})
.then((data) =>{
    console.log(data);
})
.catch((error) => console.log(error))

