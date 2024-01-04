import { getProduct, get,documentos} from "./backConfig.js";
let form = document.querySelector('form');
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
let btnEliminar = document.createElement('button'); 
let btnMenu = document.querySelector(".btnMenu");
let bar1 = document.querySelector(".bar1");
let bar2 = document.querySelector(".bar2");
let bar3 = document.querySelector(".bar3");
let table = document.querySelector(".table tbody");

let totalPagar = 0;
let orden = [];
let OrdenData; 
const modalDelete = document.querySelector('.modal');
const modalVacio = document.querySelector('.modal_vacio');
const modalEnviado = document.querySelector('.modal_enviado');
const dataSend = [];
const RegExp = {
  nombre: /^[a-zA-Z\s]{1,100}$/,
  Id:/^[0-9\-]+$/,
}
document.addEventListener('DOMContentLoaded', getAll);

btnEliminar.textContent = "Eliminar";
btnEliminar.classList.add("btnEliminar")
function desabilitar() {
  $inputCantidad.disabled = true;
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
getAll();
function getAll() {
  desabilitar();
  $inputTotalPagar.value = ""
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

function generarID() {
  return Date.now().toString()+Math.random().toString(30).substring(2);
}

const createOrden = (data) => {
  data["id"] = generarID();
  btnEliminar.setAttribute('data-id',data.id)
  orden.push(data);
};

const validateInput = (exprecion,input,campo) => {
  if(exprecion.test(input)){
    console.log('correcto')
    document.querySelector(`.${campo}`).style='display:none';
    btnAdd.style='opacity:1'
    btnEnviar.style='opacity:1'
  }else{
    console.log('incorrecto')
    document.querySelector(`.${campo}`).style='display:block';
     btnAdd.style='opacity:0'
     btnEnviar.style='opacity:0'
  }
}

function sumar() {
  totalPagar += OrdenData.total;
  $inputTotalPagar.value = totalPagar;
}

function bars() {
  bar1.classList.toggle("active");
  bar2.classList.toggle("active");
  bar3.classList.toggle("active");
}

function EliminarObj(id) {
  let indice = orden.findIndex((el) => {
    return el.id === id;
  })
  orden.splice(indice, 1);
  if(orden.length === 0)$inputTotalPagar.value = 0
  let nombreProducto = btnEliminar.dataset.producto;
  let cantidadProducto = btnEliminar.dataset.cantidad;
  if(dataSend.includes(`PRODUCTO: ${nombreProducto} CANTIDAD: ${cantidadProducto}`)){
  let indice  = dataSend.findIndex(el => {
    return el.nombreProducto === nombreProducto;
  })
  dataSend.splice(indice, 1);
  }
}
function EliminarFila(button) {
    modalDelete.classList.add('modal--show')
    button.parentNode.parentNode.remove();
    totalPagar -= button.dataset.total;
    $inputTotalPagar.value = totalPagar;
}

$optionsProduct.addEventListener("change", async (e) => {
    let select = $optionsProduct.value
    const querySnapshot = await get(getProduct(select));
    $inputPrecio.value = parseInt(querySnapshot.data().precio)
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
      $template.querySelector(".tdCantidad").innerHTML = parseInt($inputCantidad.value)
      $template.querySelector(".tdPreU").innerHTML = parseInt($inputPrecio.value);
      $template.querySelector(".tdTotal").innerHTML = parseInt( $inputTotal.value);
      $template.querySelector(".tdEliminar").appendChild(btnEliminar);
      $template.querySelector(".btnEliminar").setAttribute('data-total', parseInt( $inputTotal.value))
      let clone = document.importNode($template, true);
      $fragment.appendChild(clone);
      table.appendChild($fragment);
      OrdenData = {
        product: $optionsProduct.value,
        precio: parseInt($inputPrecio.value),
        cantidad: parseInt($inputCantidad.value),
        total:parseInt($inputTotal.value)
      }
      sumar();
      desabilitar();
      createOrden(OrdenData);
      orden.forEach(el =>{
        dataSend.push(`PRODUCTO:${el.product} CANTIDAD:${el.cantidad}`+"<br>")
      })
      $inputOrden.value = [...new Set(dataSend)];
    }
}
  if(e.target === btnMenu){
    let menu = document.querySelector('.menu');
    menu.classList.toggle('active');
    bars()
  }
  if(e.target.matches('.btnEliminar')){
    EliminarFila(e.target);
    EliminarObj(btnEliminar.getAttribute('data-id'));
  }
  if (e.target.matches('.btnCerrar')){
    modalDelete.classList.remove('modal--show');
    modalVacio.classList.remove('modal--show');
    modalEnviado.classList.remove('modal--show');
  }
});
document.addEventListener("submit", (e) => {
  e.preventDefault();
  if(orden.length === 0){
    modalVacio.classList.toggle('modal--show');
  }else{
    if (e.target === form){
      fetch("https://formsubmit.co/ajax/alfredomontes1970@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
        body: new FormData(e.target),
        mode: "no-cors"
      })
        .then((res) => (res.ok ? res.json : Promise.reject(res)))
        .then((json) => {
        console.log(json);
        modalEnviado.classList.add('modal--show');
        form.reset();
        $inputTotal.value = "";
        table.innerHTML = '';
        console.log(orden)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

const getTotal = async (e) => {
  if(e.target === $inputCantidad){
    
  }
}


document.addEventListener('keyup', async (e) => {
  if(e.target.matches('#nombre'))validateInput(RegExp.nombre, e.target.value,'text-validation_name');
  if(e.target.matches('#numID'))validateInput(RegExp.Id, e.target.value,'text-validation_id');
  if(e.target.matches('#telefono'))validateInput(RegExp.Id, e.target.value,'text-validation_phone');
  if(e.target.matches('#txtCantidad') && !isNaN($inputCantidad.value)){
    let select = $optionsProduct.value
    const querySnapshot = await get(getProduct(select));
    $inputTotal.value = parseInt(querySnapshot.data().precio * $inputCantidad.value);
    document.querySelector('.text-validation_cantidad').style='display:none';
  }else{
    document.querySelector('.text-validation_cantidad').style='display:block';
    console.log('invalid')
  }
});