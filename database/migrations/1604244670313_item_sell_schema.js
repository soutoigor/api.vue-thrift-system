'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemSellSchema extends Schema {
  up () {
    this.create('item_sells', (table) => {
      table.increments()
      table.integer('sell_id')
        .unsigned()
        .references('id')
        .inTable('sells')
      table.integer('item_id')
        .unsigned()
        .references('id')
        .inTable('items')
      table.timestamps()
    })
  }

  down () {
    this.drop('item_sells')
  }
}

module.exports = ItemSellSchema
