'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Provider extends Model {
  newItem() {
    return this.hasMany('App/Models/NewItem')
  }
}

module.exports = Provider
