// Guia de API: https://www.wix.com/velo/reference/api-overview/introduction
import wixWindow from 'wix-window';
import {session} from 'wix-storage';

$w.onReady(function () {



});

function calculaIMC(peso, altura) {
  return peso / (altura * altura);
}

function TempoCirurgico() {
	let temp = $w('#tempoCirurgico').value;
	let nota = 0;

	if(temp == "ATE 4 HORAS"){
		nota = 1;
	}else if(temp == "DE 4 A 6 HORAS"){
		nota = 2;
	}else if(temp == "ACIMA DE 6 HORAS"){
		nota= 4;
	}
	return nota;
	
}
function areaCorporal() {
	let temp = $w('#areacorporal').value;
	let nota = 0;

	if(temp == "20%"){
		nota = 1;
	}else if(temp == "DE 20% A 30%"){
		nota = 2;
	}else if(temp == "DE 30% A 40%"){
		nota= 4;
	}
	return nota;
	
}
function fatortromboembolico() {
	let temp = $w('#fatortromboembolicos').value;
		let nota = 0;

	if(temp == "ATE 1 FATOR"){
		nota = 1;
	}else if(temp == "2 FATORES"){
		nota = 2;
	}else if(temp == "3 OU MAIS FATORES"){
		nota= 4;
	}
	return nota;
}
function vigencia(valorTotal) {
	let temp =0;
		if ($w('#vigencia').value == "SIM"){
		temp =  valorTotal*1.5;
	}
	return temp;	
}
function infeccao(valorTotal) {
	let temp = 0;
	if ($w('#infeccao').value == "SIM"){
		temp = valorTotal+470;
	}
	return temp;	
}
function riscocirurgico() {
	
	let temp = $w('#riscocirurgico').value;
	let nota = 0;

	if(temp == "ASA I"){
		nota = 1;
	}else if(temp == "ASA II"){
		nota = 2;
	}else if(temp == "ASA III"){
		nota= 4;
	}
	return nota;
}

function Procedimentos() {
	let procedimento = 1;
	console.log("Procedimento 2: "+$w("#procedimento3").value);
	console.log("Procedimento 2: "+$w("#procedimento2").value);

	if($w("#procedimento2").value != ""){
		if($w("#procedimento2").value != "Nenhum"){
					procedimento = 2;
		}

	if($w("#procedimento3").value != ""){
		if($w("#procedimento3").value != "Nenhum" ){
			procedimento = 4;
		}
		
	}
	}
	console.log("VALOR DO PROCEDIMENTO " + procedimento);
	return procedimento;
	
}

