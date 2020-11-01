'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ItemSell extends Model {
  item() {
    return this.hasMany('App/Models/Item')
  }
  sell() {
    return this.hasMany('App/Models/Sell')
  }
}

module.exports = ItemSell
