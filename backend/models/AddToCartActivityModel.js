import mongoose from 'mongoose';

const addToCartActivitySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    activityType: { type: String, default: 'addToCart' },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AddToCartActivity = mongoose.model(
  'add_to_cart_activity',
  addToCartActivitySchema
);
export default AddToCartActivity;
