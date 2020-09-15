# MERCADO LIEBRE 2.0
#### version adaptada para trabajar con MySQL y Sequelize

## Instalación de módulos
### Sequelize
Sequelize: es un ORM (Objet Relational Mapping o Mapeo Objeto-Relacional) para Nodejs que nos permitirá agilizar el desarrollo para trabajar con MySQL.

- Vamos a hacer uso del paquete **Sequelize CLI**. Este paquete además de ser necesario para iniciar el proyecto, nos ayudará más adelante a generar migraciones de bases de datos. Lo instalaremos de forma global	

    	npm install sequelize-cli - g
	
-  Vamos a necesitar instalar el paquete **Sequelize**, junto con sus dependencias.

    	npm install sequelize --save

- Por último instalaremos el paquete **mysql2** para poder trabajar con MySQL

    	npm install mysql2 --save

## Establecer rutas y directorios

- Debemos crear un archivo en la carpeta raíz de nuestro proyecto con el nombre: **.sequelizerc**, y copiar en dicho archivo el siguiente código:

	    const path = require('path')
		
		module.exports = {
		  	'config':          path.resolve('database', 'config', 'config.js'),
		  	'migrations-path': path.resolve('database', 'migrations'),
		  	'models-path':     path.resolve('database', 'models'),
		  	'seeders-path':    path.resolve('database', 'seeders'),
			}

## Inicializar Sequelize en el proyecto

- Con el archivo _.sequelizerc_ creado, podemos iniciar el proyecto tecleando desde la terminal lo siguiente:

    	sequelize init

- Esto nos creará la estructura necesaria para trabajar con nuestro ORM, particularmente el archivo **config.js** el cual deberemos editarlo de conformidad a la configuración de nuestra base de datos.


- **IMPORTANTE: No olvidarse de exportar el modulo!!**

	    module.exports = {
	      "development": {
		    "username": "root",
		    "password": null,
		    "database": "mercado_liebre_v2",
		    "host": "127.0.0.1",
		    "dialect": "mysql"
	      },
	      "test": {
		    "username": "root",
		    "password": null,
		    "database": "database_test",
		    "host": "127.0.0.1",
		    "dialect": "mysql"
	      },
	      "production": {
		    "username": "root",
		    "password": null,
		    "database": "database_production",
		    "host": "127.0.0.1",
		    "dialect": "mysql"
	      }
	    }
