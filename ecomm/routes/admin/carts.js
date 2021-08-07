const express = require("express");

const { handleErrors, requireAuth } = require("./middlewares");
const cartsIndexTemplate = require("../../views/admin/carts/index");
const cartsRepo = require("../../repositories/carts");
const productsRepo = require("../../repositories/products");

//creating a router for Products
const router = express.Router();

router.get("/admin/carts", requireAuth, async (req, res) => {
  const carts = await cartsRepo.getAll();
  for (cart of carts) {
    for (item of cart.items) {
      console.log(item);
      const product = await productsRepo.getOne(item.id);
      item.product = product;
    }
    console.log("-----------");
  }
  res.send(cartsIndexTemplate({ carts }));
});

router.post("/admin/carts/:id/delete", requireAuth, async (req, res) => {
  await cartsRepo.delete(req.params.id);
  res.redirect("/admin/carts");
});

module.exports = router;
