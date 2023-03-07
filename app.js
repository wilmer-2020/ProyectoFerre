document.addEventListener('DOMContentLoaded',getAll);
let $fragment = document.createDocumentFragment();
let $optionsType = document.getElementById('tipo').querySelector("option");
let $optionsProduct = document.getElementById('material');
let $inputCantidad = document.getElementById('txtCantidad')
let $inputPrecio = document.getElementById('txtPrecio')
let $inputTotal = document.getElementById('txtTotal')
async function getAll() {
    if($optionsType.label === "construccion"){  
        let res = await fetch('http://localhost:5000/Construccion');
        let json = await res.json();
        console.log(json);
    json.forEach(el => {
        let $option = document.createElement('option');
        $option.setAttribute("label", el.name);
        $option.setAttribute("value", el.name);
        let clone = document.importNode($option,true);
        $fragment.appendChild(clone);
        console.log(el);
    });
    $optionsProduct.appendChild($fragment);
    }else{
        console.log("error");
    }
}
$inputCantidad.addEventListener('keypress', async e => {
    let res = await fetch('http://localhost:5000/Construccion');
    let json = await res.json();
    json.forEach(el => {
        if($optionsProduct.value === el.name){
            let total = $inputCantidad.value * el.precioUnitario
            console.log(total);
            $inputTotal.value = total;
        }
    });
});

$optionsProduct.addEventListener('change', async e => {
    let res = await fetch('http://localhost:5000/Construccion');
    let json = await res.json();
    $inputCantidad.value = "";
    $inputTotal.value = "";
    json.forEach(el => {
        if($optionsProduct.value === el.name){
            $inputPrecio.value = el.precioUnitario
        }
    });
});
