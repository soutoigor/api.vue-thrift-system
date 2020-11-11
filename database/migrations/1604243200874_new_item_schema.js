'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NewItemSchema extends Schema {
  up () {
    this.create('new_items', (table) => {
      table.increments()
      table.integer('provider_id')
        .unsigned()
        .references('id')
        .inTable('providers')
      table.date('date').notNullable()
      table.float('buy_price').notNullable()
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('new_items')
  }
}

module.exports = NewItemSchema

