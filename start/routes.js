'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/user', 'UserController.create')
Route.post('/login', 'UserController.login')

Route.resource('category', 'CategoryController').apiOnly().middleware(['auth'])
Route.resource('provider', 'ProviderController').apiOnly().middleware(['auth'])
Route.resource('client', 'ClientController').apiOnly().middleware(['auth'])
Route.resource('item', 'ItemController').apiOnly().middleware(['auth'])
