'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class NewItem extends Model {
  provider() {
    return this.belongsTo('App/Models/Provider')
  }
  item() {
    return this.hasOne('App/Models/Item')
  }
}

module.exports = NewItem
