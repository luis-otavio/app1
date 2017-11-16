var app = angular.module('CrudApp', ['ngCookies']);

app.controller('CrudController', function($scope, $http, $cookies){
	// chama API para consulta no banco de dados e atualiza tabela na camada view	
	$scope.login = function(){
		$http.post('http://localhost:3000/logar', $scope.x)
		.then(function (response){
			// response.data contém resultado do select
			if (response.data == 1){
				
				$cookies.put('usuario', $scope.x.email);
				
				window.location.href = "/crudAluga";
			}
			else {	
				alert("Usuário/Senha inválida");	
			}	
		});
	};
	$scope.cadastro = function(){
		$http.post('http://localhost:3000/cadastro', $scope.cadastra)
		.then(function (response){
			// response.data contém resultado do select
			if (response.data == 1){
				$cookies.put('usuario', $scope.login.email);
				window.location.href = "/crud.html";
			}
			else {	
				alert("Usuário/Senha inválida");	
			}	
		});
	};
	// chama API para consulta no banco de dados e atualiza tabela na camada view	
	var atualizaTabelaCarro = function(){
		$http.get('http://localhost:3000/consulta')
		.then(function (response){
				// response.data contém resultado do select
				$scope.listaCarros = response.data;	
				$scope.usuario = $cookies.get('usuario');		
		});
	};
	// chama API para consulta no banco de dados e atualiza tabela na camada view	
	var atualizaTabelaCompra = function(){
		var email = $cookies.get('usuario');
		$http.get('http://localhost:3000/consultaCompra/'+email)
		.then(function (response){
				// response.data contém resultado do select
				$scope.listaAluga = response.data;
				$scope.usuario = $cookies.get('usuario');		
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
		$scope.aluga.email = $cookies.get('usuario');
		$http.post('http://localhost:3000/insereCompra', $scope.aluga)
		.then(function (response){
				atualizaTabelaCompra();
				alert("Inserção com sucesso");
		}
		);
	}
	// chama API - remove do banco de dados e atualiza tabela
	$scope.remove = function(cod_carro){
		var resposta = confirm("Confirma a exclusão do carro com código " + cod_carro + "?");
		if (resposta == true){
			$http.delete('http://localhost:3000/remove/' + cod_carro)
			.then(function (response){
				atualizaTabelaCarro();
				alert("Remoção com sucesso");
			}
			);
		}
	}
	// chama API - remove do banco de dados e atualiza tabela
	$scope.removeCompra = function(cod_carro){
		var resposta = confirm("Confirma a exclusão deste carro?");
		if (resposta == true){
			$http.delete('http://localhost:3000/removeCompra/' + cod_carro)
			.then(function (response){
				atualizaTabelaCompra();
				alert("Remoção com sucesso");
			}
			);
		}
	}
	// coloca o carro para edição
	$scope.preparaAtualizacao = function(cod_carro){
		var posicao = retornaIndice(cod_carro);
		$scope.carro = {
			'cod_carro': $scope.listaCarros[posicao].cod_,
			'carro': $scope.listaCarros[posicao].carro,
			'diaria': parseFloat($scope.listaCarros[posicao].diaria)
		};
	}
	// coloca o aluguel para edição
	$scope.preparaAtualizacaoCompra = function(cod_carro){
		var posicao = retornaIndiceCompra(cod_carro);
		$scope.aluga = {
			'cod_carro': $scope.listaAluga[posicao].cod_aluga,
			'carro': $scope.listaAluga[posicao].carro,
			'dia': $scope.listaAluga[posicao].dia,
			'preco': $scope.listaAluga[posicao].preco
		};
	}
	// função que retorna a posição de um carro pela cod_carro
	function retornaIndice(cod_carro){
		var i;
		for (i=0;i<$scope.listaCarros.length;i++){
			if ($scope.listaCarros[i].cod_carro == cod_carro){
				return i; // retorna posição do carro desejado
			}
		}
		return -1;
	}
	// função que retorna a posição de um aluguel pelo seu código 
	function retornaIndiceCompra(cod_carro){

		var i;
		for (i=0;i<$scope.listaAluga.length;i++){
			if ($scope.listaAluga[i].cod_carro == cod_carro){
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
		//alert($scope.aluga.carro)
		$http.put('http://localhost:3000/atualizaCompra', $scope.aluga)
		.then(function (response){
				atualizaTabelaCompra();
				alert("Atualização com sucesso");
		}
		);
	}

});