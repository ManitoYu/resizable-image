((name, root, factory) => {
  if (typeof exports === 'object') {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define(factory)
  } else {
    root[name] = factory()
  }
})('ResizableImage', this, () => {
  class ResizableImage {
    /**
     * constructor
     *
     * @param  {string} imageURL
     * @param  {integer} dstWidth
     * @param  {integer} dstHeight
     * @param  {integer} top
     * @param  {integer} right
     * @param  {integer} bottom
     * @param  {integer} left
     * @param  {function} callback
     */
    constructor(imageURL, dstWidth, dstHeight, top, right, bottom, left, callback) {
      this.dstWidth = dstWidth
      this.dstHeight = dstHeight

      this.top = top
      this.left = left
      this.right = right
      this.bottom = bottom

      this._srcCanvas = null
      this._dstCanvas = null

      let image = new Image()
      image.src = imageURL
      image.crossOrigin = ''
      image.onload = () => this._loadImage(image, callback)
      image.onerror = callback
    }

    _loadImage(image, callback) {
      this.srcWidth = image.width
      this.srcHeight = image.height
      this._createContext()
      this._srcCtx.drawImage(image, 0, 0, this.srcWidth, this.srcHeight)

      this.repaint()

      callback(null, this._dstCanvas.toDataURL('image/png'))

      this._dropContext()
    }

    _dropContext() {
      document.body.removeChild(this._srcCanvas)
      document.body.removeChild(this._dstCanvas)
      this._srcCanvas = null
      this._dstCanvas = null
      this._srcCtx = null
      this._dstCtx = null
    }

    _createContext() {
      let srcCanvas = document.createElement('canvas')
      document.body.appendChild(srcCanvas)
      srcCanvas.width = this.srcWidth
      srcCanvas.height = this.srcHeight
      srcCanvas.style.display = 'none'
      this._srcCanvas = srcCanvas

      let dstCanvas = document.createElement('canvas')
      document.body.appendChild(dstCanvas)
      dstCanvas.width = this.dstWidth
      dstCanvas.height = this.dstHeight
      srcCanvas.style.display = 'none'
      this._dstCanvas = dstCanvas

      this._srcCtx = srcCanvas.getContext('2d')
      this._dstCtx = dstCanvas.getContext('2d')
    }

    repaint() {
      const {
        srcWidth,
        srcHeight,
        dstWidth,
        dstHeight,
        top,
        right,
        bottom,
        left,
        _srcCtx,
        _dstCtx
      } = this

      let tileWidth = srcWidth - left - right
      let tileHeight = srcHeight - top - bottom

      let rowTileNum = Math.ceil(dstWidth / tileWidth)
      let colTileNum = Math.ceil(dstHeight / tileHeight)

      if (rowTileNum < 0 || colTileNum < 0) {
        console.log('image size: ', srcWidth, srcHeight)
        console.log('tile size: ', tileWidth, tileHeight)
        throw new Error('args error, maybe some args over the size of image, please check them.')
      }

      // center
      let data = _srcCtx.getImageData(left, top, tileWidth, tileHeight)
      Array(rowTileNum).fill().forEach((m, k) => {
        Array(colTileNum).fill().forEach((n, j) => {
          _dstCtx.putImageData(data, left + k * tileWidth, top + j * tileHeight)
        })
      })

      // top
      data = _srcCtx.getImageData(left, 0, tileWidth, top)
      Array(rowTileNum).fill().forEach((v, k) => {
        _dstCtx.putImageData(data, left + tileWidth * k, 0)
      })

      // right
      data = _srcCtx.getImageData(srcWidth - right, top, right, tileHeight)
      Array(colTileNum).fill().forEach((v, k) => {
        _dstCtx.putImageData(data, dstWidth - right, tileHeight * k)
      })

      // bottom
      data = _srcCtx.getImageData(left, srcHeight - bottom, tileWidth, bottom)
      Array(rowTileNum).fill().forEach((v, k) => {
        _dstCtx.putImageData(data, left + tileWidth * k, dstHeight - bottom)
      })

      // left
      data = _srcCtx.getImageData(0, top, left, tileHeight)
      Array(colTileNum).fill().forEach((v, k) => {
        _dstCtx.putImageData(data, 0, top + tileHeight * k)
      })

      // left top
      data = _srcCtx.getImageData(0, 0, left, top)
      _dstCtx.putImageData(data, 0, 0)

      // right top
      data = _srcCtx.getImageData(srcWidth - right, 0, right, top)
      _dstCtx.putImageData(data, dstWidth - right, 0)

      // right bottom
      data = _srcCtx.getImageData(srcWidth - right, srcHeight - bottom, right, bottom)
      _dstCtx.putImageData(data, dstWidth - right, dstHeight - bottom)

      // left bottom
      data = _srcCtx.getImageData(0, srcHeight - bottom, left, bottom)
      _dstCtx.putImageData(data, 0, dstHeight - bottom)
    }
  }

  ResizableImage.init = (...args) => new ResizableImage(...args)

  return ResizableImage
})
