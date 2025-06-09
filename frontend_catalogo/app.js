import storage from "./firebaseIntegration.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const contenedorProductos = document.getElementById("productos");
const contenedorCategorias = document.getElementById("categorias");
const entradaBusqueda = document.getElementById("busqueda");
const contenedorDetalleProducto = document.getElementById(
  "contenedor-detalle-producto"
);
const map = document.getElementById("map");
const botonRegresar = document.getElementById("btn-regresar");
let productos = [];
let categoriaSeleccionada = "all";
//Login de la app
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    //Login de usuario
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const mensaje = document.getElementById("mensaje");
      try {
        const response = await fetch("http://127.0.0.1:8000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        if (!response.ok) {
          throw new Error("Error de conexión con la api");
        }
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_data", JSON.stringify(data.user));

        mensaje.textContent = "Inicio de sesión exitoso ✔️​";
        mensaje.classList.add("text-green-500");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mensaje.textContent =
          "Error al iniciar sesión. Inténtalo de nuevo. ❌​";
        mensaje.classList.add("text-red-500");
      }
    });
  }
  if (contenedorProductos && entradaBusqueda && contenedorCategorias) {
    //Catalogo de productos
    cargarTodosLosProductos();
    cargarCategorias();
    entradaBusqueda.addEventListener("input", filtrarProductos);
    //Lógica botón de cerrar sesión
    const botonCerrarSesion = document.getElementById("btn-cerrar-sesion");
    botonCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      location.href = "index.html";
    });
  }
  if (contenedorDetalleProducto && botonRegresar) {
    //Detalle de producto
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get("id");
    if (productoId) {
      cargarProducto(productoId);
      botonRegresar.addEventListener("click", () => {
        //Botón regresar de página de detalle de producto
        location.href = "index.html#catalogo";
      });
    }
  }
  if (map && botonRegresar) {
    botonRegresar.addEventListener("click", () => {
      //Botón regresar de página de contacto
      location.href = "index.html";
    });
  }
});

