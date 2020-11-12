'use strict'

const Category = use('App/Models/Category')
const { validateAll } = use('Validator')

const validateCategory = async (attributes) => {
  const message = {
    'name.required': 'Esse campo é obrigatorio',
    'name.string': 'Nome precisa ser uma String',
  }

  const validation = await validateAll(attributes, {
    name: 'required|string',
  }, message)

  if(validation.fails()) {
    throw { message: validation.messages() }
  }
}

class CategoryController {
  async index ({ auth }) {
    const categories = await Category
      .query()
      .where('user_id', auth.user.id)
      .orderBy('name', 'asc')
      .fetch()

    return { categories }
  }

  async store ({ request, response, auth }) {
    try {
      await validateCategory(request.all())
      const { name } = request.all()
      const { id } = auth.user
      const category = await Category.create({ name, user_id: id })
      return category
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async update ({ params, request, response, auth }) {
    try {
      await validateCategory(request.all())
      const { name } = request.all()
      const category = await Category.find(params.id)
      if (category.user_id === auth.user.id) {
        category.name = name
        await category.save()
        return category
      }

      return response.status(403).send('Forbidden')
    } catch(error) {
      return response.status(400).send(error.message)
    }
  }

  async destroy ({ params, response, auth }) {
    const category = await Category.find(params.id)
    if (!category) {
      return response.status(404).send('category not found')
    }
    if (category.user_id !== auth.user.id) {
      return response.status(403).send('Forbidden')
    }
    await category.delete()

    return {}
  }
}

module.exports = CategoryController
