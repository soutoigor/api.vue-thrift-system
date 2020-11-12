'use strict'

const Client = use('App/Models/Client')
const { validateAll } = use('Validator')

const validateClient = async ({ attributes, isCreate }) => {
  const message = {
    'name.required': 'Esse campo é obrigatorio',
    'name.string': 'Nome precisa ser uma String',
    'address.string': 'Endereço precisa ser uma String',
    'contact.string': 'Contato precisa ser uma String',
  }

  const validations = {
    name: 'string',
    address: 'string',
    contact: 'string',
  }

  if (isCreate) validations.name = `required|${validations.name}`

  const validation = await validateAll(attributes, validations, message)

  if(validation.fails()) {
    throw { message: validation.messages() }
  }
}

class ClientController {
  async index ({ auth }) {
    const clients = await Client
      .query()
      .where('user_id', auth.user.id)
      .orderBy('name', 'asc')
      .fetch()

    return { clients }
  }

  async store ({ auth, request, response }) {
    try {
      await validateClient({ attributes: request.all(), isCreate: true })
      const client = await Client.create({
        ...request.all(),
        user_id: auth.user.id,
      })
      return client
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  async update ({ params, request, response, auth }) {
    try {
      await validateClient({ attributes: request.all(), isCreate: false })
      const client = await Client.find(params.id)
      if (client.user_id === auth.user.id) {
        client.merge({ ...request.all() })
        await client.save()

        return client
      }

      return response.status(403).send('Forbidden')
    } catch(error) {
      return response.status(400).send(error.message)
    }
  }

  async destroy ({ params, response, auth }) {
    const client = await Client.find(params.id)


    if (!client) {
      return response.status(404).send('client not found')
    }

    if (client.user_id !== auth.user.id) {
      return response.status(403).send('Forbidden')
    }

    await client.delete()

    return {}
  }
}

module.exports = ClientController
