import { CreateTodoDTO, TodoEntity, TodoRepository, UpdateTodoDTO } from "../../domain";
import {TodoDataSource} from '../../domain';

export class TodoRepositoryImpl implements TodoRepository {

    constructor(
        private readonly dataSource: TodoDataSource,
    ){}

    create(createTodoDTO: CreateTodoDTO): Promise<TodoEntity> {
        return this.dataSource.create(createTodoDTO);
    }
    getAll(): Promise<TodoEntity[]> {
        return this.dataSource.getAll();
    }
    findById(id: number): Promise<TodoEntity> {
        return this.dataSource.findById(id);
    }
    updateById(updateTodoDTO: UpdateTodoDTO): Promise<TodoEntity> {
        return this.dataSource.updateById(updateTodoDTO);
    }
    deleteById(id: number): Promise<TodoEntity> {
        return this.dataSource.deleteById(id);
    }



}