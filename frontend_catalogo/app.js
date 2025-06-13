import storage from "./firebaseIntegration.js";
import { authService } from "./js/authService.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Elementos del DOM
const contenedorProductos = document.getElementById("productos");
const contenedorCategorias = document.getElementById("categorias");
const entradaBusqueda = document.getElementById("busqueda");
const panelAdmin = document.getElementById("panel-admin");
const btnCerrarFomulario = document.getElementById("cerrar-formulario");
const formularioProducto = document.getElementById("formulario-producto");
const btnCrearProducto = document.getElementById("crear-producto");
const overlay = document.getElementById("overlay");
const contenedorCategoriasSeleccionadas = document.getElementById("categorias-seleccionadas");
const contenedorDetalleProducto = document.getElementById("contenedor-detalle-producto");
const ventanaConfirmacion = document.getElementById("ventana-confirmacion");
const idProductoEliminar = document.getElementById("id-producto-eliminar");

// Campos del formulario
const productoId = document.getElementById("producto-id");
const productoTitulo = document.getElementById("producto-titulo");
const productoPrecio = document.getElementById("producto-precio");
const productoImagen = document.getElementById("producto-imagen");
const productoStock = document.getElementById("producto-stock");
const productoDescripcion = document.getElementById("producto-descripcion");
const productoImgUrl = document.getElementById("producto-img-url");

const map = document.getElementById("map");
const botonRegresar = document.getElementById("btn-regresar");

// Variables de estado
let productos = [];
let categoriaSeleccionada = "all";
let modoFormulario = "crear"; // Puede cambiar a "editar"
let categorias = [];
let categoriasSeleccionadasForm = [];


//Inicializar elementos del DOM
document.addEventListener("DOMContentLoaded", () => {

  if (panelAdmin && botonRegresar) { //Panel administración
    botonRegresar.addEventListener("click", () => {
      location.href = "index.html";
    });
  }

  if (contenedorProductos && entradaBusqueda && contenedorCategorias) { //Catalogo de productos
    cargarTodosLosProductos();
    cargarCategorias();
    entradaBusqueda.addEventListener("input", filtrarProductos);
    const botonCerrarSesion = document.getElementById("btn-cerrar-sesion");
    if (botonCerrarSesion && localStorage.getItem("user_data")) {
      botonCerrarSesion.addEventListener("click", authService.logout);
    }
  }

  if (contenedorDetalleProducto && botonRegresar) { //Detalle de producto
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get("id");
    if (productoId) {
      cargarProducto(productoId);
      botonRegresar.addEventListener("click", regresarCatalogo);
    }
  }

  if (map && botonRegresar) { //Página de contacto
    botonRegresar.addEventListener("click", () => {
      location.href = "index.html";
    });
  }

  if (btnCerrarFomulario && formularioProducto && btnCrearProducto) { //Formulario de productos
    btnCrearProducto.addEventListener("click", abrirFormularioCreacion);
    const btnGuardarProducto = document.getElementById("guardar-producto");
    btnGuardarProducto.addEventListener("click", guardarProducto);
    btnCerrarFomulario.addEventListener("click", cerrarFormulario);
    productoImagen.type = "file"; // Aseguramos que el input de imagen sea de tipo file
    productoImagen.accept = "image/*"; // Aceptar solo imágenes
  }
});

//Funciones de autenticación

async function me() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    
    if (!response.ok) throw new Error("Error al obtener los datos del usuario");
    
    const data = await response.json();
    localStorage.setItem("user_data", JSON.stringify(data));
    return data;
  } catch (error) {
    console.log("Error al obtener los datos del usuario:", error);
    return [];
  }
}

async function regresarCatalogo() {
  const userData = await me();
  if (userData.rol === "admin") {
    location.href = "admin.html#catalogo";
  } else {
    location.href = "index.html#catalogo";
  }
}

//Funciones del formulario de productos
function abrirFormularioCreacion() {
  modoFormulario = "crear";
  overlay.classList.remove("hidden");
  formularioProducto.classList.remove("hidden");
  cargarCategorias();
  cargarCategoriasDisponiblesFormulario();
}

