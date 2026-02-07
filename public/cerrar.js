
// Verificar si hay token al cargar la página
window.onload = function() {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("No tienes sesión activa");
    window.location.href = "/";
    return;
  }

  // Evento del botón cerrar sesión
  document.getElementById("btnLogout").addEventListener("click", function() {

    // Eliminar token
    localStorage.removeItem("token");

    alert("Sesión cerrada correctamente");

    // Redirigir al login
    window.location.href = "/";
  });

};

