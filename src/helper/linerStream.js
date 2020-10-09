var stream = require('stream')
var linerStream = new stream.Transform({ objectMode: true })

linerStream._transform = function (chunk, encoding, done) {
    var data = chunk.toString()
    if (this._lastLineData) data = this._lastLineData + data

    var lines = data.split('\n')
    this._lastLineData = lines.splice(lines.length - 1, 1)[0]

     lines.forEach(this.push.bind(this))
    done()
}

linerStream._flush = function (done) {
    if (this._lastLineData) this.push(this._lastLineData)
    this._lastLineData = null
    done()
}

module.exports = linerStream