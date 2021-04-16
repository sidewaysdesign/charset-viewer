var Deploy = require('ftp-deploy')
var ftpDeploy = new Deploy()

// sidewaysdesign.com//home/zippy/sidewaysdesign.com/glyphworks
sftp: var config = {
  host: 'ftp.sidewaysdesign.com',
  user: 'zippy',
  password: 'DogPizza7?Arf',
  port: 22,
  localRoot: __dirname + '/build',
  remoteRoot: '/home/zippy/sidewaysdesign.com/glyphworks',
  include: ['*'],
  deleteRemote: false,
  forcePasv: true,
  sftp: true,
  replace: true
}
ftpDeploy.deploy(config, function (err, res) {
  if (err) console.log(err)
  else console.log('finished:', res)
})
ftpDeploy.on('uploading', function (data) {
  data.totalFilesCount
  data.transferredFileCount
  data.filename
})
ftpDeploy.on('uploaded', function (data) {
  console.log(data)
})
ftpDeploy.on('log', function (data) {
  console.log(data)
})
ftpDeploy.on('upload-error', function (data) {
  console.log(data.err)
})
// sftp://sidewaysdesign.com/home/zippy/sidewaysdesign.com/glyphworks
