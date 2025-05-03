import db from '../models/index.js';
const { Joke } = db;



// Create a new joke
export const createJoke = async (req, res) => {
  try {
    const joke = await Joke.create({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      createdBy: req.user.id // Assuming we have user info in request
    });
    res.status(201).json(joke);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all jokes
export const getAllJokes = async (req, res) => {
  try {
    const jokes = await Joke.findAll();
    res.status(200).json(jokes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single joke by ID
export const getJokeById = async (req, res) => {
  try {
    const joke = await Joke.findByPk(req.params.id);
    if (!joke) {
      return res.status(404).json({ message: 'Joke not found' });
    }
    res.status(200).json(joke);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a joke
export const updateJoke = async (req, res) => {
  try {
    const joke = await Joke.findByPk(req.params.id);
    if (!joke) {
      return res.status(404).json({ message: 'Joke not found' });
    }
    
    // Check if user is the creator of the joke
    if (joke.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this joke' });
    }

    await joke.update({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category
    });
    
    res.status(200).json(joke);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a joke
export const deleteJoke = async (req, res) => {
  try {
    const joke = await Joke.findByPk(req.params.id);
    if (!joke) {
      return res.status(404).json({ message: 'Joke not found' });
    }

    // Check if user is the creator of the joke
    if (joke.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this joke' });
    }

    await joke.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
