const contenedorProductos = document.getElementById("productos");
const contenedorCategorias = document.getElementById("categorias");
const entradaBusqueda = document.getElementById("busqueda");
const contenedorDetalleProducto = document.getElementById("contenedor-detalle-producto");

let productos = [];
let categoriaSeleccionada = "all";
//Login de la app
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    //verificar si existe el formulario
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); //Evita que se recargue la página
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const mensaje = document.getElementById("mensaje");

      try {
        const response = await fetch("https://fakestoreapi.com/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password,
          }),
        });
        if (!response.ok) {
          throw new Error("Error de conexión con la api");
        }
        const data = await response.json();
        localStorage.setItem("token", data.token); //almacenar token en local storage (almacenamiento localmente en el navegador)
        mensaje.textContent = "Inicio de sesión exitoso";
        mensaje.classList.add("text-green-500");
        setTimeout(() => {
          window.location.href = "index.html"; //redireccionar a la página principal
        }, 2000); //después de 2 segundos
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mensaje.textContent = "Error al iniciar sesión. Inténtalo de nuevo.";
        mensaje.classList.add("text-red-500");
      }
    });
  }
  if (contenedorProductos && entradaBusqueda && contenedorCategorias) {
  cargarTodosLosProductos();
  cargarCategorias();
  entradaBusqueda.addEventListener("input", filtrarProductos);
  }
  if(contenedorDetalleProducto){
    const  urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get("id");
    if(productoId){
      cargarProducto(productoId);
      const botonRegresar = document.getElementById("btn-regresar");
      botonRegresar.addEventListener("click", ()=>{
      location.href = "index.html";
      });
    } 
  }
});

//Lógica de productos
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
    productosFiltrados = productos.filter(
      (p) => p.category === categoriaSeleccionada
    );
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
      <img src="${producto.image}" alt="${producto.title}" class="w-32 h-32 
      object-contain">
      <h2 class="text-lg font-bold text-center">${producto.title}</h2>
      <p class="text-gray-700 text-center mt-2">$${producto.price}</p>
      <button class="btn-detalle-producto bg-blue-600 hover:bg-blue-700 mt-3 text-white 
      font-bold py-2 px-4 rounded">+Detalles</button>
    `;

    div.querySelector(".btn-detalle-producto").addEventListener("click", () => {
      window.location.href = `detalle.html?id=${producto.id}`;
    });

    contenedorProductos.appendChild(div);
  });
}

async function cargarCategorias() {
  try {
    const respuesta = await fetch(
      "https://fakestoreapi.com/products/categories"
    );
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
    boton.textContent =
      cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1);
    boton.className = `bg-slate-400 font-semibold px-8 py-1 rounded-full text-lg
      hover:bg-slate-600 hover:text-white shadow-xl 
      transition-colors duration-200 ease-in-out ${
        categoriaSeleccionada === cat
          ? " text-white bg-slate-600"
          : " text-black bg-slate-400"
      }`;

    boton.addEventListener("click", () => {
      categoriaSeleccionada = cat;
      mostrarCategorias(categorias);
      filtrarProductos();
    });

    contenedorCategorias.appendChild(boton);
  });
}

const botonCerrarSesion = document.getElementById("btn-cerrar-sesion");
botonCerrarSesion.addEventListener("click", ()=>{
  localStorage.removeItem("token");
  location.href = "login.html";
});


async function cargarProducto(id){
  try{;
    const response = await fetch(`https://fakestoreapi.com/products/`+id);
    if(!response.ok){
      throw new Error("No hay respuesta del servidor de la API");
    }
    const producto = await response.json();
    mostrarProducto(producto); //Implementar 
  }catch(error){
    console.error("Error al obtener el producto:", error);
  }
}

function mostrarProducto(producto){
  contenedorDetalleProducto.innerHTML = "";
  const div = document.createElement("div");
  div.className = `grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10 px-10 py-4 bg-white rounded-lg `;
  div.innerHTML = `
  <div>
    <img src="${producto.image}" alt="${producto.title}" class="object-contain">
  </div>
  <div class="flex flex-col justify-center items-start">
    <h2 class="font-bold text-xl bg-sky-600 text-white p-2 rounded-md">${producto.title}</h2>
    <h3 class="font-bold text-xl mt-3">$${producto.price}</h3>
    <p class="mt-3"><b>Description: </b></p>
    <p class="text-base/8 text-gray-700">${producto.description}</p>
    <p class="mt-3"><b>Category: </b>${producto.category}</p>
    <button class="btn-agregar-carrito bg-sky-600 hover:bg-sky-700 mt-5 text-white
    font-bold py-2 px-4 rounded">🛒 Agregar al carrito</button>
  </div>`;
  contenedorDetalleProducto.appendChild(div);
}





