import { prisma } from "../../data/postgres";
import { CreateTodoDTO } from "../../domain/dtos/todos/create-todo.dto";
import { DeleteTodoDTO } from "../../domain/dtos/todos/delete-todo.dto";
import { UpdateTodoDTO } from "../../domain/dtos/todos/update-todo.dto";
import { CustomError } from "../../domain/errors/custom.error";

export class TodoService {

    constructor(){};

    async createTodo( taskId: number, createTodoTDO: CreateTodoDTO ){

        let taskExist = null;

        try{
            taskExist = await prisma.task.findUnique({ where: { id: taskId } });

        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }

        if( !taskExist ) throw CustomError.badRequest(`Task with id: ${ taskId } doesn't exist`);

        try{

            const newTodo = await prisma.todo.create({
                data: {
                    taskId: taskId,
                    description: createTodoTDO.description,
                    completedAt: createTodoTDO.completedAt,
                    isCompleted: createTodoTDO.isCompleted,
                }
            });

            return {
                newTodo: { ...newTodo },
            };
        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }
    };

    async getTodos( taskId: number ){
        try{
            const todos = await prisma.todo.findMany({
                where: { taskId: taskId }
            });

            return todos;

        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }
    }

    async updateTodo( todoId: number, updateTodoDTO: UpdateTodoDTO ){

        const todoExist = await prisma.todo.findUnique({
            where: { id: todoId }
        });

        if( !todoExist ) throw CustomError.badRequest(`Todo with id: ${ todoId } doesn't exist`);

        try{
            const updatedTodo = await prisma.todo.update({
                where: { id: todoId },
                data: { ...updateTodoDTO.getDataToUpdate() }
            });

            return updatedTodo;
        } catch( error ){
            throw CustomError.internalServer('Internal Server Erorr');
        }
    }

    async deleteTodo( deleteTodoDTO: DeleteTodoDTO ){

        const todoId = deleteTodoDTO.id;
        let todoExist = null;

        try{
            todoExist = await prisma.todo.findUnique({ where: { id: todoId } });
        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }

        if( !todoExist ) throw CustomError.badRequest(`Todo with id: ${ todoId } doesn't exist`);

        try{
            const deletedTodo = await prisma.todo.delete({
                where: {id: todoId}
            });
            return { ...deletedTodo };

        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }
    }
}