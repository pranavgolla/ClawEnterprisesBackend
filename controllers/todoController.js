const Todo = require('../models/Todo');

exports.createTodo = async (req, res) => {
  const { text } = req.body;

  const todo = new Todo({
    user: req.user._id,
    text,
  });

  const createdTodo = await todo.save();
  res.status(201).json(createdTodo);
};

exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });
  res.json(todos);
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { text, isCompleted } = req.body;

  const todo = await Todo.findById(id);

  if (todo.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  todo.text = text || todo.text;
  todo.isCompleted = isCompleted !== undefined ? isCompleted : todo.isCompleted;

  const updatedTodo = await todo.save();
  res.json(updatedTodo);
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the todo by ID
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if the user is authorized to delete the todo
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete the todo
    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Todo removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleTodo = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
      const todo = await Todo.findById(id);
      if (!todo) {
          return res.status(404).json({ message: 'Todo not found' });
      }
      if (todo.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: 'Not authorized' });
      }
      todo.isCompleted = !todo.isCompleted;
      await todo.save();
      res.json(todo);
  } catch (err) {
      res.status(500).json({ message: 'Server error' });
  }
};


