const expressAsyncHandler = require("express-async-handler");
const v2 = require("../config/cloudinary.config");

const extractPublicID = (url) => {
  let array = url.split("/");
  console.log(array);
  let element = array[array.length - 1];
  console.log(element);
  let id = element.split(".");
  console.log(id);
  let publicID = "eKart/" + id[0];
  console.log(publicID);
  return publicID;
};

const uploadToCloudinary = expressAsyncHandler(async (path) => {
  if (!path) return null;
  let uploaded = await v2.uploader.upload(path, {
    folder: "eKart",
  });
  return uploaded;
});

const deleteFromCloudinary = expressAsyncHandler(async (url) => {
  let publicID = extractPublicID(url);
  console.log(url);
  console.log(publicID);

  let result = await v2.uploader.destroy(publicID);
  console.log(result);

  return result;
});

module.exports = { uploadToCloudinary, deleteFromCloudinary };
