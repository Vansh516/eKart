const productCollection = require('../../models/product.model');
const expressAsyncHandler = require('express-async-handler');
const {
  addProductValidation,
  updateProductValidation,
  updateImageValidation,
} = require('../../validations/product.validation');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../utils/cloudinary.util');
const ApiResponse = require('../../utils/ApiResponse.utils');
const CustomError = require('../../utils/CustomError.utils');

const uploadImage = expressAsyncHandler(async (req, res, next) => {
  let buffer = req.file.buffer;
  let b64 = `data:${req.file.mimetype};base64,${buffer.toString('base64')}`;

  let uploaded = await uploadToCloudinary(b64);
  new ApiResponse(201, true, 'image uploaded', uploaded).send(res);
});

const deleteImage = expressAsyncHandler(async (req, res, next) => {
  let { url } = req.body;
  let result = await deleteFromCloudinary(url);

  new ApiResponse(200, true, 'imaged deleted', result).send(res);
});

const updateImage = expressAsyncHandler(async (req, res, next) => {
  // const { error } = updateImageValidation.validate(req.body);
  // if (error) {
  //   throw new CustomError(error.details[0].message, 400);
  // }

  console.log(req.body);
  console.log(req.file);

  let { url } = req.body;
  await deleteFromCloudinary(url);

  let buffer = req.file.buffer;
  let b64 = `data:${req.file.mimetype};base64,${buffer.toString('base64')}`;

  let uploaded = await uploadToCloudinary(b64);
  // console.log(uploaded);
  new ApiResponse(201, true, 'image updated', uploaded).send(res);
});

const addProduct = expressAsyncHandler(async (req, res, next) => {
  // console.log(req.file); // this will print the information for the image updloaded inisde RAM in buffer value
  // console.log(req.body);//

  const { error } = addProductValidation.validate(req.body);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  const {
    image, //TODO:
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    quantity,
    totalStock,
  } = req.body;

  let newProduct = await productCollection.create({
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    quantity,
    totalStock,
  });

  new ApiResponse(201, true, 'product added', newProduct).send(res);
});

const getProducts = expressAsyncHandler(async (req, res, next) => {
  const products = await productCollection
    .find()
    .select('-__v -createdAt -updatedAt -averageReview');
  if (products.length === 0) return next(new CustomError('No products found', 404));

  new ApiResponse(200, true, 'products found', products).send(res);
});

const getProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productCollection.findById(id).select('-__v -createdAt -updatedAt');
  if (!product) return next(new CustomError('No product found', 404));

  new ApiResponse(200, true, 'product found', product).send(res);
});

const updateProduct = expressAsyncHandler(async (req, res, next) => {
  console.log('hi');

  const { error } = updateProductValidation.validate(req.body);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  const { id } = req.params;
  const product = await productCollection
    .findByIdAndUpdate(id, req.body, {
      new: true,
    })
    .select('-__v -createdAt -updatedAt');
  if (!product) return next(new CustomError('No product found', 404));
  new ApiResponse(200, true, 'product updated', product).send(res);
});

const deleteProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productCollection
    .findByIdAndDelete(id)
    .select('-__v -createdAt -updatedAt');
  if (!product) return next(new CustomError('No product found', 404));

  new ApiResponse(200, true, 'product deleted', product).send(res);
});

// require() --> built/third : ==> moduleName
// require() --> user-defined : ==> path

module.exports = {
  addProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  uploadImage,
  deleteImage,
  updateImage,
};
