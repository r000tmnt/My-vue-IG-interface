const { useCssModule } = require("vue");

module.exports={
    devServer: {https: true},
    publicPath: process.env.NODE_ENV === 'production'
    ? '/My-vue-IG-interface/'
    : '/'
}