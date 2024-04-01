let currentFractal;
document.addEventListener("DOMContentLoaded", async () => {
    const canvas = document.getElementById("mycanvas");
    const ctx = canvas.getContext("2d");
    canvas.width =  1000 //window.innerWidth;
    canvas.height = 1000 //window.innerHeight;
    const width = canvas.width
    const height = canvas.height
    ctx.translate(width/2, height/2);

    setInterval(async () => {
        document.getElementById("clock").innerText = new Date().toTimeString()
    }, 1E3);
    const slider_a = document.getElementById("a")
    slider_a.oninput = () => {
        document.getElementById("a_label").innerText = `c.a = ${slider_a.value/100}`;
    }
    const slider_b = document.getElementById("b")
    slider_b.oninput = () => {
        document.getElementById("b_label").innerText = `c.b = ${slider_b.value/100}`;
    }
    const slider_lim = document.getElementById("lim")
    slider_lim.oninput = () => {
        document.getElementById("lim_label").innerText = `limit = ${slider_lim.value}`;
    }
    const slider_maxIter = document.getElementById("maxIter")
    slider_maxIter.oninput = () => {
        document.getElementById("maxIter_label").innerText = `maximum Iteration = ${slider_maxIter.value}`;
    }
    document.getElementById("start").addEventListener("click", () => {
        start({
            x : -width/2,
            y : height/2
        }, {
            x: width/2,
            y : -height/2
        })
        startingState = ctx.getImageData(0, 0, width, height)

    })
    const mode = document.getElementById("modechanger")
    currentFractal = mode.value
    mode.addEventListener("change", ()=>{
        currentFractal = mode.value
        if(mode.value === "mandelbrot"){
            slider_a.hidden = true;
            slider_b.hidden = true;
            document.getElementById("a_label").hidden = true;
            document.getElementById("b_label").hidden = true;
        }
        else if(mode.value === "julia"){

            slider_a.hidden = false;
            slider_b.hidden = false;
            document.getElementById("a_label").hidden = false;
            document.getElementById("b_label").hidden = false;
        }
    })

    document.getElementById("zoom").addEventListener("click", ()=>{
        start({
            x : -30,
            y : 30
        }, {
            x: 0,
            y : 0
        })
        
    })
    
    // sx = width / |(x2-x1)|, sy = height / |(y2-y1)|, (x1, y1) = (300, 300), (x2, y2) = (400, 400), a = d_width/width, b = d_height / height
    let drawing = false
    let startingPoint, endingPoint
    let startingState = ctx.getImageData(0, 0, width, height)
    function drawstart(e){
        drawing = true
        startingPoint = getMousePos(canvas, e)
    }
    function draw(e){
        if(!drawing) return
        ctx.putImageData(startingState ,0, 0)
        endingPoint = getMousePos(canvas, e)
        let w = endingPoint.x - startingPoint.x
        w = Math.floor(w)
        let h = endingPoint.y - startingPoint.y
        h = Math.floor(h)
        let x = Math.floor(startingPoint.x) - width/2
        let y = Math.floor(startingPoint.y) - width/2

        ctx.strokeStyle = "red"
        ctx.strokeRect(x, y, w, h)
    }
    function drawstop(){
        drawing = false
    }
    window.addEventListener("mousedown", drawstart)
    window.addEventListener("mousemove", draw)
    window.addEventListener("mouseup", drawstop)


    async function start(start_pos, end_pos){
        const c = { a: slider_a.value/100, b : slider_b.value/100 };
        const lim = slider_lim.value
        const maxiter = slider_maxIter.value
        const m = 255/maxiter;

        let d_width = Math.abs(start_pos.x - end_pos.x)
        let d_height = Math.abs(start_pos.y - end_pos.y)
        let a = d_width / width
        let b = d_height / height
        let x = start_pos.x   // start_pos.x < end_pos.x | start_pos.y > end_pos.y
        let y = end_pos.y
        for(let i = -width/2; i <= width/2; i++){
            for(let j = -height/2; j <= height/2; j++){
                let rgb = Math.floor(m*count_itteration((x*2*lim/width), (j*2*lim/height), c, maxiter, lim))
                ctx.fillStyle = `${rgbToHex(rgb, rgb, rgb)}`
                ctx.fillRect(i, j, 1, 1)
                y = y + b
            }
            x = x + a
        }
        if (document.getElementById("autodwn").checked){
            let canvasUrl = canvas.toDataURL();
            const createEl = document.createElement('a');
            createEl.href = canvasUrl;
            createEl.download = "download-this-canvas";
            createEl.click();
            createEl.remove();
        }

    }
})  

function compute_next(z, c){
    let z2 = {
        "x" : (z.x*z.x - z.y*z.y + c.a),
        "y" : (2*z.x*z.y + c.b) 
    }
    return z2;
}

function mod(z){
    return z.x*z.x + z.y*z.y
}
function count_itteration(x, y, c, maxIteration, lim){
    let z;
    if(currentFractal === "julia"){
        z = {
            "x" : x,
            "y" : y
        }
    }
    else if(currentFractal === "mandelbrot"){
        z = {
            "x" : 0,
            "y" : 0
        }
        c = {
            a : x,
            b : y
        }
        lim = 2 
    }
    else{
        throw console.error("Not a valid fractal")
    }

    let i = 0
    let lim_sq = Math.pow(lim, 2)
    while(i < maxIteration){
        let z2 = compute_next(z, c);
        if(mod(z2) > lim_sq) break;
        z.x = z2.x
        z.y = z2.y
        i++;
    }
    return i;
}
//copied from SO
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
    canvas.addEventListener("mousemove", draw)
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
 //y = (x+1) * 3