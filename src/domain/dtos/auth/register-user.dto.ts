interface JsonData {
    [key: string]: any
}

export class RegisterUserDTO {

    public readonly username: string;
    public readonly password: string;
    public readonly name: string;
    public readonly surname?: string | null;

    constructor( data: JsonData ){
        this.username = data.username;
        this.password = data.password;
        this.name = data.name;
        this.surname = data.surname;
    }

    static create( data: JsonData ): [string?, RegisterUserDTO?]{

        const { username, password, name, surname } = data;

        if( !name ) return ['name is required'];
        if( !username ) return ['username is required'];
        if( !password ) return ['password is required'];
        if( surname && typeof surname !== 'string' ) return ['surname must be a string'];

        return [undefined, new RegisterUserDTO({
            name,
            username,
            password,
            surname,
        })]
        
    }
}