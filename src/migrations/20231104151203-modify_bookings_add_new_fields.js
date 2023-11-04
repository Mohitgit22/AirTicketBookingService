'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn(
       'Bookings' ,//1st aparameter of addcolumn in which table you want to add the colomn
        'noOfSeats',  //2nd ius column name u want to add
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1
        }
    );
    await queryInterface.addColumn(
       'Bookings' ,//1st aparameter of addcolumn in which table you want to add the colomn
        'totalCost',  //2nd ius column name u want to add
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Bookings', 'noOfSeats');
    await queryInterface.removeColumn('Bookings', 'totalCost');
  }
};
