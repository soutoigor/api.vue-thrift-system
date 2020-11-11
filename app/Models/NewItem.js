'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class NewItem extends Model {
  static boot() {
    super.boot()
    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  provider() {
    return this.belongsTo('App/Models/Provider').withTrashed()
  }
  item() {
    return this.hasOne('App/Models/Item')
  }
}

module.exports = NewItem
