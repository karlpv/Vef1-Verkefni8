import { formatNumbers } from "./lib/helpers.js";
import { createCartLine, showCartContent } from "./lib/ui.js";

/**
 * @typedef {Object} Product
 * @property {number} id Auðkenni vöru, jákvæð heiltala stærri en 0.
 * @property {string} title Titill vöru, ekki tómur strengur.
 * @property {string} description Lýsing á vöru, ekki tómur strengur.
 * @property {number} price Verð á vöru, jákvæð heiltala stærri en 0.
 */

const products = [
  {
    id: 1,
    title: "HTML húfa",
    description:
      "Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.",
    price: 5_000,
  },
  {
    id: 2,
    title: "CSS sokkar",
    description: "Sokkar sem skalast vel með hvaða fótum sem er.",
    price: 3_000,
  },
  {
    id: 3,
    title: "JavaScript jakki",
    description: "Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.",
    price: 20_000,
  },
];

/**
 * Bæta vöru í körfu
 * @param  {Product} product
 * @param {number} quantity
 */
function addProductToCart(product, quantity) {
  const cartTableBodyElement = document.querySelector(".cart table tbody");

  if (!cartTableBodyElement) {
    console.warn("fann ekki .cart table");
    return;
  }

  // hér þarf að athuga hvort lína fyrir vöruna sé þegar til
  const existingCartLine = cartTableBodyElement.querySelector(
    `tr[data-product-id="${product.id}"]`
  );

  if (existingCartLine) {
    // ef til, updata fjöldi og samtals
    const quantityElement = existingCartLine.querySelector(".quantity");
    const totalElement = existingCartLine.querySelector(".total");

    const currentQuantity = parseInt(quantityElement.textContent, 10);
    const newQuantity = currentQuantity + quantity;

    quantityElement.textContent = newQuantity;
    totalElement.textContent = formatNumbers(product.price * newQuantity);
  } else {
    const cartLine = createCartLine(product, quantity);
    cartTableBodyElement.appendChild(cartLine);
  }

  // Sýna efni körfu
  showCartContent(true);

  // sýna/uppfæra samtölu körfu
  updateCartTotal();
}

function updateCartTotal() {
  console.log("Uppfæra samtals karfa...");
  const cartTableBodyElement = document.querySelector(".cart table tbody");

  if (!cartTableBodyElement) {
    console.warn(".cart table unreacable");
    return;
  }

  const totalElement = document.querySelector(".cart tfoot .total");
  if (!totalElement) {
    console.warn(".cart tfoot .total unreachable");
    return;
  }

  let total = 0;
  const cartLines = cartTableBodyElement.querySelectorAll("tr");
  for (const cartLine of cartLines) {
    const quantityElement = cartLine.querySelector(".quantity");
    const priceElement = cartLine.querySelector(".price");

    if (quantityElement && priceElement) {
      const quantity = parseInt(quantityElement.textContent, 10);
      const price = parseInt(priceElement.dataset.price, 10);
      total += quantity * price;
    }
  }

  totalElement.textContent = formatNumbers(total);
}

function submitHandler(event) {
  event.preventDefault();

  // Finnum næsta element sem er `<tr>`
  const parent = event.target.closest("tr");

  // Það er með attribute sem tiltekur auðkenni vöru, t.d. `data-product-id="1"`
  const productId = Number.parseInt(parent.dataset.productId);

  // Finnum vöru með þessu productId
  const product = products.find((i) => i.id === productId);

  if (!product) {
    return;
  }

  // hér þarf að finna fjölda sem á að bæta við körfu með því að athuga
  // á input
  const quantityInput = parent.querySelector('input[type="number"]');
  const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

  // Bætum vöru í körfu (hér væri gott að bæta við athugun á því að varan sé til)
  addProductToCart(product, quantity);
}

// Finna öll form með class="add"
const addToCartForms = document.querySelectorAll(".add");

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  // Bæta submit event listener við hvert
  form.addEventListener("submit", submitHandler);
}

// bæta við event handler á form sem submittar pöntun
function orderSubmitHandler(event) {
  event.preventDefault();

  const cartSection = document.querySelector(".cart");
  if (cartSection) {
    cartSection.classList.add("hidden");
  }

  const receiptSection = document.querySelector(".receipt");
  if (receiptSection) {
    receiptSection.classList.remove("hidden");
  } else {
    console.warn("Receipt section not found");
  }
}

const orderForm = document.querySelector(".order-submit");
if (orderForm) {
  orderForm.addEventListener("submit", orderSubmitHandler);
} else {
  console.warn("Order form not found");
}
