import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import ExtractFilter from './Filters/ExtractFilter'

export default class Extract extends compose(BaseModel, Filterable) {
  public static $filter = () => ExtractFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public client_id: number

  @column()
  public type: string

  @column()
  public name_destination: string

  @column()
  public transfer_amount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
