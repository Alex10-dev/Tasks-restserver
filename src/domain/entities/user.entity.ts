import { CustomError } from "../errors/custom.error";

export class UserEntity {

    public id: number;
    public name: string;
    public username?: string;
    public password: string;
    public surname?: string | null

    constructor( data: {[key: string]: any} ){
        this.id = data.id;
        this.name = data.name;
        this.username = data.username;
        this.password = data.password;
        this.surname = data.surname;
    }

    public static fromJSON( object: {[key: string]: any} ){

        const { id, name, username, password, surname } = object;

        if( !id ) throw CustomError.badRequest('Missing id');
        if( !name ) throw CustomError.badRequest('Missing name');
        if( !password ) throw CustomError.badRequest('Missing password');

        return new UserEntity({
            id,
            name,
            username,
            password,
            surname
        })
    }
}