import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {v4 as uuidv4} from 'uuid';

interface Todo {
  id: string;
  text: string;
  dueDate: string;
  completed: boolean;
}


const app: Express = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


let todos: Todo[] = [];

const arbeiten = "Arbeiten";
const datum = "2023-10-12";
const erledigt = false;

const newTodo: Todo = {
  id: uuidv4(),
  text: arbeiten,
  dueDate: datum,
  completed: erledigt
};
todos.push(newTodo)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Todo API!');
});

app.get('/todos', (req: Request, res: Response) => {
  console.log(todos);
  res.json(todos);
});

app.put('/todos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { text, dueDate, completed } = req.body;

  const todoIndex = todos.findIndex((todo) => todo.id == id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (text !== undefined && typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid text data' });
  }
  if (dueDate !== undefined && typeof dueDate !== 'string') {
    return res.status(400).json({ error: 'Invalid dueDate data' });
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid completed data' });
  }

  if(text !== undefined) todos[todoIndex].text = text;
  if(dueDate !== undefined) todos[todoIndex].dueDate = dueDate;
  if(completed !== undefined) todos[todoIndex].completed = completed;

  console.log(todos);
  console.log("Request body received:", req.body);

  res.json({ message: 'To-Do updated successfully', data: todos[todoIndex] });
});

app.post('/todos', (req: Request, res: Response) => {
  const todo: Todo = {
    id: req.body.id,
    text: req.body.text,
    dueDate: req.body.dueDate,
    completed: req.body.completed
  };
  todos.push(todo);
  console.log(todos);
  res.status(201).json(todo);
});

app.delete('/todos/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(req.body.text)
  console.log('Delete request received with id:', id);
  todos = todos.filter((todo) => todo.id !== id);
  console.log(todos);
  res.status(204).end();
});

export default app;
