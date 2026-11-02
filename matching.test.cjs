const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx=vm.createContext({console,Date,state:{},needs:[{}],screens:[],backMap:{},addScreen(){},body(){},newCompose(){},vact(){},foot(){},document:{addEventListener(){}},visibleNeeds(){return ctx.needs.filter(n=>n.status==='approved')},esc:String,field(){},input(){},peers:{},cb(){}});
vm.runInContext(fs.readFileSync(__dirname+'/matching.js','utf8'),ctx);
vm.runInContext(`
needs.push({id:'test',category:'买卖方交流',matchType:'卖方资源',industry:'科技',status:'approved',expires:'2099-12-31'});
if(matchingRecords(matchingSpaces.research,{matchType:'卖方资源'}).length!==1)throw Error('type filter');
if(matchingRecords(matchingSpaces.capital).some(n=>n.id==='test'))throw Error('category isolation');
needs.find(n=>n.id==='test').status='closed';
if(matchingRecords(matchingSpaces.research).some(n=>n.id==='test'))throw Error('closed record');
needs.find(n=>n.id==='test').status='approved';needs.find(n=>n.id==='test').expires='2000-01-01';
if(matchingRecords(matchingSpaces.research).some(n=>n.id==='test'))throw Error('expiry');
`,ctx);
console.log('Matching category, filters, closure and expiry tests passed.');
