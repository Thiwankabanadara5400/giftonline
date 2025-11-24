import db from '../config/database.js';

export class Category {
  static async create(categoryData) {
    const result = await db('categories').insert(categoryData).returning('id');
    const id = result[0]?.id || result[0];
    return this.findById(id);
  }

  static async findById(id) {
    return db('categories').where('id', id).first();
  }

  static async all() {
    return db('categories');
  }

  static async update(id, categoryData) {
    await db('categories').where('id', id).update(categoryData);
    return this.findById(id);
  }

  static async delete(id) {
    return db('categories').where('id', id).del();
  }

  static async findByName(name) {
    return db('categories').where('name', name).first();
  }
}
