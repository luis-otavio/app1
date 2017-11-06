var app = angular.module('CrudApp', ['ngCookies']);

app.controller('CrudController', function($scope, $http, $cookies){
	// chama API para consulta no banco de dados e atualiza tabela na camada view	
	$scope.login = function(){
		$http.post('http://localhost:3000/logar', $scope.x)
		.then(function (response){
			// response.data contém resultado do select
			if (response.data == 1){
				$cookies.put('usuario', $scope.login.email);
				alert("eu");
				window.location.href = "/crudAluga";
			}
			else {	
				alert("Usuário/Senha inválida");	
			}	
		});
	};
	$scope.registra = function(){
		$http.post('http://localhost:3000/cadastra', $scope.cadastra)
		.then(function (response){
			// response.data contém resultado do select
			if (response.data == 1){
				$cookies.put('usuario', $scope.login.email);
				window.location.href = "http://127.0.0.1:8080/crudAluga.html";
			}
			else {	
				alert("Usuário/Senha inválida");	
			}	
		});
	};
	// chama API para consulta no banco de dados e atualiza tabela na camada view	
	var atualizaTabelaCarro = function(){
		$http.get('http://localhost:3000/consulta/'+$cookies.get('usuario'))
		.then(function (response){
				// response.data contém resultado do select
				$scope.listaCarros = response.data;	
				$scope.usuario = $cookies.get('usuario');
				alert($scope.usuario);		
		});
	};
	// chama API para consulta no banco de dados e atualiza tabela na camada view	
	var atualizaTabelaCompra = function(){
		$http.get('http://localhost:3000/consultaCompra')
		.then(function (response){
				// response.data contém resultado do select
				$scope.listaAluga = response.data;			
		});
	};
	// chama função atualizaTabela
	$scope.consulta = function(){
			atualizaTabelaCarro();
	};
	// chama função atualizaTabela
	$scope.consultaCompra = function(){
			atualizaTabelaCompra();
			atualizaTabelaCarro();
	};
	// chama API - insere no banco de dados e atualiza tabela
	$scope.insere = function(){
		$http.post('http://localhost:3000/insere', $scope.carro)
		.then(function (response){
				atualizaTabelaCarro();
				alert("Inserção com sucesso");
		}
		);
	}
	// chama API - insere no banco de dados e atualiza tabela
	$scope.insereCompra = function(){
		$http.post('http://localhost:3000/insereCompra', $scope.aluga)
		.then(function (response){
				atualizaTabelaCompra();
				alert("Inserção com sucesso");
		}
		);
	}
	// chama API - remove do banco de dados e atualiza tabela
	$scope.remove = function(placa){
		var resposta = confirm("Confirma a exclusão do carro com placa " + placa + "?");
		if (resposta == true){
			$http.delete('http://localhost:3000/remove/' + placa)
			.then(function (response){
				atualizaTabelaCarro();
				alert("Remoção com sucesso");
			}
			);
		}
	}
	// chama API - remove do banco de dados e atualiza tabela
	$scope.removeCompra = function(placa){
		var resposta = confirm("Confirma a exclusão deste carro?");
		if (resposta == true){
			$http.delete('http://localhost:3000/removeCompra/' + placa)
			.then(function (response){
				atualizaTabelaCompra();
				alert("Remoção com sucesso");
			}
			);
		}
	}
	// coloca o carro para edição
	$scope.preparaAtualizacao = function(placa){
		var posicao = retornaIndice(placa);
		$scope.carro = {
			'placa': $scope.listaCarros[posicao].placa,
			'carro': $scope.listaCarros[posicao].carro,
			'diaria': parseFloat($scope.listaCarros[posicao].diaria)
		};
	}
	// coloca o aluguel para edição
	$scope.preparaAtualizacaoCompra = function(placa){
		var posicao = retornaIndiceCompra(placa);
		$scope.aluga = {
			'nome' : $scope.listaAluga[posicao].nome,
			'telefone': $scope.listaAluga[posicao].telefone,
			'placa': $scope.listaAluga[posicao].placa,
			'dia': $scope.listaAluga[posicao].dia,
			'carro': $scope.listaAluga[posicao].carro
		};
	}
	// função que retorna a posição de um carro pela placa
	function retornaIndice(placa){
		var i;
		for (i=0;i<$scope.listaCarros.length;i++){
			if ($scope.listaCarros[i].placa == placa){
				return i; // retorna posição do carro desejado
			}
		}
		return -1;
	}
	// função que retorna a posição de um aluguel pelo seu código 
	function retornaIndiceCompra(placa){
		var i;
		for (i=0;i<$scope.listaAluga.length;i++){
			if ($scope.listaAluga[i].placa == placa){
				return i; // retorna posição do aluguel desejado
			}
		}
		return -1;
	}
	// chama API - atualiza o banco de dados e atualiza tabela
	$scope.atualiza = function(){
		$http.put('http://localhost:3000/atualiza', $scope.carro)
		.then(function (response){
				atualizaTabelaCarro();
				alert("Atualização com sucesso");
		}
		);
	}
	// chama API - atualiza o banco de dados e atualiza tabela
	$scope.atualizaCompra = function(){
		alert("entrou ");
		//alert($scope.aluga.carro)
		$http.put('http://localhost:3000/atualizaCompra', $scope.aluga)
		.then(function (response){
				atualizaTabelaCompra();
				alert("Atualização com sucesso");
		}
		);
	}
});