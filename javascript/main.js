/*Code by Jelly. Add me on Twitter: @elemental_jude*/

var gameover;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var canvas_b = document.getElementById('canvas');
var background = canvas_b.getContext('2d');

var h = $(window).height();
var w = $(window).width();

canvas.width = w - (w/48);
canvas.height = canvas.width/1.7777;

canvas_b.width = canvas.width;
canvas_b.height = canvas.height;

var y = canvas.height/2,momentum = -5;
var x = canvas.width/4;

var x_bar = canvas.width;
var x_bar2 = canvas.width*1.5;
var frame = 1;

var pix = [0,0,0], pix_old = [0,0,0];

var t = 0;
var i = 0;
var r = 0;

var score = 0;
var scored = false;

var rand = Math.random();
var rand2 = Math.random();

var started = false;

var interval,animationinterval,gameoverinterval;

var sounds = ['yumyum','thatswhatimtalkingabout','juicy', 'imjustimpressed'];

var rsound = 0;
var rsound_old = 0;
var rsound_old2 = 0;

var retry = true;

var pink = false;

var highscore;

var cookieE = navigator.cookieEnabled;

function jump(){
  momentum = canvas.width/96;
}

function background_scroll(){
  bg_x = 0;
  //bg_x2 = canvas.width;
  background.drawImage(document.getElementById('bg'),bg_x,0,canvas.width,canvas.height);
  //background.drawImage(document.getElementById('bg'),bg_x2,0,canvas.width,canvas.height);
}

function play(){
  started = true;

  if(momentum==-1*(canvas.width/96)){
    momentum = -19;
  }

  if(y>canvas.height){
    y=canvas.height;
    gameover = true;
  }

  if(y<0){
    y=0;
  }

  y-=momentum;
  momentum-=canvas.width/960;

  canvas.height = canvas.height;

  context.beginPath(); /*clear jack*/
  context.clearRect(x, y-((canvas.width/16)*2.185)/2, canvas.width/16, (canvas.width/16)*2.185 /*2.185 is the magic scaling unit. makes sure the image doesnt stretch*/);
  context.fill();

  context.beginPath();
  context.fillStyle = '#0f0'; /*pipe*/
  context.drawImage(document.getElementById('pipe'),x_bar,0,canvas.width/16,canvas.height);
  context.fill();

  context.beginPath();
  context.fillStyle = '#0f0'; /*pipe*/
  context.drawImage(document.getElementById('pipe'),x_bar2,0,canvas.width/16,canvas.height);
  context.fill();

  context.beginPath(); /*clear block*/
  context.clearRect(x_bar-canvas.width/32, rand*(canvas.height-(canvas.width/16)*2.185), canvas.width/8, (canvas.width/16)*2.185);
  context.fill();

  context.beginPath(); /*clear block*/
  context.clearRect(x_bar2-canvas.width/32, rand2*(canvas.height-(canvas.width/16)*2.185), canvas.width/8, (canvas.width/16)*2.185);
  context.fill();

  context.beginPath(); /*Jack*/
  context.drawImage(document.getElementById('jf' + frame.toString()), x, y-((canvas.width/16)*2.185)/2, canvas.width/16, (canvas.width/16)*2.185 /*2.185 is the magic scaling unit. makes sure the image doesnt stretch*/);
  context.fill();

  context.beginPath(); /*Score background*/
  context.fillStyle = 'black';
  context.rect(canvas.width-canvas.width/8,0,canvas.width/8,canvas.width/12);
  context.fill();

  context.beginPath(); /*Score text*/
  context.fillStyle = 'white';
  context.font = canvas.width/12 + 'px Comic Sans MS';
  context.textAlign = 'start';
  context.fillText(score.toString(),canvas.width-canvas.width/8,canvas.width/14);
  context.fill();

  for(i = 0;i<canvas.width/16;i++){
    pix = context.getImageData(x + canvas.width/16 + 2, y - canvas.width/32 + i, 1, 1).data;
    if(pix[2]!=pix_old[2] && t>12){
      gameover = true;

    }
    pix_old[2] = pix[2];
  }

  x_bar-=canvas.width/128;
  if(x_bar<0-canvas.width/16){
    x_bar=canvas.width;
    rand=Math.random();
    scored=false;
  }

  x_bar2-=canvas.width/128;
  if(x_bar2<0-canvas.width/16){
    x_bar2=canvas.width;
    rand2=Math.random();
    scored=false;
  }

  if((Math.min(x_bar,x_bar2)<canvas.width/4) && (!scored)){
    scored=true;
    score++;
    while(retry){
      rsound = Math.floor(Math.random()*4);
      if((rsound==rsound_old)||(rsound==rsound_old2)){retry=true;}
      else{retry=false;}
    }
    document.getElementById(sounds[rsound]).play();
    rsound_old2 = rsound_old;
    rsound_old = rsound;
    retry=true;
  }

  if(gameover){
    clearInterval(interval);
    clearInterval(animationinterval);
    document.getElementById('slap').pause();
    loadscreen(1);
    if(score>Number(highscore)){
      changeCookie('highscore',score.toString(),365)
    }
    console.log(Number(highscore).toString() + ' ' + highscore);
    reset();
  }

  t++;

} /*End of play function*/

