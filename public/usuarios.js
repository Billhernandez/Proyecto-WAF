document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Acceso no autorizado");
    window.location.href = "/";
    return;
  }

  try {

    const respuesta = await fetch("/usuarios", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!respuesta.ok) {
      alert("Sesión inválida");
      window.location.href = "/";
      return;
    }

    const usuarios = await respuesta.json();

    const tabla = document.getElementById("tablaUsuarios");

    usuarios.forEach(u => {

      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td>${u.correo}</td>
        <td>${u.activo ? "Activo" : "Inactivo"}</td>
      `;

      tabla.appendChild(fila);

    });

  } catch (error) {
    console.error(error);
  }

});
