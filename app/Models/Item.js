'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Item extends Model {
  newItem() {
    return this.belongsTo('App/Models/NewItem')
  }
  category() {
    return this.belongsTo('App/Models/Category')
  }
}

module.exports = Item
