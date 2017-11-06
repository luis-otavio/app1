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
	console.log(" " + req.body.email);
	sess=req.session;
	console.log(" " + req.body.email);
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
app.get('/consulta/:email', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'select * from tb_usuario where email = \'' + req.params.email + '\'';
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
app.get('/consultaCompra', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'select a.*,c.carro from tb_aluga a '
			sql += 'inner join tb_carro c on(a.placa = c.placa) '
			sql += 'order by a.nome';
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
		var sql = 'insert into tb_carro values ( \'' + req.body.placa + 
				  '\',\'' + req.body.carro + 
				  '\',' + req.body.diaria + ')';
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
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'insert into tb_aluga values ( \'' + req.body.nome + 
				  '\', \''+ req.body.telefone + 
				  '\',\'' + req.body.placa + 
				  '\', '+ req.body.dia + ')';
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
app.delete('/remove/:placa', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'delete from tb_carro where placa = \'' + req.params.placa+'\' ';
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

app.delete('/removeCompra/:placa', function (req, res){
	// conecta no banco a partir do canal
	canal.connect(function(erro, conexao, feito){
		if (erro){ // ocorreu um erro
			return console.error('erro ao conectar no banco', erro);
		}
		var sql = 'delete from tb_aluga where placa = \'' + req.params.placa + '\'';
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
				'where  placa =  \'' + req.body.placa + '\'';
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
		var sql = 'update tb_aluga set nome = \'' + req.body.nome + 
				'\', telefone = \'' + req.body.telefone +
				'\', dia = ' + req.body.dia + 
				' where placa =  \'' + req.body.placa + '\'';
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