'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Provider extends Model {
  static boot() {
    super.boot()
    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  newItem() {
    return this.hasMany('App/Models/NewItem')
  }

}

module.exports = Provider
