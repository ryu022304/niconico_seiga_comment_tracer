// URLから静画IDの取得、対象コメントに対するHTML要素の追加等を行う

var url = location.href ;
var seiga_id = url.split('/')[4];
var seiga_id = seiga_id.split('?')[0];

// backgroung.jsへ静画IDの送付
var port = chrome.runtime.connect({name: "niconico_seiga_comment_tracer"});
port.postMessage({id: seiga_id});

// background.jsから全静画コメントを受信して処理を行う
port.onMessage.addListener(function(response) {
  var datas = response.datas;
  var comment_list = datas['comment_list'];
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
    //コメント中の全角英数字を半角に変換
    comment = comment.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    // 「↑数字」「↑*数字」「↑×数字」「↑繰り返し」にマッチする
    // match[0]:マッチ全体、match[1]:矢印、match[2]:繰り返し数
    var match = comment.match(/^(↑+)[\*×]*([0-9]*)/);
    if(match != null){
      arrow_len = match[1].length;
      repeat_num = match[2]-0;
      // 「↑64の世代は〜」「↑100年後は〜」とかの例外処理
      if(repeat_num > com_list.length){
        repeat_num = 0;
      }
      //「↑10」「↑*10」「↑×10」とかの場合
      if (arrow_len < repeat_num) {
        res_comment = com_list[i - repeat_num]['text']
        arrow_com_list.push({id:id,res:com_list[i - repeat_num]['text'],arrow:match[0]});
      }
      // 「↑↑↑」とかの場合
      else{
        res_comment = com_list[i - arrow_len]['text']
        arrow_com_list.push({id:id,res:com_list[i - arrow_len]['text'],arrow:match[0]});
      }
    }
  }
  return arrow_com_list;
}

// 対象のコメントの矢印部分に参照先のリンクを付ける
// リンクをオーバーマウスで参照先のコメントが吹き出しで表示される
// @param a_list 矢印付きコメントのidと参照先コメントのJSONリスト
function addLinkToArrow(a_list){
  // HTML上のコメント欄の要素を取得
  var ul_elements = document.getElementsByClassName("comment_info");

  for(var i in ul_elements){
    // コメント欄以外に使われているcomment_infoの要素を取ってきた時はスルーする
    if(typeof ul_elements[i]['children'] == 'undefined'){
      continue;
    }
    // コメントID
    var id = ul_elements[i]['children'].item(2).innerText.match(/[0-9]+/)[0];
    // コメント文
    var text = ul_elements[i]['children'].item(4).innerText;
    //コメント中の全角英数字を半角に変換
    text = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    // 矢印付きコメントにマウスオーバー時の処理を追加
    for(var j in a_list){
      if(a_list[j].id == id){
        var res_com = a_list[j].res;
        var match = text.match(/^(↑+)([\*×]*)([0-9]*)(.*)/);
        ul_elements[i]['children'].item(4).innerHTML =
        '<div class="cp_tooltip"><a href="#"><font color="red">'
        +match[1]+match[2]+match[3]
        +'</font></a><span class="cp_tooltiptext">'
        +res_com+'</span></div>'+match[4];
      }
    }
  }
}
