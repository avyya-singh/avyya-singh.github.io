(() => {
const wrap=document.querySelector('#pet-wrap'),pet=document.querySelector('#pet'),home=document.querySelector('.companion-home'),toggle=document.querySelector('#pet-toggle'),message=document.querySelector('#pet-message');
const motion=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');
let following=fine.matches&&!motion.matches,x=0,y=0,tx=0,ty=0,frame=0,idleTimer,messageTimer,reactionTimer,reacting=false,footerVisible=false;
const clamp=(v,max)=>Math.max(8,Math.min(Math.max(8,max),v));
function place(){wrap.style.transform=`translate(${x}px,${y}px)`}
function tick(){frame=0;if(document.hidden)return;const dist=Math.hypot(tx-x,ty-y);if(motion.matches||dist<1){x=tx;y=ty;wrap.classList.remove('walking');place();return}x+=(tx-x)*.12;y+=(ty-y)*.12;wrap.classList.toggle('walking',!reacting&&dist>5);place();frame=requestAnimationFrame(tick)}
function move(left,top,snap=false){tx=left;ty=top;if(snap||motion.matches){x=tx;y=ty;place()}if(!frame)frame=requestAnimationFrame(tick)}
function dock(){const r=home.getBoundingClientRect();move(clamp(r.left+r.width/2-47,innerWidth-108),r.top+(innerWidth<=700?65:138),true)}
function sync(){toggle.textContent=`Following: ${following?'on':'off'}`;toggle.setAttribute('aria-pressed',String(following))}
function speak(text){clearTimeout(messageTimer);message.textContent=text;message.classList.add('show');messageTimer=setTimeout(()=>message.classList.remove('show'),2400)}
function wake(){wrap.classList.remove('sleepy');pet.setAttribute('aria-label','Pet Pikachu');clearTimeout(idleTimer);idleTimer=setTimeout(()=>{if(document.hidden||reacting)return;wrap.classList.remove('walking');wrap.classList.add('sleepy');pet.setAttribute('aria-label','Wake Pikachu')},9500)}
function react(kind,text){clearTimeout(reactionTimer);wake();reacting=true;wrap.classList.remove('walking','happy','peeking','celebrating');wrap.classList.add(kind);speak(text);reactionTimer=setTimeout(()=>{reacting=false;wrap.classList.remove(kind);wake()},2400)}
function greet(){react('happy','pika! ♡')}
pet.addEventListener('click',greet);document.querySelector('#pet-hi').addEventListener('click',greet);
toggle.addEventListener('click',()=>{following=!following;sync();reacting=false;clearTimeout(reactionTimer);wrap.classList.remove('walking','happy','peeking','celebrating');dock();wake();if(following)speak('coming!')});
addEventListener('pointermove',e=>{wake();if(!following||reacting||e.pointerType==='touch'||motion.matches)return;move(clamp(e.clientX+32,innerWidth-108),clamp(e.clientY+35,innerHeight-145))},{passive:true});
addEventListener('keydown',wake);addEventListener('pointerdown',wake,{passive:true});
addEventListener('scroll',()=>{wake();if(!following||motion.matches)dock();else if(!fine.matches&&!reacting)move(innerWidth-108,innerHeight-145)},{passive:true});
addEventListener('resize',()=>{if(!following||motion.matches)dock();else move(clamp(x,innerWidth-108),clamp(y,innerHeight-145),true)});
function peek(card){if(!following||motion.matches||footerVisible)return;const r=card.getBoundingClientRect();move(clamp(r.right-72,innerWidth-108),clamp(r.top+70,innerHeight-145));react('peeking',card.querySelector('h3').textContent.includes('One More Run')?'one more round?':'ooh, what’s this?')}
const cards=document.querySelectorAll('.project');cards.forEach(card=>{card.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')peek(card)});card.addEventListener('focusin',()=>peek(card))});
if('IntersectionObserver' in window){const seen=new WeakSet();const projects=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&!seen.has(e.target)&&!fine.matches&&following){seen.add(e.target);peek(e.target)}}),{threshold:.5});cards.forEach(card=>projects.observe(card));const footer=new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(visible&&!footerVisible&&following&&!motion.matches){move(clamp(innerWidth-130,innerWidth-108),clamp(innerHeight-155,innerHeight-145));react('celebrating','you made it! ✨')}footerVisible=visible},{threshold:.3});footer.observe(document.querySelector('footer'))}
motion.addEventListener('change',()=>{if(motion.matches){following=false;reacting=false;clearTimeout(reactionTimer);wrap.classList.remove('walking','happy','peeking','celebrating');sync();dock()}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){dock();wake()}});sync();dock();wake();
})();
