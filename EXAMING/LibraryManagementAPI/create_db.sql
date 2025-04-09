CREATE DATABASE library_db;

\c library_db

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('user', 'admin', 'librarian')) DEFAULT 'user',
  status VARCHAR(50) CHECK (status IN ('active', 'inactive')) DEFAULT 'inactive',
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE authors (
  id UUID PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  bio TEXT,
  birth_date DATE,
  nationality VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  isbn VARCHAR(255) UNIQUE NOT NULL,
  author_id UUID REFERENCES authors(id),
  category VARCHAR(255),
  pub_date DATE,
  total_copies INTEGER NOT NULL,
  available_copies INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE borrows (
  id UUID PRIMARY KEY,
  book_id UUID REFERENCES books(id),
  user_id UUID REFERENCES users(id),
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE,
  status VARCHAR(50) CHECK (status IN ('borrowed', 'returned', 'overdue')) DEFAULT 'borrowed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);