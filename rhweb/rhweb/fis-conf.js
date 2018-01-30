fis.match('module/*/*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

//fis.match('*.less', {
//  parser: fis.plugin('less'),
//  rExt: '.css'
//});