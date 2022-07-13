/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/login', 'AuthController.login')
Route.post('/reset-password', 'ResetPasswordsController.store')
Route.put('/change-password/:token', 'ResetPasswordsController.update')

Route.group(() => {
  Route.get('/admin/all', 'UsersController.index')
  Route.post('/admin/create', 'UsersController.store')
}).middleware('auth')

Route.post('/client', 'ClientsController.store')
Route.post('/client/pix', 'PixesController.store').middleware('auth')
