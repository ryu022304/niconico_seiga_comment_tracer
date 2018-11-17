
var url = location.href ;
seiga_id = url.split('/')[4]
//console.log(seiga_id);

var port = chrome.runtime.connect({name: "test"});
port.postMessage({id: seiga_id});
port.onMessage.addListener(function(response) {
  //console.log("receive");
  var datas = response.datas;
  var comment_list = datas['comment_list']
  //console.log(comment_list);
  var arrow_list = getArrowComment(comment_list);
  addLinkToArrow(arrow_list);
});

// 矢印付きコメントの取得
// @param com_list 全コメント情報のリスト
// @ret   arrow_com_list 矢印付きコメントのidと参照先コメントのJSONリスト
function getArrowComment(com_list){
  var arrow_com_list = [];
  for(var i in com_list){
    var comment = com_list[i]['text'];
    var id = com_list[i]['id'];
    // 「↑数字」「↑*数字」「↑繰り返し」にマッチする
    // match[0]:マッチ全体、match[1]:矢印、match[2]:繰り返し数
    var match = comment.match(/^(↑+)\**([0-9]*)/);
    if(match != null){
      arrow_len = match[1].length;
      repeat_num = match[2]-0;

      if (arrow_len < repeat_num) {
        res_comment = com_list[i - repeat_num]['text']
        arrow_com_list.push({id:id,res:com_list[i - repeat_num]['text'],arrow:match[0]});
        //console.log('対象コメ：'+res_comment);
      }
      else{
        res_comment = com_list[i - arrow_len]['text']
        arrow_com_list.push({id:id,res:com_list[i - arrow_len]['text'],arrow:match[0]});
        //console.log('対象コメ：'+res_comment);
      }
      //console.log(match);
      //console.log(comment);
    }
  }
  return arrow_com_list;
}

// 対象のコメントの矢印部分に参照先のリンクを付ける
// リンクをオーバーマウスで参照先のコメントが吹き出しで表示される
// @param a_list 矢印付きコメントのidと参照先コメントのJSONリスト
function addLinkToArrow(a_list){
  //console.log(a_list);
  var ul_elements = document.getElementsByClassName("comment_info");

  for(var i in ul_elements){
    var id = ul_elements[i]['children'].item(2).innerText.match(/[0-9]+/)[0];
    var text = ul_elements[i]['children'].item(4).innerText;

    for(var j in a_list){
      if(a_list[j].id == id){
        var res_com = a_list[j].res;
        //console.log(res_com);
        var match = text.match(/^(↑+)\**([0-9]*)(.*)/);
        ul_elements[i]['children'].item(4).innerHTML =
        '<div class="cp_tooltip"><a href="#"><font color="red">'
        +match[1]+match[2]
        +'</font></a><span class="cp_tooltiptext">'
        +res_com+'</span></div>'+match[3];
      }
    }
  }
}
