import { firebaseIntegration } from "../firebaseIntegration.js";
import { productService } from "./productService.js";

const createProductsCards = (products, container) => {
  container.innerHTML = "";
  products.forEach((producto) => {
    const card = document.createElement("div");
    card.className = `producto-card rounded-lg hover:shadow-lg px-2 md:px-8 py-3 m-2 bg-white flex flex-col 
      justify-evenly items-center transition-shadow duration-200 ease-in-out relative`;

    card.innerHTML = `
      <input type="hidden" value="${producto.id}" id="producto-id">
      <img src="${producto.imagen}" alt="${producto.titulo}" class="w-40 h-32 object-contain rounded-2xl shadow-lg">
      <h2 class="font-bold text-center break-all sm:break-normal hyphens-auto mt-3">${producto.titulo}</h2>
      <p class="text-gray-700 text-center mt-2">$${producto.precio}</p>
      <p class="text-gray-700 text-center mt-2">${producto.descripcion}</p>
      <p class="text-sky-600 text-center mt-2 font-medium bg-sky-100 p-2 rounded-lg">Stock: ${producto.stock}</p>
      <button class="btn-detalle-producto bg-red-400 text-white 
        font-bold py-2 px-4 rounded absolute inset-100 top-0 right-0 text-lg
        hover:after:content-['Ver_detalles'] shadow-2xl shadow-black/50">+​</button>`;

    card.querySelector(".btn-detalle-producto").addEventListener("click", () => {
        window.location.href = `detalle.html?id=${producto.id}`;});
    container.appendChild(card);
  });
};

export const uiFactory = {
  createProductsCards,
};
