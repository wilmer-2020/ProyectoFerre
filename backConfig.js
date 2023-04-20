import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore,collection,getDoc,doc,getDocs } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"
let $optionsProduct = document.getElementById("material");
let $inputCantidad = document.getElementById("txtCantidad");
let $inputPrecio = document.getElementById("txtPrecio");
let $inputTotal = document.getElementById("txtTotal");
let btnEnviar = document.querySelector(".btnEnviar");
let btnAdd = document.querySelector(".buttonAdd");
const firebaseConfig = {
  apiKey: "AIzaSyDynbKZvRnj8d0XwfmUcyQ4d9UOPrnAvA0",
  authDomain: "dbferre-45a40.firebaseapp.com",
  projectId: "dbferre-45a40",
  storageBucket: "dbferre-45a40.appspot.com",
  messagingSenderId: "1085887115769",
  appId: "1:1085887115769:web:45ef41825c6e3cb7b2cd28"
};
export function desabilitar() {
  $inputCantidad.disabled = true;
  $optionsProduct.disabled = true;
  btnAdd.disabled = true;
  $inputCantidad.value = "";
  $inputTotal.value = "";
  $inputPrecio.value = "";
  $optionsProduct.value = "";
}
export function habilitar(){
  $inputCantidad.disabled = false;
  $optionsProduct.disabled = false;
  btnEnviar.disabled = false;
  btnAdd.disabled = false;
}
const app = initializeApp(firebaseConfig);
const db = getFirestore()
export let get = getDoc
export const documentos =  await getDocs(collection(db, "productos"));
export const getProduct = (data) => doc(db,'productos',data);