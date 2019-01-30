/**
 * @file db/index.js
 * Start a pool to connect to remote database using node-postgres npm package.
 * 
 * Environment variables are used as credentials to avoid leaving sensitive information
 * hardcoded in the source file.
 * 
 * Manages all database interactions for benefits suggested in 
 * https://node-postgres.com/guides/project-structure#example
 */

const { Pool } = require('pg')

const config = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
}

const pool = new Pool(config)

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}