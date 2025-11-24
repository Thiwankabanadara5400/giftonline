import db from '../config/database.js';

export class Product {
  // Helper: Parse JSON fields
  static parseProduct(product) {
    if (!product) return null;
    return {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || [])
    };
  }

  static async create(productData) {
    const result = await db('products').insert(productData).returning('id');
    const id = result[0]?.id || result[0];
    return this.findById(id);
  }

  static async findById(id) {
    const product = await db('products')
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .where('products.id', id)
      .select(
        'products.*',
        'categories.name as category_name'
      )
      .first();

    if (!product) return null;

    // Get average rating and review count
    const reviewData = await db('reviews')
      .where('product_id', id)
      .avg('rating as average_rating')
      .count('id as total_reviews')
      .first();

    return {
      ...this.parseProduct(product),
      average_rating: parseFloat(reviewData.average_rating) || 0,
      total_reviews: parseInt(reviewData.total_reviews) || 0
    };
  }

  static async all(filters = {}) {
    let query = db('products')
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .select('products.*', 'categories.name as category_name');

    if (filters.categoryId) {
      query = query.where('products.category_id', filters.categoryId);
    }

    if (filters.search) {
      query = query.where('products.name', 'ilike', `%${filters.search}%`);
    }

    if (filters.minPrice) {
      query = query.where('products.price', '>=', filters.minPrice);
    }

    if (filters.maxPrice) {
      query = query.where('products.price', '<=', filters.maxPrice);
    }

    if (filters.isFeatured === 'true') {
      query = query.where('products.is_featured', true);
    }

    // Sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';
    query = query.orderBy(sortBy, sortOrder);

    // Pagination
    const limit = parseInt(filters.limit) || 50;
    const offset = parseInt(filters.offset) || 0;
    query = query.limit(limit).offset(offset);

    const products = await query;

    // Add ratings to each product and parse JSON
    for (let product of products) {
      const reviewData = await db('reviews')
        .where('product_id', product.id)
        .avg('rating as average_rating')
        .count('id as total_reviews')
        .first();

      product.average_rating = parseFloat(reviewData.average_rating) || 0;
      product.total_reviews = parseInt(reviewData.total_reviews) || 0;
      product.images = typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || []);
    }

    return products;
  }

  static async update(id, productData) {
    await db('products').where('id', id).update({
      ...productData,
      updated_at: new Date(),
    });
    return this.findById(id);
  }

  static async delete(id) {
    return db('products').where('id', id).del();
  }

  static async findByCategory(categoryId) {
    return db('products').where('category_id', categoryId);
  }

  static async getFeatured(limit = 6) {
    return this.all({ isFeatured: 'true', limit });
  }
}
