const multer = require("multer");


//! multimedia will be saved in hard disk
// const myStorage = multer.diskStorage({ 
//   destination: function (req, file, cb) {
//     cb(null, "images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-----" + file.originalname);
//   },
// });

// const upload = multer({ storage: myStorage });
// module.exports = upload;



//! multimedia will be saved in memory/RAM
const myStorage = multer.memoryStorage()

const upload = multer({ storage: myStorage });

module.exports = upload;
