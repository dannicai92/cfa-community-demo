/* Session-only relationships and kudos for the interactive demo. */
(() => {
  const tr = (zh, en) => typeof language !== 'undefined' && language === 'en' ? en : zh;
  const person = id => id === 'self' ? {name:'陈安',role:'CFA 会员',city:'深圳',bio:'从一次认真交流开始，找到自己的同行。'} : peers[id];
  const edges = new Set(['self:xu','zhou:self','lin:self','lin:xu','zhou:lin','xu:lin']);
  const kudos = [
    {from:'zhou',to:'self',text:'总能认真听完别人的问题，再分享具体的建议。和你交流很舒服。',status:'visible'},
    {from:'lin',to:'self',text:'谢谢你分享阅读笔记，让我发现了不少新的视角。',status:'visible'},
    {from:'xu',to:'lin',text:'那次交流帮我把职业转型的问题拆得更具体，也少了一些焦虑。',status:'visible'},
    {from:'gu',to:'self',text:'很喜欢你对行业问题的好奇心，期待下次交流！',status:'pending'}
  ];
  let owner='self', tab='following', target='lin', draft='', consent=false;
  const history=[];
  function visit(route,change=()=>{}){history.push({from:state.screen,to:route,back:backMap[route],owner,tab,peer:state.peer});backMap[route]=state.screen;change();oldGo(route);}
  const visible = id => kudos.filter(k=>k.to===id && k.status==='visible');
  function sync(){if(state.following)edges.add('self:lin');else edges.delete('self:lin');}
  function related(id,kind){sync();return [...edges].map(x=>x.split(':')).filter(([a,b])=>kind==='following'?a===id:b===id).map(([a,b])=>kind==='following'?b:a).filter(x=>person(x)&&!state.blockedPeers[x]);}
  const action=(name,label,extra='',cls='')=>`<button type="button" class="${cls}" data-social="${name}" ${extra}>${label}</button>`;
  function stats(id){return `<div class="profile-stats" data-no-translate aria-label="${tr('社交数据','Social stats')}">${[['following',tr('关注','Following'),related(id,'following').length],['followers',tr('被关注','Followers'),related(id,'followers').length],['kudos',tr('夸夸','Kudos'),visible(id).length]].map(([kind,label,n])=>action('list',`<strong>${n}</strong><span>${label}</span>`,`data-owner="${id}" data-kind="${kind}"`)).join('')}</div>`;}
  const follow=id=>action('follow',edges.has('self:'+id)?tr('已关注','Following'):tr('关注','Follow'),`data-person="${id}" aria-pressed="${edges.has('self:'+id)}"`,'social-follow');
  function tools(id){return `<div class="social-tools" data-no-translate>${follow(id)}${action('write',tr('夸夸TA','Send kudos'),`data-person="${id}"`,'social-kudos')}</div>`;}
  const profileTabs={};
  let ownLiked=false,ownComment='';
  function personalFeed(id){
    const cards=[];
    if(id==='self'&&state.socialPost)cards.push(`<article class="card" data-no-translate><div class="author">${av('陈')}<div><strong>陈安</strong><div class="meta">${tr('刚刚','Just now')}</div></div></div>${action('own-post',`<p class="bodytext">${esc(state.socialPost)}</p>`,'','profile-post-copy')}<div class="reactions">${action('own-like',ico('heart')+' '+(ownLiked?1:0),`aria-pressed="${ownLiked}"`)}${action('own-post',ico('chat')+' '+(ownComment?1:0))}</div></article>`);
    visibleNeeds().filter(n=>n.name===person(id).name).sort((a,b)=>b.time.localeCompare(a.time)).forEach(n=>cards.push(demandPost(n)));
    if(id==='lin'&&!state.blocked)cards.push(postCard().replace(/<div class="feed-validity">[\s\S]*?<\/div>/,'<div class="meta">2026-10-14 · 深圳</div>').replace(`${ico('chat')} 8`,`${ico('chat')} ${state.comment?9:8}`));
    return `<section class="personal-feed" aria-label="${tr('个人动态','Personal posts')}">${cards.join('')||`<div class="empty" data-no-translate>${id==='self'?tr('你的第一条动态，从一个想法开始。','Your first post starts with a thought.'):tr('TA 还没有发布动态。','No posts yet.')}${id==='self'?'<button class="backlink" data-go="compose">'+tr('发一条动态','Write a post')+'</button>':''}</div>`}</section>`;
  }
  function profilePage(html,id){
    const marker=id==='lin'||id==='self'?'<section class="sectionbox"':'<h3>可以聊什么</h3>';
    const split=html.indexOf(marker);
    let head=split<0?html:html.slice(0,split),about=split<0?'':html.slice(split);
    const interests=about.match(/<section class="sectionbox"><h3>工作之外<\/h3>([\s\S]*?)<\/section>/);
    if(interests){head=head.replace('</h1>',`</h1><div class="profile-interests" aria-label="${tr('兴趣','Interests')}">${interests[1]}</div>`);about=about.replace(interests[0],'');}
    head=head.replace(/<button class="selected" data-act="verifyInfo">[\s\S]*?<\/button>/,'');
    head=head.replace(/<span class="verified">身份已核验<\/span>/g,`<button class="verified profile-verification" data-social="verify" aria-label="${tr('查看身份核验说明','View verification details')}">${tr('身份已核验','Identity verified')}</button>`);
    if(id!=='lin'&&id!=='self'){head+='</div>';about='<div class="inset">'+about;}
    about=about.replace(/<section class="sectionbox"><h3>最近分享<\/h3>[\s\S]*?<\/section>/,'');
    const active=profileTabs[id]||'posts';
    const switcher=`<div class="profile-content-tabs" data-no-translate>${[['posts',tr('动态','Posts')],['about',id==='self'?tr('关于我','About me'):tr('关于TA','About')]].map(([key,label])=>action('profile-tab',label,`data-person="${id}" data-view="${key}" aria-pressed="${active===key}"`,active===key?'active':'')).join('')}</div>`;
    return head+switcher+(active==='posts'?personalFeed(id):`<div class="profile-about">${about}</div>`);
  }
  function praiseList(id){
    const rows=kudos.map((k,i)=>({...k,i})).filter(k=>k.to===id&&(k.status==='visible'||id==='self'));
    return `<div class="inset" data-no-translate><h1 class="page-title">${id==='self'?tr('收到的夸夸','Your kudos'):tr('同行的夸夸','Peer kudos')}</h1>${id!=='self'?tools(id):`<p class="hint">${tr('你决定哪些夸夸展示在主页上。待确认和已隐藏的内容仅自己可见。','Choose which kudos appear on your profile. Pending and hidden kudos are private.')}</p>`}${rows.map(k=>`<article class="kudos-card">${action('person',esc(person(k.from).name),`data-person="${k.from}"`,'kudos-author')}<p>${esc(k.text)}</p><footer>${k.status==='visible'?tr('已展示','Visible'):k.status==='pending'?tr('待你确认 · 仅自己可见','Pending · private'):tr('已隐藏 · 仅自己可见','Hidden · private')}${id==='self'?action(k.status==='visible'?'hide':'show',k.status==='visible'?tr('隐藏','Hide'):tr('展示到主页','Show on profile'),`data-index="${k.i}"`):''}</footer></article>`).join('')||`<div class="empty">${tr('还没有夸夸，一次暖心回应就能开启。','No kudos yet. A thoughtful exchange is a good start.')}</div>`}</div>`;
  }
  for(const [id,title] of [['personalPost','我的动态'],['socialConnections','关注与被关注'],['kudos','同行的夸夸'],['selfProfile','我的主页']])addScreen(id,title,'','','','','');
  const oldBody=body,oldFoot=foot,oldGo=go,oldAct=act;
  body=function(s,p){
    if(s==='nearProfile'&&state.peer==='lin')return body('profile',p);
    if(s==='socialConnections'){
      const ids=related(owner,tab);
      return `<div class="inset" data-no-translate><h1 class="page-title">${esc(person(owner).name)}</h1><div class="social-tabs">${['following','followers'].map(kind=>action('tab',kind==='following'?tr('关注','Following'):tr('被关注','Followers'),`data-kind="${kind}" aria-pressed="${tab===kind}"`,tab===kind?'active':'')).join('')}</div>${ids.map(id=>`<div class="social-person">${action('person',`<span class="avatar">${esc(person(id).name[0])}</span><span><strong>${esc(person(id).name)}</strong><small>${esc(person(id).role)} · ${esc(person(id).city)}</small></span>`,`data-person="${id}"`,'social-person-link')}${id==='self'?`<span>${tr('我','Me')}</span>`:follow(id)}</div>`).join('')||`<div class="empty">${tr('这里暂时还没有同行。','No peers here yet.')}</div>`}</div>`;
    }
    if(s==='kudos')return praiseList(owner);
    if(s==='personalPost')return '<div class="inset" data-no-translate><h1 class="page-title">'+tr('我的动态','My post')+'</h1><p class="bodytext personal-post-text">'+esc(state.socialPost||'')+'</p><div class="reactions">'+action('own-like',ico('heart')+' '+(ownLiked?1:0))+'</div><h3>'+tr('评论','Comments')+'</h3>'+(ownComment?'<p class="quote">陈安 · '+esc(ownComment)+'</p>':'')+'<label class="field">'+tr('参与讨论','Join the conversation')+'<textarea id="personal-comment" maxlength="500"></textarea></label>'+action('own-comment',tr('发送评论','Send comment'),'','secondary')+'</div>';

    if(s==='selfProfile')return profilePage(`<div class="profile-cover"></div><div class="profile-head">${av('陈','large')}<h1>陈安</h1><p class="bodytext">深圳 · CFA 会员</p>${stats('self')}<p class="bodytext">从一次认真交流开始，找到自己的同行。</p></div><section class="sectionbox" data-no-translate><h3>${tr('同行的夸夸','Peer kudos')}</h3>${visible('self').map(k=>`<p class="quote">${esc(k.text)}</p>`).join('')||`<p>${tr('还没有展示的夸夸','No public kudos yet')}</p>`}${action('list',tr('查看全部','View all'),'data-owner="self" data-kind="kudos"','backlink')}</section>`,'self');
    if(s==='thanks'){
      const sent=kudos.some(k=>k.from==='self'&&k.to===target);
      return `<div class="inset" data-no-translate><h1 class="page-title">${tr('TA 哪一点打动了你？','What do you appreciate about them?')}</h1><p class="subtitle">${tr('写给','To')} ${esc(person(target).name)}</p><label class="field">${tr('夸夸TA','Send kudos')}<textarea id="kudos-text" maxlength="300" ${sent?'disabled':''} placeholder="${tr('一次耐心解答、一个有用的建议，都值得夸一夸。','A patient answer or a useful suggestion is worth celebrating.')}" rows="5">${esc(draft)}</textarea></label><label class="check"><input id="kudos-consent" type="checkbox" ${consent?'checked':''} ${sent?'disabled':''}>${tr('同意以我的姓名展示这条夸夸','Show this kudos with my name')}</label><p class="hint">${tr('最多 300 字。对方确认后，才会展示在 TA 的主页。','Up to 300 characters. Visible on their profile only after they accept.')}</p>${sent?`<div class="banner">${tr('夸夸已送达，等待 TA 确认。','Kudos sent, awaiting their approval.')}</div>`:''}<p class="error" id="kudos-error" role="alert"></p></div>`;
    }
    let html=oldBody(s,p);
    if(s==='me')html=html.replace('<button class="banner fullwidth"',stats('self')+'<button class="banner fullwidth"').replace('data-go="profile"','data-go="selfProfile"');
    if(s==='profile')html=html.replace('<div class="inline-options">',stats('lin')+'<div class="inline-options">').replace(/<button data-act="follow">[\s\S]*?<\/button>/,tools('lin')).replace(/<section class="sectionbox"><div class="section-head" style="margin-top:0"><h3>同行的夸夸<\/h3>[\s\S]*?<\/section>/,`<section class="sectionbox" data-no-translate><h3>${tr('同行的夸夸','Peer kudos')}</h3>${visible('lin').map(k=>`<p class="quote">${esc(k.text)}</p>`).join('')}${action('list',tr('查看全部夸夸','View all kudos'),'data-owner="lin" data-kind="kudos"','backlink')}</section>`);
    if(s==='nearProfile')html=html.replace('<h3>可以聊什么</h3>',stats(state.peer)+tools(state.peer)+'<h3>可以聊什么</h3>');
    if(['profile','nearProfile'].includes(s))return profilePage(html,s==='profile'?'lin':state.peer);
    return html;
  };
  foot=function(s){if(s==='thanks')return `<div class="actionbar" data-no-translate>${action('send',tr('送出夸夸','Send kudos'),kudos.some(k=>k.from==='self'&&k.to===target)?'disabled':'','primary')}</div>`;return oldFoot(s);};
  go=function(s){
    if(['profile','nearProfile','selfProfile'].includes(state.screen)&&['post','need'].includes(s))backMap[s]=state.screen;
    const frame=history.at(-1);
    if(frame&&state.screen===frame.to&&s===frame.from){history.pop();backMap[frame.to]=frame.back;owner=frame.owner;tab=frame.tab;state.peer=frame.peer;return oldGo(s);}
    if(s==='thanks'){target=state.screen==='nearProfile'?state.peer:state.screen==='kudos'?owner:'lin';if(target==='self')return;draft='';consent=false;backMap.thanks=state.screen;}
    if(s==='selfProfile')backMap.selfProfile='me';
    return oldGo(s);
  };
  act=function(a){const result=oldAct(a);if(a==='follow')sync();return result;};
  document.addEventListener('input',e=>{if(e.target.id==='kudos-text')draft=e.target.value;});
  document.addEventListener('change',e=>{if(e.target.id==='kudos-consent')consent=e.target.checked;});
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-social]');if(!b){if(e.target.closest('[data-language]'))render();return;}
    const a=b.dataset.social,id=b.dataset.person;
    if(a==='list'){visit(b.dataset.kind==='kudos'?'kudos':'socialConnections',()=>{owner=b.dataset.owner;tab=b.dataset.kind;});}
    if(a==='profile-tab'){profileTabs[id]=b.dataset.view;render();}
    if(a==='own-post'){visit('personalPost');}
    if(a==='own-like'){ownLiked=!ownLiked;render();}
    if(a==='own-comment'){const text=value('personal-comment').trim();if(!text)return toast(tr('请先填写评论','Write a comment first'));ownComment=text.slice(0,500);render();}
    if(a==='verify'){toast(tr('演示身份核验标识；不代表投资能力、机构授权或收益保证。','Demo identity verification; not an endorsement of investment ability, organizational authority or returns.'));}
    if(a==='tab'){
tab=b.dataset.kind;render();}
    if(a==='follow'){const key='self:'+id;if(edges.has(key))edges.delete(key);else edges.add(key);if(id==='lin')state.following=edges.has(key);render();}
    if(a==='person'){visit(id==='self'?'selfProfile':'nearProfile',()=>{if(id!=='self')state.peer=id;});}
    if(a==='write'){visit('thanks',()=>{target=id;draft='';consent=false;});}
    if(a==='send'){
      if(kudos.some(k=>k.from==='self'&&k.to===target))return;
      const text=document.getElementById('kudos-text').value.trim();
      if(!text||!consent){document.getElementById('kudos-error').textContent=!text?tr('写一句具体的夸夸吧。','Write a specific compliment.'):tr('请确认具名展示。','Please confirm attribution.');return;}
      kudos.push({from:'self',to:target,text:text.slice(0,300),status:'pending'});render();toast(tr('夸夸已送达，等待 TA 确认','Kudos sent, awaiting approval'));
    }
    if(a==='show'||a==='hide'){const k=kudos[Number(b.dataset.index)];if(k?.to!=='self')return;k.status=a==='show'?'visible':'hidden';render();}
  });
})();
