'use strict';

const bcryptjs = require('bcryptjs');
const Context = require('./context');

class Database {
  constructor(seedData, enableLogging) {
    this.smarfGems = seedData.smarfGems;
    this.users = seedData.users;
    this.enableLogging = enableLogging;
    this.context = new Context('smarfgems.db', enableLogging);
  }

  log(message) {
    if (this.enableLogging) {
      console.info(message);
    }
  }

  tableExists(tableName) {
    this.log(`Checking if the ${tableName} table exists...`);

    return this.context
      .retrieveValue(`
        SELECT EXISTS (
          SELECT 1 
          FROM sqlite_master 
          WHERE type = 'table' AND name = ?
        );
      `, tableName);
  }

  createUser(user) {
    return this.context
      .execute(`
        INSERT INTO Users
          (username, emailAddress, password, createdAt, updatedAt)
        VALUES
          (?, ?, ?, ?, datetime('now'), datetime('now'));
      `,
      user.username,
      user.emailAddress,
      user.password);
  }

  createSmarfGem(smarfGem) {
    return this.context
      .execute(`
        INSERT INTO SmarfGems
          (userId, title, description, gem, createdAt, updatedAt)
        VALUES
          (?, ?, ?, ?, datetime('now'), datetime('now'));
      `,
      smarfGem.userId,
      smarfGem.title,
      smarfGem.description,
      smarfGem.gem);
  }

  async hashUserPasswords(users) {
    const usersWithHashedPasswords = [];

    for (const user of users) {
      const hashedPassword = await bcryptjs.hash(user.password, 10);
      usersWithHashedPasswords.push({ ...user, password: hashedPassword });
    }

    return usersWithHashedPasswords;
  }

  async createUsers(users) {
    for (const user of users) {
      await this.createUser(user);
    }
  }

  async createSmarfGems(smarfGems) {
    for (const smarfGem of smarfGems) {
      await this.createSmarfGem(smarfGem);
    }
  }

  async init() {
    const userTableExists = await this.tableExists('Users');

    if (userTableExists) {
      this.log('Dropping the Users table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS Users;
      `);
    }

    this.log('Creating the Users table...');

    await this.context.execute(`
      CREATE TABLE Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        username VARCHAR(255) NOT NULL DEFAULT '', 
        emailAddress VARCHAR(255) NOT NULL DEFAULT '' UNIQUE, 
        password VARCHAR(255) NOT NULL DEFAULT '', 
        createdAt DATETIME NOT NULL, 
        updatedAt DATETIME NOT NULL
      );
    `);

    this.log('Hashing the user passwords...');

    const users = await this.hashUserPasswords(this.users);

    this.log('Creating the user records...');

    await this.createUsers(users);

    const courseTableExists = await this.tableExists('SmarfGems');

    if (courseTableExists) {
      this.log('Dropping the SmarfGems table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS SmarfGems;
      `);
    }

    this.log('Creating the SmarfGem table...');

    await this.context.execute(`
      CREATE TABLE SmarfGems (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title VARCHAR(255) NOT NULL DEFAULT '', 
        description TEXT NOT NULL DEFAULT '', 
        gem BLOB, 
        createdAt DATETIME NOT NULL, 
        updatedAt DATETIME NOT NULL, 
        userId INTEGER NOT NULL DEFAULT -1 
          REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    this.log('Creating the smarfgem records...');

    await this.createSmarfGems(this.smarfGems);

    this.log('Database successfully initialized!');
  }
}

module.exports = Database;
