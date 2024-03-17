let currentFractal;
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("mycanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 1000//window.innerWidth;
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
    document.getElementById("start").addEventListener("click", start)
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
    
    async function start(){
        const c = { a: slider_a.value/100, b : slider_b.value/100 };
        const lim = slider_lim.value
        const maxiter = slider_maxIter.value
        const m = 255/maxiter;
        for(let x = -width/2; x <= width/2; x++){
            for(let y = -height/2; y <= height/2; y++){
                let rgb = Math.floor(m*count_itteration((x*2*lim/width), (y*2*lim/width), c, maxiter, lim))
                ctx.fillStyle = `${rgbToHex(rgb, rgb, rgb)}`;
                ctx.fillRect(x, y, 1, 1);
                
            }
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
    }
    else{
        throw console.error("Not a valid fractal")
    }

    let i = 0
    lim = Math.pow(lim, 2)
    while(i < maxIteration){
        let z2 = compute_next(z, c);
        if(mod(z2) > lim) break;
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
//y = (x+1) * 3