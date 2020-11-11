'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemSchema extends Schema {
  up () {
    this.create('items', (table) => {
      table.increments()
      table.string('name', 100).notNullable()
      table.string('photo_name').nullable()
      table.float('price').notNullable()
      table.boolean('sold').defaultTo(false)
      table.integer('new_item_id')
        .unsigned()
        .references('id')
        .inTable('new_items')
      table.integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('items')
  }
}

module.exports = ItemSchema
