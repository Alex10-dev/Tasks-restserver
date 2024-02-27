import { prisma } from "../../data/postgres";
import { CreateTaskDTO } from "../../domain/dtos/tasks/create-task.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class TaskService {

    constructor(){};

    async createTask( createTaskDTO: CreateTaskDTO, user: UserEntity ) {
        const userExist = await prisma.user.findUnique({
            where: { id: createTaskDTO.assignedTo }
        });
        if( !userExist ) throw CustomError.badRequest(`User with id: ${ createTaskDTO.assignedTo } doesn't exist`);

        console.log(createTaskDTO!);
        try{
            const task = await prisma.task.create({
                data: {
                    title: createTaskDTO!.title, 
                    isCompleted: createTaskDTO!.isCompleted,
                    description: createTaskDTO!.description,
                    completedAt: createTaskDTO!.completedAt,
                    userId: user.id 
                }
            });
            console.log( task);

            const taskAssigment = await prisma.taskAssigment.create({
                data: {
                    userId: createTaskDTO.assignedTo,
                    taskId: task.id
                }
            });

            console.log('se crean');
            return {
                newTask: {...task},
                assignedTo: {...taskAssigment}
            };

        } catch( error ){
            throw CustomError.internalServer(`${ error }`);
        }
    }
}