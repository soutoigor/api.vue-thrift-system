'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Sell extends Model {
  client() {
    return this.belongsTo('App/Models/Client')
  }
  itemSell() {
    return this.hasMany('App/Models/ItemSell')
  }
}

module.exports = Sell
