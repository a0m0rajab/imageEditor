let init = true;
var crop = tinycrop.create({
    parent: '#mount',
    image: 'images/test.JPG',
    bounds: {
        width: '100%',
        height: '100%'
    },
    backgroundColors: ['#fff', '#f0f0f0'],
    selection: {
        color: 'red',
        activeColor: 'blue',
        aspectRatio: 1,
    },

})

function getId(id) {
    return document.getElementById(id)
}

var inputX = getId('input-x')
var inputY = getId('input-y')
var inputWidth = getId('input-width')
var inputHeight = getId('input-height')

var buttonAspect16By9 = getId('aspect-16-by-9')
buttonAspect16By9.addEventListener('click', function (e) {
    e.preventDefault()
    crop.setAspectRatio(16 / 9)
})

var buttonAspect1By1 = getId('aspect-square')
buttonAspect1By1.addEventListener('click', function (e) {
    e.preventDefault()
    crop.setAspectRatio(1)
})

var buttonAspectFree = getId('aspect-free')
buttonAspectFree.addEventListener('click', function (e) {
    e.preventDefault()
    crop.setAspectRatio(null)
})

var buttonContainerFitImage = getId('container-fit-to-image')
buttonContainerFitImage.addEventListener('click', function (e) {
    e.preventDefault()
    crop.setBounds({ width: '100%', height: 'auto' })
})

var buttonContainerSquare = getId('container-square')
buttonContainerSquare.addEventListener('click', function (e) {
    e.preventDefault()
    crop.setBounds({ width: '100%', height: '100%' })
})

var buttonContainer2By1 = getId('container-2-by-1')
buttonContainer2By1.addEventListener('click', function (e) {
    e.preventDefault()
    crop.setBounds({ width: '100%', height: '50%' })
})

var backgroundColorPreset = 0


function setInputsFromRegion(region) {
    inputX.value = region.x
    inputY.value = region.y
    inputWidth.value = region.width
    inputHeight.value = region.height
}

crop
    .on('start', function (region) {
        console.log("start")
        setInputsFromRegion(region)
    })
    .on('move', function (region) {
        console.log("move")
        setInputsFromRegion(region)
    })
    .on('resize', function (region) {
        console.log("resize")
        setInputsFromRegion(region)
    })
    .on('change', function (region) {
        console.log("change")
        if (init) {
            loadPreviewImage(region);
            init = false;
        }

        setInputsFromRegion(region)
    })
    .on('end', function (region) {
        console.log("end")
        loadPreviewImage(region)
        setInputsFromRegion(region)
    })
function loadPreviewImage(region) {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    image = new Image(); // Using optional size for image
    image.onload = drawImageActualSize; // Draw when image has loaded
    // Load an image of intrinsic size 300x227 in CSS pixels
    image.src = crop.getImage().src;
    function drawImageActualSize() {
        // Use the intrinsic size of image in CSS pixels for the canvas element
        canvas.width = region.width / 5;
        canvas.height = region.height / 5;
        // To use the custom size we'll have to specify the scale parameters
        // using the element's width and height properties - lets draw one
        // on top in the corner:
        ctx.drawImage(this, region.x, region.y, region.width, region.height, 0, 0, region.width / 5, region.height / 5);
        watermark()
    }
}
function watermark() {
    let cnvs = document.getElementById("canvas")
    let ctx = cnvs.getContext("2d")
    ctx.globalAlpha = 0.6
    ctx.fillStyle = "white";
    ctx.textAlign = 'center';
    ctx.font = 'italic bold ' + canvas.width * 0.2 + 'px Adobe Garamond Pro';
    ctx.fillText("Hello World", cnvs.width / 2, cnvs.height / 2);
    ctx.globalAlpha = 0.9
    ctx.fillStyle = "#757575";
    ctx.textAlign = 'center';
    let x = 40, y = cnvs.height - 93, width = canvas.width - 80, height = 70;
    roundRect(ctx, x, y, width, height, 50, true);
    ctx.font = canvas.width * 0.025 + 'px ABeeZee';
    ctx.fillStyle = "black";
    ctx.fillText("Lorem ipsum data information we are the best", cnvs.width / 2, cnvs.height - 50);
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} haeight The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

}

var openFile = function (file) {
    var input = file.target;
    var reader = new FileReader();
    reader.onload = function () {
        var dataURL = reader.result;
        crop.setImage(dataURL)
    };
    reader.readAsDataURL(input.files[0]);
};

function download() {
    let link = document.createElement('a');
    link.download = 'filename.png';
    link.href = document.getElementById('canvas').toDataURL()
    link.click();
}

function previewAndSave() {
    watermark()
    download()
}