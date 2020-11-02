'use strict'

const NewItem = use('App/Models/NewItem')
const Item = use('App/Models/Item')
const { validateAll } = use('Validator')

const validateItem = async (attributes) => {
  const message = {
    'name.required': 'Esse campo é obrigatorio',
    'name.string': 'Nome precisa ser uma String',
    'address.string': 'Endereço precisa ser uma String',
    'telephone.string': 'Telefone precisa ser uma String',
    'telephone.min': 'Telefone inválido',
    'telephone.max': 'Telefone inválido',
    'contact.string': 'Telefone precisa ser uma String',
  }

  const validation = await validateAll(attributes, {
    name: 'required|string',
    address: 'string',
    telephone: 'string|min:8|max:12',
    contact: 'string',
  }, message)

  if(validation.fails()) {
    throw { message: validation.messages() }
  }
}

class ItemController {

  async index ({ request, response }) {
  }

  async store ({ request, response }) {

  }

  async show ({ params, request, response }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = ItemController
