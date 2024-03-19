import { Request, Response } from "express";
import { TodoService } from "../services/todo.service";
import { CreateTodoDTO } from "../../domain/dtos/todos/create-todo.dto";
import { CustomError } from "../../domain/errors/custom.error";
import { DeleteTodoDTO } from "../../domain/dtos/todos/delete-todo.dto";
import { UpdateTodoDTO } from "../../domain/dtos/todos/update-todo.dto";


export class TodoController {

    constructor(
        private readonly todoService: TodoService,
    ){};

    public getTodos = ( req: Request, res: Response ) => {

        const {id} = req.params;

        this.todoService.getTodos( Number(id) )
            .then( tasks => res.status(200).json( tasks ))
            .catch( error => CustomError.handleError( error, res ));

    };

    public createTodo = ( req: Request, res: Response ) => {

        const {id} = req.params;
        const [ error, createTodoDTO ] = CreateTodoDTO.create( req.body );
        if( error ) return res.status(400).json({ error });

        // console.log(req.body.user);
        this.todoService.createTodo( Number(id), createTodoDTO! )
            .then( task => res.status(200).json( task ))
            .catch( error => CustomError.handleError( error, res ));
    };

    public updateTodo = ( req: Request, res: Response ) => {

        const {id} = req.params;

        const [ error, updateTodoDTO ] = UpdateTodoDTO.create( req.body );
        if( error ) return res.status(400).json({ error });

        //console.log( updateTaskDTO!.getDataToUpdate() );
        this.todoService.updateTodo( Number(id), updateTodoDTO! )
            .then( updatedTodo => res.status(200).json( updatedTodo ))
            .catch( error => CustomError.handleError( error, res ));
    };

    public deleteTodo = ( req: Request, res: Response ) => {

        const {id} = req.params;
        const [ error, deleteTaskDTO] = DeleteTodoDTO.create( Number(id) );
        if( error ) return res.status(400).json({ error });

       this.todoService.deleteTodo( deleteTaskDTO! )
            .then( deletedTodo => res.status(200).json( deletedTodo ))
            .catch( error => CustomError.handleError( error, res ));
    };
}