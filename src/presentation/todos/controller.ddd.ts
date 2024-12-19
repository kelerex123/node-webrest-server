import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDTO, UpdateTodoDTO } from "../../domain/dtos";
import { TodoRepository } from "../../domain";

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

    public getTodos = async(req: Request, res: Response) => {

        const allTodos = await this.todoRepository.getAll();
        
        // const allTodos = await prisma.todo.findMany();

        res.json(allTodos);
        return;
    }

    public getTodoById = async(req: Request, res: Response) => {
        const id = +req.params.id;

        try {
            const todo = await this.todoRepository.findById(id); 
            res.json(todo);
        } catch (error: any) {
            res.status(404).json({error: error});
        }

        // if(isNaN(id)) {
        //     res.status(400).json({error: 'Invalid id'});
        //     return;
        // }
        
        // const todo = await prisma.todo.findUnique({
        //     where: {
        //         id: id,
        //     },
        // });

        // //const todo = todos.find( todo => todo.id === id );
        // (todo)
        //     ? res.json(todo)
        //     : res.status(404).json({error: `TODO with id. '${id}' not found`});
        return;
    };

    public createTodo = async(req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDTO.create(req.body);
        
        if(error) {
            res.status(400).json({error});
            return;
        } 

        // if(!text){
        //     res.status(400).json({error: 'Text is required'});
        //     return;
        // }

        const todo = await this.todoRepository.create(createTodoDto!);

        // const todo = await prisma.todo.create({
        //     data: createTodoDto!
        // });

        // const newTodo = {
        //     id: todos.length + 1,
        //     text: text,
        //     completedAt: null
        // }

        // todos.push(newTodo)

        res.json(todo);
        return;

    };

    public updateTodo = async(req: Request, res: Response) => {

        const id = +req.params.id;
        //const {text, completedAt} = req.body;
        const [error, updateTodoDto] = UpdateTodoDTO.create({...req.body, id});

        if(error) {
            res.status(400).json({error});
            return;
        }

        // if(isNaN(id)) {
        //     res.status(400).json({error: 'Invalid id'});
        //     return;
        // }

        //const todo = todos.find( todo => todo.id === id );
       
        const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);

        // const todo = await prisma.todo.findUnique({
        //     where: {
        //         id: id,
        //     },
        // });

        // if(!todo){
        //     res.status(404).json({error: `TODO with id ${id} not found`});
        //     return;
        // }

        // const updatedTodo = await prisma.todo.update({
        //     where: {
        //         id: id,
        //     },
        //     data: updateTodoDto!.values,
        // });

        // todo.text = text || todo.text;
        // (completedAt === 'null') 
        //     ? todo.completedAt = null
        //     : todo.completedAt = new Date(completedAt || todo.completedAt);
        //! OJO, referencia, deberia ser inmutable

        res.json(updatedTodo);
        return;

    };

    public deleteTodo = async(req: Request, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) {
            res.status(400).json({error: 'Invalid id'});
            return;
        }
        
        //const todo = todos.find( todo => todo.id === id );
        try {
            const deleted = await this.todoRepository.deleteById(id);
            res.json(deleted)
        } catch (error) {
            res.status(400).json({error: error});
        }

        // const todo = await prisma.todo.findUnique({
        //     where: {
        //         id: id,
        //     },
        // });

        // if(!todo){
        //     res.status(404).json({error: `TODO with id ${id} not found`});
        //     return;
        // }

        // //todos = todos.filter(td => td.id !== todo.id);
        // const deleted = await prisma.todo.delete({
        //     where: {
        //         id: id,
        //     },
        // });
        
        // (deleted)
        //     ? res.json(deleted)
        //     : res.status(400).json({error: `TODO with id ${id} not found`});

        return;
    };

}