const contenedorProductos = document.getElementById("productos");
const contenedorCategorias = document.getElementById("categorias");
const entradaBusqueda = document.getElementById("busqueda");
const contenedorDetalleProducto = document.getElementById("contenedor-detalle-producto");
const map = document.getElementById("map");
const botonRegresar = document.getElementById("btn-regresar");
let productos = [];
let categoriaSeleccionada = "all";
//Login de la app
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) { //Login de usuario
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); 
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
        localStorage.setItem("token", data.token); 
        mensaje.textContent = "Inicio de sesión exitoso ✔️​";
        mensaje.classList.add("text-green-500");
        setTimeout(() => {
          window.location.href = "index.html";
          }, 2000); 
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mensaje.textContent = "Error al iniciar sesión. Inténtalo de nuevo. ❌​";
        mensaje.classList.add("text-red-500");
      }
    });
  }
  if (contenedorProductos && entradaBusqueda && contenedorCategorias) { //Catalogo de productos
    cargarTodosLosProductos();
    cargarCategorias();
    entradaBusqueda.addEventListener("input", filtrarProductos);
    //Lógica botón de cerrar sesión
    const botonCerrarSesion = document.getElementById("btn-cerrar-sesion");
    botonCerrarSesion.addEventListener("click", ()=>{
      localStorage.removeItem("token");
      location.href = "login.html";
    });
  }
  if(contenedorDetalleProducto && botonRegresar){ //Detalle de producto
    const  urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get("id");
    if(productoId){
      cargarProducto(productoId);
      botonRegresar.addEventListener("click", ()=>{ //Botón regresar de página de detalle de producto
      location.href = "index.html#catalogo";
      });
    } 
  }
  if (map && botonRegresar){ 
    botonRegresar.addEventListener("click", ()=>{ //Botón regresar de página de contacto
      location.href = "index.html";
  });
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
    div.className = `rounded-lg hover:shadow-lg px-2 md:px-8 m-2 bg-white flex flex-col 
        justify-evenly items-center transition-shadow 
        duration-200 ease-in-out relative`;
    div.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" class="w-40 h-32 
      object-contain">
      <h2 class="font-bold text-center break-all sm:break-normal hyphens-auto">${producto.title}</h2>
      <p class="text-gray-700 text-center mt-2">$${producto.price}</p>
      <button class="btn-detalle-producto bg-red-400 text-white 
      font-bold py-2 px-4 rounded absolute inset-100 top-0 right-0 text-lg
      hover:after:content-['Ver_detalles'] shadow-2xl shadow-black/50">+​</button>`;
    div.querySelector(".btn-detalle-producto").addEventListener("click", () => {
      window.location.href = `detalle.html?id=${producto.id}`;
    });
    contenedorProductos.appendChild(div);
  });
}

//Lógica de categorías
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
    boton.className = `bg-slate-400 font-semibold px-8 py-1 rounded-full text-sm md:text-lg
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

//Lógica de detalle de producto
async function cargarProducto(id){
  try{;
    const response = await fetch(`https://fakestoreapi.com/products/`+id);
    if(!response.ok){
      throw new Error("No hay respuesta del servidor de la API");
    }
    const producto = await response.json();
    mostrarProducto(producto); 
  }catch(error){
    console.error("Error al obtener el producto:", error);
  }
}
function mostrarProducto(producto){
  contenedorDetalleProducto.innerHTML = "";
  const div = document.createElement("div");
  div.className = `grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10 px-5 py-4 bg-white rounded-lg
                    relative place-items-center break-all sm:break-normal hyphens-auto`;
  div.innerHTML = `
    <div>
      <img src="${producto.image}" alt="${producto.title}" class="object-contain object-center h-96"
      loading="lazy">
    </div>
    <div class="flex flex-col justify-center items-start">
      <h2 class="font-bold text-lg md:text-xl bg-sky-600 text-white p-2 rounded-md">${producto.title}</h2>
      <h3 class="font-bold text-lg md:text-xl mt-2 md:mt-3">$${producto.price}</h3>
      <p class="mt-2 md:mt-3 text-lg"><b>Description: </b></p>
      <p class="text-sm lg:text-base text-base/8 text-gray-700">${producto.description}</p>
      <p class="mt-2 md:mt-3 text-lg"><b>Category: </b>${producto.category}</p>
      <button class="btn-agregar-carrito bg-sky-600 hover:bg-sky-700 mt-5 text-white
      font-bold py-2 px-4 rounded text-lg md:text-xl">🛒 Agregar al carrito</button>
    </div>`;
  contenedorDetalleProducto.appendChild(div);
}





