module.exports = (sequelize, dataTypes) => {
    let alias = "Stores";
    let cols = {
        id:{
            type:dataTypes.INTEGER(11),
            allowNull:false,
            autoIncrement: true,
            primaryKey:true
        },
        nombre:{
            type:dataTypes.STRING(45),
            allowNull:false
        },
        imagen:{
            type:dataTypes.STRING(45)
        },
        id_usuario:{
            type:dataTypes.INTEGER(11),
            allowNull:false
        }
    }
    let config = {
        tablaName: "stores",
        timestamps:false
    }
    let Store = sequelize.define(alias,cols,config);

    Store.associtate = function(models){
        Store.belongsTo(models.Users,{
            as:"responsable",
            foreignKey:"id_usuario"
        })
        Store.belongsToMany(models.Products,{
            as:"productos",
            through:"store_product",
            foreingKey:"id_store",
            otherKey:"id_product",
            timestamps:false
        })
    }

    return Store;
}