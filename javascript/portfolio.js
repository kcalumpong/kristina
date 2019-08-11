var c, ctx, cH, cW,
    cBounds,
    mouse = {
      x: undefined,
      y: undefined
    },
    strColor = "225, 220, 225"
    intMaxSize = 50,
    intQty = 800,
    intPercentImpact = 100,
    arr = []

c = document.getElementById('canvas')
ctx = c.getContext('2d')
setCanvas()


window.onresize = function(){
  setCanvas()
  init()
}
window.addEventListener('mousemove', function(e){
	mouse.x = e.x
	mouse.y = e.y
});

function setCanvas(){
  c.width = window.innerWidth
  c.height = window.innerHeight
  cW = c.width
  cH = c.height
  cBounds = c.getBoundingClientRect()
  intWFreq = parseInt(cW/intMaxSize) + 2
  intHFreq = parseInt(cH/intMaxSize) + 2
}
function object(x, y, color, opacity){
  this.x = x
	this.y = y
	this.color = color
  this.minsize = Math.floor((Math.random() * 1) + 4)
	this.size = this.minsize
	this.opacity = getRandomInt(10)/10
  this.blnOpacityUp = Math.random() >= 0.5;
  this.draw = function(){
    this.opacity < 0 && (this.blnOpacityUp = true)
    this.opacity > 1 && (this.blnOpacityUp = false)
    ctx.beginPath()
    ctx.arc(x, y, (this.size/2), 0, (this.size/2) * Math.PI)
    ctx.fill()
    ctx.fillStyle = 'rgba(' + this.color + ', ' + this.opacity + ')'
    ctx.closePath()
	}
  this.update = function(){
    this.blnOpacityUp ? (this.opacity+=0.01) : (this.opacity-=0.01)
    if (mouse.x - this.x < (intMaxSize*2) &&
       mouse.x - this.x > -(intMaxSize*2) &&
       mouse.y - this.y < (intMaxSize*2) && 
       mouse.y - this.y > -(intMaxSize*2)){
      this.blnOpacityUp ? (this.opacity+=0.03) : (this.opacity-=0.03)
      if(intMaxSize-10 >= this.size){
        this.size +=(intMaxSize/intPercentImpact)
      }
    } else if (this.size > this.minsize){
      this.size -=(intMaxSize/intPercentImpact)
    }
    this.draw()
  }
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function init(){
  arr = []
  for (i=0; i<intQty; i++){
    arr.push( new object(getRandomInt(cW), getRandomInt(cH), strColor, 1) )
  }
}
function animate(){
	requestAnimationFrame(animate)
	ctx.clearRect(0,0,cW,cH)
	for(var i=0;i < arr.length; i++){
		arr[i].update()
	}	
}
init()
animate()