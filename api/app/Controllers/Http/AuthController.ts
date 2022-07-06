import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import SessionValidator from 'App/Validators/SessionValidator'

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    try {
      await request.validate(SessionValidator)

      const { email, password } = request.all()

      const user = await User.findByOrFail('email', email)

      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '7days',
      })

      return response.status(200).json({ user, token })
    } catch (error) {
      return response.status(error.status).json({ message: 'Email ou senha inválidos' })
    }
  }
}
