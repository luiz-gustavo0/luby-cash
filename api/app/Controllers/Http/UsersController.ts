/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin'
import User from 'App/Models/User'
import AdminValidator from 'App/Validators/AdminValidator'

export default class UsersController {
  public async index({ response, bouncer }: HttpContextContract) {
    try {
      await bouncer.authorize('adminOperations')

      const admins = await Admin.all()

      return response.status(200).json(admins)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    try {
      // await request.validate(AdminValidator)

      await bouncer.authorize('adminOperations')

      const { full_name, email, password, phone, cpf_number, zipcode, city, state, address } =
        request.all()

      const user = await User.create({
        email,
        password,
        role: 'admin',
      })

      const data = {
        user_id: user.id,
        full_name,
        email,
        phone,
        cpf_number,
        zipcode,
        city,
        state,
        address,
      }

      const admin = await Admin.create(data)

      return response.status(201).json(admin)
    } catch (error) {
      console.log('Admin Store', error)
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async update({}: HttpContextContract) {}

  public async delete({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params()

      const admin = await Admin.findByOrFail('user_id', id)

      await admin.delete()

      const user = await User.findByOrFail('id', id)

      await user.delete()

      return response.status(204)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }
}
