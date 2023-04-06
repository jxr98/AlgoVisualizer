export class User{
    #id;
    #name;
    #email;
    #password;
    constructor(name,email) {
        this.#name = name;
        this.#email = email;
    }

    getId(){
        return this.#id;
    }

    getName(){
        return this.#name;
    }
    setName(name){
        this.#name=name;
    }
    getEmail(){
        return this.#email;
    }

    setEmail(email){
        this.#email=email;
    }

    setPassword(password){
        this.#password=password;
    }
    getPassword(){
        return this.#password;
    }
}