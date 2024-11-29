import { Request, Response } from "express";

let todos = [
    {id: 1, text: 'Buy Milk', completedAt: new Date()},
    {id: 2, text: 'Buy bread', completedAt: null},
    {id: 3, text: 'Buy butter', completedAt: new Date()},
];

export class TodosController {

    //* DI
    constructor(){}

    public getTodos = (req: Request, res: Response) => {
        res.json(todos);
        return;
    }

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) {
            res.status(400).json({error: 'Invalid id'});
            return;
        }
        
        const todo = todos.find( todo => todo.id === id );
        (todo)
            ? res.json(todo)
            : res.status(404).json({error: `TODO with id. '${id}' not found`});
        return;
    };

    public createTodo = (req: Request, res: Response) => {

        const {text} = req.body;

        if(!text){
            res.status(400).json({error: 'Text is required'});
            return;
        }

        const newTodo = {
            id: todos.length + 1,
            text: text,
            completedAt: null
        }

        todos.push(newTodo)

        res.json(newTodo);
        return;

    };

    public updateTodo = (req: Request, res: Response) => {

        const id = +req.params.id;
        const {text, completedAt} = req.body;

        if(isNaN(id)) {
            res.status(400).json({error: 'Invalid id'});
            return;
        }

        const todo = todos.find( todo => todo.id === id );
       
        if(!todo){
            res.status(404).json({error: `TODO with id ${id} not found`});
            return;
        }

        todo.text = text || todo.text;
        (completedAt === 'null') 
            ? todo.completedAt = null
            : todo.completedAt = new Date(completedAt || todo.completedAt);
        //! OJO, referencia, deberia ser inmutable

        res.json(todo);
        return;

    };

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) {
            res.status(400).json({error: 'Invalid id'});
            return;
        }
        
        const todo = todos.find( todo => todo.id === id );
        
        if(!todo){
            res.status(404).json({error: `TODO with id ${id} not found`});
            return;
        }

        todos = todos.filter(td => td.id !== todo.id);
        
        res.json(todo);

        return;
    };

}