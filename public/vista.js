console.log("SCRIPT CARGADO");

document.getElementById("formLogin").addEventListener("submit", async function(e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  const respuesta = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usuario, password })
  });

  const data = await respuesta.json();

  if (respuesta.ok) {

    // Guardar token recibido
    localStorage.setItem("token", data.token);

    // Redirigir a la página protegida
    window.location.href = "/credenciales";

  } else {
    alert(data.mensaje);
  }
});
