'use strict'

const ItemSell = use('App/Models/ItemSell')
const Sell = use('App/Models/Sell')
const Item = use('App/Models/Item')
const { validateAll } = use('Validator')

class ItemSellController {

  async store ({ request, response }) {
    try {
      const message = {
        'item_id.required': 'Esse campo é obrigatorio',
        'item_id.number': 'item_id invalido',
        'sell_id.required': 'Esse campo é obrigatorio',
        'sell_id.number': 'sell_id inválido',
      }

      const validations = {
        item_id: 'required|number',
        sell_id: 'required|number',
      }

      const validation = await validateAll(request.all(), validations, message)

      if(validation.fails()) {
        throw { message: validation.messages() }
      }

      const { item_id, sell_id } = request.all()
      await ItemSell.create({ item_id, sell_id })

      await Item.query().update({ sold: true }).where('id', item_id)

      return Sell.query().where('id', sell_id).with('itemSell.item').fetch()
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async destroy ({ params, request, response }) {
    const itemSell = await ItemSell.find(params.id)

    await Item.query().update({ sold: false }).where('id', itemSell.item_id)

    await itemSell.delete()

    return {}
  }
}

module.exports = ItemSellController
