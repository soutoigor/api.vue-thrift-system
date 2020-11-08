'use strict'

const Drive = use('Drive')
const Helpers = use('Helpers')
const cuid = require('cuid')

class UploadController {

  async store ({ request, response }) {
    const itemImage = request.file('item_image', {
      types: ['image'],
      size: '2mb',
    })

    await itemImage.move(Helpers.tmpPath('uploads'), {
      name: `${itemImage.clientName}_${cuid()}.${itemImage.extname}`,
      overwrite: false,
    })

    if (!itemImage.moved()) {
      return itemImage.error()
    }

    return itemImage
  }

  async show ({ params }) {
    return Drive.getStream(`uploads/${params.id}`)
  }

}

module.exports = UploadController
