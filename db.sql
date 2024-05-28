CREATE TABLE student(
	id SERIAL,
	regno BIGINT PRIMARY KEY,
	name VARCHAR(25),
	dept TEXT,
	fname VARCHAR(25),
	dob DATE,
	gender VARCHAR(10),
	phno BIGINT,
	email VARCHAR(30),
	address TEXT,
	photo TEXT
)

CREATE TABLE institution(
	id SERIAL,
	insname TEXT,
	insaddress TEXT, 
	insid VARCHAR(20),
	password VARCHAR(20)
)