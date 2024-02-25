import { Request, Response } from "express";
import { prisma } from "../../data/postgres";

export class UserController {

    constructor(){};

    public getUsers = async( req: Request, res: Response ) => {

        const users = await prisma.user.findMany();

        return res.status(200).json( users );
    };
    
}