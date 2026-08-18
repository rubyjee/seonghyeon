const $=s=>document.querySelector(s);
window.addEventListener("load",()=>setTimeout(()=>$("#preloader").classList.add("hide"),900));

const dot=$(".cursor-dot"),ring=$(".cursor-ring");
document.addEventListener("mousemove",e=>{dot.style.left=e.clientX+"px";dot.style.top=e.clientY+"px";ring.style.left=e.clientX+"px";ring.style.top=e.clientY+"px"});
document.querySelectorAll("a,button").forEach(el=>{el.addEventListener("mouseenter",()=>ring.classList.add("big"));el.addEventListener("mouseleave",()=>ring.classList.remove("big"))});

const audio=$("#audio"), vinyl=$("#vinyl"), soundBtn=$("#soundBtn"), musicToggle=$("#musicToggle"), state=$("#trackState");
function toggleAudio(){
  if(audio.paused){audio.play().then(()=>{vinyl.classList.add("playing");soundBtn.querySelector("span").textContent="PAUSE";state.textContent="PLAYING"}).catch(()=>{state.textContent="ADD MP3"});}
  else{audio.pause();vinyl.classList.remove("playing");soundBtn.querySelector("span").textContent="PLAY";state.textContent="PAUSED"}
}
soundBtn.onclick=toggleAudio;musicToggle.onclick=toggleAudio;
audio.addEventListener("ended",()=>{vinyl.classList.remove("playing");soundBtn.querySelector("span").textContent="PLAY";state.textContent="ENDED"});

document.querySelectorAll(".g-card").forEach(card=>card.onclick=()=>{
  $("#modalTitle").textContent=card.dataset.title;$("#modalText").textContent=card.dataset.text;$("#galleryModal").classList.add("open")
});
$("#closeModal").onclick=()=>$("#galleryModal").classList.remove("open");
$("#galleryModal").onclick=e=>{if(e.target.id==="galleryModal")$("#galleryModal").classList.remove("open")};

const constellation=$("#constellation"), count=$("#starCount");
let stars=Number(localStorage.getItem("shStars")||0);count.textContent=stars;
for(let i=0;i<65;i++)addStar(Math.random()*100,Math.random()*100,false);
function addStar(x,y,save=true){
  const s=document.createElement("span");s.className="star";s.textContent=Math.random()>.5?"✦":"·";s.style.left=x+"%";s.style.top=y+"%";s.style.animationDelay=Math.random()*2+"s";const size=7+Math.random()*9;s.style.fontSize=size+"px";const life=1+Math.random()*2;s.style.animationDuration=life+"s";const existing=constellation.children.length; if(existing>130)constellation.firstChild.remove();constellation.appendChild(s);
  if(save){stars++;localStorage.setItem("shStars",stars);count.textContent=stars}
}
$(".stars").addEventListener("click",e=>{if(e.target.closest("a,button"))return;const r=constellation.getBoundingClientRect();addStar((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100,true)});

let game=false,x=50,score=0,level=1,objects=[],loop;
function move(d){x=Math.max(7,Math.min(93,x+d*7));$("#car").style.left=x+"%"}
document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"){e.preventDefault();move(-1)}if(e.key==="ArrowRight"){e.preventDefault();move(1)}});
document.querySelectorAll("[data-move]").forEach(b=>b.onclick=()=>move(Number(b.dataset.move)));
function spawn(){if(!game)return;const o=document.createElement("div");o.className="light";o.textContent=Math.random()>.2?"✦":"✧";const ox=7+Math.random()*86;o.style.left=ox+"%";o.style.top="-25px";$("#gameArea").appendChild(o);objects.push({el:o,x:ox,y:-25,speed:2+level*.4})}
function tick(){if(!game)return;for(let i=objects.length-1;i>=0;i--){const o=objects[i];o.y+=o.speed;o.el.style.top=o.y+"px";if(o.y>$("#gameArea").clientHeight-70&&Math.abs(o.x-x)<10){score+=10;level=1+Math.floor(score/100);$("#score").textContent=score;$("#level").textContent=level;o.el.remove();objects.splice(i,1)}else if(o.y>$("#gameArea").clientHeight){o.el.remove();objects.splice(i,1)}}}
$("#gameStart").onclick=()=>{game=!game;$("#gameStart").textContent=game?"STOP":"START";if(game){score=0;level=1;$("#score").textContent=0;$("#level").textContent=1;objects.forEach(o=>o.el.remove());objects=[];clearInterval(loop);loop=setInterval(()=>{spawn();tick()},500)}else clearInterval(loop)};

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
$("#typeBtn").onclick=()=>{const b=$("#letterBody");b.classList.toggle("revealed");$("#typeBtn").textContent=b.classList.contains("revealed")?"THE LETTER IS OPEN":"REVEAL THE LETTER →"};
