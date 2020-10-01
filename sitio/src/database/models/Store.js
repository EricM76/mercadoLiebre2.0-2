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
        logo:{
            type:dataTypes.STRING(45)
        },
        id_usuario:{
            type:dataTypes.INTEGER(11),
            allowNull:false
        }
    }
    let config = {
        tablaName: "stores",
        timestamps:true,
        underscored:true
    }
    let Store = sequelize.define(alias,cols,config);

    Store.associate = function(models){
        Store.belongsTo(models.Users,{
            as:"responsable",
            foreignKey:"id_usuario"
        })
        Store.hasMany(models.Products,{
            as:"productos",
            foreingKey:"id_tienda"
            
        })
    }

    return Store;
}
