import { prisma } from "../../data/postgres";
import { PaginationDTO } from "../../domain/dtos/shared/pagination.dto";
import { UserAssigmentTaskDTO } from "../../domain/dtos/tasks/user-assigment-task.dto";
import { CreateTaskDTO } from "../../domain/dtos/tasks/create-task.dto";
import { UpdateTaskDTO } from "../../domain/dtos/tasks/update-task.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { DeleteTaskDTO } from "../../domain/dtos/tasks/delete-task.dto";

export class TaskService {

    constructor(){};

    async createTask( createTaskDTO: CreateTaskDTO, user: UserEntity ) {
        /*const userExist = await prisma.user.findUnique({
            where: { id: createTaskDTO.assignedTo }
        });
        if( !userExist ) throw CustomError.badRequest(`User with id: ${ createTaskDTO.assignedTo } doesn't exist`);
*/
        // console.log(createTaskDTO!);
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

            /*const taskAssigment = await prisma.taskAssigment.create({
                data: {
                    userId: createTaskDTO.assignedTo,
                    taskId: task.id
                }
            });*/

            return {
                newTask: {...task},
                // assignedTo: taskAssigment.userId
            };

        } catch( error ){
            throw CustomError.internalServer(`${ error }`);
        }
    };

    async getTasks( pagination: PaginationDTO ){

        const skip = (pagination.page - 1) * (pagination.limit);
        try{

            const [total, tasks] = await Promise.all([
                await prisma.task.count(),
                await prisma.task.findMany({
                    skip: skip,
                    take: pagination.limit,
                    include: {
                        todos: true,
                    }
                }),
            ]);

            return {
                page: pagination.page,
                limit: pagination.limit,
                total: total,

                next: ( (pagination.page * pagination.limit) < total ) 
                    ? `/api/tasks?page=${ pagination.page + 1}&limit=${ pagination.limit }`
                    : null,
                prev: ( pagination.page - 1 > 0 ) 
                    ? `/api/tasks?page=${ pagination.page - 1}&limit=${ pagination.limit }`
                    : null,

                tasks: tasks.map( task => {
                    return {...task};
                })
            }

        } catch( error ){
            throw CustomError.internalServer('Internal Server Erorr');
        }
    };

    async updateTaskData( taskId: number, updateTaskDTO: UpdateTaskDTO ){

        const taskExist = await prisma.task.findUnique({
            where: { id: taskId }
        });
        if( !taskExist ) throw CustomError.badRequest(`Task with id: ${ taskId } doesn't exist`);

        // console.log( updateTaskDTO.getDataToUpdate() );
        try{
            const updatedTask = await prisma.task.update({
                where: { id: taskId },
                data: { ...updateTaskDTO.getDataToUpdate() }
            });

            return updatedTask;
        } catch( error ){
            throw CustomError.internalServer('Internal Server Erorr');
        }
    }

    async addUserToTask( taskId: number, addUserToTaskDTO: UserAssigmentTaskDTO ){

        let taskExist = null;
        let userAdded = null;
        let userExist = null;
        try{
            [taskExist, userAdded, userExist] = await Promise.all([
                await prisma.task.findUnique({ where: { id: taskId } }),
                await prisma.taskAssigment.findFirst({
                    where: { taskId: taskId, userId: addUserToTaskDTO.assignedTo }
                }),
                await prisma.user.findUnique({
                    where: { id: addUserToTaskDTO.assignedTo }
                }),
            ]);

        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }

        if( !userExist ) throw CustomError.badRequest(`User with id: ${ addUserToTaskDTO.assignedTo } doesn't exist`);
        if( !taskExist ) throw CustomError.badRequest(`Task with id: ${ taskId } doesn't exist`);
        if( userAdded ) throw CustomError.badRequest(`The user with id: ${ addUserToTaskDTO.assignedTo } was already assigned to the task`);

        try{
            await prisma.taskAssigment.create({
                data: {
                    userId: addUserToTaskDTO.assignedTo,
                    taskId: taskId,
                }
            });

            return {
                task: { ...taskExist },
                userAssigned: addUserToTaskDTO.assignedTo
            }
        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }
    };

    async unAssignUserFromTask( taskId: number, userAssigmentTaskDTO: UserAssigmentTaskDTO ){

        let taskExist = null;
        let userAssigned = null;
        let userExist = null;
        try{
            [taskExist, userAssigned, userExist] = await Promise.all([
                await prisma.task.findUnique({ where: { id: taskId } }),
                await prisma.taskAssigment.findFirst({
                    where: { taskId: taskId, userId: userAssigmentTaskDTO.assignedTo }
                }),
                await prisma.user.findUnique({
                    where: { id: userAssigmentTaskDTO.assignedTo }
                }),
            ]);
        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }

        if( !userExist ) throw CustomError.badRequest(`User with id: ${ userAssigmentTaskDTO.assignedTo } doesn't exist`);
        if( !taskExist ) throw CustomError.badRequest(`Task with id: ${ taskId } doesn't exist`);
        if( !userAssigned ) throw CustomError.badRequest(`The user with id: ${ userAssigmentTaskDTO.assignedTo } isn't assigned to the task`);

        try{
            await prisma.taskAssigment.delete({
                where: {
                    userId_taskId: {
                        userId: userAssigmentTaskDTO.assignedTo,
                        taskId: taskId,
                    }
                }
            });

            return {
                taskId: { ...taskExist },
                unassignedUser: userAssigmentTaskDTO.assignedTo
            }
        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }
    };

    async deleteTask( deleteTaskDTO: DeleteTaskDTO ){

        const taskId = deleteTaskDTO.id;
        let taskExist = null;
        let assigmentsExist = null;
        let hasAssigments = false;
        try{
            [taskExist, assigmentsExist] = await Promise.all([
                await prisma.task.findUnique({ where: { id: taskId } }),
                await prisma.taskAssigment.findMany({ where: { taskId: taskId } }),
            ]);

        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }

        if( !taskExist ) throw CustomError.badRequest(`Task with id: ${ taskId } doesn't exist`);
        ( assigmentsExist ) ? hasAssigments = true : hasAssigments = false; 

        try{
            const [ deletedAssigments, deletedTask] = await this.deleteTaskAndAssigments( taskId, hasAssigments );
            return { deletedAssigments, deletedTask };
        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }
    }

    private async deleteTaskAndAssigments(taskId: number, hasAssigments: boolean ) {
    
        let deleteAssigmentsPromise;
        if( hasAssigments ){
            deleteAssigmentsPromise = prisma.taskAssigment.deleteMany({
                where: { taskId: taskId }
            })
        };

        const deleteTaskPromise = prisma.task.delete({
            where: {id: taskId}
        });

        try{
            const [deletedAssigments, deletedTask] = await Promise.all([
                deleteAssigmentsPromise,
                deleteTaskPromise,
            ]);

            return [deletedAssigments, deletedTask];

        } catch( error ){
            throw CustomError.internalServer('Internal Server Error');
        }
    }
}