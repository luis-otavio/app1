CREATE TABLE tb_carro (
placa		VARCHAR(8),
carro		VARCHAR(30),
diaria		NUMERIC,
CONSTRAINT pk_car_placa PRIMARY KEY(placa));

INSERT INTO tb_carro
VALUES
('JDR5678', 'BMW X6', 125),
('NPM1253', 'Corolla',59);

select * from tb_aluga order by 3

select * from tb_carro order by 3

SELECT *
FROM tb_carro;

INSERT INTO tb_carro
VALUES

DROP TABLE tb_aluga;

CREATE TABLE tb_aluga(
cod_aluga	INTEGER,
email		VARCHAR(50),
placa		VARCHAR(8),
dia		INTEGER,
CONSTRAINT pk_cod_aluga PRIMARY KEY (cod_aluga),
CONSTRAINT fk_email_usuario FOREIGN KEY (email) REFERENCES tb_usuario(email),
CONSTRAINT fk_car_placa FOREIGN KEY(placa) REFERENCES tb_carro(placa)
);

SELECT *
FROM tb_aluga;



INSERT INTO tb_aluga
VALUES
(1, 'vc@vc.com.br', 'JDR5678', 3);

CREATE TABLE tb_usuario(
nome		VARCHAR(60) CONSTRAINT nn_nome_usuario NOT NULL,
cpf		INTEGER CONSTRAINT nn_cpf_usuario NOT NULL,
email		VARCHAR(50) CONSTRAINT nn_email_usuario NOT NULL,
senha		VARCHAR(50) CONSTRAINT nn_senha_usuario NOT NULL,
nascimento 	DATE CONSTRAINT nn_nascimento_usuario NOT NULL,
genero		INTEGER,
rua		VARCHAR(99),
numero		INTEGER,
bairro		VARCHAR(40),
cidade		VARCHAR(40),
estado		VARCHAR(40),
CONSTRAINT pk_email_usu PRIMARY KEY (email)
);

INSERT INTO tb_usuario
VALUES
('luis', '123', 'eu@eu.com.br', 'senhaeu', '23/02/1994', '1', 'Rua', '123', 'Bairro', 'Cidade', 'Estado');

SELECT *
FROM tb_usuario;

DROP TABLE tb_usuario;