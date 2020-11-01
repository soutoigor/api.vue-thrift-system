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
  async index () {
    const categories = await Category
      .query()
      .orderBy('name', 'asc')
      .fetch()

    return { categories }
  }

  async store ({ request, response }) {
    try {
      await validateCategory(request.all())
      const category = await Category.create(request.only(['name']))
      return category
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async update ({ params, request, response }) {
    try {
      await validateCategory(request.all())
      const { name } = request.all()
      const category = await Category.find(params.id)
      category.name = name
      await category.save()

      return category
    } catch(error) {
      return response.status(400).send(error.message)
    }
  }
}

module.exports = CategoryController
