class User{
    constructor(username){
        this.username = username
    }


logMe(){
    console.log(`USERNAME is $ {this.usernme}`);

}
}

class Teacher extends User{
    constructor(username , email , password){
        super(username)
        this.email = email
        this.password = password
    }

    addCourse(){
        console.log(`A new course was added by ${this.changeUsername

        }`);
    }
}

const chai = Teacher("chai","chaiteacher.com" , "123")

chai.addCourse()

const masalaChai = new User("masalaChai")

masalaChai.logme()

console.log(chai === Teacher);