'use strict'

const Provider = use('App/Models/Provider')
const { validateAll } = use('Validator')

const validateProvider = async ({ attributes, isCreate }) => {
  const message = {
    'name.required': 'Esse campo é obrigatorio',
    'name.string': 'Nome precisa ser uma String',
    'address.string': 'Endereço precisa ser uma String',
    'telephone.string': 'Telefone precisa ser uma String',
    'telephone.min': 'Telefone inválido',
    'telephone.max': 'Telefone inválido',
    'contact.string': 'Contato precisa ser uma String',
  }

  const validations = {
    name: 'string',
    address: 'string',
    telephone: 'string|min:8|max:12',
    contact: 'string',
  }

  if (isCreate) validations.name = `required|${validations.name}`

  const validation = await validateAll(attributes, validations, message)

  if(validation.fails()) {
    throw { message: validation.messages() }
  }
}

class ProviderController {
  async index ({ auth }) {
    const providers = await Provider
      .query()
      .where('user_id', auth.user.id)
      .orderBy('name', 'asc')
      .fetch()

    return { providers }
  }

  async store ({ request, response, auth }) {
    try {
      await validateProvider({ attributes: request.all(), isCreate: true })
      const provider = await Provider.create({
        ...request.all(),
        user_id: auth.user.id,
      })

      return provider
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async update ({ params, request, response, auth }) {
    try {
      await validateProvider({ attributes: request.all(), isCreate: false })
      const provider = await Provider.find(params.id)

      if (provider.user_id !== auth.user.id) {
        return response.status(403).send('Forbidden')
      }

      provider.merge({ ...request.all() })

      await provider.save()

      return provider
    } catch(error) {
      return response.status(400).send(error.message)
    }
  }

  async destroy ({ params, response, auth }) {
    const provider = await Provider.find(params.id)

    if (provider.user_id !== auth.user.id) {
      return response.status(403).send('Forbidden')
    }

    if (!provider) {
      return response.status(404).send('provider not found')
    }

    await provider.delete()

    return {}
  }
}

module.exports = ProviderController
