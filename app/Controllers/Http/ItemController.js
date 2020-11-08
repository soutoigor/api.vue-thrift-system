'use strict'

const NewItem = use('App/Models/NewItem')
const Item = use('App/Models/Item')
const { validateAll } = use('Validator')

const validateItem = async ({ attributes, isCreate }) => {
  const message = {
    'name.required': 'name é obrigatorio',
    'name.string': 'Nome precisa ser uma String',
    'photo_url.string': 'photo_url precisa ser uma String',
    'date.required': 'date é obrigatorio',
    'date.date': 'Data inválida',
    'buy_price.required': 'Esse campo é obrigatorio',
    'buy_price.number': 'buy_price precisa ser número',
    'provider_id.required': 'provider_id é obrigatorio',
    'new_item_id.required': 'new_item_id é obrigatorio',
    'category_id.required': 'category_id é obrigatorio',
  }

  const validations = {
    name: 'string',
    photo_url: 'string',
    date: 'date',
    buy_price: 'number',
    price: 'number',
    provider_id: 'number',
    category_id: 'number',
  }

  if (isCreate) {
    const requiredFields = [
      'date',
      'buy_price',
      'price',
      'provider_id',
      'category_id',
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

const newItemAttributesName = ['date', 'buy_price', 'provider_id']
const itemAttributesName = ['name', 'photo_url', 'category_id', 'price']

class ItemController {
  async index ({ request }) {
    const {
      name,
      category_id,
      provider_id,
      start_date,
      end_date,
      sold,
     } = request.get()

    const itemsQuery = Item.query()

    if (name) itemsQuery.where('name', 'like', `%${name}%`)
    if (category_id) itemsQuery.where('category_id', category_id)
    if (sold) itemsQuery.where('sold', sold === 'true')

    if (provider_id) {
      itemsQuery.whereHas('newItem.provider', (builder) => {
        builder.where('id', provider_id)
      })
    }

    if (start_date && end_date) {
      itemsQuery.whereHas('newItem', (builder) => {
        builder.whereBetween('date', [start_date, end_date])
      })
    }

    const items = await itemsQuery
      .with('category')
      .with('newItem.provider')
      .fetch()

    return items
  }

  async store ({ request, response }) {
    try {
      await validateItem({ attributes: request.all(), isCreate: true })
      const newItemAttributes = request.only(newItemAttributesName)
      const itemAttributes = request.only(itemAttributesName)

      const newItem = await NewItem.create(newItemAttributes)
      const item = await Item.create({ ...itemAttributes, new_item_id: newItem.id })

      return { item, newItem }
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async show ({ params }) {
    return Item.query()
      .where('id', params.id)
      .with('category')
      .with('newItem.provider')
      .fetch()
  }

  async update ({ params, request, response }) {
    try {
      await validateItem({ attributes: request.all(), isCreate: false })
      const newItemAttributes = request.only(newItemAttributesName)
      const itemAttributes = request.only(itemAttributesName)

      const item = await Item.find(params.id)
      const newItem = await NewItem.find(item.new_item_id)

      item.merge({ ...itemAttributes })
      newItem.merge({ ...newItemAttributes })

      await item.save()
      await newItem.save()

      return { item, newItem }
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }
}

module.exports = ItemController
