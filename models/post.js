const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const User = require('./user');

class Post extends Model {}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'Post',
    }
);

Post.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Post;