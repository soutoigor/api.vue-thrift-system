'use strict'

const getFileBase64 = require('../../../utils/getFileBase64')

const NewItem = use('App/Models/NewItem')
const Item = use('App/Models/Item')
const { validateAll } = use('Validator')

const validateItem = async ({ attributes, isCreate }) => {
  const message = {
    'name.required': 'name é obrigatorio',
    'name.string': 'Nome precisa ser uma String',
    'photo_name.string': 'photo_name precisa ser uma String',
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
    photo_name: 'string',
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
const itemAttributesName = ['name', 'photo_name', 'category_id', 'price']

class ItemController {
  async index ({ request, auth }) {
    const {
      name,
      category_id,
      provider_id,
      start_date,
      end_date,
      sold,
      page = 1,
     } = request.get()

    const itemsQuery = Item.query().where('user_id', auth.user.id)

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
      .paginate(page)

    for (const [index, item] of items.rows.entries()) {
      if (item.photo_name) {
        const { file } = await getFileBase64(item.photo_name)
        items.rows[index].photo = file
      } else {
        items.rows[index].photo = null
      }
    }

    return { products: {
      items: items.rows,
      pages: items.pages,
    }}
  }

  async store ({ request, response , auth}) {
    try {
      await validateItem({ attributes: request.all(), isCreate: true })
      const newItemAttributes = request.only(newItemAttributesName)
      const itemAttributes = request.only(itemAttributesName)

      const newItem = await NewItem.create(newItemAttributes)
      const item = await Item.create({
        ...itemAttributes,
        new_item_id: newItem.id,
        user_id: auth.user.id,
      })

      return { item, newItem }
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async show ({ params, auth }) {
    return Item.query()
      .where('id', params.id)
      .andWhere('user_id', auth.user.id)
      .with('category')
      .with('newItem.provider')
      .fetch()
  }

  async update ({ params, request, response, auth }) {
    try {
      await validateItem({ attributes: request.all(), isCreate: false })
      const newItemAttributes = request.only(newItemAttributesName)
      const itemAttributes = request.only(itemAttributesName)

      const item = await Item.find(params.id)
      if (item.user_id !== auth.user.id) {
        return response.status(403).send('Forbidden')
      }
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

  async destroy ({ params, response, auth }) {
    const item = await Item.find(params.id)

    if (!item) {
      return response.status(404).send('item not found')
    }

    if (item.user_id !== auth.user.id) {
      return response.status(403).send('Forbidden')
    }

    const newItem = await NewItem.find(item.new_item_id)

    await item.delete()
    await newItem.delete()

    return {}
  }
}

module.exports = ItemController
