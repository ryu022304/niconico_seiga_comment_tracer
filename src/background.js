
chrome.runtime.onConnect.addListener(function(port){
  port.onMessage.addListener(function(request){
    var seigaid = request.id;
    var id = seigaid.replace('im','')
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
});
