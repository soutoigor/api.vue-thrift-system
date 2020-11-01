'use strict'

const Provider = use('App/Models/Provider')
const { validateAll } = use('Validator')

const validateProvider = async (attributes) => {
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

class ProviderController {
  async index () {
    const providers = await Provider
      .query()
      .orderBy('name', 'asc')
      .fetch()

    return { providers }
  }

  async store ({ request, response }) {
    try {
      await validateProvider(request.all())
      const provider = await Provider.create(request.all())
      return provider
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async update ({ params, request, response }) {
    try {
      await validateProvider(request.all())
      const provider = await Provider.find(params.id)
      provider.merge({ ...request.all() })
      await provider.save()

      return provider
    } catch(error) {
      return response.status(400).send(error.message)
    }
  }
}

module.exports = ProviderController
