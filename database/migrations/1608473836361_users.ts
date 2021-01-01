import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)

      table.string('email').notNullable()
      table.string('password', 180).notNullable()
      table.string('name')
      table.string('remember_me')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
