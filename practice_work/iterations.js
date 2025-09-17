// for 

// for (let index = 0; index < Array.length; index ++){
//     const element = array[index];

// }

// for (let index = 0; index <10; index++){
//     const element = index;
//     console.log(element);

// } 
for (let i = 0; i<=10; i++){
    const element = i;
    if (element == 5){
      //  console.log("5 is best number");
    }

//console.log(element);

}


// for (let i = 0; i<=10; i++){
//     console.log(`outer loop value : ${i}`);
//     for(let j =0; j<=10; j++){
//         console.log(`Inner loop value ${j} and inner loop ${i}`);
//         console.log(i  + `*` + j + `=` + i*j);
//     }
// }

let myArray =["flash", "batman", "superman"]

console.log(myArray.length);

for (let index = 0;index <= myArray.lemgth; index ++){
    const element = myArray[index];
    console.log(element);
}

//break and continue


// for (let index =1; index <=20; index++){
//     if(index == 5){
//         console.log(`Detected 5`);
//         continue
//     }
//     console.log(`value of i is ${index}`);
// }

// let index =0
// while (index <=10){
//     console.log(`value of index is ${index}`);
//     index = index +2
// }

// let myArray = ['flash', "batman", "superman"]

let arr = 0
while(arr < myArray.length){
    // console.log(`valuue is ${myArray [arr]}`);
    arr = arr 

}

let score =1 

do {
    console.log (`Score is ${score}`);
    score++

} while (score <=10 );


// for of 
// ["","",""]
// [{},{},{}]

// const arr = [1,2,3,4,5]

for(const num of arr){
    //console.log(num);

}

const greetings ="hello world"
for (const great of greetings){
    console.log(`Each char is ${greet}`)

}

//maps
const map = new Map()
map.set ('IN' ,"India")
map.set ('USA' , "United State of America")
map.set ('Fr', "France")
map.set ('IN', "India")


console.log(map);


for (const [key] of map){
    console.log(key , ':-', value);
// }
//   const myObject ={
//     'game1': 'NFS',
//     'game2' : 'Spiderman'
  }
  for (const [key , value] of myObject){
    console.log(key ,':-' , value);
  }

//   const myObject = { 
//     js :' javascript',
//     cpp : 'C++',
//     rb : "ruby",
//     swift :"swift by apple"
//   }

  for (const key in myObject){
    console.log(`${key} shortcut is for ${myObject[key]}`);
  }

  const programming = ["js", "rb" , "py", "java" , "cpp"]

  for (const key in programming){
    console.log(programming[key]);
  }


  const  map = new Map()
map.set ('IN' ,"India")
map.set ('USA' , "United State of America")
map.set ('Fr', "France")
map.set ('IN', "India")

for (const key in map){
    // console.log(key);
}

const coding = ["js", "ruby", "java", "python","cpp"]

// coding.forEach( function (val){
//     console.log(val);

// })

// coding.forEach ((item) =>{
//     console.log(item);
// })

// function printMe (itme){
//     console.log(item);
// }

// coding.forEach(printMe)

// coding.forEach ((item , index, arr)=>{
//     console.log(item , index, arr);
// })

const myCoding =[
    {
        languageName: "javaScript",
        languageFileName: "js"
    },
    {
        languageName: "java",
        languageFileName: "java"
    },
    {
        languageName: "python",
        languageFileName: "py"
    },


]