/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Extract from 'App/Models/Extract'
import PixValidator from 'App/Validators/PixValidator'

export default class PixesController {
  public async store({ auth, bouncer, request, response }: HttpContextContract) {
    try {
      await bouncer.authorize('makePix')

      await request.validate(PixValidator)

      const { cpf_destination, transfer_amount } = request.all()
      const client = await auth.use('api').authenticate()

      const clientSender = await Database.query()
        .from('clients')
        .select('*')
        .where({
          user_id: client.id,
        })
        .first()

      const clientRecipient = await Database.query()
        .from('clients')
        .select('*')
        .where({
          cpf_number: cpf_destination,
        })
        .first()

      if (!clientSender || !clientRecipient) {
        return response.notFound({ message: 'Usuário não encontrado' })
      }

      if (clientSender.cpf_number === clientRecipient.cpf_number) {
        return response.badRequest({ message: 'Não pode fazer pix para você mesmo' })
      }

      if (!clientSender.status) {
        return response.badRequest({ message: 'Você não está apto para fazer pix' })
      }

      if (clientSender.current_balance >= transfer_amount) {
        await Database.query()
          .from('clients')
          .where({ user_id: client.id })
          .update({ current_balance: (clientSender.current_balance -= transfer_amount) })

        await Extract.create({
          client_id: clientSender.id,
          type: 'Pix Enviado',
          name_destination: clientRecipient.full_name,
          transfer_amount,
        })

        await Database.query()
          .from('clients')
          .where({ cpf_number: cpf_destination })
          .update({ current_balance: (clientRecipient.current_balance += transfer_amount) })

        await Extract.create({
          client_id: clientRecipient.id,
          type: 'Pix Recebido',
          name_destination: clientSender.full_name,
          transfer_amount,
        })

        return response.status(201).json({ message: 'Pix realizado' })
      } else {
        return response.badRequest({ message: 'Seu saldo não é suficiente' })
      }
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }
}
