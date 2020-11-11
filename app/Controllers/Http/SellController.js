'use strict'

const Sell = use('App/Models/Sell')
const ItemSell = use('App/Models/ItemSell')
const Item = use('App/Models/Item')
const { validateAll } = use('Validator')

const validateSell = async ({ attributes, isCreate }) => {
  const message = {
    'shipping_price.required': 'Esse campo é obrigatorio',
    'shipping_price.number': 'Frete inválido',
    'date.required': 'Esse campo é obrigatorio',
    'date.date': 'Data inválida',
    'items.required': 'Esse campo é obrigatorio',
    'items.array': 'item_id inválido',
    'client_id.required': 'Esse campo é obrigatorio',
    'client_id.number': 'client_id inválido',
  }

  const validations = {
    shipping_price: 'number',
    date: 'date',
    client_id: 'number',
  }

  if (isCreate) {
    validations.items = 'array'
    const requiredFields = [
      'date',
      'shipping_price',
      'items',
      'client_id',
    ]
    for (const field of requiredFields) {
      validations[field] = `required|${validations[field]}`
    }
  }

  const validation = await validateAll(attributes, validations, message)

  if(validation.fails()) {
    throw { message: validation.messages() }
  }
}

class SellController {

  async index ({ request, response }) {
    try {
      const {
        item_id,
        client_id,
        start_date,
        end_date,
      } = request.get()

      const sellQuery = Sell.query()

      if (item_id) {
        sellQuery.whereHas('itemSell', (builder) => {
          builder.where('item_id', item_id)
        })
      }

      if (client_id) sellQuery.where('client_id', client_id)

      if (start_date && end_date) {
        sellQuery.whereBetween('date', [start_date, end_date])
      }

      return sellQuery
        .with('itemSell.item')
        .with('client')
        .fetch()
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async store ({ request, response }) {
    try {
      await validateSell({ attributes: request.all(), isCreate: true })
      const {
        date,
        shipping_price,
        client_id,
        items,
      } = request.all()

      const itemsToUpdate = await Item
        .query()
        .whereIn('id', items)
        .fetch()

      const soldItems = itemsToUpdate.rows.filter(item => item.sold)

      if (soldItems.length > 0) {
        throw { message: 'Erro, remova os itens que ja foram vendidos' }
      }

      const sell = await Sell.create({
        date,
        shipping_price,
        client_id,
      })
      const itemSells = items.map(item => ({ item_id: item, sell_id: sell.id }))
      await ItemSell.createMany(itemSells)
      await Item
        .query()
        .update({ sold: true })
        .whereIn('id', items)

      return sell
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async update ({ params, request, response }) {
    try {
      await validateSell({ attributes: request.all(), isCreate: false })
      const {
        date,
        shipping_price,
        client_id,
      } = request.all()

      const sell = await Sell.find(params.id)

      if (date) sell.date = date
      if (shipping_price) sell.shipping_price = shipping_price
      if (client_id) sell.client_id = client_id

      await sell.save()

      return sell
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async destroy ({ params, response }) {
    const sell = await Sell.find(params.id)
    if (!sell) {
      return response.status(404).send('sell not found')
    }
    const itemSells = await ItemSell.query().where('sell_id', sell.id).fetch()

    const itemsToUpdate = itemSells.rows.map(({ item_id }) => item_id)

    await Item.query().update({ sold: false }).whereIn('id', itemsToUpdate)
    await ItemSell.query().where('sell_id', sell.id).delete()
    await sell.delete()

    return {}
  }
}

module.exports = SellController
