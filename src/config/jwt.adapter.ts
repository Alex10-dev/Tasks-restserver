import jwt from "jsonwebtoken";
import { envs } from "./envs";

const JWT_SEED = envs.jwt_seed;

export class JwtAdapter {

    public static async generateToken( payload: any, duration: string = '2h' ): Promise<any>{

        return new Promise(resolve => {
            jwt.sign( payload, JWT_SEED, {expiresIn: duration}, (error, token) => {

                if( error ) return resolve(null);

                return resolve(token);
            });
        });
    }

    public static validateToken( token: string ){

    }
}