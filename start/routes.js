'use strict'

const Route = use('Route')

Route.post('/user', 'UserController.create')
Route.post('/login', 'UserController.login')

Route.resource('category', 'CategoryController').apiOnly().middleware(['auth'])
Route.resource('provider', 'ProviderController').apiOnly().middleware(['auth'])
Route.resource('client', 'ClientController').apiOnly().middleware(['auth'])
Route.resource('item', 'ItemController').apiOnly().middleware(['auth'])
Route.resource('sell', 'SellController').apiOnly().middleware(['auth'])
Route.resource('item_sell', 'ItemSellController').apiOnly().middleware(['auth'])
Route.resource('upload', 'UploadController').apiOnly().middleware(['auth'])
