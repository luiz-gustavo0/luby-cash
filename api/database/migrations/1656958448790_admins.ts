import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'admins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('full_name').notNullable()
      table.string('email').unique().notNullable()
      table.string('phone').notNullable()
      table.string('cpf_number').unique().notNullable()
      table.string('zipcode').notNullable()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.string('address').notNullable()
      table.string('user_id').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
