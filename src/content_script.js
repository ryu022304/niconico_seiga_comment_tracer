
var url = location.href ;
seiga_id = url.split('/')[4]
console.log(seiga_id);

var port = chrome.runtime.connect({name: "test"});
port.postMessage({id: seiga_id});
port.onMessage.addListener(function(response) {
  console.log("receive");
  var datas = response.datas;
  var comment_list = datas['comment_list']
  console.log(comment_list);
});
