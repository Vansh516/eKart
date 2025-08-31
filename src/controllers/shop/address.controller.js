const addressCollection = require('../../models/address.model');
const expressAsyncHandler = require('express-async-handler');
const CustomError = require('../../utils/CustomError.utils');
const ApiResponse = require('../../utils/ApiResponse.utils');
const {
  addAddressValidation,
  updateAddressValidation,
} = require('../../validations/address.validation');

const addAddress = expressAsyncHandler(async (req, res, next) => {
  console.log(addAddressValidation);
  console.log(req.body);

  const { error, value } = addAddressValidation.validate(req.body);
  console.log(value, error);

  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }

  let { address, city, pincode, phone, notes } = req.body;
  let newAddress = await addressCollection.create({
    address,
    city,
    pincode,
    phone,
    notes,
    userId: req.myUser._id,
  });
  // let newAddress = await addressCollection.create({
  //   ...req.body,
  //   userId: req.myUser._id,
  // });

  new ApiResponse(201, true, 'address added', newAddress).send(res);
});

const getAddresses = expressAsyncHandler(async (req, res, next) => {
  const addresses = await addressCollection.find({ userId: req.myUser._id }).select('-__v');

  if (addresses.length === 0) return next(new CustomError('No addresses found', 404));

  new ApiResponse(200, true, 'addresses found', addresses).send(res);
});

const getAddress = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const address = await addressCollection.findById(id).select('-__v');

  if (!address) return next(new CustomError('Address not found', 404));

  new ApiResponse(200, true, 'address found', address).send(res);
});

const updateAddress = expressAsyncHandler(async (req, res, next) => {
  const { error, value } = updateAddressValidation.validate(req.body);
  console.log(value, error);

  if (error) {
    return next(new CustomError(error.details[0].message, 400));
  }

  const { id } = req.params;

  const updatedAddress = await addressCollection
    .findByIdAndUpdate(id, req.body, {
      new: true,
    })
    .select('-__v');

  if (!updatedAddress) return next(new CustomError('Address not found', 404));

  new ApiResponse(200, true, 'address updated', updatedAddress).send(res);
});

const deleteAddress = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedAddress = await addressCollection.findByIdAndDelete(id);

  if (!deletedAddress) return next(new CustomError('Address not found', 404));

  new ApiResponse(200, true, 'address deleted', deletedAddress).send(res);
});

module.exports = {
  addAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
};
