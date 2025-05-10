const contenedorProductos = document.getElementById("productos");
const contenedorCategorias = document.getElementById("categorias");
const entradaBusqueda = document.getElementById("busqueda");

let productos = [];
let categoriaSeleccionada = "all";

async function cargarTodosLosProductos() {
  try {
    const respuesta = await fetch("https://fakestoreapi.com/products");
    if (!respuesta.ok) {
      throw new Error("No hay respuesta del servidor de la API");
    }
    productos = await respuesta.json();
    if (productos.length === 0) {
      console.log("No hay productos disponibles");
    } else {
      mostrarProductos(productos);
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}

function filtrarProductos() {
  let productosFiltrados = productos;
  if (categoriaSeleccionada !== "all") {
    productosFiltrados = productos.filter((p) => p.category === categoriaSeleccionada);
  }

  const texto = entradaBusqueda.value.toLowerCase().trim();
  if (texto !== "") {
    productosFiltrados = productosFiltrados.filter((p) => {
      return (
        p.title.toLowerCase().includes(texto) ||
        p.description.toLowerCase().includes(texto)
      );
    });
  }

  mostrarProductos(productosFiltrados);
}

function mostrarProductos(listaProductos) {
  contenedorProductos.innerHTML = "";

  listaProductos.forEach((producto) => {
    const div = document.createElement("div");
    div.className = `rounded-lg hover:shadow-lg p-4 m-2 bg-white flex flex-col 
        justify-between items-center transition-shadow 
        duration-200 ease-in-out`;

    div.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" class="w-32 h-32 object-contain">
      <h2 class="text-lg font-bold text-center">${producto.title}</h2>
      <p class="text-gray-700 text-center mt-2">$${producto.price}</p>
      <button class="bg-blue-600 hover:bg-blue-700 mt-3 text-white 
      font-bold py-2 px-4 rounded">Agregar al carrito</button>
    `;

    contenedorProductos.appendChild(div);
  });
}

async function cargarCategorias() {
  try {
    const respuesta = await fetch("https://fakestoreapi.com/products/categories");
    if (!respuesta.ok) {
      throw new Error("No hay respuesta del servidor de la API");
    }
    const categorias = await respuesta.json();
    mostrarCategorias(["all", ...categorias]);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
  }
}

function mostrarCategorias(categorias) {
  contenedorCategorias.innerHTML = "";
  categorias.forEach((cat) => {
    const boton = document.createElement("button");
    boton.textContent = cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1);
    boton.className = `bg-slate-400 font-semibold px-8 py-1 rounded-full text-lg
      hover:bg-slate-600 hover:text-white shadow-xl 
      transition-colors duration-200 ease-in-out ${
        categoriaSeleccionada === cat ? " text-white bg-slate-600" : " text-black bg-slate-400"
      }`;

    boton.addEventListener("click", () => {
      categoriaSeleccionada = cat;
      mostrarCategorias(categorias);
      filtrarProductos();
    });

    contenedorCategorias.appendChild(boton);
  });
}

entradaBusqueda.addEventListener("input", filtrarProductos);

document.addEventListener("DOMContentLoaded", () => {
  cargarTodosLosProductos();
  cargarCategorias();
});

