import { Product } from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const {
      categoryId,
      search,
      minPrice,
      maxPrice,
      isFeatured,
      sortBy,
      sortOrder,
      limit,
      offset
    } = req.query;

    const filters = {
      categoryId,
      search,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      isFeatured,
      sortBy: sortBy || 'created_at',
      sortOrder: (sortOrder || 'DESC').toUpperCase(),
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    };

    const products = await Product.all(filters);
    res.json({ products, total: products.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    // Check admin
    if (!req.user || (req.user.role !== 'admin' && req.user.is_admin !== true)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const {
      name,
      description,
      price,
      original_price,
      category_id,
      affiliate_link,
      image_url,
      images,
      notes,
      is_featured
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      original_price: original_price || null,
      category_id: category_id || null,
      affiliate_link: affiliate_link || '',
      image_url: image_url || null,
      images: JSON.stringify(images || []),
      notes: notes || null,
      is_featured: is_featured || false,
      created_at: new Date(),
    });

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // Check admin
    if (!req.user || (req.user.role !== 'admin' && req.user.is_admin !== true)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const {
      name,
      description,
      price,
      original_price,
      category_id,
      affiliate_link,
      image_url,
      images,
      notes,
      is_featured
    } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = await Product.update(id, {
      name: name !== undefined ? name : existingProduct.name,
      description: description !== undefined ? description : existingProduct.description,
      price: price !== undefined ? price : existingProduct.price,
      original_price: original_price !== undefined ? original_price : existingProduct.original_price,
      category_id: category_id !== undefined ? category_id : existingProduct.category_id,
      affiliate_link: affiliate_link !== undefined ? affiliate_link : existingProduct.affiliate_link,
      image_url: image_url !== undefined ? image_url : existingProduct.image_url,
      images: images !== undefined ? JSON.stringify(images) : existingProduct.images,
      notes: notes !== undefined ? notes : existingProduct.notes,
      is_featured: is_featured !== undefined ? is_featured : existingProduct.is_featured,
    });

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // Check admin
    if (!req.user || (req.user.role !== 'admin' && req.user.is_admin !== true)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.delete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.getFeatured(6);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
