
var w2pclick = document.getElementById('w2pclick');
var apiupdate = document.getElementById('apiupdate');

var corsURL = ''
var n8nURL = ''

fetchID = function(secretAPIKEY){
  var id = document.getElementById('addPseudo');
  id &&= id.value;
  const myHeaders = new Headers();
  myHeaders.append('X-API-KEY',secretAPIKEY);
  myHeaders.append("X-Requested-With",n8nURL);
  myHeaders.append("Content-Type", "text/plain");

  fetch(corsURL+id,{
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    headers:myHeaders
  })
  .then(res => {document.getElementById('code_for_json').innerHTML = JSON.stringify(res)})
  .catch(err => {document.getElementById('code_for_json').innerHTML = JSON.stringify(err)})
}



w2pclick.onclick = function() {
  var id = document.getElementById('addPseudo');
  id &&= id.value;

  document.getElementById('code_for_json').innerHTML = ''

  chrome.storage.local.get(["secretAPIKEY"]).then((result) => {
    return result.secretAPIKEY; 
  }).then((key) => {
    return fetchID(key)
  })
}

apiupdate.onclick = function() {
  var id = document.getElementById('secretAPIKEY');
  id &&= id.value;
 
  chrome.storage.local.set({ secretAPIKEY: id }).then(() => {
    console.log("Value is updated");
  });
}

initialTrigger = function(){
  chrome.storage.local.get(["secretAPIKEY"]).then((result) => {
    var id = document.getElementById('secretAPIKEY');
    id.defaultValue = result.secretAPIKEY; 
  });
}


initialTrigger()