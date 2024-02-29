interface JsonData {
    [key: string]: any
}

export class AddUserToTaskDTO {

    public readonly assignedTo: number;

    constructor( data: JsonData ){
        this.assignedTo = data.assignedTo;
    }

    static create( data: JsonData ): [string?, AddUserToTaskDTO?]{

        const { assignedTo } = data;
        if( !assignedTo ) return ['the user id to assign the task is required'];
        if ( typeof assignedTo !== 'number' ) return ['the user id to assign the task must be a number'];
        if( assignedTo <= 0 ) return ['the user id to assign the task must be greater than cero']; 
        
        return [undefined, new AddUserToTaskDTO({
            assignedTo: assignedTo,
        })]
        
    }
}