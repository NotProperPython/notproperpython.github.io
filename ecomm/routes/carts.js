const express = require("express");
const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartShowTemplate = require("../views/carts/show");

const router = express.Router();

// Recieve a POST request to add an item to a cart
router.post("/cart/products", async (req, res) => {
  const productId = req.body.productId; // ID of the product we wish to add to cart
  // Figure out the cart by either creating one OR retrieving one
  let cart;
  if (!req.session.cartId) {
    // we dont have a cart, we need to create one,
    // and store the cart ID on the req.session.cartId property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // we have a cart, Now fetch it from the carts repo
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  // Either increment quantity for existing product OR add new product
  const existingItem = cart.items.find((item) => item.id === productId);
  if (existingItem) {
    // incerement quantity
    existingItem.quantity++;
  } else {
    // add a new product
    cart.items.push({ id: productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, { items: cart.items });

  res.redirect("/");
});

// Recieve a GET request to show all items in a cart
router.get("/cart", async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect("/");
  }
  const cart = await cartsRepo.getOne(req.session.cartId);
  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items }));
});

// Recieve a POST request to delete an item from a cart
router.post("/cart/products/delete", async (req, res) => {
  const { itemId, itemQuantity } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);
  const items = cart.items.filter((item) => item.id !== itemId);
  await cartsRepo.update(req.session.cartId, { items });
  res.redirect("/cart");
});

module.exports = router;
