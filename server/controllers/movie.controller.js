const { db } = require('../database/init');

class MovieController {
  // Get all movies
  getAllMovies(req, res) {
    db.all('SELECT * FROM movies', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const movies = rows.map(row => ({
        ...row,
        actors: JSON.parse(row.actors)
      }));
      
      res.json(movies);
    });
  }

  // Get movie by ID
  getMovieById(req, res) {
    const { id } = req.params;
    db.get('SELECT * FROM movies WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      
      const movie = {
        ...row,
        actors: JSON.parse(row.actors)
      };
      
      res.json(movie);
    });
  }

  // Create new movie
  createMovie(req, res) {
    const {
      title, description, releaseYear, genre, rating,
      imageUrl, director, actors, duration
    } = req.body;

    const sql = `
      INSERT INTO movies (title, description, releaseYear, genre, rating, imageUrl, director, actors, duration)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
      title, description, releaseYear, genre, rating,
      imageUrl, director, JSON.stringify(actors), duration
    ], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.status(201).json({
        id: this.lastID,
        title,
        description,
        releaseYear,
        genre,
        rating,
        imageUrl,
        director,
        actors,
        duration
      });
    });
  }

  // Update movie
  updateMovie(req, res) {
    const { id } = req.params;
    const {
      title, description, releaseYear, genre, rating,
      imageUrl, director, actors, duration
    } = req.body;

    const sql = `
      UPDATE movies 
      SET title = ?, description = ?, releaseYear = ?, genre = ?, 
          rating = ?, imageUrl = ?, director = ?, actors = ?, duration = ?
      WHERE id = ?
    `;

    db.run(sql, [
      title, description, releaseYear, genre, rating,
      imageUrl, director, JSON.stringify(actors), duration, id
    ], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json({ message: 'Movie updated successfully' });
    });
  }

  // Delete movie
  deleteMovie(req, res) {
    const { id } = req.params;
    db.run('DELETE FROM movies WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json({ message: 'Movie deleted successfully' });
    });
  }
}

module.exports = new MovieController();