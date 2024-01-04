<?php
if (isset($_POST)){
    error_reporting(0);
    $name = $_POST['nombre'];
    $ID = $_POST['numID'];
    $telefono = $_POST['telefono'];
    $direccion = $_POST['direccion'];
    $orden = $_POST['orden'];
    $domian = $_SERVER['HTTP_HOST'];

    $to= "alfredomontes1970@gmail.com";
    $subject = "Realización de pedido $domian";
    $message="
       <ul>
        <li>Nombre: <b>$name</b></li>
        <li>Numero de Identidad: <b>$ID</b></li>
        <li>Telefono: <b>$telefono</b></li>
        <li>Direccion: <b>$direccion</b></li>
        <li>ORDEN:$orden</li>

       </ul>
    ";

    $headers = "MIME-Version: 1.0\r\n"."Content-Type:text/html;charset=utf8\r\n".
    "From: Envio Automatico no responder <no-reply@$domian>";

    $send_mail = mail($to,$subject,$message,$headers);
    if ($send_mail) {
        $res = [
            'error' => false,
            'message' => "Los datos han sido enviados"
        ]
    }else{
        $res = [
            'error' => true,
            'message' => "Error al enviar los datos"
        ]
    }

    header("Access-Control-Allow-Origin: *")
    header('Content-Type: application/json)');
    echo json_encode($res);
    exit;
}
>