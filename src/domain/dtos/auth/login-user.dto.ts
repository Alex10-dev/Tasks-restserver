interface JsonData {
    [key: string]: any
}

export class LoginUserDTO {

    public readonly username: string;
    public readonly password: string;

    constructor( data: JsonData ){
        this.username = data.username;
        this.password = data.password;
    };

    static create( data: JsonData ): [string?, LoginUserDTO?]{

        const { username, password } = data;

        if( !username ) return ['username is required'];
        if( !password ) return ['password is required'];

        return [undefined, new LoginUserDTO({
            username,
            password,
        })]
        
    }
}