const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cart', CartSchema);

//
/* 
cart = {
    userId:234567890,
    items:[
        {
            productId:123456789,
            quantity:2
        },
        {
            productId:234567890,
            quantity:1
        }
    ]
}
*/
