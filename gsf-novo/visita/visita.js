$("#gsf_formVisita").submit(function(event){
    var nome = document.forms["gsf-visita"]["gsf-visita-nome"].value;
    var visita_nome = document.getElementById("gsf-visita-nome");
    
    var email = document.forms["gsf-visita"]["gsf-visita-email"].value;
    var visita_email = document.getElementById("gsf-visita-email");
    
    var assunto = document.forms["gsf-visita"]["gsf-visita-assunto"].value;
    var visita_ass = document.getElementById("gsf-visita-assunto");
    
    var mensagem = document.forms["gsf-visita"]["gsf-visita-mensagem"].value;
    var visita_msg = document.getElementById("gsf-visita-mensagem");
    
    var att = document.createAttribute("required");
    if (nome == "") {
        visita_nome.setAttributeNode(att);
        return false;
        // handle the invalid form...
        contatoError();
    }
    if (email == "") {
        visita_email.setAttributeNode(att);
        return false;
        // handle the invalid form...
        contatoError();
    }
    if (assunto == "") {
        visita_ass.setAttributeNode(att);
        return false;
        // handle the invalid form...
        contatoError();
    } 
    if (mensagem == "") {
        visita_msg.setAttributeNode(att);
        return false;
        // handle the invalid form...
        contatoError();
    } 
    if (event.isDefaultPrevented()) {
        // handle the invalid form...
        contatoError();
    } else {
        // everything looks good!
        event.preventDefault();
        submitContato();
    }
});

function submitContato(){
    // Initiate Variables With Form Content
    var nome = $("#gsf-visita-nome").val();
    var email = $("#gsf-visita-email").val();
    var assunto = $("#gsf-visita-assunto").val();
    var mensagem = $("#gsf-visita-mensagem").val();
 
    $.ajax({
        type: "POST",
        url: "contato/contato.php",
        data: "gsf-visita-nome=" + nome + "&gsf-visita-email=" + email + "&gsf-visita-assunto=" + assunto + "&gsf-visita-mensagem=" + mensagem,
        success : function(text){
            if (text == "success"){
                contatoSuccess();
            } else {
                contatoError();
            }
        }
    });
}

function contatoSuccess(){
    $( "#gsf-visita-enviado" ).removeClass( "ed-hide" );
    $( '#gsf-visita-nome, #gsf-visita-email, #gsf-visita-assunto, #gsf-visita-mensagem' ).val('');
}

function contatoError(){
    $( "#gsf-visita-erro" ).removeClass( "ed-hide" );
}

