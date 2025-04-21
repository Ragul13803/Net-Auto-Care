import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

const Todo = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  const addTodo = () => {
    if (!inputValue.trim()) return;

    if (isEditing && currentEditIndex !== null) {
      const updatedTodos = [...todos];
      updatedTodos[currentEditIndex] = inputValue;
      setTodos(updatedTodos);
      setIsEditing(false);
      setCurrentEditIndex(null);
    } else {
      setTodos([...todos, inputValue]);
    }

    setInputValue('');
  };

  const editTodo = (index: number) => {
    setInputValue(todos[index]);
    setIsEditing(true);
    setCurrentEditIndex(index);
  };

  const deleteTodo = (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    if (isEditing && currentEditIndex === index) {
      setIsEditing(false);
      setInputValue('');
      setCurrentEditIndex(null);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // 👈 centers vertically
        minHeight: '100vh',
        padding: 4,
        bgcolor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Todo List
      </Typography>

      <Card sx={{ width: '600px', padding: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            placeholder="Enter your task here..."
            size="small"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            variant="contained"
            color={isEditing ? 'warning' : 'primary'}
            onClick={addTodo}
          >
            {isEditing ? 'Update' : '(+) Add'}
          </Button>
        </Box>

        {todos.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" variant='h6'>
            No tasks yet.
          </Typography>
        ) : (
          todos.map((todo, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#f0f0f0',
                padding: 1.5,
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Typography>
                <strong>{index + 1}.</strong> {todo}
              </Typography>
              <Box>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => editTodo(index)}
                >
                  <ModeEditTwoToneIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteTodo(index)}
                >
                  <DeleteTwoToneIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
      </Card>
    </Box>
  );
};

export default Todo;