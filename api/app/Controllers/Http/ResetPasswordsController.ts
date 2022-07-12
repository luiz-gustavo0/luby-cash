import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

export default class ResetPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    const { email } = request.all()

    try {
      const user = await User.findByOrFail('email', email)

      const token = uuidv4()
      const tokenExpirationTime = new Date()

      user.token = token
      user.token_created_at = tokenExpirationTime

      await user.save()

      await Mail.send((message) => {
        message
          .from('lubycash@mail.com.br')
          .to(user.email)
          .subject('Redefinir senha')
          .htmlView('emails/reset_password', { token })
      })

      return response.status(200).json(user)
    } catch (error) {
      console.log('Reset password', error)
      return response.notFound({ message: 'Usuário não encontrado' })
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const { token } = request.params()

    try {
      const user = await User.findByOrFail('token', token)
      const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).json({ message: 'Token expirado, gere um novo' })
      }

      const { password } = request.all()

      user.password = password
      user.token = undefined
      user.token_created_at = undefined

      await user.save()

      return response.status(200).json(user)
    } catch (error) {
      return response.notFound({ message: 'Usuário não encontrado' })
    }
  }
}
