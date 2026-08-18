window.addEventListener("load",()=>setTimeout(()=>document.getElementById("loader").classList.add("hide"),700));

const enterBtn=document.getElementById("enterBtn");
enterBtn.addEventListener("click",()=>document.getElementById("about").scrollIntoView({behavior:"smooth"}));

const modal=document.getElementById("modal");
const modalTitle=document.getElementById("modalTitle");
const modalCaption=document.getElementById("modalCaption");
document.querySelectorAll(".photo-card").forEach(card=>card.addEventListener("click",()=>{
  modalTitle.textContent=card.dataset.title;
  modalCaption.textContent=card.dataset.caption;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
}));
document.getElementById("modalClose").onclick=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true")};
modal.addEventListener("click",e=>{if(e.target===modal)document.getElementById("modalClose").click()});

const record=document.getElementById("record");
document.getElementById("spinBtn").onclick=()=>record.classList.toggle("spinning");

document.getElementById("letterBtn").onclick=()=>{
  const btn=document.getElementById("letterBtn");
  btn.textContent=btn.textContent.includes("LAST")?"THE LAST PAGE IS ALREADY OPEN":"READ THE LAST PAGE →";
  document.getElementById("letterText").classList.add("revealed");
};

const starField=document.getElementById("starField");
const starCountEl=document.getElementById("starCount");
let savedStars=Number(localStorage.getItem("seonghyeonStars")||0);
starCountEl.textContent=savedStars;
for(let i=0;i<55;i++)createStar(Math.random()*100,Math.random()*100,false);

function createStar(x,y,save=true){
  const s=document.createElement("span");
  s.className="tiny-star";
  s.textContent=Math.random()>.5?"✦":"·";
  s.style.left=x+"%";s.style.top=y+"%";
  s.style.animationDelay=(Math.random()*2)+"s";
  starField.appendChild(s);
  if(save){savedStars++;localStorage.setItem("seonghyeonStars",savedStars);starCountEl.textContent=savedStars}
}
document.querySelector(".stars-section").addEventListener("click",e=>{
  if(e.target.closest("button,a"))return;
  const r=starField.getBoundingClientRect();
  createStar(((e.clientX-r.left)/r.width)*100,((e.clientY-r.top)/r.height)*100,true);
});

let playerX=50,gameRunning=false,score=0,level=1,fallers=[],timer;
const area=document.getElementById("gameArea"),player=document.getElementById("player");
const scoreEl=document.getElementById("gameScore"),levelEl=document.getElementById("gameLevel");

function move(dir){playerX=Math.max(8,Math.min(92,playerX+dir*6));player.style.left=playerX+"%"}
document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"){e.preventDefault();move(-1)}if(e.key==="ArrowRight"){e.preventDefault();move(1)}})
document.querySelectorAll(".game-controls button[data-key]").forEach(b=>b.addEventListener("click",()=>move(b.dataset.key==="ArrowLeft"?-1:1)));

function spawnLight(){
  if(!gameRunning)return;
  const x=10+Math.random()*80;
  const el=document.createElement("div");el.className="falling";el.textContent=Math.random()>.25?"✦":"✧";
  el.style.left=x+"%";el.style.top="-30px";area.appendChild(el);
  const obj={el,x,y:-30,speed:2.3+level*.45};fallers.push(obj);
}
function tick(){
  if(!gameRunning)return;
  fallers.forEach((o,i)=>{
    o.y+=o.speed;o.el.style.top=o.y+"px";
    if(o.y>area.clientHeight-65 && Math.abs(o.x-playerX)<9){
      score+=10;level=1+Math.floor(score/100);scoreEl.textContent=score;levelEl.textContent=level;
      o.el.remove();fallers.splice(i,1);
    }else if(o.y>area.clientHeight){o.el.remove();fallers.splice(i,1)}
  });
}
document.getElementById("startGame").onclick=()=>{
  fallers.forEach(o=>o.el.remove());fallers=[];score=0;level=1;playerX=50;
  scoreEl.textContent=0;levelEl.textContent=1;gameRunning=!gameRunning;
  document.getElementById("startGame").textContent=gameRunning?"STOP":"START";
  if(gameRunning){
    clearInterval(timer);
    timer=setInterval(()=>{spawnLight();tick()},520);
  }else clearInterval(timer);
};
