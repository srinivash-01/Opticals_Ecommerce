import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);


const productSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    category: { type: String, required: true },
    colors: { type: [String], required: true },
    countInStock: { type: Number, required: true },
    description: { type: String, required: true },
    frameDimensions: { type: String, required: true },
    frameMaterial: { type: String, required: true },
    frameShape: { type: String, required: true },
    frameSize: { type: String, required: true },
    frameStyle: { type: String, required: true },
    frameTechnology: { type: String, required: true },
    frameType: { type: String, required: true },
    frameWeight: { type: String, required: true },
    frameWidth: { type: String, required: true },
    image: { type: String, required: true },
    images: [String],
    modelNo: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    numReviews: { type: Number, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    reviews: [reviewSchema],
    slug: { type: String, required: true, unique: true },
    weightGroup: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);



const Product = mongoose.model('Product', productSchema);
export default Product;
