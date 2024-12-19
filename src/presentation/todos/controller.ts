import { Request, Response } from "express";
import { CreateTodoDTO, UpdateTodoDTO } from "../../domain/dtos";
import { CreateTodo, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";
import { CustomError } from "../../domain/errors/custom.errors";

// let todos = [
//     {id: 1, text: 'Buy Milk', completedAt: new Date()},
//     {id: 2, text: 'Buy bread', completedAt: null},
//     {id: 3, text: 'Buy butter', completedAt: new Date()},
// ];

export class TodosController {

    //* DI
    constructor(
        private readonly todoRepository: TodoRepository,
    ){}

    private handleError = (res: Response, error: unknown) => {

        if(error instanceof CustomError) {
            res.status(error.statusCode).json({error: error.message});
            return;
        }

        const serverError = new CustomError('Internal server error - check logs', 500);
        res.status(serverError.statusCode).json({error: serverError.message});
        return;
    }

    public getTodos = (req: Request, res: Response) => {

        new GetTodos(this.todoRepository)
            .execute()
            .then(todos => res.json(todos))
            .catch(error => this.handleError(res, error));

    }

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;

        if(isNaN(id)) {
            this.handleError(res, new CustomError('Invalid id', 400))
        }

        new GetTodo(this.todoRepository)
            .execute(id)
            .then(todos => res.json(todos))
            .catch((error) => this.handleError(res, error));

    };

    public createTodo = (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDTO.create(req.body);
        
        if(error) {
            this.handleError(res, new CustomError(error, 400));
            return;
        } 

        new CreateTodo(this.todoRepository)
            .execute(createTodoDto!)
            .then(todos => res.status(201).json(todos))
            .catch(error => this.handleError(res, error));

    };

    public updateTodo = (req: Request, res: Response) => {

        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDTO.create({...req.body, id});

        if(error) {
            this.handleError(res, new CustomError(error, 400));
            return;
        }

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then(todos => res.json(todos))
            .catch(error => this.handleError(res, error));

    };

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) {
            this.handleError(res, new CustomError('Invalid id', 400))
        }
        
        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then( todo => res.json(todo))
            .catch(error => this.handleError(res, error));
    };

}