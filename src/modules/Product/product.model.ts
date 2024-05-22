import { Schema, model } from "mongoose";
import { TInventory, TProduct, TVariant } from "./product.interface";

const SchemaVariant: Schema<TVariant> = new Schema<TVariant>(
  {
    type: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const SchemaInventory: Schema<TInventory> = new Schema<TInventory>(
  {
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
  },
  { _id: false },
);

const ProductSchema: Schema<TProduct> = new Schema<TProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tags: { type: [String], required: true },
  variants: { type: [SchemaVariant], required: true },
  inventory: { type: SchemaInventory, required: true },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});


ProductSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

ProductSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

ProductSchema.pre("aggregate", function (next) {
  //[{ $match: { isDeleted: { $ne: true } } },{match}]
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const ProductModel = model<TProduct>("Product", ProductSchema);
