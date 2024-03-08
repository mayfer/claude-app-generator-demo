
import sqlite3 from 'sqlite3';

// Import the 'User' type from the appropriate module
import { User, Stroke } from '../shared/types';

const db = new sqlite3.Database('db.sqlite');

export function initDb() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      color TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS strokes (
      id TEXT PRIMARY KEY,
      userId TEXT,
      points TEXT,
      color TEXT,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);
}

export function createUser(user: User): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (id, name, color) VALUES (?, ?, ?)',
      [user.id, user.name, user.color],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

export function getUser(userId: string): Promise<User | undefined> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as User);
      }
    });
  });
}

export function createStroke(stroke: Stroke): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO strokes (id, userId, points, color) VALUES (?, ?, ?, ?)',
      [stroke.id, stroke.userId, JSON.stringify(stroke.points), stroke.color],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

export function getStrokes(): Promise<Stroke[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM strokes', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const strokes = rows.map((row: any) => ({ // Add type assertion to specify the type of 'row'
          ...row, points: JSON.parse(row.points),
        }));
        resolve(strokes);
      }
    });
  });
}
