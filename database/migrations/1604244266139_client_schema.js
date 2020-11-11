'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientSchema extends Schema {
  up () {
    this.create('clients', (table) => {
      table.increments()
      table.string('name', 100).notNullable()
      table.string('contact', 100).nullable()
      table.string('address').nullable()
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('clients')
  }
}

module.exports = ClientSchema
