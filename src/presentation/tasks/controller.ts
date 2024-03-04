import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { CreateTaskDTO } from "../../domain/dtos/tasks/create-task.dto";
import { CustomError } from "../../domain/errors/custom.error";
import { PaginationDTO } from "../../domain/dtos/shared/pagination.dto";
import { UpdateTaskDTO } from "../../domain/dtos/tasks/update-task.dto";
import { UserAssigmentTaskDTO } from "../../domain/dtos/tasks/user-assigment-task.dto";
import { DeleteTaskDTO } from "../../domain/dtos/tasks/delete-task.dto";

export class TaskController {

    constructor(
        private readonly taskService: TaskService,
    ){};

    public getTasks = ( req: Request, res: Response ) => {

        // console.log(req.body);

        const {page = 1, limit = 10} = req.query;
        const [ error, paginationDTO] = PaginationDTO.create( Number(page), Number(limit) );
        if( error ) return res.status(400).json({ error });

        this.taskService.getTasks( paginationDTO! )
            .then( tasks => res.status(200).json( tasks ))
            .catch( error => CustomError.handleError( error, res ));

    };

    public createTasks = ( req: Request, res: Response ) => {

        const [ error, createTaskDTO ] = CreateTaskDTO.create( req.body );
        if( error ) return res.status(400).json({ error });

        // console.log(req.body.user);
        this.taskService.createTask( createTaskDTO!, req.body.user )
            .then( task => res.status(200).json( task ))
            .catch( error => CustomError.handleError( error, res ));
    };

    public updateTask = ( req: Request, res: Response ) => {

        const {id} = req.params;

        const [ error, updateTaskDTO ] = UpdateTaskDTO.create( req.body );
        if( error ) return res.status(400).json({ error });

        //console.log( updateTaskDTO!.getDataToUpdate() );
        this.taskService.updateTaskData( Number(id), updateTaskDTO! )
            .then( updatedTask => res.status(200).json( updatedTask ))
            .catch( error => CustomError.handleError( error, res ));
    };

    public assignUserToTask = ( req: Request, res: Response ) => {

        const {id} = req.params;
        const [ error, userAssigmentTaskDTO ] = UserAssigmentTaskDTO.create( req.body );
        if( error ) return res.status(400).json({ error });

        this.taskService.addUserToTask( Number(id), userAssigmentTaskDTO! )
            .then( assignedUser => res.status(200).json( assignedUser ))
            .catch( error => CustomError.handleError( error, res ));
    };

    public unassignUserFromTask = ( req: Request, res: Response ) => {

        const { id } = req.params;
        const [error, userAssigmentTaskDTO ] = UserAssigmentTaskDTO.create( req.body );
        if( error ) return res.status(400).json({ error });

        this.taskService.unAssignUserFromTask( Number(id), userAssigmentTaskDTO! )
            .then( unassignedUser => res.status(200).json( unassignedUser ))
            .catch( error => CustomError.handleError( error, res ));
    };

    public deleteTask = ( req: Request, res: Response ) => {

        const {id} = req.params;
        const [ error, deleteTaskDTO] = DeleteTaskDTO.create( Number(id) );
        if( error ) return res.status(400).json({ error });

       this.taskService.deleteTask( deleteTaskDTO! )
            .then( deletedTask => res.status(200).json( deletedTask ))
            .catch( error => CustomError.handleError( error, res ));
    };
}