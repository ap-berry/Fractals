document.addEventListener("DOMContentLoaded", () => {
    const c = document.getElementById("mycanvas");
    c.width = 400
    c.height = 400
    const width = c.width
    const height = c.height
    const ctx = c.getContext("2d");
    function drawXaxis(){
        ctx.beginPath()
        ctx.moveTo(0, height/2)
        ctx.lineTo(width, height/2)
        ctx.stroke()
        ctx.closePath()
    }
    function drawYaxis(){
        ctx.beginPath()
        ctx.moveTo(width/2, 0)
        ctx.lineTo(width/2, height)
        ctx.stroke()
        ctx.closePath()
    }
    drawXaxis()
    drawYaxis()

    function coordinateConverter(x, y){
        let x_canvas = width/2 + x;
        let y_canvas = height/2 - y;
        return { "x" : x_canvas, "y" : y_canvas};
    }

    let coordinate_list = []
    for(let x = -width/2; x <= width/2; x+=1){
        for(let y = -height/2 ; y <= height/2; y++){
            let diff = Math.sqrt(x*x + y*y);
            coordinate_list.push(coordinateConverter(x, y))
        }
        
    }

    /* for(let i = 0; i < coordinate_list.length; i++){
        const point1 = coordinate_list[i]
        ctx.fillRect(point1.x, point1.y, 1, 1)
    } */
    

})  

//y = (x+1) * 3