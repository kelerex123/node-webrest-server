
export class UpdateTodoDTO {

    private constructor(
        private readonly id: number,
        private readonly text: string,
        private readonly completedAt?: string,
    ){}

    get values() {
        const returnObj: {[key: string]: any} = {};

        if(this.text) returnObj.text = this.text;
        if(this.completedAt) returnObj.completedAt = this.completedAt;

        return returnObj;
    }

    static create(props: {[key: string]: any}): [string?, UpdateTodoDTO?] {

        const {id, text, completedAt} = props;
    
        if(!id || isNaN(Number(id))) {
            return ['Id must be a valid number'];
        }

        let newCompletedAt = completedAt;

        if (completedAt){
            newCompletedAt = new Date(completedAt);
            if(newCompletedAt.toString() === 'Invalid Date') {
                return ['CompletedAt must be a valid date'];
            }
        }



        return [undefined, new UpdateTodoDTO(id, text, newCompletedAt)];

    }

}