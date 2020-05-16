const minPecas = 15, maxPecas = 26, minRetirada = 3, maxRetirada = 6;
var qtdPecas, qtdRetirada, qtdPecasExistentes;
var pecasSelecionadas = [];
var qtdSelecionadas = 1;
var gameMode;
var rad = document.getElementsByClassName("pode");

for (var i = 0; i < rad.length; i++) {
    rad[i].onclick = function() {
      updateGameMode();
    }
  };





// CRIAÇÃO DO JOGO

function criarJogo(){
    criarPecas();
    criarRetirada();
    updateGameMode();
    
}

function updateGameMode(){
    gameMode = document.querySelectorAll('[name=mode]:checked')[0].value;
    
}

document.querySelector(".pode").addEventListener("click", updateGameMode());

function criarPecas(){
    qtdPecas = parseInt (Math.random() * (maxPecas - minPecas) + minPecas);
    qtdPecasExistentes = qtdPecas;
    console.log(qtdPecas);
    var pecas = document.querySelector("#pecas");
    for(i = 0; i < qtdPecas; i++){
        var peca = document.createElement("i");
        var numeroPeca = i+1;
        var idLocal = "peca-" + numeroPeca;
        peca.classList.add('fas');
        peca.classList.add('fa-apple-alt');

        if (i == qtdPecas - 1){
            peca.classList.add('rotten');
        } else{
            peca.classList.add('selectable');
        }

        // peca.classList.add('selectable');
        
        peca.id = idLocal;
        pecas.appendChild(peca);
    }
}

function criarRetirada(){
    qtdRetirada = parseInt (Math.random() * (maxRetirada - minRetirada) + minRetirada);
}








// REGRAS DE NEGÓCIO



$(document).on('click', '.selectable', function(e){
    if (pecasSelecionadas.length < qtdRetirada){
        
        var pecaAtual = document.getElementById(e.target.id);
        pecaAtual.classList.add('selected');
        pecaAtual.classList.remove('selectable');
        
        pecasSelecionadas.push(pecaAtual);
        
    } 

});

$(document).on('click', '.selected', function(e){
    var pecaAtual = document.getElementById(e.target.id);
    pecaAtual.classList.add('selectable');
    pecaAtual.classList.remove('selected');

    
    pecasSelecionadas.splice(pecasSelecionadas.indexOf(pecaAtual), 1);
    
});


$("#comer").click(function(){
    // Ação do usuário
    comer();
    // Ação do jogo
    
    bloquearPecas();
    jogar();
    setTimeout(desbloquearPecas, 1500);
   
});



function comer(){
    qtdPecasExistentes -= pecasSelecionadas.length;

    for(i = 0; i < pecasSelecionadas.length; i++){
        pecasSelecionadas[i].parentNode.removeChild(pecasSelecionadas[i]);       
    }

    while(pecasSelecionadas.length != 0){
        pecasSelecionadas.pop();
    }
    
    console.log(qtdPecasExistentes);
    
    mudarJogador();

    if(qtdPecasExistentes <= 1){
        console.log($("#player").text());
        if($("#player").text() == "Sua vez!"){
            $("#player").text("Você perdeu!");  
       }
       else  if($("#player").text() == "Minha vez!"){
           $("#player").text("Você venceu!");  
       }
        return;
    }

    
    
}

function mudarJogador(){
    if($("#player").text() == "Sua vez!"){
        $("#player").text("Minha vez!");  
   }
   else  if($("#player").text() == "Minha vez!"){
       $("#player").text("Sua vez!");  
   }
   else{
    //    console.error("Erro: " + $("#player").text());
   }
}

function jogar(){
    
   

    if(gameMode == "easy"){
        jogarEasy();
        
    }
    else if(gameMode == "medium"){
        jogarMedium();
    }
    else if(gameMode == "hard"){
        jogarHard();
    }
    else{
        console.error("Erro");
    }
    
    
}

function jogarMedium(){
    let decision =  parseInt (Math.random() * (3 - 1) + 1);
    console.log(decision);
    if(decision == 1){
        jogarEasy();
        console.log("Easy");
    }
    else if(decision == 2){
        jogarHard();
        console.log("Hard");
    }
    else{
        console.error("Erro gerador não escolheu 1 ou 2");
    }
}


function jogarEasy(){
    var qtdARetirar;
    if(qtdRetirada <= qtdPecasExistentes){
        let qtdRetiradaValida = qtdRetirada + 1;        
        qtdARetirar = parseInt (Math.random() * (qtdRetiradaValida - 1) + 1);
    }
    else if(qtdRetirada > qtdPecasExistentes){
        var qtdPecasValidas = qtdPecasExistentes - 1;
        qtdARetirar = parseInt (Math.random() * (qtdPecasValidas - 1) + 1);
    }

    // setTimeout(selecionarPecas, 1000);
    selecionarPecas(qtdARetirar);
    setTimeout(comer,  1000);

    
    
}




function selecionarPecas(qtdARetirar){
    let todasPecas = document.getElementsByClassName("fa-apple-alt");

    while(pecasSelecionadas.length < qtdARetirar){
        let maxIndice = todasPecas.length ;
        let indice = parseInt (Math.random() * (maxIndice - 1));
        inserir(todasPecas[indice]); 
    }
}

function inserir (elemento){
    let index = pecasSelecionadas.indexOf(elemento, 0);
    if (elemento == undefined || elemento.classList.contains("rotten")){
        return;
    }
    if (index == -1){
        elemento.classList.add('selected');
        pecasSelecionadas.push(elemento);
    }
}




function jogarHard(){
    let critico = (qtdPecasExistentes - 1) % (qtdRetirada + 1); 
    if(critico == 0){
        jogarEasy();
    }
    else{
        console.log(critico);
        selecionarPecas(critico);
        setTimeout(comer, 1000);
    }
}

function bloquearPecas(){
    let todasPecas = document.getElementsByClassName("fa-apple-alt");
    for(i = 0; i < todasPecas.length; i++){
        if(todasPecas[i].classList.contains("selectable")){
            todasPecas[i].classList.add('disable');
            todasPecas[i].classList.remove('selectable');
        }
    }
}

function desbloquearPecas(){
    let todasPecas = document.getElementsByClassName("fa-apple-alt");
    for(i = 0; i < todasPecas.length; i++){
        if(todasPecas[i].classList.contains("disable")){
            todasPecas[i].classList.add('selectable');
            todasPecas[i].classList.remove('disable');
        }
    }
}

// ELEMENTOS


$("#rules-click").click(function (){
    window.alert(
        "Aqui há " + qtdPecas +
        " maçãs. \nDurante o jogo cada jogador alternativamente "+
        "pode retirar desde 1 até " + qtdRetirada +
        " delas. \nAquele que ficar com o último perderá. "
    );
});








// MENU



$("#btn-menu").click(function(){
    $("#menu").fadeIn();
    $("#menu").show();
    
    $("#btn-menu").hide();
    $("#btn-close").show();

    console.log("menu aparecendo");
});

$("#btn-close").click(function(){
    $("#menu").fadeOut();
    $("#menu").hide();
    $("#btn-menu").show();
    $("#btn-close").hide();

    console.log("menu sumido");
});
