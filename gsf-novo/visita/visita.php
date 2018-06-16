<?php

$error = "";


//nome
if (empty($_POST["ed-contato-nome"])) {
    $error .= "Name is required ";
} else {
    $nome = $_POST["ed-contato-nome"];
}

//email
if (empty($_POST["ed-contato-email"])) {
    $error .= "Email is required ";
} else {
    $email = $_POST["ed-contato-email"];
}

//assunto
if (empty($_POST["ed-contato-assunto"])) {
    $error .= "Assunto is required ";
} else {
    $assunto = $_POST["ed-contato-assunto"];
}

//mensagem
if (empty($_POST["ed-contato-mensagem"])) {
    $error .= "Mensagem is required ";
} else {
    $mensagem = $_POST["ed-contato-mensagem"];
}
 
$To = "embarque@estacaodigitalrio.com.br";
$uglySubject = "[Site | Contato] $assunto";
$Subject='=?UTF-8?B?'.base64_encode($uglySubject).'?=';

$Body .= "<html><body style='width: 690px'><b>$nome</b>, utilizou a área de contato do site querendo saber sobre <b>$assunto</b> e escreveu:<br/><br/>$mensagem<br/><br/>Para retornar este contato temos estas opções: <b>$email</b></body></html>";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-Transfer-Encoding: 8bit" . "\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: $email" . "\r\n";
 
// send email
$success = mail($To, $Subject, $Body, $headers);
 
// redirect to success page
if ($success && $error == ""){
   echo "success";
}else{
    if($error == ""){
        echo "Algo deu errado... Mas deu errado num nível, que é melhor você nos ligar no telefone (21) 9 9636 7232, porque pelo site vai ser difícil.";
    } else {
        echo $error;
    }
}
 
?>