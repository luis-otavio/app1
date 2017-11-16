CREATE SEQUENCE carro_cod_seq;

CREATE TABLE tb_carro (
cod_carro	INTEGER DEFAULT NEXTVAL('carro_cod_seq'),
carro		VARCHAR(30),
qtde		INTEGER,
diaria		NUMERIC(6,2),
CONSTRAINT pk_car_cod_carro PRIMARY KEY(cod_carro)
);

ALTER TABLE tb_carro ADD COLUMN qtde INTEGER;

SELECT NEXTVAL('carro_cod_seq');

DROP TABLE tb_carro;

INSERT INTO tb_carro
VALUES
(default, 'BMW X6', 1, 125),
(default, 'Corolla',5, 59);

select * from tb_aluga order by 3

select * from tb_carro order by 3

SELECT *
FROM tb_carro;

INSERT INTO tb_carro
VALUES

DROP TABLE tb_aluga;

CREATE SEQUENCE aluga_id_seq;

SELECT NEXTVAL('aluga_id_seq');

CREATE TABLE tb_aluga(
cod_aluga	INTEGER DEFAULT NEXTVAL('aluga_id_seq'),
email		VARCHAR(50),
cod_carro	INTEGER,
dia		INTEGER,
CONSTRAINT pk_cod_aluga PRIMARY KEY (cod_aluga),
CONSTRAINT fk_email_usuario FOREIGN KEY (email) REFERENCES tb_usuario(email),
CONSTRAINT fk_car_cod_carro FOREIGN KEY(cod_carro) REFERENCES tb_carro(cod_carro)
);

SELECT *
FROM tb_aluga;




INSERT INTO tb_aluga
VALUES
(default, 'vc@vc.com.br', 3, 5);

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

select MD5 ('teste');
CREATE TABLE teste(
cod_usu		INTEGER,
senha		VARCHAR(32)
);

INSERT INTO teste
VALUES
(1, md5('senha'));

select *
from teste;