function loadscreen(s){
  if(s==0){

    context.beginPath();
    context.fillStyle = '#ccc';
    context.rect(canvas.width*0.125,canvas.height*0.75,canvas.width*0.75,canvas.height/8);
    context.fill();

    context.beginPath();
    context.fillStyle = '#efefef'
    context.font = 'bold ' + canvas.height/12 + 'px Comic Sans MS, sans-serif';
    context.textAlign = 'center';
    context.fillText('Press any key to start. Click to jump',canvas.width*0.5,canvas.height*0.8375);
    context.fillStyle = 'black';
    context.lineWidth = 3;
    context.strokeText('Press any key to start. Click to jump',canvas.width*0.5,canvas.height*0.8375);

    checkCookie('highscore');

    if(cookieE){
      context.beginPath(); /*Highscore background*/
      context.fillStyle = 'black';
      context.rect(canvas.width-canvas.width/8,0,canvas.width/8,canvas.width/12);
      context.fill();

      context.beginPath(); /*Highscore text*/
      context.fillStyle = 'white';
      context.font = canvas.width/12 + 'px Comic Sans MS, sans-serif';
      context.textAlign = 'start';
      context.fillText(highscore,canvas.width-canvas.width/8,canvas.width/14);
      context.fill();

      context.beginPath();
      context.fillStyle = '#fff'
      context.font = 'bold ' + canvas.height/12 + 'px Comic Sans MS, sans-serif';
      context.textAlign = 'right';
      context.fillText('highscore:',canvas.width-canvas.width/8,0+canvas.height/12);
      context.fillStyle = 'black';
      context.lineWidth = 2;
      context.strokeText('highscore:',canvas.width-canvas.width/8,0+canvas.height/12);

    }else{
      context.beginPath(); /*Cookies not enabled*/
      context.fillStyle = 'white';
      context.font = canvas.width/24 + 'px sans-serif';
      context.textAlign = 'center';
      context.fillText('No highscore available, cookies turned off',canvas.width/2,canvas.height/2);
      context.fill();
    }

  }else if(s==1){

    document.getElementById('ohnooo').play();

    gameoverinterval = window.setInterval(strobeText, 50);

    context.beginPath(); /*Gameover*/
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.font = 'bold ' + canvas.width/8 + 'px Comic Sans MS, sans-serif';
    context.fillText('gameover XDDD',canvas.width*0.5,canvas.height*0.5);
    context.fillStyle = 'black';
    context.lineWidth = 8;
    context.strokeText('gameover XDDD',canvas.width*0.5,canvas.height*0.5);

    context.beginPath(); /*Gameover*/
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.font = 'bold ' + canvas.width/32 + 'px Comic Sans MS, sans-serif';
    context.fillText('pr35 3ny k3y t0 r35t4rt',canvas.width*0.5,canvas.height*0.625);
    context.fillStyle = 'black';
    context.lineWidth = 3;
    context.strokeText('pr35 3ny k3y t0 r35t4rt',canvas.width*0.5,canvas.height*0.625);

    context.beginPath();
    context.fillStyle = '#fff'
    context.font = 'bold ' + canvas.height/12 + 'px Comic Sans MS, sans-serif';
    context.textAlign = 'right';
    context.fillText('highscore:',canvas.width-canvas.width/8,0+canvas.height/12);
    context.fillStyle = 'black';
    context.lineWidth = 2;
    context.strokeText('highscore:',canvas.width-canvas.width/8,0+canvas.height/12);

    checkCookie('highscore');

    context.beginPath(); /*Highscore background*/
    context.fillStyle = 'black';
    context.rect(canvas.width-canvas.width/8,0,canvas.width/8,canvas.width/12);
    context.fill();

    context.beginPath(); /*Highscore text*/
    context.fillStyle = 'white';
    context.font = canvas.width/12 + 'px Comic Sans MS, sans-serif';
    context.textAlign = 'start';
    context.fillText(highscore,canvas.width-canvas.width/8,canvas.width/14);
    context.fill();
  }
}

