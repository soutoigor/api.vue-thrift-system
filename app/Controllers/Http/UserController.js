'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')

class UserController {
  async create({ request, response }) {
    try {

      const message = {
        'name.required': 'Esse campo é obrigatorio',
        'name.min': 'O nome deve ter mais que 2 caracteres'
      }

      const validation = await validateAll(request.all(), {
        name: 'required|min:2',
        email: 'required|email|unique:users',
        admin: 'required|boolean',
        password: 'required|min:6'
      }, message)

      if(validation.fails()) {
        return response.status(401).send({message: validation.messages()})
      }

      const data = request.only(["name", "admin", "email", "password"])

      const user = await User.create(data)

      return user
    } catch (err) {
      return response.status(500).send({ error: `Erro: ${err.message}`})
    }
  }
  async login({ request, response, auth }) {
    const { email, password } = request.all()

    const validationToken = await auth.attempt(email, password)

    return validationToken
  }
}

module.exports = UserController