function limpaResultado(){
	$w("#Pontuacao").value = "";
	$w("#Valor").value = "";
	$w("#qrcodeimagem").hide();
	$w("#submitButton").disable();
	$w('#opcaoPagamento').hide();
	$w('#TextoBoleto').hide();
	
}
function imc() {
	let temp;
	if($w('#imcinput').value != "" || Number ($w('#imcinput').value) >= 18 && Number ($w('#imcinput').value) <= 35 ){
		if(Number ($w('#imcinput').value) < 30  ){
			temp = 1;
		}else if (Number ($w('#imcinput').value) < 34){
			temp = 2;
		}else if (Number ($w('#imcinput').value) <= 35){
			temp = 4;
		}
			
	}else{
		limpaResultado();
		bloqueiaresultado();

	}
	
	return temp;
	
}
function calculapontos() {
	let temp = 0;
	
	limpaResultado();
	let datalimite = validaDataProcedimento();
	if(Number($w('#Idade')) < 18){
		console.log("bloqueou por idade menor de 18");
		//bloqueiaresultado();

		return 0;	
	}
	if(datalimite == -1){
		console.log("bloqueou por data limite =1");
		bloqueiaresultado();

		return 0;	
	}else if (datalimite == ~1){
		console.log("somente pix");
	}else if(datalimite == 2){
		$w('#opcaoPagamento').show();
	}

	if($w("#procedimento1").value == "" ||$w('#fatortromboembolicos').value == "" ||$w('#riscocirurgico').value == "" 
	||$w('#tempoCirurgico').value == "" ||$w('#imcinput').value == "" ||$w('#areacorporal').value == ""   ){
		console.log("bloqueou no if final.");
		bloqueiaresultado();

		return 0;
	}else{
		let pontoProcedimento = Number(Procedimentos());
		console.log("procedimento " + pontoProcedimento);
		let pontoIMC = Number(imc());
		let pontoRiscoCirurgico = Number(riscocirurgico());
		let pontoAreaCorporal = Number(areaCorporal());
		let pontoFator = Number(fatortromboembolico());
		let pontoTempoCirurgico = Number(TempoCirurgico());

		temp = pontoAreaCorporal+pontoFator+pontoProcedimento+pontoRiscoCirurgico+pontoTempoCirurgico+pontoIMC
		calculaPreco(temp);
	}
	
	
}
function calculaPreco(pontos){
	console.log("entrou no calcula preço");
	let valor = 0;
	if(pontos <= 9){
		valor = 310;
	}else if(pontos == 10 ){
		valor = 355;
	}else if(pontos == 11){
		valor = 400;
	}else if(pontos == 12){
		valor = 475;
	}else if(pontos == 13){
		valor = 550;
	}else if(pontos == 14){
		valor = 620;
	}else if(pontos == 15){
		valor = 720;
	}else if(pontos == 16){
		valor = 820;
	}else if(pontos == 17){
		valor = 920;
	}else if(pontos > 17){
		console.log("bloqueou por estar acima de 17 pontos");
		bloqueiaresultado();
		return 0;
	}

	if ($w('#infeccao').value == "SIM"){
		valor = valor+470;
	}
	if ($w('#vigencia').value == "SIM"){
		valor =  valor*1.5;
	}
	if($w('#herniaumbilical').value =="SIM"){
		valor = valor+150;
	}
	if($w('#opcaoPagamento').value == 'Pix'){
		valor = valor*0,985;
	}
	$w('#Valor').show();
	$w('#Pontuacao').show();
	$w('#Valor').value = String(valor);
	$w('#Pontuacao').value = String(pontos);
	$w("#qrcodeimagem").show();
	$w("#submitButton").enable();
	$w('#tituloPagamento').text = "Paciente elegível. Verifique o valor da adesão abaixo:"

}
function validaDataProcedimento() {
	let dataProcedimento = new Date($w('#dataprocedimento').value);
	let dataAtual = new Date();
	let dataLimite = new Date();
	let temp= 0;
	dataLimite.setDate(dataAtual.getDate() + 2);
	if(dataProcedimento <= dataAtual){
		temp = 1;
	}else if(dataProcedimento > dataLimite){
		temp =  2;
	}else if(dataProcedimento <= dataLimite && dataProcedimento > dataAtual){
		temp = 1;
	}
	console.log(temp);
	return temp;
	
}

function bloqueiaresultado() {
	$w("#submitButton").disable();
	$w("#Valor").value = "0";
	$w("#Pontuacao").value ="0";
	$w('#opcaoPagamento').hide();
	$w('#TextoBoleto').hide();
	$w("#tituloPagamento").text = "Paciente não elegivel ou Dados incompletos. Atualize a pagina para uma nova tentativa";
	
}
export function alturaInput_change(event) {

	let procedimento = Procedimentos();
	console.log(procedimento);

	if(Number($w('#PesoInput').value) !== 0 && Number($w('#PesoInput').value) < 150 && Number($w('#alturaInput').value) < 3){
		let altura = Number($w('#alturaInput').value); 
		let peso = Number($w('#PesoInput').value);
		let imc = calculaIMC(peso,altura);


		if (imc<35){
			$w("#submitButton").enable();
			$w("#text58").text = "IMC Permitido";
		}
		else if(imc>=35){
			$w("#submitButton").disable();
			$w("#imcinput").style.color = "rgb(255,0,0)";
			$w("#text58").text = "rgb(255,0,0)";
			$w("#text58").text = "IMC não permitido";
			$w("#imcinput").value = imc.toFixed(2);
		}
		$w("#imcinput").value = imc.toFixed(2);
	}else{
		$w("#text58").text = "Valor não aceito";
		$w("#submitButton").disable();
	}

}




