'use strict'

const Route = use('Route')

Route.post('/user', 'UserController.store')
Route.post('/login', 'UserController.login')
Route.get('/user', 'UserController.show').middleware(['auth'])
Route.get('/sell/total', 'SellController.total').middleware(['auth'])

Route.resource('category', 'CategoryController').apiOnly().middleware(['auth'])
Route.resource('provider', 'ProviderController').apiOnly().middleware(['auth'])
Route.resource('client', 'ClientController').apiOnly().middleware(['auth'])
Route.resource('item', 'ItemController').apiOnly().middleware(['auth'])
Route.resource('item_sell', 'ItemSellController').apiOnly().middleware(['auth'])
Route.resource('upload', 'UploadController').apiOnly().middleware(['auth'])
Route.resource('sell', 'SellController').apiOnly().middleware(['auth'])
