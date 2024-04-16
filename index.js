let currentFractal;
let graphStartingPoint = {x: -2, y: 2}, graphEndingPoint = {x: 2, y:-2};
document.addEventListener("DOMContentLoaded", async () => {
    const canvas = document.getElementById("mycanvas");
    const ctx = canvas.getContext("2d");
    canvas.width =  1000 //window.innerWidth;
    canvas.height = 1000 //window.innerHeight;
    const width = canvas.width
    const height = canvas.height

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
        document.getElementById("maxIter_label").innerText = `(Improves Calrity) maximum Iteration = ${slider_maxIter.value}`;
    }
    document.getElementById("start").addEventListener("click", () => {
        start({
            x : -2,
            y : 2
        }, {
            x: 2,
            y : -2
        })
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
    let canvasStartingPoint, canvasEndingPoint
    let startingState = ctx.getImageData(0, 0, width, height)
    function drawstart(e){
        drawing = true
        canvasStartingPoint = getMousePosFloored(canvas, e)
    }
    function draw(e){
        if(!drawing) return
        ctx.putImageData(startingState ,0, 0)
        canvasEndingPoint = getMousePosFloored(canvas, e)

        let w = canvasEndingPoint.x - canvasStartingPoint.x
        let h = canvasEndingPoint.y - canvasStartingPoint.y
        let x = canvasStartingPoint.x 
        let y = canvasStartingPoint.y
        let a = Math.max(Math.abs(w), Math.abs(h))
        ctx.strokeStyle = "red" 
        if(h < 0 && w > 0) { 
          ctx.strokeRect(x, y, a, -a)
          canvasEndingPoint.x = canvasStartingPoint.x + a
          canvasEndingPoint.y = canvasStartingPoint.y - a
        }
        else if(h > 0 && w < 0) {
          ctx.strokeRect(x, y, -a, a)
          canvasEndingPoint.x = canvasStartingPoint.x - a
          canvasEndingPoint.y  = canvasStartingPoint.y + a
        }
        else if(h < 0 && w < 0) {
          ctx.strokeRect(x, y, -a, -a) 
          canvasEndingPoint.x = canvasStartingPoint.x - a
          canvasEndingPoint.y = canvasStartingPoint.y - a
        }
        else {
          ctx.strokeRect(x, y, a, a)
          canvasEndingPoint.x = canvasStartingPoint.x + a 
          canvasEndingPoint.y = canvasStartingPoint.y + a
        }
        
    }
    function drawstop(){
        drawing = false
        let point1 = canvasPosToGraphPos(canvasStartingPoint)
        let point2 = canvasPosToGraphPos(canvasEndingPoint)
        console.log("Canvas Positions", canvasStartingPoint, canvasEndingPoint)
        console.log("Graph Positions", point1, point2)
        start(point1, point2)
    }

    function canvasPosToGraphPos(canvasPosition){
        return {
            x: graphStartingPoint.x + canvasPosition.x * ( Math.abs(graphEndingPoint.x - graphStartingPoint.x) / width ),
            y: graphStartingPoint.y - canvasPosition.y * ( Math.abs(graphStartingPoint.y - graphEndingPoint.y) / height ) 
        }
    }
    function zoom(e){
        //nothing
    }
    canvas.addEventListener("mousedown", drawstart)
    canvas.addEventListener("mousemove", draw)
    canvas.addEventListener("mouseup", drawstop)
    canvas.addEventListener("dblclick", zoom)


    async function start(start_pos, end_pos){
       //deal with different graph points
        const properPoints = getProperStartingPointAndEndingPoint(start_pos, end_pos);
        start_pos = properPoints[0];
        end_pos = properPoints[1];
        graphStartingPoint = start_pos
        graphEndingPoint = end_pos 

        const c = { a: slider_a.value/100, b : slider_b.value/100 };
        const lim = slider_lim.value
        const maxiter = slider_maxIter.value
        const m = 255/maxiter;

        let d_width = Math.abs(start_pos.x - end_pos.x)
        let d_height = Math.abs(start_pos.y - end_pos.y)
        let dx = d_width / width
        let dy = d_height / height
        let x = start_pos.x  // start_pos.x < end_pos.x | start_pos.y > end_pos.y
        let y = start_pos.y
        for(let i = 0; i <= width; i++){
            for(let j = 0; j <= height; j++){
                let rgb = Math.floor(m*count_itteration(x, y, c, maxiter, lim))
                ctx.fillStyle =  `${rgbToHex(rgb, rgb, rgb)}` // x > 0 ? "red" : "black"
                ctx.fillRect(i, j, 1, 1)
                y -= dy
            }
            y = start_pos.y
            x += dx
        }
        if (document.getElementById("autodwn").checked){
            let canvasUrl = canvas.toDataURL();
            const createEl = document.createElement('a');
            createEl.href = canvasUrl;
            createEl.download = "download-this-canvas";
            createEl.click();
            createEl.remove();
        }
        startingState = ctx.getImageData(0, 0, width, height)
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
function getProperStartingPointAndEndingPoint(p1, p2){
  if(p1.x < p2.x && p1.y > p2.y) return [p1, p2]; 
  else if (p1.x < p2.x && p1.y < p2.y) return [{x: p2.x, y: p1.y}, {x: p1.x, y: p2.y}];
  else if (p1.x > p2.x && p1.y < p2.y) return [p2, p1];
  else return [{x: p1.x, y: p2.y}, {x: p2.x, y: p1.y}];
}
//copied from SO
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
function getMousePosFloored(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
      x: Math.floor(evt.clientX - rect.left),
      y: Math.floor(evt.clientY - rect.top)
  };
}
