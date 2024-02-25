import { Request, Response } from "express";

export class TaskController {

    constructor(){};

    public getTasks = ( req: Request, res: Response ) => {
        return res.json({
            msg: 'Task route is working',
        });
    };
}