# MERCADO LIEBRE 2.0
#### version adaptada para trabajar con MySQL y Sequelize

## Instalación de módulos
### Sequelize
Sequelize: es un ORM (Objet Relational Mapping o Mapeo Objeto-Relacional) para Nodejs que nos permitirá agilizar el desarrollo para trabajar con MySQL.

- Vamos a hacer uso del paquete **Sequelize CLI**. Este paquete además de ser necesario para iniciar el proyecto, nos ayudará más adelante a generar migraciones de bases de datos. Lo instalaremos de forma global	

		npm install sequelize-cli -g
	
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
## Crear los modelos
- Creamos un archivo por **entidad** que en la base de datos es representada por una tabla. Por convención se nombran con la primera letra en mayúscula, en singular y preferentemente en ingles, por ejemplo: **User.js**. Los mismos se guarda en la carpeta _models_ de la carpeta _database_ denuestro proyecto.

- En el archivo se exporta una función que recibe dos parámetros: **sequelize** y **dataTypes**

	    module.exports = (sequelize, dataTypes) => {
	    
			//codigo
	    
		}

- Dentro de la función se declara una constante que lleva el nombre del modelo que representa a la tabla, por ejemplo: **User** que recibe como valor la función **define()** de _sequelize_ haciendo un _return_ de la misma.

	    module.exports = (sequelize, dataTypes) => {
	    	
			const User = sequelize.define();

			return User;
	    
		}

- El método _define()_ recibe tres parámetros:
	- El alias de la tabla (el plural del modelo),
	- Las columnas que la componen, la mismas se pasan en como un objeto literal cuyas propiedades corresponden al nombre de cada una de ellas, recibiendo como valor otro objeto literal con cuyas propiedades son el tipo de datos y las restricciones que esta tenga, y por último
	- La configuración del Modelo, que es un objeto literal que por lo menos lleva dos propiedades: el _nombre_ de la tabla, que si el nombre del archivo está en ingles, sequelize infiere que la tabla es el plural del mismo y si es así no sería necesario definirlo y la configuración de los **_timestamps_** que si estos campos no estuviesen en la tabla, debe darle el valor **_false_**

- Es una buena práctica  declarar en variables dichos parámetros para luego usarlos cuando se defina la constante.Así quedaría el modelo completo:

		module.exports = (sequelize, dataTypes) => {
		    let alias = "Users";
		    let cols = {
		        id:{
		            type:dataTypes.INTEGER(11),
		            allowNull:false, //permite nulo?
		            autoIncrement: true,
		            primaryKey:true
		        },
		        nombre:{
		            type:dataTypes.STRING(45),
		            allowNull:false
		        },
		        apellido:{
		            type:dataTypes.STRING(45),
		            allowNull:false
		        },
		        email:{
		            type:dataTypes.STRING(45),
		            allowNull:false,
		            unique:true
		        },
		        password:{
		            type:dataTypes.STRING(100),
		            allowNull:false
		        },
		        fecha:{
		            type:dataTypes.DATEONLY()
		        },
		        avatar:{
		            type:dataTypes.STRING(45)
		        },
		        direccion:{
		            type:dataTypes.STRING(45)
		        },
		        ciudad:{
		            type:dataTypes.STRING(45)
		        },
		        provincia:{
		            type:dataTypes.STRING(45)
		        },
		        rol:{
		            type:dataTypes.STRING(45)
		        }
		    }
		    
			let config = {
		        tableName: "users",
		        timestamps: true
		    }
		    
			const User = sequelize.define(alias,cols,config);
		
		    return User;
		}