export function PesoInput_change(event) {

	console.log("pesoInput_change acionado");
	console.log($w('#PesoInput').value);
	console.log($w('#alturaInput').value);
	let procedimento = Procedimentos();
	console.log(procedimento);


if(Number($w('#alturaInput').value) !== 0 && Number($w('#PesoInput').value) < 150 && Number($w('#alturaInput').value) < 3){
 	let altura = Number($w('#alturaInput').value); 
 	let peso = Number($w('#PesoInput').value);
 	let imc = calculaIMC(peso,altura);

 	if(Number($w('#PesoInput').value) !== 0){
		let altura = Number($w('#alturaInput').value); 
		let peso = Number($w('#PesoInput').value);
		let imc = calculaIMC(peso,altura);

		console.log(altura);
		console.log(peso);

		if (imc<35){
			$w("#submitButton").enable();
			$w("#text58").text = "IMC Permitido";
		}
		else if(imc>=35)
		{
			$w("#submitButton").disable();
			$w("#imcinput").style.color = "rgb(255,0,0)";
			$w("#text58").text = "IMC não permitido";
			$w("#imcinput").value = imc.toFixed(2);
		}

		$w("#imcinput").value = imc.toFixed(2);
	} 


}else{
		$w("#text58").text = "Valor não aceito";
		$w("#submitButton").disable();
	}
}
export function CPF_change(event) {
	let cpfComPontuacao = $w('#CPF').value;
	let cpf = cpfComPontuacao.replace(/\D/g,'');
	console.log("numero recebido: " +cpf);
	if (cpf.length !== 11) {
		console.log("CPF COM MENOS DE DIGITOS INCOMPLETOS:  "+cpf);
		$w('#cpfInvalido').show();
		$w('#CPF').value = "";
		
		return false;
	}

			let soma = 0;
	for (let i = 0; i < 9; i++) {
		soma += parseInt(cpf.charAt(i)) * (10 - i);
		console.log("soma do digito "+i +" x " + (10 - i)+ " igual a: "+ soma);
	}
	let resto = 11 - (soma % 11);
	console.log("O resto da divisão de "+ soma +" dividido por 11 é igual a: "+ resto);
	if (resto === 10 || resto === 11) resto = 0;
	if (resto !== parseInt(cpf.charAt(9))){
		console.log("PRIMEIRO DIGITO INVALIDO"+cpf);
		$w('#cpfInvalido').show();
		$w('#CPF').value = "";
		 return false;
	}
	soma = 0;
	for (let i = 0; i < 10; i++) {
		soma += parseInt(cpf.charAt(i)) * (11 - i);
		console.log("soma do digito "+i +" x " + (11 - i)+ " igual a: "+ soma);
	}
	resto = 11 - (soma % 11);
	console.log("O resto da divisão de "+ soma +" dividido por 11 - 11 é igual a: "+ resto);
	if (resto === 10 || resto === 11) resto = 0;
	if (resto !== parseInt(cpf.charAt(10))){
		console.log("SEGUNDO DIGITO INVALIDO"+cpf);
		$w('#cpfInvalido').show();
		$w('#CPF').value = "";
		return false;
	} 

	$w('#cpfInvalido').hide();
	let cpfComPont = cpf.substring(0,3) + '.' + cpf.substring(3,6) + '.' + cpf.substring(6,9) + '-' + cpf.substring(9);
	console.log(cpfComPont); 
	$w('#CPF').value = cpfComPont;
	return true; // CPF válido
	

}

