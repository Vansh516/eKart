require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const { connectDB } = require('./src/config/database.config');
const { error } = require('./src/middlewares/error.middlewares');

const userRoutes = require('./src/routes/user/user.routes');
const adminProductRoutes = require('./src/routes/admin/product.routes');
const shopAddressRoutes = require('./src/routes/shop/address.routes');
const shopProductRoutes = require('./src/routes/shop/product.routes');
const shopCartRoutes = require('./src/routes/shop/cart.routes');
const shopOrderRoutes = require("./src/routes/shop/order.routes");
const adminOrderRoutes = require("./src/routes/admin/order.routes")
const shopReviewRoutes = require("./src/routes/shop/review.routes")

const { seedAdmin } = require('./src/seed/admin.seed');
const { authenticate, authorize } = require('./src/middlewares/auth.middleware');

// seedAdmin();

// console.log(process.argv);
/* 
[4
  'C:\\Program Files\\nodejs\\node.exe',     // path of exectuable node 
  'C:\\Users\\HP\\OneDrive\\Desktop\\eKart\\server.js' // path of file which is being executed
]
*/

if (process.argv[2] == 'seed') {
  seedAdmin();
}

const app = express();

app.use(express.json()); // json data
app.use(express.urlencoded({ extended: true })); // html form data
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/admin/products', authenticate, authorize, adminProductRoutes);
app.use('/api/shop/address', authenticate, shopAddressRoutes);
app.use('/api/shop/products', shopProductRoutes);
app.use('/api/shop/carts', authenticate, shopCartRoutes);
app.use('/api/shop/orders', authenticate, shopOrderRoutes)
app.use("/api/admin/orders", authenticate, authorize, adminOrderRoutes)
app.use("/api/shop/reviews", authenticate, shopReviewRoutes)

connectDB();

app.use(error);

app.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  console.log('server is running on: ', process.env.PORT);
});
