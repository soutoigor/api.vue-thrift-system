'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Item extends Model {
  static boot() {
    super.boot()
    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  newItem() {
    return this.belongsTo('App/Models/NewItem')
  }
  category() {
    return this.belongsTo('App/Models/Category').withTrashed()
  }
  itemSell() {
    return this.hasMany('App/Models/ItemSell')
  }
}

module.exports = Item
