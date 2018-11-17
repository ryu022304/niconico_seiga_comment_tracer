
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
  addLinkToArrow(comment_list);
});

function addLinkToArrow(com_list){
  displayed_com_list = com_list.slice(-10);

  for(var i in com_list){
    var comment = com_list[i]['text'];
    var id = com_list[i]['id'];
    // 「↑数字」「↑*数字」「↑繰り返し」にマッチする
    var match = comment.match(/^(↑+)(\**)([0-9]*)/);
    if(match != null){
      arrow_len = match[1].length;
      repeat_num = match[3]-0;

      if (arrow_len < repeat_num) {
        res_comment = com_list[i - repeat_num]['text']
        console.log('対象コメ：'+res_comment);
      }
      else{
        res_comment = com_list[i - arrow_len]['text']
        console.log('対象コメ：'+res_comment);
      }
      //console.log(match);
      console.log(comment);
    }
  }
}
