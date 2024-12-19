
import request from 'supertest';
import { testServer } from '../../test-server';
import { constants } from 'buffer';
import { prisma } from '../../../src/data/postgres';

describe('Todo route testing', () => {

    beforeEach(async() => {
        await prisma.todo.deleteMany();
    });

    beforeAll(async() => {

        await testServer.start();

    });

    afterAll(() => {

        testServer.close();
    })

    const todo1 = {text: 'Tarea 1'};
    const todo2 = {text: 'Tarea 2'};

    test('should return TODOs api/todos', async () => {
        
        
        await prisma.todo.createMany({
            data: [todo1, todo2]
        })
        
        const {body} = await request(testServer.getApp)
            .get('/api/todos')
            .expect(200);
        
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(2);
        expect(body[0].text).toEqual(todo1.text);
        expect(body[1].text).toEqual(todo2.text);
        expect(body[0].completedAt).toBeNull();


    });

    test('should return a TODO api/todos/:id', async () => {
        
        const createdTodo = await prisma.todo.create({
            data: todo1
        });
        
        const {body} = await request(testServer.getApp)
            .get('/api/todos/' + createdTodo.id)
            .expect(200);
        
        
        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual({
            id: createdTodo.id,
            text: createdTodo.text,
            completedAt: createdTodo.completedAt,
        });

    });

    test('should return a 404 NotFound api/todos/:id', async () => {
        
        const todoId = "90203";

        const {body} = await request(testServer.getApp)
            .get('/api/todos/' + todoId)
            .expect(404);
        
        
        expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
      
    });

    test('should return a new Todo api/todos', async () => {

        const {body} = await request(testServer.getApp)
            .post('/api/todos/')
            .send(todo1)
            .expect(201);
        
        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null,
        })
        
      
    });

    test('should return an error if text is not sent api/todos', async () => {

        const {body} = await request(testServer.getApp)
            .post('/api/todos/')
            .send({})
            .expect(400);
        
        expect(body).toEqual({ error: 'Text property is required' });
        
    });

    test('should return an error if text is not valid api/todos', async () => {

        const {body} = await request(testServer.getApp)
            .post('/api/todos/')
            .send({text:''})
            .expect(400);
        
        expect(body).toEqual({ error: 'Text property is required' });
        
      
    });

    test('should return a updated Todo api/todos/:id', async () => {

        const newTodo = await prisma.todo.create({
            data: todo1
        })



        const {body} = await request(testServer.getApp)
            .put('/api/todos/' + newTodo.id)
            .send({text: 'Hola Mundo updated', completedAt: '2024-12-17'})
            .expect(200);
        
        expect(body).toEqual({
            id: newTodo.id,
            text: 'Hola Mundo updated',
            completedAt: '2024-12-17T00:00:00.000Z',
        })
    });

    // TODO: Realizar este test con errores personalizados
    test('should return a 404 if todo not found api/todos/:id', async () => {

        const todoId = "90203";

        const {body} = await request(testServer.getApp)
            .put('/api/todos/' + todoId)
            .send({text: 'Hola Mundo updated', completedAt: '2024-12-17'})
            .expect(404);
        
        expect(body).toEqual({ error: 'Todo with id 90203 not found' });
    });

    test('should return an updated TODO only the date api/todos/:id', async () => {

        const newTodo = await prisma.todo.create({
            data: todo1
        })

        const {body} = await request(testServer.getApp)
            .put('/api/todos/' + newTodo.id)
            .send({completedAt: '2024-12-17'})
            .expect(200);
        
        expect(body).toEqual({
            id: newTodo.id,
            text: newTodo.text,
            completedAt: '2024-12-17T00:00:00.000Z',
        })
    });

    test('should return an updated TODO only the text api/todos/:id', async () => {

        const newTodo = await prisma.todo.create({
            data: todo1
        })

        const {body} = await request(testServer.getApp)
            .put('/api/todos/' + newTodo.id)
            .send({text: 'Tarea Updated'})
            .expect(200);
        
        expect(body).toEqual({
            id: newTodo.id,
            text: 'Tarea Updated',
            completedAt: newTodo.completedAt,
        })
    });

    test('should not updated a TODO api/todos/:id', async () => {

        const newTodo = await prisma.todo.create({
            data: todo1
        })

        const {body} = await request(testServer.getApp)
            .put('/api/todos/' + newTodo.id)
            .send({})
            .expect(200);
        
        expect(body).toEqual(newTodo);
    });

    test('should delete a TODO api/todos/:id', async () => {

        const newTodo = await prisma.todo.create({
            data: todo1
        })

        const {body} = await request(testServer.getApp)
            .delete('/api/todos/' + newTodo.id)
            .expect(200);
        
        expect(body).toEqual(newTodo);
    });


    //TODO: Cambiar a 404
    test('should return a 404 if TODO do not exist api/todos/:id', async () => {

        const {body} = await request(testServer.getApp)
            .delete('/api/todos/231241')
            .expect(404);
        
        expect(body).toEqual({ error: 'Todo with id 231241 not found' });
    });


});