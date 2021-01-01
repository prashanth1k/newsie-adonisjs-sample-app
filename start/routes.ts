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
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/login', 'UsersController.login')
Route.get('/login', 'UsersController.showLogin')
Route.post('/register', 'UsersController.register')
Route.get('/register', 'UsersController.showRegister')
Route.post('/logout', 'UsersController.logout')

Route.get('/', 'ArticlesController.index')
Route.on('/about').render('about')

Route.group(() => {
  Route.get('/new', 'ArticlesController.create')
  Route.get('/:id/edit', 'ArticlesController.edit')
  Route.patch('/:id', 'ArticlesController.update')
  Route.post('/', 'ArticlesController.store')
})
  .prefix('articles')
  .middleware('auth')

Route.get('/articles/:id', 'ArticlesController.show')

Route.on('/hello').render('hello')
