const express = require('express');
const CopieFichiers = require("./helper/CopieFichiers")

const app = express();

app.use('/start', (req, res, next) => {
  // Y:\\main\\PSVL (Macoweb)\\WCRS\\CS.NET\\csNETsWCRS301
    const origine = "Y:\\main\\PSVL (Macoweb)\\WCRS\\CS.NET\\csNETsWCRS301"
  //  const origine = "Y:\\main"
  const dest = "C:\\Users\\dhuyet-at\\Desktop\\WikiPOC\\content\\en"

  const helper = new CopieFichiers(dest)
  helper.start(origine)

});
module.exports = app;