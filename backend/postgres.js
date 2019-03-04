const Sequelize = require('sequelize');

/*exports.sequelize = new Sequelize(
  process.env.DEV ? "postgres://localhost/dashboard?sslmode=disable" : process.env.POSTGRES_URL,
  process.env.DEV ? {} : {dialect: 'postgres', dialectOptions: {ssl: true}}
);*/
const sequelize = new Sequelize('postgres://postgres:aixiaoyao@47.101.197.165:5432/dashboard');

exports.sequelize = sequelize;

exports.NodeMeasurement = sequelize.define('node_measurement', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  node_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
}, {
  indexes: [
    {unique: true, fields: ['node_id', 'date']}
  ]
});

// Create schema if doesn't exist
sequelize.sync();
