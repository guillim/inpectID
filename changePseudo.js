// making async some function with this helper
const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        reject();
      } else {
        resolve(result[key]);
      }
    });
  });
};

var w2pclick = document.getElementById('w2pclick');
var apiupdate = document.getElementById('apiupdate');
var corsupdate = document.getElementById('corsupdate');
var n8nupdate = document.getElementById('n8nupdate');

fetchID = async function(api,n8nURL,corsURL){
  var id = document.getElementById('idtoinspect');
  id &&= id.value;
  const myHeaders = await new Headers();
  myHeaders.append('X-API-KEY',api);
  myHeaders.append("X-Requested-With",n8nURL);
  myHeaders.append("Content-Type", "text/plain");
  
  const response = await fetch(corsURL+id,{
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    headers:myHeaders
  })

  // const reader = response.body.getReader();
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

  let obj
  while (true) {
    const {value, done} = await reader.read();
    
    if (done) break;
    obj = value
  }
  document.getElementById('code_for_json').innerHTML = JSON.stringify(JSON.parse(obj), null, "  ")

  
}


w2pclick.onclick = async function() {
  var id = document.getElementById('idtoinspect');
  id &&= id.value;
  chrome.storage.local.set({ idtoinspect: id }).then(() => {    console.log("i updated");  });

  const n8n = await readLocalStorage('n8n');
  const cors = await readLocalStorage('cors');
  const api = await readLocalStorage('api');

  document.getElementById('code_for_json').innerHTML = ''

  await fetchID(api,n8n,cors)
}



// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------


apiupdate.onclick = function() {
  var id = document.getElementById('api');
  id &&= id.value;
  chrome.storage.local.set({ api: id }).then(() => {    console.log("a updated");  });
}

n8nupdate.onclick = function() {
  var id = document.getElementById('n8n');
  id &&= id.value;
  chrome.storage.local.set({ n8n: id }).then(() => {    console.log("n updated");  });
}


corsupdate.onclick = function() {
  var id = document.getElementById('cors');
  id &&= id.value;
  chrome.storage.local.set({ cors: id }).then(() => {    console.log("c updated");  });
}



initialTrigger = function(){
  chrome.storage.local.get(["api"]).then((result) => {
    document.getElementById('api').defaultValue = result.api; 
  });
  chrome.storage.local.get(["n8n"]).then((result) => {
    document.getElementById('n8n').defaultValue = result.n8n; 
  });
  chrome.storage.local.get(["cors"]).then((result) => {
    document.getElementById('cors').defaultValue = result.cors; 
  });
  chrome.storage.local.get(["idtoinspect"]).then((result) => {
    document.getElementById('idtoinspect').defaultValue = result.idtoinspect; 
  });

}

initialTrigger()