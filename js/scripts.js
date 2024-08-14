(function () {

    'use strict';
    
    var canvas,ctx,mouse,originx,originy,lifeVal,windVal,turbVal,int;
    var points = [];//Stores each generated particle
    var life = 20;//The length of the flame
    var wind = 0;
    var turb = 2;
      
    function init () {
        canvas = document.getElementById("canvas");
      lifeVal = document.getElementById("life");
      windVal = document.getElementById("wind");
      turbVal = document.getElementById("turb");
      lifeVal.value = life;
      windVal.value = wind;
      turbVal.value = turb;
        ctx = canvas.getContext("2d");
        resizeCanvas();
        int = setInterval(pointFun,25);
        window.addEventListener('resize', resizeCanvas, false);
        canvas.addEventListener("mousemove",function(evt){
            mouse = getMousePos(canvas,evt);
            originx = mouse.x;
            originy = mouse.y;
        });
     lifeVal.addEventListener("input",controls,false);
      windVal.addEventListener("input",controls,false);
      turbVal.addEventListener("input",controls,false);
    }
      
      function controls() {
        life = parseInt(lifeVal.value);
        wind = parseInt(windVal.value);
        turb = parseInt(turbVal.value);
        clearInterval(int);
        points = [];
        int = setInterval(pointFun,25);
        
      }
    //Particle constructor
    function point () {
        this.x = originx;
        this.y = originy;
        this.vx = (Math.random()*(-turb))+(turb/2) + wind;
      console.log(this.vx);
        this.vy = (Math.random()*-2)-5;
        this.dia = (Math.random()*5)+15;
      //age only used to change colours
        this.age = 0;
    }
    //Flame drawer
    function drawFlame(obj) {
        ctx.beginPath();
      ctx.arc(obj.x,obj.y,obj.dia,0,2*Math.PI);
        var flame = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, obj.dia);
        flame.addColorStop(0,"rgba(255,"+Math.floor(255*(1-obj.age))+","+Math.floor(255*(1-(2*obj.age)))+","+(1-obj.age)+")");
        flame.addColorStop(1, "rgba(255,"+Math.floor(255*(1-obj.age))+",0,0)");
        ctx.fillStyle = flame;
        ctx.closePath();
        ctx.fill();
    }
    //Draws the glow...
    function drawGlow(obj) {
        ctx.beginPath();
        var gloDia = obj.dia*4;
        ctx.arc(originx,originy+obj.vy*5,gloDia,0,2*Math.PI);
        var glow = ctx.createRadialGradient(originx, originy, 0, originx, originy+obj.vy*5, gloDia);
        glow.addColorStop(0, "rgba(255,255,240,0.1)");
        glow.addColorStop(1, "rgba(255,255,240,0)");
        ctx.fillStyle = glow;
        ctx.closePath();
        ctx.fill();
    }
    //Point generator
    function generatePoints (amount) {
        var temp;
        temp = new point();
        points.push(temp);
        if(points.length > amount){
            points.shift();
        }
    }
    function getMousePos(cvs, evt) {
        var rect = cvs.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    //Updates point position values
    function update (obj) {
        obj.x += obj.vx;
        obj.y += obj.vy;
        obj.dia += 0.1;
        obj.age += 1/life;
    }
    //
    function pointFun () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        generatePoints(life);
        for (var i = 0; i < points.length; i++) {
            drawFlame(points[i]);
            update(points[i]);
        }
        drawGlow(points[0]);
    }
    //Update canvas size to fill window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        originx = canvas.width / 2;
        originy = canvas.height / 2;
        pointFun();
    }
    //Execute when DOM has loaded
    document.addEventListener('DOMContentLoaded',init,false);
    
    })();