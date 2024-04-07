import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      brand: 'Sample Brand',
      category: 'Sample Category',
      colors: ['Sample Color'],
      countInStock: 0,
      description: 'Sample Description',
      frameDimensions: 'Sample Frame Dimensions',
      frameMaterial: 'Sample Frame Material',
      frameShape: 'Sample Frame Shape',
      frameSize: 'Sample Frame Size',
      frameStyle: 'Sample Frame Style',
      frameTechnology: 'Sample Frame Technology',
      frameType: 'Sample Frame Type',
      frameWeight: 'Sample Frame Weight',
      frameWidth: 'Sample Frame Width',
      image: '/images/p1.jpg',
      images: [],
      modelNo: 'Sample Model No',
      name: 'Sample Name ' + Date.now(),
      numReviews: 0,
      price: 0,
      rating: 0,
      slug: 'sample-name-' + Date.now(),
      weightGroup: 'Sample Weight Group',
    });

    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  })
);

productRouter.put(
  '/:id/reduceStock',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;

    try {
      // Find the product by ID
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Check if the product is in stock
      if (product.countInStock === 0) {
        return res.status(400).json({ message: 'Product is out of stock' });
      }

      // Reduce the stock count by 1
      product.countInStock -= 1;

      // Save the updated product
      await product.save();

      // Return a success message
      res.status(200).json({ message: 'Stock count reduced successfully' });
    } catch (error) {
      console.error('Error reducing stock count:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  })
);


productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (product) {
      // Fields sorted alphabetically
      product.brand = req.body.brand || product.brand;
      product.category = req.body.category || product.category;
      product.colors = req.body.colors || product.colors;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.description = req.body.description || product.description;
      product.frameDimensions = req.body.frameDimensions || product.frameDimensions;
      product.frameMaterial = req.body.frameMaterial || product.frameMaterial;
      product.frameShape = req.body.frameShape || product.frameShape;
      product.frameSize = req.body.frameSize || product.frameSize;
      product.frameStyle = req.body.frameStyle || product.frameStyle;
      product.frameTechnology = req.body.frameTechnology || product.frameTechnology;
      product.frameType = req.body.frameType || product.frameType;
      product.frameWeight = req.body.frameWeight || product.frameWeight;
      product.frameWidth = req.body.frameWidth || product.frameWidth;
      product.image = req.body.image || product.image;
      product.images = req.body.images || product.images;
      product.modelNo = req.body.modelNo || product.modelNo;
      product.name = req.body.name || product.name;
      product.numReviews = req.body.numReviews || product.numReviews;
      product.price = req.body.price || product.price;
      product.rating = req.body.rating || product.rating;
      product.slug = req.body.slug || product.slug;
      product.weightGroup = req.body.weightGroup || product.weightGroup;

      // Updated fields
      product.frameStyle = req.body.frameStyle ?? product.frameStyle;

      await product.save();
      res.send({ message: 'Product Updated', product });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);


productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

const PAGE_SIZE = 12;

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});



export default productRouter;
