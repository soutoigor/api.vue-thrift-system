'use strict'

const getFileBase64 = require('../../../utils/getFileBase64')

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

  async index ({ request, response, auth }) {
    try {
      const {
        item_id,
        client_id,
        start_date,
        end_date,
        start_price,
        end_price,
        category_id,
        provider_id,
        page = 1,
      } = request.get()

      const sellQuery = Sell.query().where('user_id', auth.user.id)

      if (item_id) {
        sellQuery.whereHas('itemSell', (builder) => {
          builder.where('item_id', item_id)
        })
      }

      if (category_id) {
        sellQuery.whereHas('itemSell.item', (builder) => {
          builder.where('category_id', category_id)
        })
      }

      if (provider_id) {
        sellQuery.whereHas('itemSell.item.newItem', (builder) => {
          builder.where('provider_id', provider_id)
        })
      }

      if (client_id) sellQuery.where('client_id', client_id)

      if (start_date && end_date) {
        sellQuery.whereBetween('date', [start_date, end_date])
      }

      if (start_price && end_price) {
        sellQuery.whereBetween('total_price', [start_price, end_price])
      }

      const sales = (await sellQuery
        .with('itemSell.item')
        .with('itemSell.item.category')
        .with('itemSell.item.newItem.provider')
        .with('client')
        .paginate(page)
      ).toJSON()

      for (const sale of sales.data) {
        for (const { item } of sale.itemSell) {
          if (item.photo_name) {
            const { file } = await getFileBase64(item.photo_name)
            item.photo = file
          } else {
            item.photo = null
          }
        }
      }

      return {
        sales: sales.data,
        pages: {
          total: sales.total,
          perPage: sales.perPage,
          page: sales.page,
        },
      }
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async store ({ request, response, auth }) {
    try {
      await validateSell({ attributes: request.all(), isCreate: true })
      const {
        date,
        shipping_price,
        client_id,
        items,
      } = request.all()

      const itemsToUpdate = (await Item
        .query()
        .whereIn('id', items)
        .with('newItem')
        .fetch()).toJSON()

      const soldItems = itemsToUpdate.filter(item => item.sold)

      if (soldItems.length > 0) {
        throw { message: 'Erro, remova os itens que ja foram vendidos' }
      }

      const total_price = itemsToUpdate.reduce((acc, item) => acc + item.price, 0)
      const total_cost = itemsToUpdate.reduce(
        (acc, item) => acc + item.newItem.buy_price,
        0,
      )

      const sell = await Sell.create({
        date,
        shipping_price,
        client_id,
        user_id: auth.user.id,
        total_price,
        total_cost,
      })

      const itemSells = items.map(item => ({
        item_id: item,
        sell_id: sell.id,
        user_id: auth.user.id,
      }))

      await ItemSell.createMany(itemSells)
      await Item
        .query()
        .update({ sold: true })
        .whereIn('id', items)
        .andWhere('user_id', auth.user.id)

      return sell
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async update ({ params, request, response, auth }) {
    try {
      await validateSell({ attributes: request.all(), isCreate: false })
      const {
        date,
        shipping_price,
        client_id,
      } = request.all()

      const sell = await Sell.find(params.id)

      if (sell.user_id !== auth.user.id) {
        return response.status(403).send('Forbidden')
      }

      if (date) sell.date = date
      if (shipping_price) sell.shipping_price = shipping_price
      if (client_id) sell.client_id = client_id

      await sell.save()

      return sell
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async destroy ({ params, response, auth }) {
    const sell = await Sell.find(params.id)

    if (!sell) {
      return response.status(404).send('sell not found')
    }

    if (sell.user_id !== auth.user.id) {
      return response.status(403).send('Forbidden')
    }

    const itemSells = await ItemSell.query().where('sell_id', sell.id).fetch()

    const itemsToUpdate = itemSells.rows.map(({ item_id }) => item_id)

    await Item.query().update({ sold: false }).whereIn('id', itemsToUpdate)
    await ItemSell.query().where('sell_id', sell.id).delete()
    await sell.delete()

    return {}
  }

  async total ({ request, auth }) {
    const {
      start_date,
      end_date,
    } = request.get()

    const sellQuery = Sell.query().where('user_id', auth.user.id)

    if (start_date && end_date) {
      sellQuery.whereBetween('date', [start_date, end_date])
    }

    const items = (await sellQuery.fetch()).toJSON()

    const total = items.reduce(
      (acc, item) => acc + (item.total_price - item.total_cost),
      0,
    )

    return { total }
  }
}

module.exports = SellController
