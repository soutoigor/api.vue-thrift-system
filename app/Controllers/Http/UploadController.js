'use strict'

const Helpers = use('Helpers')
const cuid = require('cuid')
const getFileBase64 = require('../../../utils/getFileBase64')

const removeFileExtension = file => file.split('.').slice(0, -1).join('.')
const removeSpaces = name => name.replace(/\s/g, '')

class UploadController {
  async store ({ request, response }) {
    const itemImage = request.file('item_image')

    await itemImage.move(Helpers.tmpPath('uploads'), {
      name: `${removeFileExtension(removeSpaces(itemImage.clientName))}_${cuid()}.${itemImage.extname}`,
      overwrite: false,
    })

    if (!itemImage.moved()) {
      return itemImage.error()
    }

    return itemImage
  }

  async show ({ params, response }) {
    const { file } = await getFileBase64(params.id)
    if (file) return response.json({ file })
    return response.status(404).send('file_not_found')
  }
}

module.exports = UploadController
