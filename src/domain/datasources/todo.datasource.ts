import { CreateTodoDTO, UpdateTodoDTO } from './../dtos';
import { TodoEntity } from "../entities/todo.entity";

export abstract class TodoDataSource {

    abstract create(createTodoDTO: CreateTodoDTO): Promise<TodoEntity>;
    //TODO: paginacion
    abstract getAll(): Promise<TodoEntity[]>;
    abstract findById(id: number): Promise<TodoEntity>;
    abstract updateById(updateTodoDTO: UpdateTodoDTO): Promise<TodoEntity>;
    abstract deleteById(id: number): Promise<TodoEntity>;
    
}