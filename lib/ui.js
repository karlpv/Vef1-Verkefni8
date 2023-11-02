import { formatNumbers } from "./helpers.js";

function deleteLineFromCart(event) {
  event.preventDefault();
  console.log("Eyða!", event.submitter);
  const lineToDelete = event.submitter.closest("tr");
  console.log(lineToDelete);

  lineToDelete.parentElement.removeChild(lineToDelete);

  updateCartTotal();
}

/**
 * Búa til línu í cart töflu.
 * @param  {import('../main.js').Product} product
 * @param {number} quantity
 * @returns HTMLElement
 */
export function createCartLine(product, quantity) {
  const cartLineElement = document.createElement("tr");
  cartLineElement.dataset.productId = product.id.toString();

  const titleElement = document.createElement("td");
  titleElement.textContent = product.title;
  cartLineElement.appendChild(titleElement);

  const quantityElement = document.createElement("td");
  quantityElement.textContent = quantity.toString();
  quantityElement.classList.add("quantity");
  // Kórrétt væri hér að bæta líka við <span class="price">
  cartLineElement.appendChild(quantityElement);

  const priceElement = document.createElement("td");
  priceElement.textContent = formatNumbers(product.price);
  // Kórrétt væri hér að bæta líka við <span class="price">
  cartLineElement.appendChild(priceElement);

  const totalElement = document.createElement("td");
  totalElement.textContent = formatNumbers(product.price * quantity);
  totalElement.classList.add("total");
  cartLineElement.appendChild(totalElement);

  const formTdElement = document.createElement("td");

  const formElement = document.createElement("form");
  formElement.addEventListener("submit", deleteLineFromCart);

  const buttonElement = document.createElement("button");
  buttonElement.textContent = "Eyða";

  formElement.appendChild(buttonElement);
  formTdElement.appendChild(formElement);
  cartLineElement.appendChild(formTdElement);

  return cartLineElement;
}

/**
 * Sýna efni körfu eða ekki.
 * @param {boolean} show Sýna körfu eða ekki
 */
export function showCartContent(show = true) {
  // Finnum element sem inniheldur körfuna
  const cartElement = document.querySelector(".cart");

  if (!cartElement) {
    console.warn("fann ekki .cart");
    return;
  }

  const emptyMessage = cartElement.querySelector(".empty-message");
  const cartContent = cartElement.querySelector(".cart-content");

  if (!emptyMessage || !cartContent) {
    console.warn("fann ekki element");
    return;
  }

  if (show) {
    emptyMessage.classList.add("hidden");
    cartContent.classList.remove("hidden");
  } else {
    emptyMessage.classList.remove("hidden");
    cartContent.classList.add("hidden");
  }
}
