class user{
    constructor(email, password){
        this.email = email;
        this.password = password

        
    }

    get email(){
        return this.email.toUpperCase()
    }
    set email(value){
        return this.email = value.toUpperCase()
    }
    get password (){
        return this._password.toUpperCase()
    }
    set password(value){
        this._password = value.toUpperCase()
    }
}

const hitesh = new User("h@hitesh.ai", "123")
console.log(hitesh.password);