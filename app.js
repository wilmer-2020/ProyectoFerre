import { getProduct, get } from "./backConfig.js";
let $template = document.querySelector(".template").content;
let $fragment = document.createDocumentFragment();
let $optionsProduct = document.getElementById("material");
let $inputCantidad = document.getElementById("txtCantidad");
let $inputPrecio = document.getElementById("txtPrecio");
let $inputTotal = document.getElementById("txtTotal");
let $inputOrden = document.getElementById("orden");
let btnEnviar = document.querySelector(".btnEnviar");
let btnFactura = document.querySelector(".btnFactura");
let btnAdd = document.querySelector(".buttonAdd");
let table = document.querySelector(".table");
const AllProducts = {
  cemento: "cemento",
  "tubo 3pulg": "tubo 3pulg",
};
document.addEventListener("DOMContentLoaded", async (e) => {
  getAll();
  desabilitar();
});

async function getAll() {
  for (const key in AllProducts) {
    let $option = document.createElement("option");
    $option.setAttribute("value", key);
    $option.setAttribute("label", key);
    let clone = document.importNode($option, true);
    $fragment.appendChild(clone);
  }
  $optionsProduct.appendChild($fragment);
}
function desabilitar() {
  $inputCantidad.disabled = true;
  $optionsProduct.disabled = true;
  btnEnviar.disabled = true;
  btnFactura.disabled = true;
  btnAdd.disabled = true;
  $inputCantidad.value = "";
  $inputTotal.value = "";
  $inputPrecio.value = "";
  $optionsProduct.value = "";
}
function habilitar() {
  $inputCantidad.disabled = false;
  $optionsProduct.disabled = false;
  btnEnviar.disabled = false;
  btnFactura.disabled = false;
  btnAdd.disabled = false;
}

document.addEventListener("change", async (e) => {
  if (e.target === $optionsProduct) {
    let select = $optionsProduct.value.toLowerCase();
    const querySnapshot = await get(getProduct(AllProducts[select]));
    console.log(querySnapshot.data().precio);
    $inputPrecio.value = querySnapshot.data().precio;
  }
});

$inputCantidad.addEventListener("keypress", async (e) => {
  let select = $optionsProduct.value.toLowerCase();
  const querySnapshot = await get(getProduct(AllProducts[select]));
  $inputTotal.value = $inputCantidad.value * querySnapshot.data().precio;
});

const createOrden = (data) => {
  orden.push(data);
  for (let i = 0; i < orden.length; i++) {
    dataSend.push(
      `PRODUCTO: ${JSON.stringify(
        orden[i].product
      )} -- CANTIDAD: ${JSON.stringify(orden[i].cantidad)}`
    );
  }
  $inputOrden.value = [...new Set(dataSend)];
  console.log(dataSend);
};
let orden = [];
const dataSend = [];
document.addEventListener("click", (e) => {
  if (e.target.matches(".buttonCreate")) habilitar();
  if (e.target.matches(".buttonAdd")) {
    $template.querySelector(".tdMaterial").innerHTML = $optionsProduct.value;
    $template.querySelector(".tdCantidad").innerHTML = $inputCantidad.value;
    $template.querySelector(".tdPreU").innerHTML = $inputPrecio.value;
    $template.querySelector(".tdTotal").innerHTML = $inputTotal.value;
    let clone = document.importNode($template, true);
    $fragment.appendChild(clone);
    table.appendChild($fragment);
    const OrdenData = {
      product: $optionsProduct.value,
      precio: $inputPrecio.value,
      cantidad: $inputCantidad.value,
    };
    createOrden(OrdenData);
    console.log(orden);
    desabilitar();
  }
});
document.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target === document.querySelector("form")) {
    fetch("https://formsubmit.co/ajax/alfredomontes1970@gmail.com", {
      method: "POST",
      body: new FormData(e.target),
    })
      .then((res) => (res.ok ? res.json : Promise.reject(res)))
      .then((json) => {
        console.log(json);
        alert("success");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
