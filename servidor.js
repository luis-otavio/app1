var express = require('express')
// lidando com session
var session = require('express-session')
var app = express()

var bodyParser = require('body-parser')

var core_use = require('cors');
var pg = require('pg');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/front/views');
app.set('view engine', 'html');
app.use('/front',express.static(__dirname + '/front'));
app.use(core_use());
app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: true}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var sess;

// JSON de configuração de conexão com banco de dados
var config = {
	user: "postgres",
	database: "tb_carro",
	password: "123",
	port: 5432,
	max: 10,
	idleTimeoutMills: 30000,
}
// cria o canal de comunicação com o banco de dados
var canal = new pg.Pool(config);
app.get('/',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('crud.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/crud',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('crud.html');
    } 
    else {
    	res.render('login.html');
    } 
});

app.get('/crudAluga',function(req,res){
    sess=req.session;
    if (sess.email){
    	res.render('crudAluga.html');
    } 
    else {
    	res.render('login.html');
    } 
});
// cria rota para consulta em uma tabela do banco de dados
app.post('/logar', function (req, res){
	sess=req.session;
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'select count(*) as conta from tb_usuario where email = \'' + req.body.email + 
		'\' and senha = \'' + req.body.senha + '\'';
		console.log(sql);
		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				return console.error('Erro na consulta da tabela', erro);
			}
			var conta = resultado.rows[0].conta;
			if (conta == 1){
				sess.email = req.body.email;
			}
			res.json(conta); // retorna ao cliente as linhas do select
		});
	});
});
app.post('/cadastrar', function (req, res){
	canal.connect(function(erro, conexao, feito){
		if (erro){
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'insert into tb_usuario values (\'' + req.body.nome + 
				  '\',' + req.body.cpf + 
				  ',\'' + req.body.email + 
				  '\',' + req.body.senha +
				  ')';
		console.log(sql);
		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				return console.error('Erro nao cadastro de usuario', erro);
			}
			res.json(resultado.rows); // retorna ao cliente o resultado da inserção
		});
	})
});
app.get('/logout',function(req,res){
	
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/');
		}
	});

});
// cria rota para consulta em uma tabela do banco de dados
app.get('/consulta', function (req, res){

	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'select * from tb_carro order by 1';
		console.log(sql);
		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				return console.error('Erro na consulta da tabela', erro);
			}
			res.json(resultado.rows); // retorna ao cliente as linhas do select
		});
	});
});
app.get('/consultaCompra/:email', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'select a.*,c.carro,c.diaria from tb_aluga a '
			sql += 'inner join tb_carro c on(a.cod_carro = c.cod_carro) '
			sql += 'where email = \''  + req.params.email + '\' order by a.cod_aluga';
			console.log(sql);
		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				return console.error('Erro na consulta da tabela', erro);
			}
			res.json(resultado.rows); // retorna ao cliente as linhas do select
		});
	});
});

// cria rota para consulta em uma tabela do banco de dados
app.post('/insere', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'INSERT INTO tb_carro VALUES (default, \'' + req.body.carro +
				  '\', ' + req.body.qtde + ', ' + req.body.diaria + ');';
		console.log(sql);
		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				return console.error('Erro na inserção dos dados', erro);
			}
			res.json(resultado.rows); // retorna ao cliente o resultado da inserção
		});
	});
});

app.post('/insereCompra', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		console.log("x " + req.body.email);
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}

		var sql = 'insert into tb_aluga values (default, \'' + req.body.email + 
				'\', ' + req.body.cod_carro + ', ' + req.body.dia + ')';
		console.log(sql);
		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				return console.error('Erro na inserção dos dados', erro);
			}
			res.json(resultado.rows); // retorna ao cliente o resultado da inserção
		});
	});
});

// cria rota para consulta em uma tabela do banco de dados
app.delete('/remove/:cod_carro', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'delete from tb_carro where cod_carro = \'' + req.params.cod_carro +'\' ';
		console.log(sql);
		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				return console.error('Erro na remoção dos dados', erro);
			}
			res.json(resultado.rows); // retorna ao cliente o resultado da remoção
		});
	});
});

app.delete('/removeCompra/:cod_carro', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'delete from tb_aluga where cod_aluga = \'' + req.params.cod_carro + '\'';
		console.log(sql);

		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				return console.error('Erro na remoção dos dados', erro);
			}
			res.json(resultado.rows); // retorna ao cliente o resultado da remoção
		});
	});
});

// cria rota para consulta em uma tabela do banco de dados
app.put('/atualiza', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'update tb_carro set carro = \'' + req.body.carro + 
				'\', diaria = ' + req.body.diaria + 
				'where  cod_carro =  \'' + req.body.cod_carro + '\'';
		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				return console.error('Erro na atualização dos dados', erro);
			}
			res.json(resultado.rows); // retorna ao cliente o resultado da atualização
		});
	});
});

app.put('/atualizaCompra', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'update tb_aluga set dia = ' + req.body.dia + 
				' where cod_carro =  \'' + req.body.cod_carro + '\'';
		conexao.query(sql, function(erro, resultado){
			feito(); // libera a conexão
			if (erro){
				return console.error('Erro na atualização dos dados', erro);
			}
			res.json(resultado.rows); // retorna ao cliente o resultado da atualização
		});
	});
});
app.listen(3000, function(){
	console.log("SERVIDOR ON");
})