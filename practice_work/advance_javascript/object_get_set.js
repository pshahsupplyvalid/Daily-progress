const user ={
    _email:'h@hc.com',
    _password:"abc",


    get email(){
        return this_email.toUpperCase()
    },

    set email (value){
        this._email.toUpperCase()
    },

    set email(value){
        this._email=value
    }
}

const tea = Object.create(User)
console.log(tea.email);