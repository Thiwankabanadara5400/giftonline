import db from '../config/database.js';

export class User {
  static async create(userData) {
    const result = await db('users').insert(userData).returning('id');
    const id = result[0]?.id || result[0];
    return this.findById(id);
  }

  static async findById(id) {
    return db('users').where('id', id).first();
  }

  static async findByEmail(email) {
    return db('users').where('email', email).first();
  }

  static async update(id, userData) {
    await db('users').where('id', id).update(userData);
    return this.findById(id);
  }

  static async delete(id) {
    return db('users').where('id', id).del();
  }

  static async all() {
    return db('users');
  }
}
