import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Extract from 'App/Models/Extract'

export default class AdminActionsController {
  public async getExtracts({ request, response, bouncer }: HttpContextContract) {
    try {
      await bouncer.authorize('adminOperations')

      const { id } = request.params()
      const { ...inputs } = request.qs()

      const extracts = await Extract.query().where('client_id', id).filter(inputs)

      return response.status(200).json(extracts)
    } catch (error) {
      console.log(error)

      response.badRequest({ message: 'Erro ao listar extratos' })
    }
  }

  public async getClients({ request, response, bouncer }: HttpContextContract) {
    try {
      let clients
      await bouncer.authorize('adminOperations')

      const { status, from, to } = request.qs()

      if (status && from && to) {
        clients = await Database.query()
          .from('clients')
          .select('*')
          .where('status', status)
          .where('createdAt', '>', from)
          .where('createdAt', '<', to)

        return response.status(200).json(clients)
      }

      if (status && !(from && to)) {
        clients = await Database.query().from('clients').select('*').where('status', status)

        return response.status(200).json(clients)
      }

      if (!status && from && to) {
        clients = await Database.query()
          .from('clients')
          .select('*')
          .where('createdAt', '>', from)
          .where('createdAt', '<', to)

        return response.status(200).json(clients)
      }

      clients = await Database.query().from('clients').select('*')
      return response.status(200).json(clients)
    } catch (error) {
      console.log(error)

      response.badRequest({ message: 'Erro ao listar os clientes' })
    }
  }
}
