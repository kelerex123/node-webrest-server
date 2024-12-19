import { prisma } from "../../data/postgres";
import { CreateTodoDTO, TodoDataSource, TodoEntity, UpdateTodoDTO } from "../../domain";
import { CustomError } from "../../domain/errors/custom.errors";

export class TodoDatasourceImp implements TodoDataSource {
    async create(createTodoDTO: CreateTodoDTO): Promise<TodoEntity> {
        const todo = await prisma.todo.create({
            data: createTodoDTO!
        });

        return TodoEntity.fromObject(todo);
    }
    async getAll(): Promise<TodoEntity[]> {
        const allTodos = await prisma.todo.findMany();

        return allTodos.map(TodoEntity.fromObject);

    }
    async findById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findUnique({
            where: {
                id: id,
            },
        });
        
        if(!todo) throw new CustomError(`Todo with id ${id} not found`, 404);

        return TodoEntity.fromObject(todo);
    }
    async updateById(updateTodoDTO: UpdateTodoDTO): Promise<TodoEntity> {
        await this.findById(updateTodoDTO.id);

        const updatedTodo = await prisma.todo.update({
            where: {
                id: updateTodoDTO.id,
            },
            data: updateTodoDTO!.values,
        }); 

        return TodoEntity.fromObject(updatedTodo);

    }
    async deleteById(id: number): Promise<TodoEntity> {
        await this.findById(id);

        const deleted = await prisma.todo.delete({
            where: {
                id: id,
            },
        });

        return TodoEntity.fromObject(deleted);
    }

}