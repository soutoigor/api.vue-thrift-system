const Drive = use('Drive')

const getFileBase64 = async (fileName) => {
  const filePath = `uploads/${fileName}`
  const file = await Drive.get(filePath)
  const buff = Buffer.from(file)
  const buffFile = buff.toString('base64')
  return { file: buffFile }
}

module.exports = getFileBase64
