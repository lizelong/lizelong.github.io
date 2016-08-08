//============== 随机显示标题 start
var title = [
  '穷则独善其身，富则妻妾成群',
  '君子成人之美，小人夺人所爱',
  '英雄宝刀未老，老娘风韵犹存',
  '天生我材必有用，老鼠儿子会打洞',
  '书到用时方恨少，钱到月底不够花',
  '两个黄鹂鸣翠柳，一行白鹭上西天',
  '问君能有几多愁，恰似一群太监上青楼',
  '相爱没有那么容易，每个人都有他的手机',
  '如果天黑之前来得及，我要挖了你的眼睛',
  '你所有为人称道的美丽，都有PS的痕迹',
  '想飞上天和太阳肩并肩',
  '大爷听过我的歌，小伙亲过我的脸',
  '答应我你从此不在深夜里排队',
  '我们坐在高高的骨灰旁边～～',
  '千万别说你一无所有，至少你还有病啊'
];
var index = Math.ceil(Math.random() * title.length);
$('#project_tagline').html(title[index]);
//============== 随机显示标题 end

//实现PHP的in_array功能
// function in_array(val, arr) {
//   for (var x = 0; x < arr.length; x++) {
//     if (val == arr[x]['id']) {
//       return true;
//     }
//   }
//   return false;
// }

//============== 获取上一篇下一篇的标题信息 start
function getTitle() {
  //ajax请求
  $.get('./title.html', '', function(res){
    var str = '<div class="post-prev">';
    for (var i = 0; i < res.length; i++) {
      if (res[i]['id'] == $_GET['id']) {
        //修改标题和描述
        document.title = res[i]['title']; 
        $('meta[name=description]').attr('content', res[i]['des']);
        //修改页面中的标题和发表时间
        $('.widget-title a').html(res[i]['title']); 
        $('.widget-meta span:first').html('发表于 ' + res[i]['time'])

        //获取上一条的标题
        if ($_GET['id'] <= 1) {
          str += '<a class="disabled"><span>&larr;</span>没有了</a></div><div class="post-next">';
        } else {
          str += '<a href="?id='+ res[i+1]['id'] +'"><span>&larr;</span> '+ res[i+1]['title'] +'</a></div><div class="post-next">';
        }

        //获取下一条的标题
        if ($_GET['id'] >= res.length) {
          str += '<a class="disabled">没有了<span>&rarr;</span></a></div>';
        } else {
          str += '<a href="?id='+ res[i-1]['id'] +'">'+ res[i-1]['title'] +'<span>&rarr;</span></a> </div>';
        }
      }
    }
    $('.post-navigation').html(str);
  }, 'json');
}
//============== 获取上一篇下一篇的标题信息 end


//============== 模拟PHP获取URL传的参数，比如$_GET['id']
var $_GET = (function(){
  var url = window.document.location.href.toString();
  var u = url.split("?");
  if(typeof(u[1]) == "string"){
      u = u[1].split("&");
      var get = {};
      for(var i in u){
          var j = u[i].split("=");
          get[j[0]] = j[1];
      }
      return get;
  } else {
      return {};
  }
})();
//============== 模拟PHP获取URL传的参数 end


//============== 获取帖子内容 start
$.ajax({
  url: './post/'+ $_GET['id'] +'.html',
  type: 'get',
  success: function(res){
    if (res) {
      $('.widget-body').html(res);
    }
    //获取翻页标题
    getTitle();
  },
  error: function(){
    window.location.href = './index.html';
  }
})
//============== 获取帖子内容 end


//============== 滚动显示到顶和到底按钮 start
$(window).scroll(function(){
  if ($(window).scrollTop() > 10) {
    $('.position-btn').show(800);
  } else {
    $('.position-btn').hide(800);
  }
})
//============== 滚动显示到顶和到底按钮 end


//============== 点击跑动滚动条 start
function pao(flag) {
  if (flag) {
    $('html,body').animate({'scrollTop': '0px'}, 1000);
  } else {
    $('html,body').animate({'scrollTop': $(document).height() + 'px'}, 1000);
  }
}
//============== 点击跑动滚动条 end


