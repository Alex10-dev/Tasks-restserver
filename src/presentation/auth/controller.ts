import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { RegisterUserDTO } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";

export class AuthController {

    constructor(){};

    public registerUser = async( req: Request, res: Response ) => {

        const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
        if( error ) return res.status(400).json({ error });
    
        try{
            const newUser = await prisma.user.create({
                data: registerUserDTO!
            });

            const { password, ...rest } = UserEntity.fromJSON( newUser );
            res.status(200).json({ ...rest });
        } catch( error ){
            res.status(400).json( error );
        }
        
    }
}