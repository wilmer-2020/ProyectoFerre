import { 
  getProduct, get,documentos
} from "./backConfig.js";
let $template = document.querySelector(".template").content;
let $fragment = document.createDocumentFragment();
let $optionsProduct = document.getElementById("material");
let $inputCantidad = document.getElementById("txtCantidad");
let $inputPrecio = document.getElementById("txtPrecio");
let $inputTotal = document.getElementById("txtTotal");
let $inputTotalPagar = document.getElementById("txtPagar");
let $inputOrden = document.getElementById("orden");
let btnEnviar = document.querySelector(".btnEnviar");
let btnAdd = document.querySelector(".buttonAdd");
let btnEliminar = document.querySelector(".btnEliminar"); 
let table = document.querySelector(".table");
let total = 0;
let orden = [];
const dataSend = [];
const RegExp = {
  nombre: /^[a-zA-Z\s]+$/,
  Id:/^[0-9\-]+$/,
}
function desabilitar() {
  $inputCantidad.disabled = true;
  btnEliminar.disabled = true;
  $optionsProduct.disabled = true;
  btnAdd.disabled = true;
  $inputCantidad.value = "";
  $inputTotal.value = "";
  $inputPrecio.value = "";
  $optionsProduct.value = "";
}
function habilitar(){
  $inputCantidad.disabled = false;
  $optionsProduct.disabled = false;
  btnEnviar.disabled = false;
  btnAdd.disabled = false;
}
desabilitar();
getAll();

function getAll() {
  documentos.forEach(doc => {
    let option = document.createElement("option");
    option.setAttribute("value", doc.id);
    option.setAttribute("label", doc.id);
    let clone = document.importNode(option,true);
    $fragment.appendChild(clone);
  });
  $optionsProduct.appendChild($fragment);
  $optionsProduct.value =""
}

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

const validateForm = (regEpx,input,campo) => {
  if(regEpx.test(input)){
    document.getElementById(`${campo}`).classList.remove('validate');
    btnEnviar.disabled= false;
  }else{
    btnAdd.disabled = true;
    btnEnviar.disabled= true;
    document.getElementById(`${campo}`).classList.add('validate');
  }
}

function sumar(input) {
  total += parseInt(input);
  $inputTotalPagar.value = total;
  console.log(total);
}

$optionsProduct.addEventListener("change", async (e) => {
    let select = $optionsProduct.value.toLowerCase();
    const querySnapshot = await get(getProduct(select));
    console.log(querySnapshot.data().precio);
    $inputPrecio.value = querySnapshot.data().precio;
});
document.addEventListener("click", (e) => {
  if (e.target.matches(".buttonCreate")) {
   habilitar()
  };
  if (e.target.matches(".buttonAdd")) {
    if($inputCantidad.value === ""){
      return alert("seleccione el producto e ingrese la cantidad")
    }else{
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
      sumar($inputTotal.value);
      desabilitar();
    }
  }
  if(e.target.matches('#btnMenu')){
    let menu = document.querySelector('.menu');
    menu.classList.toggle('active')
  }
  if(e.target.matches('.btnEliminar')){
    alert("oha")
  }
});
document.addEventListener("submit", (e) => {
  e.preventDefault();
  if(dataSend.length === 0){
    return alert('Realize el pedido')
  }else{
    if (e.target === document.querySelector("form")){
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
  }
});

document.addEventListener('keyup', async (e) => {
  let target = e.target.value;
  if(e.target.matches("#nombre"))validateForm(RegExp.nombre,target,"nombre");
  if(e.target.matches("#numID"))validateForm(RegExp.Id,target,"numID");
  if(e.target.matches("#telefono"))validateForm(RegExp.Id,target,"telefono");
  if(e.target === $inputCantidad){
    let select = $optionsProduct.value.toLowerCase();
    const querySnapshot = await get(getProduct(select));
    $inputTotal.value = querySnapshot.data().precio * $inputCantidad.value
  }
});
