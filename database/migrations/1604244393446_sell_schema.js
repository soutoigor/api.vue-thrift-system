'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SellSchema extends Schema {
  up () {
    this.create('sells', (table) => {
      table.increments()
      table.date('date').notNullable()
      table.float('shipping_price').notNullable()
      table.integer('client_id')
        .unsigned()
        .references('id')
        .inTable('clients')
      table.timestamps()
    })
  }

  down () {
    this.drop('sells')
  }
}

module.exports = SellSchema
