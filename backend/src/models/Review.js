import db from '../config/database.js';

export class Review {
  static async create(reviewData) {
    const [id] = await db('reviews').insert(reviewData);
    return this.findById(id);
  }

  static async findById(id) {
    return db('reviews')
      .join('users', 'reviews.user_id', 'users.id')
      .where('reviews.id', id)
      .select('reviews.*', 'users.name as user_name', 'users.email as user_email')
      .first();
  }

  static async findByProductId(productId) {
    return db('reviews')
      .join('users', 'reviews.user_id', 'users.id')
      .where('reviews.product_id', productId)
      .select('reviews.*', 'users.name as user_name', 'users.email as user_email')
      .orderBy('reviews.created_at', 'desc');
  }

  static async update(id, reviewData) {
    await db('reviews').where('id', id).update(reviewData);
    return this.findById(id);
  }

  static async delete(id) {
    return db('reviews').where('id', id).del();
  }

  static async all() {
    return db('reviews')
      .join('users', 'reviews.user_id', 'users.id')
      .join('products', 'reviews.product_id', 'products.id')
      .select('reviews.*', 'users.name as user_name', 'products.name as product_name');
  }
}