async function guardarProducto(e) {
  e.preventDefault();
  switch (modoFormulario) {
    case "crear":
      await crearProducto();
      break;
    case "actualizar":
      await actualizarProducto();
      break;
  }
  
  cerrarFormulario();
  location.reload();
}

function cerrarFormulario() {
  overlay.classList.add("hidden");
  formularioProducto.classList.add("hidden");
  limpiarFormularioProducto();
}

// Funciones auxiliares del formulario
function agregarCategoriaSeleccionadaForm(categoriaId) {
  if (categoriaId && !categoriaFormAgregada(categoriaId)) {
    categoriasSeleccionadasForm.push(categoriaId);
    const categoria = categorias.find(cat => cat.id === parseInt(categoriaId));
    
    if (categoria) {
      const span = document.createElement("span");
      span.textContent = categoria.nombre;
      span.className = "bg-green-400 text-white px-4 pr-8 py-2 mr-3 rounded relative";
      
      const button = document.createElement("button");
      button.textContent = "X";
      button.className = `bg-red-400 text-white text-sm font-semibold py-1 px-2 rounded-full 
        absolute right-1 top-1/2 translate-y-[-50%]`;

      button.addEventListener("click", (e) => {
        e.preventDefault();
        quitarCategoriaSeleccionadaForm(categoriaId);
        contenedorCategoriasSeleccionadas.removeChild(span);
      });
      
      span.appendChild(button);
      contenedorCategoriasSeleccionadas.appendChild(span);
    }
  }
}

function categoriaFormAgregada(categoriaId) {
  return categoriasSeleccionadasForm.some(id => id === categoriaId);
}

function quitarCategoriaSeleccionadaForm(categoriaId) {
  categoriasSeleccionadasForm = categoriasSeleccionadasForm.filter(id => id !== categoriaId);
}

function limpiarFormularioProducto() {
  categoriasSeleccionadasForm = [];
  contenedorCategoriasSeleccionadas.innerHTML = "";
  productoTitulo.value = "";
  productoPrecio.value = "";
  productoImagen.value = "";
  productoStock.value = "";
  productoDescripcion.value = "";
  productoImgUrl.value = "";
}

function cargarCategoriasDisponiblesFormulario() {
  const categoriasFormularioSelect = document.getElementById("categorias-formulario");
  categoriasFormularioSelect.innerHTML = "";
  
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.nombre;
    categoriasFormularioSelect.appendChild(option);
  });
  
  categoriasFormularioSelect.addEventListener("change", (e) => {
    agregarCategoriaSeleccionadaForm(e.target.value);
  });
}

function cargarCategoriasSeleccionadas(categoriasProducto) {
  categoriasProducto.forEach(cat => {
    agregarCategoriaSeleccionadaForm(cat.id);
  });
}

function cargarDatosActualizacion(producto) {
  if (producto) {
    productoId.value = producto.id;
    productoTitulo.value = producto.titulo;
    productoDescripcion.value = producto.descripcion;
    productoPrecio.value = producto.precio;
    productoStock.value = producto.stock;
    productoImgUrl.value = producto.imagen;
    cargarCategoriasSeleccionadas(producto.categorias); //Categorías del producto a actualizar
    cargarCategoriasDisponiblesFormulario(); //Categorias disponibles para selecionar
  }
}

//CRUD de productos
async function crearProducto() {
  const titulo = productoTitulo.value;
  const precio = productoPrecio.value;
  const stock = productoStock.value;
  const descripcion = productoDescripcion.value;
  const imagen = productoImagen.files[0];
  let imageUrl = "";
  if (!titulo || !precio || !descripcion || !stock) return;
  if (imagen && imagen.type.startsWith("image/")) {
    imageUrl = await subirImagenFirebase(imagen, `img_producto_${titulo}_${Date.now()}`);
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        titulo,
        precio,
        stock,
        descripcion,
        categorias: categoriasSeleccionadasForm,
        imagen: imageUrl,
      }),
    });
    
    if (!response.ok) throw new Error("Error al crear el producto");
    
    alert("Producto creado exitosamente");
  } catch (error) {
    alert("Error al crear el producto");
    console.error(error);
  }
}

