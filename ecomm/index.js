// ----------------------------- NPM PACKAGES -------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

// ----------------------------- ROUTERS -------------------------------
// Auth Router - SignIn | SignOut | SignUp
const authRouter = require("./routes/admin/auth");
// Admin Products Router - Create New | Products Listing | Edit/Delete Products
const adminProductsRouter = require("./routes/admin/products");
// Admin Cart Router - Create New | Cart Listing | Edit/Delete Cart
const adminCartsRouter = require("./routes/admin/carts");
// Products Router - Products Listing
const productsRouter = require("./routes/products");
// Carts Router - Products Listing
const cartsRouter = require("./routes/carts");
// Creating an express server
const app = express();

// ----------------------------- MIDDLEWARES -------------------------------
// Exposing css file to public so it can be accessed by html inside index.js
app.use(express.static("public"));

// For parsing the encoded from data from auth html forms
app.use(bodyParser.urlencoded({ extended: true }));

// setting up cookies
app.use(
  cookieSession({
    keys: ["8W078JpZYeOJG9VIbxo1"],
  })
);

// Different routers exported for use
app.use(authRouter);
app.use(adminProductsRouter);
app.use(adminCartsRouter);
app.use(productsRouter);
app.use(cartsRouter);

// ----------------------------- BIND AND LISTEN THE CONNECTIONS ON THE SPECIFIED HOST AND PORT -------------------------------
app.listen(3000, () => {
  console.log("Listening");
});
