document.addEventListener("DOMContentLoaded", () => {
    const c = document.getElementById("mycanvas");
    c.width = window.innerWidth
    c.height = window.innerHeight
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
        let y = Math.sqrt(x);
        let draw = coordinateConverter(x, y);
        coordinate_list.push(draw)
    }

    for(let i = 0; i < coordinate_list.length-1; i++){
        const point1 = coordinate_list[i]
        const point2 = coordinate_list[i+1]
        ctx.beginPath()
        ctx.moveTo(point1.x, point1.y)
        ctx.lineTo(point2.x, point2.y)
        ctx.strokeStyle = 'red'
        ctx.stroke()
        ctx.closePath()
    }
})

//y = x+1