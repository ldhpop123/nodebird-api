const { timeStamp } = require('console');
const Sequelize = require('sequelzie');

class Domain extends Sequelize.Model {
    static initiate(sequelize) {
        Domain.init({
            host: {
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('free', 'premium'),
                allowNull: false,
            },
            clientSecret: {
                type: Sequelize.UUID,
                allowNull: false,
            }
        }, {
            sequelize,
            timeStamps: true,
            parnoid: true,
            modelName: 'Domain',
            tableName: 'domains'
        });
    }

    static associate(db) {
        db.Domain.belongsTo(db.User);
    }
};

module.exports = Domain;