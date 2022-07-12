import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Admin from 'App/Models/Admin'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    const user = await User.create({
      email: 'admin@email.com',
      password: '123456',
      role: 'admin',
    })

    await Admin.create({
      user_id: user.id,
      full_name: 'Admin Lubycash',
      email: user.email,
      cpf_number: '32145678900',
      phone: '998999899',
      zipcode: '37262000',
      city: 'Santo Antônio',
      state: 'MG',
      address: 'Rua da Felicidade',
    })
  }
}
