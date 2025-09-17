const expressAsyncHandler = require('express-async-handler');
const ApiResponse = require('../../utils/ApiResponse.utils');
const productCollection = require('../../models/product.model');
const CustomError = require('../../utils/CustomError.utils');

const fetchAllProducts = expressAsyncHandler(async (req, res, next) => {
  console.log(req.query);
  let { brand = [], category = [], sortBy = 'price-lowToHigh' } = req.query;
  // brand = puma,brand3,..... ["brand1", "b2]
  // category = puma,brand3,.....
  let filter = {};
  let sort = {};

  if (brand.length) filter.brand = { $in: brand.split(',') };
  if (category.length) filter.category = { $in: category.split(',') };

  if (sortBy === 'price-lowToHigh') sort.salePrice = 1;
  else if (sortBy === 'price-highToLow') sort.salePrice = -1;
  else if (sortBy === 'aToZ') sort.title = 1;
  else if (sortBy === 'zToA') sort.title = -1;

  let products = await productCollection.find(filter).sort(sort);
  if (products.length === 0) return next(new CustomError('No products found', 404));

  new ApiResponse(200, true, 'products found', products).send(res);
});

const fetchOneProduct = expressAsyncHandler(async (req, res, next) => {
  let product = await productCollection.findById(req.params.id);
  if (!product) return next(new CustomError('No product found', 404));
  new ApiResponse(200, true, 'product found', product).send(res);
});

const searchProducts = expressAsyncHandler(async (req, res, next) => {
  let { keyword } = req.query;
  const pattern = new RegExp(keyword, 'i');
  console.log(pattern);
  let products = await productCollection.find({
    $or: [
      { title: { $regex: pattern } },
      { description: { $regex: pattern } },
      { category: { $regex: pattern } },
      { brand: { $regex: pattern } },
    ],
  });

  if (products.length === 0) return next(new CustomError('No products found', 404));
  new ApiResponse(200, true, 'products found', products).send(res);
});

module.exports = {
  fetchAllProducts,
  fetchOneProduct,
  searchProducts,
};

// localhost:9000/shop/products/all
// localhost:9000/shop/products/all?brand=LG,Whirlpool&category=home,cat2&sortBy=aToZ

/a/;
