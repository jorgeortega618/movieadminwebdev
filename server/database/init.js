const sqlite3 = require('sqlite3').verbose();
const { MOVIES } = require('../../src/app/data/movies.data');

const db = new sqlite3.Database(':memory:');

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create movies table
      db.run(`
        CREATE TABLE IF NOT EXISTS movies (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          releaseYear INTEGER NOT NULL,
          genre TEXT NOT NULL,
          rating REAL NOT NULL,
          imageUrl TEXT NOT NULL,
          director TEXT NOT NULL,
          actors TEXT NOT NULL,
          duration INTEGER NOT NULL
        )
      `, (err) => {
        if (err) reject(err);

        // Insert initial movies data
        const stmt = db.prepare(`
          INSERT INTO movies (id, title, description, releaseYear, genre, rating, imageUrl, director, actors, duration)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        MOVIES.forEach(movie => {
          stmt.run(
            movie.id,
            movie.title,
            movie.description,
            movie.releaseYear,
            movie.genre,
            movie.rating,
            movie.imageUrl,
            movie.director,
            JSON.stringify(movie.actors),
            movie.duration
          );
        });

        stmt.finalize(err => {
          if (err) reject(err);
          resolve();
        });
      });
    });
  });
}

module.exports = {
  db,
  initializeDatabase
};