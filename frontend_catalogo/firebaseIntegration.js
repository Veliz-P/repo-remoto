
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyD-O5qNjhd-G-WUEE7jDToZe4moQvlrM_Y",
    authDomain: "catalogo-productos-imagenes.firebaseapp.com",
    projectId: "catalogo-productos-imagenes",
    storageBucket: "catalogo-productos-imagenes.firebasestorage.app",
    messagingSenderId: "321104975233",
    appId: "1:321104975233:web:5cac9b35493d4b1d6bc480"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
const storage = getStorage(app);
export default storage;