/* Translate presentation only. Never translate data attributes, field values or user input. */
let language='zh';
try{language=localStorage.getItem('tongxing-language')==='en'?'en':'zh'}catch{}
const originalText=new WeakMap(),originalAttributes=new WeakMap();
const translationPattern=new RegExp(Object.keys(englishText).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
function translateText(text){return text.replace(translationPattern,key=>englishText[key]).replace(/(\d+) 年 /g,'$1/').replace(/截至\s*(\d+)月(\d+)日/g,'Until $1/$2').replace(/(\d+)\s*月\s*(\d+)\s*日/g,'$1/$2').replace(/(\d+) 条/g,'$1 comments').replace(/(\d+) 人/g,'$1 members')}
function localize(root=document.body){
 document.documentElement.lang=language==='en'?'en':'zh-CN';
 const userStrings=new Set([state.socialPost,state.draft,state.comment,...needs.filter(n=>n.mine).flatMap(n=>[n.text,n.title,n.org,n.target,n.industry]),...needs.map(n=>n.reply),...Object.values(state.sentMessages||{}).flat()].filter(Boolean));
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  if(node.parentElement.closest('script,style,textarea,[data-no-translate]'))continue;
  if(!originalText.has(node))originalText.set(node,node.textContent);
  const raw=originalText.get(node);node.textContent=language==='en'&&!userStrings.has(raw.trim())?translateText(raw):raw;
 }
 root.querySelectorAll('option').forEach(o=>{if(!o.hasAttribute('value'))o.value=originalText.get(o.firstChild)||o.textContent});
 root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{
  if(!originalAttributes.has(el))originalAttributes.set(el,Object.fromEntries(['placeholder','aria-label','title'].filter(k=>el.hasAttribute(k)).map(k=>[k,el.getAttribute(k)])));
  for(const [key,raw] of Object.entries(originalAttributes.get(el)))el.setAttribute(key,language==='en'?translateText(raw):raw);
 });
 document.title=language==='en'?'Tongxing · Member Community':'同行 · 会员社区';
}
function installLanguageMenu(){
 document.querySelectorAll('.capsule').forEach(el=>{if(el.querySelector('[data-language-menu]'))return;el.innerHTML='<button type="button" data-language-menu aria-label="语言设置" aria-haspopup="dialog" aria-expanded="false">•••</button><span aria-hidden="true">│ ⦿</span>'});
}
function closeLanguageMenu(){document.querySelector('#language-menu')?.remove();document.querySelector('[data-language-menu]')?.setAttribute('aria-expanded','false')}
function showLanguageMenu(){
 if(document.querySelector('#language-menu')){closeLanguageMenu();return}
 const menu=document.createElement('div');menu.id='language-menu';menu.setAttribute('role','dialog');menu.setAttribute('aria-label','Language / 语言');menu.dataset.noTranslate='';
 menu.innerHTML=`<strong>语言 / Language</strong><button type="button" data-language="zh" aria-pressed="${language==='zh'}">中文 <span>${language==='zh'?'✓':''}</span></button><button type="button" data-language="en" aria-pressed="${language==='en'}">English <span>${language==='en'?'✓':''}</span></button><button type="button" data-language-close>${language==='en'?'Close':'关闭'}</button>`;
 document.querySelector('.phone').append(menu);document.querySelector('[data-language-menu]').setAttribute('aria-expanded','true');menu.querySelector('[data-language="'+language+'"]').focus();
}
const languageRender=render;render=function(){languageRender();installLanguageMenu();localize()};
const languageToast=toast;toast=function(text){languageToast(language==='en'?translateText(text):text)};
document.addEventListener('click',e=>{
 const trigger=e.target.closest('[data-language-menu]');if(trigger){showLanguageMenu();return}
 const choice=e.target.closest('[data-language]');if(choice){language=choice.dataset.language;try{localStorage.setItem('tongxing-language',language)}catch{}closeLanguageMenu();localize();document.querySelector('[data-language-menu]')?.focus();return}
 if(e.target.closest('[data-language-close]')){closeLanguageMenu();document.querySelector('[data-language-menu]')?.focus();return}
 if(!e.target.closest('#language-menu'))closeLanguageMenu();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLanguageMenu();document.querySelector('[data-language-menu]')?.focus()}if(e.key==='Tab'){const menu=document.querySelector('#language-menu');if(!menu)return;const buttons=[...menu.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
