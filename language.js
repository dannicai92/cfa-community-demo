/* Translate presentation only. Never translate data attributes, field values or user input. */
let language='zh';
try{language=localStorage.getItem('tongxing-language')==='en'?'en':'zh'}catch{}
const originalText=new WeakMap(),originalAttributes=new WeakMap();
const chineseMonths=Object.fromEntries(['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].map((month,i)=>[month,(i+1)+'月']));
const translationPattern=new RegExp(Object.keys(englishText).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
function translateText(text){return text.replace(translationPattern,key=>englishText[key]).replace(/(\d+) 年 /g,'$1/').replace(/截至\s*(\d+)月(\d+)日/g,'Until $1/$2').replace(/(\d+)\s*月\s*(\d+)\s*日/g,'$1/$2').replace(/(\d+) 条/g,'$1 comments').replace(/(\d+) 人/g,'$1 members')}
function localize(root=document.body){
 document.documentElement.lang=language==='en'?'en':'zh-CN';
 const userStrings=new Set([state.socialPost,state.draft,state.comment,...needs.filter(n=>n.mine).flatMap(n=>[n.text,n.title,n.org,n.target,n.industry]),...needs.map(n=>n.reply),...Object.values(state.sentMessages||{}).flat()].filter(Boolean));
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  if(node.parentElement.closest('script,style,textarea,[data-no-translate]'))continue;
  if(!originalText.has(node))originalText.set(node,node.textContent);
  const raw=originalText.get(node);node.textContent=language==='en'&&!userStrings.has(raw.trim())?translateText(raw):(language==='zh'&&node.parentElement.closest('.calendar')?raw.replace(/\b(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/g,month=>chineseMonths[month]):raw);
 }
 root.querySelectorAll('option').forEach(o=>{if(!o.hasAttribute('value'))o.value=originalText.get(o.firstChild)||o.textContent});
 root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{
  if(!originalAttributes.has(el))originalAttributes.set(el,Object.fromEntries(['placeholder','aria-label','title'].filter(k=>el.hasAttribute(k)).map(k=>[k,el.getAttribute(k)])));
  for(const [key,raw] of Object.entries(originalAttributes.get(el)))el.setAttribute(key,language==='en'?translateText(raw):raw);
 });
 document.title=language==='en'?'Community · Member Community':'Community · 会员社区';
}
function installLanguageSwitch(){
 document.querySelectorAll('.capsule').forEach(el=>{
  el.classList.add('language-switch');el.setAttribute('role','group');el.setAttribute('aria-label','Language / 语言');el.dataset.noTranslate='';
  el.innerHTML=['zh','en'].map(code=>'<button type="button" data-language="'+code+'" aria-label="'+(code==='zh'?'中文':'English')+'" aria-pressed="'+(language===code)+'">'+(code==='zh'?'CN':'EN')+'</button>').join('');
 });
}
// Re-render bilingual components, retaining unfinished form input and scroll position.
function setLanguage(next){
 if(!['zh','en'].includes(next)||next===language)return;
 const fields=[...document.querySelectorAll('.phone input,.phone textarea,.phone select')].map((el,index)=>({id:el.id,index,value:el.value,checked:el.checked}));
 const scrollTop=document.querySelector('.phone .scroll')?.scrollTop||0;
 language=next;try{localStorage.setItem('tongxing-language',language)}catch{}
 render();
 const updated=[...document.querySelectorAll('.phone input,.phone textarea,.phone select')];
 fields.forEach(field=>{const el=field.id?document.getElementById(field.id):updated[field.index];if(el&&el.type!=='file'){el.value=field.value;if('checked' in el)el.checked=field.checked;}});
 const scroller=document.querySelector('.phone .scroll');if(scroller)scroller.scrollTop=scrollTop;
 document.querySelector('[data-language="'+language+'"]')?.focus({preventScroll:true});
}
const languageRender=render;render=function(){languageRender();installLanguageSwitch();localize()};
const languageToast=toast;toast=function(text){languageToast(language==='en'?translateText(text):text)};
document.addEventListener('click',e=>{
 const choice=e.target.closest('[data-language]');if(choice)setLanguage(choice.dataset.language);
});
