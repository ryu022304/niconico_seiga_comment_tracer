// content_script.jsから送られた静画IDを受け取ってニコニコ静画APIを叩いた結果を
// content_script.jsに返す
chrome.runtime.onConnect.addListener(function(port){
  if(port.name == 'niconico_seiga_comment_tracer'){
    port.onMessage.addListener(function(request){
      var seigaid = request.id;
      var id = seigaid.replace('im','')
      // 閲覧しているニコニコ静画イラストの全コメントを取得
      $.ajax({
        type: "GET",
        url: "http://seiga.nicovideo.jp/ajax/illust/comment/list?id="+id+"&mode=all",
        dataType: "json",
        success: function(datas){
          port.postMessage({datas: datas});
        },
        error: function () {
          port.postMessage({datas: 'error'});
        }
      });
    });
  }
});