//======================= 评论列表 start
$.ajax({
  url: 'http://www.copydm.com/blog/index.php/Home/Index/getView',
  type: 'post',
  data: {pid: $_GET['id']},
  dataType: 'json',
  success: function(res){
    var str = '';
    if (res) {
      for (var i = 0,len = res.length; i < len; i++) {
        //评论内容
        str += '<div class="post-comment" rid="'+ res[i]['id'] +'"><div> <strong class="text-danger small">#'+ (i+1) +' </strong> '+ res[i]['name'] +'<span class="pull-right">评论于 '+ res[i]['addtime'] +'</span></div><div class="review-content">'+ res[i]['content'] +'<ul>';

        //评论下的回复列表
        if (res[i]['reply']) {
          for (var j = 0, leng = res[i]['reply'].length; j < leng; j++) {
            str += '<li>'+ res[i]['reply'][j]['name'] +'：'+ res[i]['reply'][j]['content'] +'</li>';
          };
        }

        str += '</ul></div></div>';
      }

    } else {
      str += '<div class="post-comment">暂无评论，快来抢沙发吧~~~</div>';
    }
    $('#review').html(str);
  }
})
//======================= 评论列表 end


//======================= 添加评论 start
//获取评论者的浏览器信息和屏幕尺寸
var useragent = window.navigator.userAgent;
var size = window.screen.width + ' * ' + window.screen.height;

function review(obj){
  var content = $(obj).find('textarea').val();
  if (content.length < 5 || content.match(/^ +$/)) {
    alert('多说两个字嘛~~~');
    return false;
  }
  //获取评论者昵称
  var name = $(obj).find('input[name=name]').val() || '匿名';
  if (name.match(/^ +$/)) name = '匿名';
  
  $(obj).find('button').attr('disabled', true);
  //ajax提交添加数据
  $.ajax({
    url: 'http://www.copydm.com/blog/index.php/Home/Index/review',
    type: 'post',
    data: {pid:$_GET['id'], name: name, content:content, browser: useragent, screen: size},
    dataType: 'json',
    success: function(res){
      if (res.status) {
        //将评论的内容增加到页面上
        var floor = $('#review > .post-comment:last .small').text();
        if (floor) {
          floor = parseInt(floor.substr(1)) + 1;
        } else {
          floor = 1;
        }
        var str = '<div class="post-comment" rid="'+ res['id'] +'"><div> <strong class="text-danger small">#'+ floor +' </strong> '+ name +'<span class="pull-right">评论于 '+ res['addtime'] +'</span></div><div class="review-content">'+ content +'<ul></ul></div></div>';

        //判断是否是沙发
        if (floor == 1) {
          $('#review').html(str);
        } else {
          $('#review').append(str);
        }

        //回复按钮状态
        $(obj).find('button').attr('disabled', false);
        //清空表单
        $('form')[0].reset();
      } else {
        alert(res.msg);
      }
    }
  })
  return false;
}
//======================= 添加评论 end


//======================= 给评论列表绑定鼠标事件，显示/隐藏回复按钮
$('#review').on('mouseenter', '.post-comment', function(){
  //判断有评论才显示回复按钮
  if ($(this).attr('rid')) {
    $(this).find('.review-content').before('<button class="btn pull-right" onclick="replyInfo('+ $(this).attr('rid') +')">回复</button>');
  }
});
$('#review').on('mouseleave', '.post-comment', function(){
  $(this).find('button').remove();
});

//======================= 显示模态框
function replyInfo(rid) {
  $('input[name=rid]').val(rid);
  $('.modal').modal({
    keyboard: false
  })
}


//======================= 处理回复操作 start
function reply(obj){
  var content = $(obj).find('textarea').val();
  if (content.length < 3 || content.match(/^ +$/)) {
    alert('多说两个字吧');
    return false;
  };

  //获取回复者昵称
  var name = $(obj).find('input[name=name]').val() || '匿名';
  if (name.match(/^ +$/)) name = '匿名';

  //获取review评论ID
  var rid = $(obj).find('input[name=rid]').val();

  $(obj).find('button').attr('disabled', true);
  $.ajax({
    url: 'http://www.copydm.com/blog/index.php/Home/Index/reply',
    data: {rid:rid, name:name, content:content, browser: useragent, screen: size},
    type: 'post',
    dataType: 'json', 
    success: function(res){
      if (res['status']) {
        //添加回复到页面
        $('.post-comment[rid='+ rid +'] ul').append('<li>'+ name +'： '+ content +'</li>');

        //恢复按钮状态
        $(obj).find('button').attr('disabled', false);
        //清除表单数据
        $('.modal').find('form')[0].reset();
        //隐藏模态框
        $('.modal').modal('hide');
      } else {
        alert(res['msg']);
      }
    }
  })
  return false;
}
//======================= 处理回复操作 end