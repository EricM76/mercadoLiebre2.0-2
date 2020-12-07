module.exports = (sequelize, dataTypes) => {
    let alias = "SubCategories";
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
        id_categoria : {
            type:dataTypes.INTEGER(11)
        }
    }
    let config = {
        tablaName: "subcategories",
        timestamps:false
    }
    const SubCategorie = sequelize.define(alias,cols,config);

    SubCategorie.associate = function(models){

        SubCategorie.belongsTo(models.Categories,{
            as:"categoria",
            foreignKey:"id_categoria"
        })

        SubCategorie.hasMany(models.Products,{ 
            as:"productos",
            foreignKey:"id_subcategoria"
        })
    }
    return SubCategorie;
}