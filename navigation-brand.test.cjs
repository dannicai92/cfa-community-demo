const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({headless:true,channel:'chrome'}),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto('file:///'+__dirname.replaceAll('\\','/')+'/index.html');
 await p.evaluate(()=>document.fonts.ready);
 assert.equal(await p.locator('.brand').innerText(),'Community');
 assert.equal(await p.locator('.brandmark').count(),0);
 assert.equal(await p.evaluate(()=>document.fonts.check('500 25px "Azo Sans"')),true);
 assert.ok(await p.evaluate(()=>[...document.fonts].some(f=>f.family==='Azo Sans'&&f.status==='loaded')));
 for(const width of [320,390,1280]){
  await p.setViewportSize({width,height:844});
  for(const screen of ['profile','nearProfile','selfProfile']){
   for(const target of ['opportunities','home','town','messages','me']){
    await p.evaluate(screen=>{state.peer='lin';go(screen)},screen);
    assert.equal(await p.locator('.phone>.bottomnav').count(),1);
    const nav=p.locator(`.phone>.bottomnav [data-go="${target}"]`);
    assert.equal(await nav.evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}),true);
    await nav.click();assert.equal(await p.evaluate(()=>state.screen),target);
   }
  }
 }
 await p.locator('.bottomnav [data-go="home"]').click();
 await p.getByRole('button',{name:'查看林知远主页',exact:true}).click();
 assert.equal(await p.evaluate(()=>state.screen),'profile');
 await p.locator('.profile-stats [data-kind="followers"]').click();
 await p.locator('.bottomnav [data-go="opportunities"]').click();
 await p.locator('.bottomnav [data-go="me"]').click();
 await p.locator('.profile-stats [data-kind="kudos"]').click();
 await p.locator('.minihead .back').click();assert.equal(await p.evaluate(()=>state.screen),'me');
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>go('profile'));
 await p.screenshot({path:'community-navigation-preview.png'});
 await p.locator('[data-language="en"]').click();
 assert.equal(await p.locator('.brand').innerText(),'Community');assert.match(await p.title(),/^Community/);
 assert.deepEqual(errors,[]);await b.close();console.log('PASS: embedded Azo Sans, Community identity, profile navigation hit targets at 3 widths, real profile entry and clean return history');
})().catch(e=>{console.error(e);process.exit(1)});
