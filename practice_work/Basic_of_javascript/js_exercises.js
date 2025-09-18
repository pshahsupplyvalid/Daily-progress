// 1. Print numbers from 1 to 10

for (let i = 1; i <= 10; i++) {
  console.log(i);
}

// 2. Find if a number is even or odd

function checkEvenOdd(num) {
  if (num % 2 === 0) {
    console.log(num + " is Even");
  } else {
    console.log(num + " is Odd");
  }
}

checkEvenOdd(7);
checkEvenOdd(12);

// 3. Reverse a string

function reverseString(str) {
  return str.split("").reverse().join("");
}

console.log(reverseString("hello")); // "olleh"

// 4. Find the largest number in an array

function findLargest(arr) {
  return Math.max(...arr);
}

console.log(findLargest([10, 45, 32, 67, 89])); // 89

//  5. Calculate the factorial of a number

function factorial(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}

console.log(factorial(5)); // 120

// 6. Check if a string is a palindrome

function isPalindrome(str) {
  const reversed = str.split("").reverse().join("");
  return str === reversed;
}

console.log(isPalindrome("madam")); // true
console.log(isPalindrome("hello")); // false

// 7. Count vowels in a word

function countVowels(str) {
  const vowels = "aeiouAEIOU";
  let count = 0;

  for (let char of str) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}

console.log(countVowels("javascript")); // 3

// 8. Sum all numbers in an array

function sumArray(arr) {
  return arr.reduce((acc, num) => acc + num, 0);
}

console.log(sumArray([5, 10, 15, 20])); // 50


// Generate a random number between 1 and 100

function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

console.log(getRandomNumber());


