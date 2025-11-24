export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateCreateProduct = (req, res, next) => {
  const { name, price, category_id } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  
  if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
    return res.status(400).json({ error: 'Valid product price is required' });
  }
  
  if (!category_id || isNaN(parseInt(category_id))) {
    return res.status(400).json({ error: 'Valid category ID is required' });
  }
  
  next();
};

export const validateCreateReview = (req, res, next) => {
  const { product_id, user_id, rating } = req.body;
  
  if (!product_id || isNaN(parseInt(product_id))) {
    return res.status(400).json({ error: 'Valid product ID is required' });
  }
  
  if (!user_id || isNaN(parseInt(user_id))) {
    return res.status(400).json({ error: 'Valid user ID is required' });
  }
  
  if (!rating || isNaN(parseInt(rating)) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  next();
};
