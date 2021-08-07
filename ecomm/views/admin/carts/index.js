const layout = require("../layout");

module.exports = ({ carts }) => {
  const renderedCarts = carts
    .map((cart) => {
      return `
        <div class="card">
            <header class="card-header $card-color">
                <p class="card-header-title has-background-primary has-text-grey">
                    Cart No. ${cart.id}
                </p>
            </header>
            <div class="card-content has-text-link">
                <div class="content">
                    ${cart.items
                      .map((item) => {
                        return `
                            <div class="cart-item message">
                                <h3 class="subtitle">${item.product.title}</h3>
                                <div class="cart-right">
                                    <div>
                                    $${item.product.price}  X  ${
                          item.quantity
                        } =
                                    </div>
                                    <div class="price is-size-4">
                                        $${item.product.price * item.quantity}
                                    </div>
                                </div>
                            </div>
                        `;
                      })
                      .join("")}
                </div>
            </div>
        </div>

        <div class="message is-info">
            <div class="message-header">Total</div>
            <h1 class="title has-text-right">$ ${cart.items.reduce(
              (prev, item) => {
                console.log(item.product.price, item.quantity);
                return prev + item.product.price * item.quantity;
              },
              0
            )}</h1>
        </div>

        <form method="POST" action="/admin/carts/${cart.id}/delete">
            <button class="button is-danger">Delete</button>
        </form>
      </div>
      `;
    })
    .join("</br>");

  return layout({
    content: `
            <div class="title is-2 level-item">
                <h1>Carts</h1>
            </div>
            <div>${renderedCarts}</div>
        `,
  });
};
