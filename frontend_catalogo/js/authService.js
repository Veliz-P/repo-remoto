const API_BASE_URL = 'http://localhost:8000/api';

const login = async (email, password) => {
  let data = null;
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("Error al iniciar sesión. Verifica tus credenciales.");
    }
    data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_data", JSON.stringify(data.user));
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
  return data.user;
};

const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    alert("Sesión cerrada correctamente");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    window.location.href = "index.html";
  } catch (error) {
    console.log("Error al cerrar sesión:", error);
  }
};

const me = async () => {
  let userData = null;
  try {
    const response = await fetch(`${API_BASE_URL}/me}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    
    if (!response.ok) throw new Error("Error al obtener los datos del usuario");
    
    userData = await response.json();
    localStorage.setItem("user_data", JSON.stringify(userData));
  } catch (error) {
    console.log("Error al obtener los datos del usuario:", error);
  }
  return userData;
}

export const authService = {
  login,
  logout,
  me,
};