//Lógica de productos
async function cargarTodosLosProductos() {
  try {
    const respuesta = await fetch("http://127.0.0.1:8000/api/productos"); //Cambio
    if (!respuesta.ok) {
      throw new Error("No hay respuesta del servidor de la API");
    }
    productos = await respuesta.json();
    if (productos.length === 0) {
      console.log("No hay productos disponibles");
    } else {
      mostrarProductos(productos);
      desbloquearControles();
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}

function filtrarProductos() {
  let productosFiltrados = productos;

  if (categoriaSeleccionada !== "all") {
    productosFiltrados = productos.filter((p) =>
      p.categorias.some((c) => c.nombre === categoriaSeleccionada)
    );
  }

  const texto = entradaBusqueda.value.toLowerCase().trim();
  if (texto !== "") {
    productosFiltrados = productosFiltrados.filter((p) => {
      return (
        p.titulo.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
      );
    });
  }

  mostrarProductos(productosFiltrados);
}

function mostrarProductos(listaProductos) {
  contenedorProductos.innerHTML = "";
  listaProductos.forEach((producto) => {
    const div = document.createElement("div");
    div.className = `rounded-lg hover:shadow-lg px-2 md:px-8 py-3 m-2 bg-white flex flex-col 
        justify-evenly items-center transition-shadow 
        duration-200 ease-in-out relative`;

    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.titulo}" class="w-40 h-32 object-contain rounded-2xl shadow-lg">
      <h2 class="font-bold text-center break-all sm:break-normal hyphens-auto mt-3">${producto.titulo}</h2>
      <p class="text-gray-700 text-center mt-2">$${producto.precio}</p>
      <p class="text-gray-700 text-center mt-2">${producto.descripcion}</p>
      <p class="text-sky-600 text-center mt-2 font-medium bg-sky-100 p-2 rounded-lg">Stock: ${producto.stock}</p>
      <button class="btn-detalle-producto bg-red-400 text-white 
      font-bold py-2 px-4 rounded absolute inset-100 top-0 right-0 text-lg
      hover:after:content-['Ver_detalles'] shadow-2xl shadow-black/50">+​</button>`;
    div.querySelector(".btn-detalle-producto").addEventListener("click", () => {
      window.location.href = `detalle.html?id=${producto.id}`;
    });
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/*";
    inputFile.className = "hidden";

    const botonFile = document.createElement("button");
    botonFile.textContent = "Cambiar imagen";
    botonFile.setAttribute("data-role", "admin");
    botonFile.className = `hidden
      w-full mt-4 px-4 py-2 rounded-xl border border-blue-500 bg-blue-100 text-blue-800 
      font-semibold text-sm hover:bg-blue-200 hover:text-blue-900 transition duration-300 ease-in-out
      shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300
    `;

    botonFile.addEventListener("click", () => {
      inputFile.click();
    });
    inputFile.addEventListener("change", () => {
      cambiarImagen(inputFile, producto);
    });

    div.appendChild(inputFile);
    div.appendChild(botonFile);

    contenedorProductos.appendChild(div);
  });
}

//Cambiar imagenes de productos con firebase
async function cambiarImagen(input, producto){
  const archivo = input.files[0];
      if (!archivo || !archivo.type.startsWith("image/")){
        alert("El archivo no es una imagen");
        return;
      } 
      const imageUrl = await subirImagenFirebase(archivo, `img_producto_${producto.id}_${Date.now()}`);
      if (imageUrl) {
        const response = await fetch(`http://127.0.0.1:8000/api/productos/change-product-image/${producto.id}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          },
          body: JSON.stringify({
            imagen: imageUrl
          })
        })
        if (!response.ok) {
          throw new Error("Error al cambiar la imagen");
        }
        alert("Imagen cambiada exitosamente");
        location.reload();
        location.href = "index.html#catalogo";
      }
}

async function subirImagenFirebase(archivo, nombre) {
  try {
    const storageRef = ref(storage, `fotos/${nombre}`);
    const response = await uploadBytes(storageRef, archivo);
    const url = await getDownloadURL(response.ref);
    return url;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
  }
}

//Lógica de categorías
async function cargarCategorias() {
  try {
    const respuesta = await fetch("http://127.0.0.1:8000/api/categorias");
    if (!respuesta.ok) {
      throw new Error("No hay respuesta del servidor de la API");
    }
    const categorias = await respuesta.json();
    mostrarCategorias([{ nombre: "all" }, ...categorias]);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
  }
}
function mostrarCategorias(categorias) {
  contenedorCategorias.innerHTML = "";
  categorias.forEach((cat) => {
    const boton = document.createElement("button");
    boton.textContent =
      cat.nombre === "all"
        ? "Todos"
        : cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1);
    boton.className = `bg-slate-400 font-semibold px-8 py-1 rounded-full text-sm md:text-lg
      hover:bg-slate-600 hover:text-white shadow-xl 
      transition-colors duration-200 ease-in-out ${
        categoriaSeleccionada === cat.nombre
          ? " text-white bg-slate-600"
          : " text-black bg-slate-400"
      }`;
    boton.addEventListener("click", () => {
      categoriaSeleccionada = cat.nombre;
      mostrarCategorias(categorias);
      filtrarProductos();
    });
    contenedorCategorias.appendChild(boton);
  });
}

//Lógica de detalle de producto
async function cargarProducto(id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/productos/` + id);
    if (!response.ok) {
      throw new Error("No hay respuesta del servidor de la API");
    }
    const producto = await response.json();
    mostrarProducto(producto);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
  }
}
function mostrarProducto(producto) {
  contenedorDetalleProducto.innerHTML = "";
  const div = document.createElement("div");
  div.className = `grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-3 px-10 py-4 bg-white rounded-lg
                    relative place-items-center break-all sm:break-normal hyphens-auto`;
  div.innerHTML = `
    <div>
      <img src="${producto.imagen}" alt="${producto.titulo}" class="object-contain
        h-96 rounded-2xl shadow-lg"
      loading="lazy">
    </div>
    <div class="flex flex-col justify-center items-start">
      <h2 class="font-bold text-lg md:text-xl bg-sky-600 text-white p-2 rounded-md">${producto.titulo}</h2>
      <h3 class="font-bold text-lg md:text-xl mt-2 md:mt-3">$${producto.precio}</h3>
      <p class="mt-2 md:mt-3 text-lg"><b>Descripción: </b></p>
      <p class="text-sm lg:text-base text-base/8 text-gray-700">${producto.descripcion}</p>
      <p class="mt-2 md:mt-3 text-lg"><b>Categorias: </b>${producto.category}</p>
      <button class="btn-agregar-carrito bg-sky-600 hover:bg-sky-700 mt-5 text-white
      font-bold py-2 px-4 rounded text-lg md:text-xl">🛒 Agregar al carrito</button>
    </div>`;
  contenedorDetalleProducto.appendChild(div);
}

//Lógica para desbloquear controles según rol
function desbloquearControles() {
  if(!localStorage.getItem("user_data")) return;
  const userData = JSON.parse(localStorage.getItem("user_data"));
  document.querySelectorAll("[data-role]").forEach((elemento) => {
    if (elemento.dataset.role === userData.rol) {
      elemento.classList.remove("hidden");
      elemento.classList.add("block");
    }
  });
}
