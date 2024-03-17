document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("mycanvas").getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const width = canvas.width
    const height = canvas.height
    canvas.translate(width/2, height/2);

    setInterval(() => {
        document.getElementById("clock").innerText = new Date().toTimeString()
    }, 1E3);
    const m = 255/50;

    const c = { a: 0.1, b : 0.3 };

    document.getElementById("start").addEventListener("click", () => {
        for(let x = -width/2; x <= width/2; x++){
            for(let y = height/2; y <= height/2; y++){
                let rgb = Math.floor(m*count_itteration(x, y, c, 50))
                canvas.fillStyle = `red`;
                canvas.fillRect(x, y, 1, 1);
            }
        }
    })
})  

function compute_next(z, c){
    let z2 = {
        "x" : (z.x*z.x - z.y*z.y + c.a),
        "y" : (2*z.x*z.x + c.b) 
    }
    return z2;
}

function count_itteration(x, y, c, maxIteration){
    let z = { 
        "x" : x, 
        "y" : y
    }

    let i = 0
    while(i < maxIteration){
        let z2 = compute_next(z, c);
        if(z2.x > 2) break;
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