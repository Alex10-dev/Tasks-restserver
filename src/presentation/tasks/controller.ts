import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { CreateTaskDTO } from "../../domain/dtos/tasks/create-task.dto";
import { CustomError } from "../../domain/errors/custom.error";

export class TaskController {

    constructor(
        private readonly taskService: TaskService,
    ){};

    public getTasks = ( req: Request, res: Response ) => {

        console.log(req.body);

        return res.json({
            msg: 'Get Task route is working',
        });
    };

    public createTasks = ( req: Request, res: Response ) => {

        const [ error, createTaskDTO ] = CreateTaskDTO.create( req.body );
        if( error ) return res.status(400).json({ error });

        // console.log(req.body.user);
        this.taskService.createTask( createTaskDTO!, req.body.user )
            .then( task => res.status(200).json( task ))
            .catch( error => CustomError.handleError( error, res ));
    };
}