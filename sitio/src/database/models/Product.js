module.exports = (sequelize,dataTypes) => {
    let alias = "Products";
    let cols = {
        id:{
            type:dataTypes.INTEGER(11),
            allowNull:false, //permite nulo?
            autoIncrement: true,
            primaryKey:true
        },
        nombre:{
            type:dataTypes.STRING(100),
            allowNull:false
        },
        precio:{
            type:dataTypes.DECIMAL(5,2),
            allowNull:false
        },
        descuento:{
            type:dataTypes.INTEGER(11),
            allowNull:false
        },
        descripcion:{
            type:dataTypes.STRING(300),
            allowNull:false
        },
        imagenes:{
            type:dataTypes.STRING(100),
            allowNull:false
        },
        id_tienda:{
            type:dataTypes.INTEGER(11)
        },
        id_categoria:{
            type:dataTypes.INTEGER(11)
        }
    }

    let config = {
        tableName : "products",
        timestamps: true,
        underscored: true
    }

    const Product = sequelize.define(alias,cols,config);

    Product.associate = function(models){
        
        Product.belongsTo(models.Stores,{ //le pertenece a una tienda (relacion 1:1)
            as:"tienda",
            foreignKey:"id_tienda"
        })
        
        Product.belongsTo(models.Categories,{ //le pertenece a una categoria (relacion N:1)
            as : "categoria",
            foreignKey:"id_categoria"
        })

        Product.belongsToMany(models.Users,{ //le pertenece a muchos usuarios (relacion N:M)
            as : 'usuarios',
            through : 'carts',
            foreignKey : 'id_producto',
            otherKey : 'id_usuario',
            timestamps : false
        })
    }

    return Product;
}