import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateClientValidator from 'App/Validators/CreateClientValidator'
import kafkaConfig from 'Config/kafka'
import { Partitioners } from 'kafkajs'

export default class ClientsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      // await request.validate(CreateClientValidator)

      const body = request.only([
        'full_name',
        'email',
        'password',
        'phone',
        'cpf_number',
        'zipcode',
        'city',
        'state',
        'address',
        'average_salary',
      ])

      const client = await User.create({
        email: body.email,
        password: body.password,
        role: 'client',
        token: undefined,
        token_created_at: undefined,
      })

      const data = {
        user_id: client.id,
        full_name: body.full_name,
        email: body.email,
        phone: body.phone,
        cpf_number: body.cpf_number,
        zipcode: body.zipcode,
        city: body.city,
        state: body.state,
        address: body.address,
        average_salary: body.average_salary,
      }

      const newClientProduce = kafkaConfig.producer({
        createPartitioner: Partitioners.LegacyPartitioner,
      })

      await newClientProduce.connect()
      await newClientProduce.send({
        topic: 'create-user',
        messages: [
          {
            value: JSON.stringify(data),
          },
        ],
      })
      await newClientProduce.disconnect()

      return response.status(201).json(client)
    } catch (error) {
      console.error('client', error.message)

      return response.status(error.status).json({ message: error.message })
    }
  }
}
