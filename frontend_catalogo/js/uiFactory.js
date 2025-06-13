
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


const createDetailCard = (product, container) => {
  container.innerHTML = "";
  const div = document.createElement("div");
  div.className = `grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-3 px-10 py-4 bg-white rounded-lg
    relative place-items-center break-all sm:break-normal hyphens-auto`;
  
  div.innerHTML = `
    <div class="w-full flex justify-center items-center">
      <img src="${product.imagen}" alt="${product.titulo}" 
        class="object-contain w-full md:w-96 md:h-96 rounded-2xl shadow-2xl border" loading="lazy">
    </div>
    <div class="flex flex-col justify-center items-start space-y-4 px-4 md:px-8">
      <h2 class="font-bold text-2xl md:text-3xl text-sky-700">${product.titulo}</h2>
      <h3 class="text-xl text-green-600 font-semibold">$${product.precio}</h3>
      
      <div>
        <p class="text-lg font-medium text-gray-800">Descripción:</p>
        <p class="text-base text-gray-600 leading-relaxed">${product.descripcion}</p>
      </div>
      
      <p class="text-base text-indigo-700 font-semibold bg-indigo-100 px-4 py-2 rounded-lg">Stock: ${product.stock}</p>
      
      <div class="flex flex-wrap gap-2 items-center">
        <p class="font-medium text-gray-700">Categorías:</p>
        ${product.categorias.map(cat => `
          <span class="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full shadow-sm text-sm">${cat.nombre}</span>
        `).join("")}
      </div>
      
      <button data-role="cliente" class="hidden btn-agregar-carrito bg-sky-600 hover:bg-sky-700 hover:scale-105 transition-transform 
        duration-200 text-white text-sm md:text-base 2xl:text-xl font-bold py-2 px-6 rounded-lg shadow-md text-lg">
        🛒 Agregar al carrito
      </button>
    </div>
  `;
  container.appendChild(div);
}


const createCategoriesButtons = (categories, container) => {
  container.innerHTML = "";
  categories.forEach(cat => {
    const boton = document.createElement("button");
    boton.textContent = cat.nombre === "all" 
      ? "Todos" 
      : cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1);
    boton.value = cat.nombre; //new feature: set value to category id
    boton.className = `btn-categoria bg-slate-400 font-semibold px-8 py-1 rounded-full text-sm md:text-lg
      hover:bg-slate-600 hover:text-white shadow-xl 
      transition-colors duration-200 ease-in-out`;
    container.appendChild(boton);
  });
}


export const uiFactory = {
  createProductsCards,
  createDetailCard,
  createCategoriesButtons
};
