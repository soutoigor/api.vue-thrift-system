'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
  static boot() {
    super.boot()
    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  product() {
    return this.hasMany('App/Models/Product')
  }
  item() {
    return this.hasMany('App/Models/Item')
  }
}

module.exports = Category
