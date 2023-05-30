import { 
  getProduct, get,documentos
} from "./backConfig.js";
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
let table = document.querySelector(".table");
let id = Date.now().toString()+Math.random().toString(30).substring(2);
let select = $optionsProduct.value.toLowerCase();
let total = 0;
let orden = [];
let OrdenData ; 
const dataSend = [];
const RegExp = {
  nombre: /^[a-zA-Z\s]+$/,
  Id:/^[0-9\-]+$/,
}
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
      `PRODUCTO: ${JSON.stringify(orden[i].product)} -- CANTIDAD: ${JSON.stringify(parseInt(orden[i].cantidad))}`
    );
  }
  $inputOrden.value = [...new Set(dataSend)];
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

function sumar() {
  total += parseInt($inputTotal.value);
  $inputTotalPagar.value = total;
}

function bars() {
  bar1.classList.toggle("active");
  bar2.classList.toggle("active");
  bar3.classList.toggle("active");
}


$optionsProduct.addEventListener("change", async (e) => {
    const querySnapshot = await get(getProduct(select));
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
      $template.querySelector(".tdEliminar").appendChild(btnEliminar)
      let clone = document.importNode($template, true);
      $fragment.appendChild(clone);
      table.appendChild($fragment);
      btnEliminar.setAttribute('data-id',id)
      OrdenData = {
        id,
        product: $optionsProduct.value,
        precio: $inputPrecio.value,
        cantidad: $inputCantidad.value,
      };
      createOrden(OrdenData);
      sumar();
      desabilitar();
    }
  }
  if(e.target === btnMenu){
    let menu = document.querySelector('.menu');
    menu.classList.toggle('active');
    bars()
  }
  if(e.target.matches('.btnEliminar')){
    let message = confirm("Esta seguro que quiere eliminar esto");
    if (message) {
       if(OrdenData.id === btnEliminar.dataset.id){
        e.target.parentNode.parentNode.remove();
        let indice = orden.findIndex(el => el.id === OrdenData.id)
        if(indice !== -1)orden.splice(indice, 1);
        console.log(orden);
      }else return
    }
  }
  
});
document.addEventListener("submit", (e) => {
  e.preventDefault();
  if(dataSend.length === 0){
    return alert('Realize el pedido')
  }else{
    if (e.target === form){
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
    const querySnapshot = await get(getProduct(select));
    $inputTotal.value = querySnapshot.data().precio * $inputCantidad.value
  }
});
