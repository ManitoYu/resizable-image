# Resizable Image

It can help you create backgrounds that can grow or shrink to fill the available space.

## Example

![example](https://github.com/ManitoYu/resizable-image/blob/master/example.png)

## API

### init(imageURL, dstWidth, dstHeight, top, right, bottom, left, callback)

  + imageURL (string) - url of image
  + dstWidth (integer) - destination width of image
  + dstHeight (integer) - destination height of image
  + top (integer) - distance to top of image
  + right (integer) - distance to right of image
  + bottom (integer) - distance to bottom of image
  + left (integer) - distance to left of image
  + callback (function) - you can get final image bt it

## Usage

This tool is written by UMD norm. So you can use it as follows:

  + NPM
  + RequireJS
  + Script Tag

```html
<script src="/resizable-image/index.js"></script>
<script>
  ResizableImage.init('http://xxx.xxx.xxx/bar.png', 200, 200, 10, 40, 40, 10, (err, image) => {
    if (err) return console.log(err)
    console.log(image) // data:image/png;base64,iVBORw0KGgoAAAANSUh......
  })
</script>
```

## License

MIT