export function Calculo_click(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here:
	calculapontos();

}


export function riscocirurgico_change(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	limpaResultado();
}


export function fatortromboembolicos_change(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	limpaResultado();
}

export function infeccao_change(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	limpaResultado();
}


export function vigencia_change(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	limpaResultado();
}


export function tempoCirurgico_change(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	limpaResultado();
}


export function procedimento3_change(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	limpaResultado();
}


export function procedimento2_change(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	limpaResultado();
}

export function procedimento1_change(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	limpaResultado();
}


export function imcinput_change(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	limpaResultado();
}

export function datePicker1_change(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	// cria uma data com a data atual
	limpaResultado();



}

export function button23_click(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event

export function imprimir_click(event) {
		let conteudoFormulario = $w("#form1").;
		let janelaImprimir = wixWindow.openLightbox('#formulario');
		janelaImprimir.then.apply.('<html><head><title>Formulário</title></head><body>');
}

function imprimirFormulario() {
		
			
			janelaImprimir.document.write(conteudoFormulario);
			janelaImprimir.document.write('</body></html>');
			janelaImprimir.document.close();
			janelaImprimir.focus();
			janelaImprimir.print();
			janelaImprimir.close();
		}

/**
*	Adds an event handler that runs when an input element's value
 is changed.
	[Read more](https://www.wix.com/corvid/reference/$w.ValueMixin.html#onChange)
*	 @param {$w.Event} event
*/
export function herniaumbilical_change(event) {
	limpaResultado();
}



/**
*	Adds an event handler that runs when an input element's value
 is changed.
	[Read more](https://www.wix.com/corvid/reference/$w.ValueMixin.html#onChange)
*	 @param {$w.Event} event
*/
export function opcaoPagamento_change_1(event) {
	
	let valoranterior = Number ($w('#Valor').value);
	console.log("Valor antes da conta" + String(valoranterior));
	let valor;
	if($w('#opcaoPagamento').value == "BOLETO"){
		$w('#qrcodeimagem').hide();
		$w('#TextoBoleto').show();
		valor = valoranterior*(101.5/100);
		$w('#Valor').value = valor.toFixed(2);
		console.log("Este é o valor após a conta "+ valor.toFixed(2));
	}else if($w('#opcaoPagamento').value == "PIX"){
		$w('#qrcodeimagem').show();
		$w('#TextoBoleto').hide();
		valor = valoranterior*(100/101.5);
		$w('#Valor').value = valor.toFixed(2);
		console.log("Este é o valor após a conta "+ valor.toFixed(2));
	}
}

/**
*	Adds an event handler that runs when the input element receives
input.
	[Read more](https://www.wix.com/corvid/reference/$w.TextInputMixin.html#onInput)
*	 @param {$w.Event} event
*/


/**
*	Adds an event handler that runs when the input element receives
input.
	[Read more](https://www.wix.com/corvid/reference/$w.TextInputMixin.html#onInput)
*	 @param {$w.Event} event
*/
export function DataNascimento_input(event) {

	  let valor = $w('#DataNascimento').value;
  
  // Adicionar a primeira barra após o segundo caractere digitado
  if (valor.length == 2 && !valor.includes('/')) {
    $w('#DataNascimento').value = valor + '/';
  }
  
  // Adicionar a segunda barra após o quinto caractere digitado
  if (valor.length == 5 && !valor.includes('/', 3)) {
   $w('#DataNascimento').value = valor + '/';
  }
}

export function DataNascimento_change(event) {
  limpaResultado();
  let birthdate = $w('#DataNascimento').value;
  console.log("Entrou na função on change data nascimento " +birthdate);
  if(birthdate.length != 10){
	  $w('#text63').show();
	  $w('#DataNascimento').value = "";
	  return 0;
  }else{
	  $w('#text63').hide();
  }
  let ano = Number(birthdate.substr(6,10));
  let premes = birthdate.substr(2,4);
  let mes = Number(premes.replace(/\//g, ""));
  let dia = Number(birthdate.substr(0,2));
  const data = new Date(ano, mes - 1, dia);
  console.log(data);
   
    if(isNaN(ano) || isNaN(mes) || isNaN(dia)){
	  $w('#text63').show();
	  $w('#DataNascimento').value = "";
	  return 0;
  }else if (mes == 2 && dia > 29 || (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8
  || mes == 10 || mes == 12) && dia > 31 || (mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia > 30){
	  $w('#text63').show();
	  $w('#DataNascimento').value = "";

	  return 0;
  }else{
	  $w('#text63').hide();
  }
  console.log("ano: "+ ano +" mês: "+ mes +" dia: "+dia);
  let today = new Date();
  
  let age = today.getFullYear() - Number(ano);
  const monthDifference = today.getMonth() -Number(mes);
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < Number(dia))) {
    age--;
  }

  
if ( age < 18 ){
	$w('#idadeInvalida').show();
	$w('#text63').show();
	//$w('#DataNascimento').value="";
	$w('#Idade').value=String (age);
}else{
	$w('#idadeInvalida').hide();
	$w('#Idade').value = String (age);
}
		

}


/**
*	Adds an event handler that runs when the input element receives
input.
	[Read more](https://www.wix.com/corvid/reference/$w.TextInputMixin.html#onInput)
*	 @param {$w.Event} event
*/
export function horaProcedimento_input(event) {
	  let valor = $w('#horaProcedimento').value;


  
  // Adicionar a primeira barra após o segundo caractere digitado
  	if (valor.length == 2 && !valor.includes(':')) {
    	$w('#horaProcedimento').value = valor + ':';
  	}
}

/**
*	Adds an event handler that runs when an input element's value
 is changed.
	[Read more](https://www.wix.com/corvid/reference/$w.ValueMixin.html#onChange)
*	 @param {$w.Event} event
*/
export function horaProcedimento_change(event) {
	let valor = $w('#horaProcedimento').value;
	let hora = Number(valor.substr(0,2));
	let minutos = Number(valor.substr(3,4));
	console.log("minutos: "+minutos+" horas: "+hora);
	if(valor.length<5 || isNaN(hora) ||isNaN(minutos)|| hora > 23 || minutos > 59 || hora < 0 || minutos < 0){
		$w('#horaProcedimento').value="";
		$w('#text64').show();
	}else{
		$w('#text64').hide();
	}
}

/**
*	Adds an event handler that runs when an input element's value
 is changed.
	[Read more](https://www.wix.com/corvid/reference/$w.ValueMixin.html#onChange)
*	 @param {$w.Event} event
*/
export function cep_change(event) {
	let cep = $w('#cep').value;
	if(cep.length != 8){
		$w('#mensagemCep').show();
		return false;
	}else{
		 $w('#mensagemCep').hide();
		 let cep = $w('#cep').value;
		 pesquisaCep(cep);
 
	}

}


export function cep_input(event) {
	
	let cep = $w('#cep').value;
	cep = cep.replace(/[^0-9]/g, '');

	$w('#cep').value = cep;


}

async function  pesquisaCep(cep) {
	
	let scriptURL;
	scriptURL = `https://viacep.com.br/ws/${cep}/json/`;
	const dados = await fetch(scriptURL);
	const endereco = await dados.json();
	preencherformulario(endereco);
	//preenchimentoFormulario(endereco);
    

}

 async function preencherformulario (dados){
	 $w('#bairro').value = dados.bairro;
	 $w('#rua').value = dados.logradouro;
	 $w('#cidade').value = dados.localidade;
	 $w('#estado').value = dados.uf;

 }
