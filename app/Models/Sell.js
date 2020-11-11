'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Sell extends Model {
  static boot() {
    super.boot()
    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  client() {
    return this.belongsTo('App/Models/Client').withTrashed()
  }
  itemSell() {
    return this.hasMany('App/Models/ItemSell')
  }
}

module.exports = Sell
