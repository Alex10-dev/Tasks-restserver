interface JsonData {
    [key: string]: any
}

export class CreateTaskDTO {

    public readonly title: string;
    public readonly isCompleted: boolean;
    public readonly assignedTo: number;
    public readonly description?: string | null;
    public readonly completedAt?: Date | null;

    constructor( data: JsonData ){
        this.title = data.title;
        this.isCompleted = data.isCompleted;
        this.assignedTo = data.assignedTo;
        this.description = data.description;
        this.completedAt = data.completedAt;
    }

    static create( data: JsonData ): [string?, CreateTaskDTO?]{

        const { title, assignedTo, description, completedAt } = data;
        let { isCompleted } = data;

        if( !title || typeof title !== 'string' ) return ['title is required and it must be a string'];
        if( title.length <= 3 ) return ['title is too short'];
        if( !assignedTo ) return ['the user id to assign the task is required'];
        if ( typeof assignedTo !== 'number' ) return ['the user id to assign the task must be a number'];
        if( description && typeof description !== 'string' ) return ['description must be a string'];

        let newCompletedAt = null;
        if( isCompleted != null ){
            if( completedAt ){
                newCompletedAt = new Date( completedAt );
                if( newCompletedAt.toString() === 'Invalid Date' ) return ['CompletedAt must be a valid date'];
            };
        } else {
            isCompleted = false;
        }
        
        return [undefined, new CreateTaskDTO({
            title: title,
            isCompleted: isCompleted,
            assignedTo: assignedTo,
            description: description,
            completedAt: newCompletedAt,
        })]
        
    }
}