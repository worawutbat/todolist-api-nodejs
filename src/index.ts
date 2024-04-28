// src/index.ts
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const port = 3000;

interface ITodoItem {
  id: number
  todoText: string
}

//CRUD TodoList
let todoId = 0
let todoList: ITodoItem[]  = []

app.get('/todo', (req, res) => {
  res.json(todoList);
});

app.get('/todo/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoById = todoList.find(t => t.id === id)

  if (todoById?.todoText) {
    res.json(todoById);
  } else {
    res.status(404).send(`Not Found Todo Item`)
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.post('/todo', (req, res) => {
  const id = todoId++;
  const todoText = String(req?.body?.todoText || "")
  const createTodoItem = { id, todoText }

  if (!todoList.length) {
    todoList = [createTodoItem]
  } else {
    todoList = [...todoList, createTodoItem]
  }

  res.send('Create Todo item Success!');
});

app.put('/todo', (req, res) => {
  const updateId = parseInt(req.body.id);
  const todoText = String(req?.body?.todoText || "")

    if (typeof updateId !== 'number') {
      return res.status(400).send('Bad Request error')
    }

    const todoIndex = todoList.findIndex(t => t.id === updateId)

    if (todoIndex !== -1) {
      const updateTodoItem = {id: updateId, todoText}
      todoList = [...todoList.slice(0, todoIndex), updateTodoItem, ...todoList.slice(todoIndex + 1)]
      res.send(updateTodoItem);
    } else {
      res.status(404).send('Not Found Todo Item')
    }
});

app.delete('/todo', (req, res) => {
  const deleteId = parseInt(req.body.id);

    if (typeof deleteId !== 'number') {
      return res.status(400).send('Bad Request error')
    }

    const todoIndex = todoList.findIndex(t => t.id === deleteId)

    if (todoIndex !== -1) {
      todoList = [...todoList.slice(0, todoIndex), ...todoList.slice(todoIndex + 1)]
      res.send('Delete Todo Item Success!');
    } else {
      res.status(404).send('Not Found Todo Item')
    }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});