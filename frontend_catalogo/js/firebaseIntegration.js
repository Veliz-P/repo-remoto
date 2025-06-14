import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uploadImageToFirebase = async (file, name) => {
  let url = null;
  const storageRef = ref(storage, `fotos/${name}`);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Imagen subida con éxito");
    url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
  }
  return url;
};

export const firebaseIntegration = {
  uploadImageToFirebase,
  storage,
};
