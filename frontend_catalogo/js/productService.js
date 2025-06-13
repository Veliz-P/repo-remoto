import { firebaseIntegration } from "../firebaseIntegration.js";
const API_BASE_URL = 'http://localhost:8000/api';

const getAllProducts = async () => {
  let products = null;
  try {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Error al obtener los productos");
    products = await response.json();
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
  return products;
};

const getAllCategories = async () => {
  let categories = null;
  try {
    const response = await fetch(`${API_BASE_URL}/categorias`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Error al obtener las categorías");
    categories = await response.json();
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
  }
  return categories;
}

const getProductById = async (id) => {
  let product = null;
  try {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Error al obtener el producto");
    product = await response.json();
  } catch (error) {
    console.error("Error al obtener el producto:", error);
  }
  return product;
};

const changeProductImg = async (file, productData) => {
  let url = null;
  if (!file || !file.type.startsWith("image/")) {
    alert("Archivo incorrecto o datos del producto no proporcionados");
    return null;
  }
  try {
    url = await firebaseIntegration.uploadImageToFirebase(file,`${productData.titulo}_img_${Date.now()}`);
    if (url) {
      const response = await fetch(
        `${API_BASE_URL}/productos/change-product-image/${productData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ imagen: url }),
        }
      );
      if (!response.ok) throw new Error("Error al actualizar el producto");
      alert("Imagen del producto actualizada correctamente");
      location.reload();
    }
  } catch (error) {
    console.error("Error al cambiar la imagen del producto:", error);
  }
  return url;
};

const createProduct = async (productoData, imgFile) => {
  if(!productoData.titulo || !productoData.precio 
    || !productoData.descripcion || !productoData.stock) {
        console.error("Datos del producto incompletos");
        return null
  }
  let producto = null;
  productoData.imagen = "";
  try {
    if (imgFile && imgFile.type.startsWith("image/")) {
        productoData.imagen = await firebaseIntegration.uploadImageToFirebase(imgFile,`${productoData.titulo}_img_${Date.now()}`);
    }
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(productoData),
    });
    if (!response.ok) throw new Error("Error al crear el producto");
    producto = await response.json();
  } catch (error) {
    console.error("Error al crear el producto:", error);
  }
  return producto;
}

const updateProduct = async (productoData, imgFile) => {
  if(!productoData.titulo || !productoData.precio 
    || !productoData.descripcion || !productoData.stock || !productoData.id) {
        console.error("Datos del producto incompletos");
        return null
  }
  let producto = null;
  try {
    if (imgFile && imgFile.type.startsWith("image/")) {
        productoData.imagen = await firebaseIntegration.uploadImageToFirebase(imgFile,`${productoData.titulo}_img_${Date.now()}`);
    }
    const response = await fetch(`${API_BASE_URL}/productos/${productoData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(productoData),
    });
    if (!response.ok) throw new Error("Error al actualizar el producto");
    producto = await response.json();
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
  }
  return producto;
}

const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response.ok) throw new Error("Error al eliminar el producto");
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export const productService = {
  getAllProducts,
  getProductById,
  changeProductImg,
  getAllCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