function strobeText(){
  if(pink){
    context.beginPath(); /*Score background*/
    context.fillStyle = 'black';
    context.rect(canvas.width/2-canvas.width/16,0,canvas.width/8,canvas.width/12);
    context.fill();

    context.beginPath(); /*Score text*/
    context.fillStyle = 'white';
    context.font = canvas.width/12 + 'px Comic Sans MS';
    context.textAlign = 'center';
    context.fillText(score.toString(),canvas.width/2,canvas.width/14);
    context.fill();

    pink = false;
  }else{
    context.beginPath(); /*Score background*/
    context.fillStyle = 'green';
    context.rect(canvas.width/2-canvas.width/16,0,canvas.width/8,canvas.width/12);
    context.fill();

    context.beginPath(); /*Score text*/
    context.fillStyle = 'pink';
    context.font = canvas.width/12 + 'px Comic Sans MS';
    context.textAlign = 'center';
    context.fillText(score.toString(),canvas.width/2,canvas.width/14);
    context.fill();
    context.fillStyle='black';
    context.lineWidth=2;
    context.strokeText(score.toString(),canvas.width/2,canvas.width/14);

    pink = true;
  }
}

function reset(){
  gameover = false;
  y = canvas.height/2;
  momentum = -5;
  x_bar = canvas.width;
  x_bar2 = canvas.width*1.5
  frame = 1;
  pix = [0,0,0];
  pix_old = [0,0,0];
  t=0,i=0,r=0;
  score = 0;
  scored = false;
  rand = Math.random();
  rand2 = Math.random();
  started = false;
  animationinterval = window.setInterval(animation,50);
  clearInterval(gameoverinterval);

}

function animation(){
  document.getElementById('slap').play();

  if(r==1){
    frame++;
    if(frame==5){
      frame=1;
    }
    r=0;
  }else{
    r=1;
  }

  context.beginPath();
  context.drawImage(document.getElementById('jf' + frame.toString()), x, y-((canvas.width/16)*2.185)/2, canvas.width/16, (canvas.width/16)*2.185 /*2.185 is the magic scaling unit. makes sure the image doesnt stretch*/);
  context.fill();


}

function sounds(){

  rsound = Math.floor(Math.random()*3);
  if(rsound==rsound_old){
    rsound = Math.random(Math.random()*3);
  }
  document.getElementById(sounds[rsound]).play();
  rsound_old = rsound;
}

function keymanage(e){
  if(!started){
    interval = window.setInterval(play,50);
  }
  else if(gameover){
    context.beginPath();
    context.fillStyle = '#6699ff';
    context.rect(0,0,canvas.width,canvas.height);
    context.fill();
    loadscreen(0);
    reset();
  }
}

function clickControl(){
  if(gameover || !started){
    interval = window.setInterval(play,50);
  }else{
    jump();
  }
}

function changeCookie(name, value, exd){
  var d = new Date();
  d.setTime(d.getTime() + (exd*24*60*60*1000));
  var ex = 'expires='+d.toUTCString();
  document.cookie = name + '=' + value + '; ' + ex;
}

function getCookie(name){
  var n = name + '=';
  var ar = document.cookie.split(';');
  for(var i=0;i<ar.length;i++){
    var c = ar[i];
    while(c.charAt(0)==' '){
      c = c.substring(1);
    }
    if(c.indexOf(name) == 0){
      return c.substring(name.length + 1,c.length);
    }
  }
  return '';
}

function checkCookie(n){
  var hs = getCookie(n);
  if(hs!=0){
    console.log(hs);
    if(n='highscore'){
      highscore = hs;
    }
  }
  else{
    console.log('No cookies detected');
    changeCookie(highscore,'0',365);
    highscore = '0';
  }
}

document.onload = loadscreen(0),animationinterval = window.setInterval(animation,50);
document.onkeypress = keymanage;
