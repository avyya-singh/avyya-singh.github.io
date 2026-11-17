const themeButton=document.querySelector('.theme');
let preferredTheme=null;try{preferredTheme=localStorage.getItem('avyya-anime-theme')}catch{}
if(preferredTheme==='dark'||(!preferredTheme&&matchMedia('(prefers-color-scheme: dark)').matches))document.body.classList.add('dark');
function updateThemeLabel(){themeButton.setAttribute('aria-label',`Switch to ${document.body.classList.contains('dark')?'light':'dark'} theme`)}updateThemeLabel();
themeButton.addEventListener('click',()=>{document.body.classList.toggle('dark');updateThemeLabel();try{localStorage.setItem('avyya-anime-theme',document.body.classList.contains('dark')?'dark':'light')}catch{}});
const progress=document.querySelector('.progress');function updateProgress(){const total=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${total>0?scrollY/total*100:0}%`}addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
document.querySelector('#year').textContent=new Date().getFullYear();


// Keep navigation in sync with the section nearest the header.
const sectionLinks=[...document.querySelectorAll('nav a[href^="#"]')];
const navSections=sectionLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
let navFrame=0;
function updateActiveSection(){navFrame=0;let active=null;for(const section of navSections){if(section.getBoundingClientRect().top<=150)active=section.id}for(const link of sectionLinks){const selected=link.getAttribute('href')===`#${active}`;if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')}}
function scheduleNav(){if(!navFrame)navFrame=requestAnimationFrame(updateActiveSection)}
addEventListener('scroll',scheduleNav,{passive:true});addEventListener('resize',scheduleNav);updateActiveSection();
