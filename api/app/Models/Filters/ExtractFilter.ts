import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Extract from 'App/Models/Extract'

export default class ExtractFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Extract, Extract>

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }

  public from(value: string) {
    this.$query.where('created_at', '>', value)
  }

  public to(value: string) {
    this.$query.where('created_at', '<', value)
  }
}
