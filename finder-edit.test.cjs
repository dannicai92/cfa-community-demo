const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({headless:true,channel:'chrome'}),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto('file:///'+__dirname.replaceAll('\\','/')+'/index.html');
 assert.equal(await p.evaluate(()=>state.screen),'opportunities');
 assert.equal(await p.locator('.discover-finder').count(),0);
 assert.equal(await p.locator('.phone > .finder-fab').count(),1);
 await p.getByRole('button',{name:'帮我找',exact:true}).click();
 assert.equal(await p.evaluate(()=>state.screen),'finder');
 await p.locator('[data-finder-example="0"]').click();
 assert.ok(await p.locator('[data-finder-result]').count()>0);
 await p.locator('[data-finder-result]').first().click();
 assert.equal(await p.evaluate(()=>state.screen),'nearProfile');
 await p.locator('.minihead .back').click();assert.equal(await p.evaluate(()=>state.screen),'finder');
 await p.locator('.minihead .back').click();assert.equal(await p.evaluate(()=>state.screen),'opportunities');
 for(const width of [320,390,1280]){
  await p.setViewportSize({width,height:844});
  const discover=await p.locator('.finder-fab').boundingBox();
  assert.equal(await p.locator('.finder-fab').evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}),true);
  const nav=await p.locator('.bottomnav').boundingBox();assert.ok(discover.y+discover.height<nav.y);
  await p.locator('.bottomnav [data-go="home"]').click();
  const home=await p.locator('.finder-fab').boundingBox();assert.deepEqual(discover,home);
  await p.locator('.bottomnav [data-go="opportunities"]').click();
 }

 await p.setViewportSize({width:390,height:844});await p.screenshot({path:'discover-finder-preview.png'});
 await p.getByRole('button',{name:'我的',exact:true}).click();
 await p.getByRole('button',{name:'编辑资料',exact:true}).click();
 assert.equal(await p.locator('#profile-dialog').count(),0);
 await p.locator('#edit-bio').fill('草稿会保留 Draft preserved');
 await p.locator('[data-language-menu]').click();await p.locator('[data-language="en"]').click();
 assert.equal(await p.locator('#edit-bio').inputValue(),'草稿会保留 Draft preserved');
 await p.locator('#edit-role').fill('');await p.getByRole('button',{name:'Save profile',exact:true}).click();
 assert.match(await p.locator('#profile-edit-error').innerText(),/role/);
 await p.locator('#edit-role').fill('研究');await p.locator('#edit-interests').fill('1,2,3,4,5,6,7');
 await p.getByRole('button',{name:'Save profile',exact:true}).click();assert.match(await p.locator('#profile-edit-error').innerText(),/6 tags/);
 await p.locator('#edit-interests').fill('阅读,徒步');await p.getByRole('button',{name:'Save profile',exact:true}).click();
 assert.equal(await p.locator('#inline-profile-editor').count(),0);assert.match(await p.locator('.profile-head').innerText(),/草稿会保留/);
 await p.getByRole('button',{name:'Edit profile',exact:true}).click();
 for(const width of [320,390,1280]){await p.setViewportSize({width,height:844});assert.equal(await p.locator('#inline-profile-editor').evaluate(e=>e.scrollWidth>e.clientWidth+1),false);}
 await p.locator('[data-language-menu]').click();await p.locator('[data-language="zh"]').click();
 await p.setViewportSize({width:390,height:844});await p.locator('#inline-profile-editor').scrollIntoViewIfNeeded();await p.screenshot({path:'inline-edit-preview.png'});
 assert.deepEqual(errors,[]);await b.close();console.log('PASS: Discover finder search/results/back, inline edit draft preservation, validation and responsive layouts');
})().catch(e=>{console.error(e);process.exit(1)});