async function actualizarProducto() {
  const id = productoId.value;
  const titulo = productoTitulo.value;
  const precio = productoPrecio.value;
  const stock = productoStock.value;
  const descripcion = productoDescripcion.value;
  let imageUrl = productoImgUrl.value;
  const archivoImagen = productoImagen.files[0];

  if (!titulo || !precio || !descripcion || !stock) return;
  if (archivoImagen && archivoImagen.type.startsWith("image/")) {
    imageUrl = await subirImagenFirebase(archivoImagen, `img_producto_${titulo}_${Date.now()}`);
  }
  
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/productos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        titulo,
        precio,
        stock,
        descripcion,
        categorias: categoriasSeleccionadasForm,
        imagen: imageUrl,
      }),
    });
    
    if (!response.ok) throw new Error("Error al actualizar el producto");
    alert("Producto actualizado exitosamente");
  } catch (error) {
    alert("Error al actualizar el producto:");
    console.error(error);
  }
}

async function eliminarProducto(productoId) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/productos/${productoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    
    if (!response.ok) throw new Error("Error al eliminar el producto");
    
    alert("Producto eliminado exitosamente");
  } catch (error) {
    alert("Error al eliminar el producto");
    console.error(error);
  }
}

//Visualización de productos
async function cargarTodosLosProductos() {
  try {
    const respuesta = await fetch("http://127.0.0.1:8000/api/productos");
    
    if (!respuesta.ok) throw new Error("No hay respuesta del servidor de la API");
    
    productos = await respuesta.json();
    
    if (productos.length === 0) {
      console.log("No hay productos disponibles");
    } else {
      if(localStorage.getItem("access_token")){
        await me();
      }
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
    productosFiltrados = productos.filter(p => 
      p.categorias.some(c => c.nombre === categoriaSeleccionada)
    );
  }

  const texto = entradaBusqueda.value.toLowerCase().trim();
  if (texto !== "") {
    productosFiltrados = productosFiltrados.filter(p => {
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
  const currentPage = window.location.href;

  listaProductos.forEach(producto => {
    const div = document.createElement("div");
    div.className = `producto-card rounded-lg hover:shadow-lg px-2 md:px-8 py-3 m-2 bg-white flex flex-col 
      justify-evenly items-center transition-shadow duration-200 ease-in-out relative`;

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
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if(localStorage.getItem("user_data") && userData.rol === "admin" && currentPage.includes("admin.html")) {
      agregarControlesAdmin(div, producto);
    }
    contenedorProductos.appendChild(div);
  });
}

function agregarControlesAdmin(div, producto) {
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.accept = "image/*";
  inputFile.className = "hidden";

  const botonFile = document.createElement("button");
  botonFile.textContent = "Cambiar imagen";
  botonFile.setAttribute("data-role", "admin");
  botonFile.className = `hidden w-full mt-4 px-4 py-2 rounded-xl border border-blue-500 bg-blue-100 text-blue-800 
    font-semibold text-sm hover:bg-blue-200 hover:text-blue-900 transition duration-300 ease-in-out
    shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300`;

  botonFile.addEventListener("click", () => inputFile.click());
  inputFile.addEventListener("change", () => cambiarImagen(inputFile, producto));

  div.appendChild(inputFile);
  div.appendChild(botonFile);

  const divControls = document.createElement("div");
  divControls.className = `flex flex-wrap gap-3 mt-5 items-center`;
  divControls.innerHTML = `
    <button id="producto-${producto.id}" class="border bg-indigo-200 text-indigo-700 hover:bg-indigo-300 py-2 font-medium text-sm
      border-indigo-500 px-3 rounded-xl hover:shadow-lg transition-all duration-200 ease-in-out outline-none">Editar</button>

    <button id="eliminar-producto-${producto.id}" class="border bg-red-200 text-red-700 hover:bg-red-300 py-2 font-medium text-sm
      border-red-500 px-3 rounded-xl hover:shadow-lg transition-all duration-200 ease-in-out outline-none">Eliminar</button>`;

  const botonEditar = divControls.querySelector(`#producto-${producto.id}`);
  botonEditar.addEventListener("click", () => {
    modoFormulario = "actualizar";
    overlay.classList.remove("hidden");
    formularioProducto.classList.remove("hidden");
    cargarDatosActualizacion(producto);
  });

  const botonEliminar = divControls.querySelector(`#eliminar-producto-${producto.id}`);
  botonEliminar.addEventListener("click", () => {
    abrirVentanaConfirmacion();
    
    const botonConfirmar = document.getElementById("confirmar-eliminacion");
    const botonCancelar = document.getElementById("cancelar-eliminacion");

    botonConfirmar.addEventListener("click", async () => {
      await eliminarProducto(producto.id);
      botonCancelar.click();
      location.reload();
    });

    botonCancelar.addEventListener("click", () => {
      overlay.classList.add("hidden");
      ventanaConfirmacion.classList.add("hidden");
      idProductoEliminar.value = "";
    });
  });
  
  div.appendChild(divControls);
}

function abrirVentanaConfirmacion() {
  overlay.classList.remove("hidden");
  ventanaConfirmacion.classList.remove("hidden");
}


//Funciones para detalle de producto
async function cargarProducto(id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/productos/` + id);
    
    if (!response.ok) throw new Error("No hay respuesta del servidor de la API");
    
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
    <div class="w-full flex justify-center items-center">
      <img src="${producto.imagen}" alt="${producto.titulo}" 
        class="object-contain w-full md:w-96 md:h-96 rounded-2xl shadow-2xl border" loading="lazy">
    </div>
    <div class="flex flex-col justify-center items-start space-y-4 px-4 md:px-8">
      <h2 class="font-bold text-2xl md:text-3xl text-sky-700">${producto.titulo}</h2>
      <h3 class="text-xl text-green-600 font-semibold">$${producto.precio}</h3>
      
      <div>
        <p class="text-lg font-medium text-gray-800">Descripción:</p>
        <p class="text-base text-gray-600 leading-relaxed">${producto.descripcion}</p>
      </div>
      
      <p class="text-base text-indigo-700 font-semibold bg-indigo-100 px-4 py-2 rounded-lg">Stock: ${producto.stock}</p>
      
      <div class="flex flex-wrap gap-2 items-center">
        <p class="font-medium text-gray-700">Categorías:</p>
        ${producto.categorias.map(cat => `
          <span class="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full shadow-sm text-sm">${cat.nombre}</span>
        `).join("")}
      </div>
      
      <button data-role="cliente" class="hidden btn-agregar-carrito bg-sky-600 hover:bg-sky-700 hover:scale-105 transition-transform 
        duration-200 text-white text-sm md:text-base 2xl:text-xl font-bold py-2 px-6 rounded-lg shadow-md text-lg">
        🛒 Agregar al carrito
      </button>
    </div>
  `;

  contenedorDetalleProducto.appendChild(div);
}


//Funciones para categorías
async function cargarCategorias() {
  try {
    const respuesta = await fetch("http://127.0.0.1:8000/api/categorias");
    
    if (!respuesta.ok) throw new Error("No hay respuesta del servidor de la API");
    
    categorias = await respuesta.json();
    mostrarCategorias([{ nombre: "all" }, ...categorias]);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
  }
}

function mostrarCategorias(categorias) {
  contenedorCategorias.innerHTML = "";
  
  categorias.forEach(cat => {
    const boton = document.createElement("button");
    boton.textContent = cat.nombre === "all" 
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

//Funciones para Firebase Storage
async function cambiarImagen(input, producto) {
  const archivo = input.files[0];
  
  if (!archivo || !archivo.type.startsWith("image/")) {
    alert("El archivo no es una imagen");
    return;
  }
  
  const imageUrl = await subirImagenFirebase(archivo, `img_producto_${producto.id}_${Date.now()}`);
  
  if (imageUrl) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/productos/change-product-image/${producto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ imagen: imageUrl }),
        }
      );
      
      if (!response.ok) throw new Error("Error al cambiar la imagen");
      
      alert("Imagen cambiada exitosamente");
      location.reload();
    } catch (error) {
      console.error("Error al cambiar la imagen:", error);
    }
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
    return null;
  }
}



function desbloquearControles() {
  if (!localStorage.getItem("user_data")) return;
  
  const userData = JSON.parse(localStorage.getItem("user_data"));
  document.querySelectorAll("[data-role]").forEach(elemento => {
    if (elemento.dataset.role === userData.rol) {
      elemento.classList.remove("hidden");
      elemento.classList.add("block");
    }
  });
}