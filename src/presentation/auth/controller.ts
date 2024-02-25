import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { RegisterUserDTO } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";
import { JwtAdapter } from "../../config/jwt.adapter";

export class AuthController {

    constructor(){};

    public registerUser = async( req: Request, res: Response ) => {

        const [error,  registerUserDTO] = RegisterUserDTO.create(req.body);
        if( error ) return res.status(400).json({ error });

        const { password, ...data } = registerUserDTO!;
        const encryptedPW = bcryptAdapter.hash(password);
    
        try{
            const newUser = await prisma.user.create({
                data: { password: encryptedPW , ...data }
            });

            const { password, ...rest } = UserEntity.fromJSON( newUser );
            // res.status(200).json({ ...rest, password: password });
            return res.status(200).json({ ...rest });
        } catch( error ){
            res.status(400).json( error );
        }
        
    }

    public loginUser = async( req: Request, res: Response ) => {
        const [error,  loginUserDTO] = LoginUserDTO.create(req.body);
        if( error ) return res.status(400).json({ error });

        try {
            const user = await prisma.user.findUnique({
                where: { username: loginUserDTO!.username }
            });

            if( !user ) return res.status(400).json({ error: 'User Not Found' });

            const passMatch = bcryptAdapter.compare( loginUserDTO!.password, user.password );
            if( !passMatch ) return res.status(400).json({ error: 'wrong password' });

            const { password, ...rest } = UserEntity.fromJSON( user );

            const token = await JwtAdapter.generateToken({
                id:user.id
            });
            if( !token ) return res.status(500).json({ error: 'Error creating JWT '});

            return res.status(200).json({ ...rest, token: token });


        } catch( error ){
            res.status(400).json( error );
        }
    }
}