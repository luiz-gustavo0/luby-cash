import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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
      response.badRequest({ message: 'Erro ao listar extratos' })
    }
  }
}
