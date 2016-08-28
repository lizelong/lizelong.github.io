var data;         //存放所有title数据
var total = 1;    //总页码数
var flag = true;  //是否加载数据
var p = 1;        //当前页，默认为1
page(p);          //默认加载第一页数据

/**
 * 请求title.html的数据
 * @param  {int} p   当前页，默认刷新就加载第一页的数据
 * @param  {int} num 每页显示几条数据，默认显示5条
 */
function page(p, num){
  //设置默认显示10条
  if (num === undefined) num = 2;

  //判断data是否有值
  if (data === undefined) {
    //ajax请求
    $.get('./title.html', '', function(res){
      data = res;
      total = Math.ceil(data.length / num);  //总页码数
      var end = Math.min(num, data.length);
      var str = '';
      for (var i = 0; i < end; i++) {
        str += '<article class="widget"> <header class="widget-header"> <h2 class="widget-title"> <a href="post.html?id='+ data[i]['id'] +'">'+ data[i]['title'] +'</a> </h2> <div class="widget-meta"> <span>发表于 '+ data[i]['time'] +'</span> <span class="divider">/</span> </div> <div class="hr-line"></div> </header> <section class="widget-body"> '+ data[i]['des'] +'</section> <section class="widget-footer"> <a class="btn" href="post.html?id='+ data[i]['id'] +'">阅读全文</a> </section> </article>';
      }
      // console.log(data);
      $('#main_content_wrap').append(str);
    }, 'json');
  } else {
    var start = (p - 1) * num;
    var end = Math.min((start + num), data.length);
    var str = '';
    for (var i = start; i < end; i++) {
      str += '<article class="widget"> <header class="widget-header"> <h2 class="widget-title"> <a href="post.html?id='+ data[i]['id'] +'">'+ data[i]['title'] +'</a> </h2> <div class="widget-meta"> <span>发表于 '+ data[i]['time'] +'</span> <span class="divider">/</span> </div> <div class="hr-line"></div> </header> <section class="widget-body"> '+ data[i]['des'] +'</section> <section class="widget-footer"> <a class="btn" href="post.html?id='+ data[i]['id'] +'">阅读全文</a> </section> </article>';
    }

    $('#main_content_wrap').append(str);
  }
}

//滚动加载
$(window).scroll(function(){
  if (($(document).height() - $(window).height() - $(window).scrollTop()) < 300 && flag) {
    p++;

    if (p > total) $(window).off('scroll'); //取消滚动事件

    page(p)
  }
})

//搜索
function find(obj){
  if (obj === undefined) obj = $('#search')[0];
  var val = obj.value;
  if (val != '') {
    var str = '<section><button type="button" onclick="cancel()" class="btn-info">取消搜索</button></section>';
    for (var i in data) {
      var start = data[i]['title'].indexOf(val);
      if (start != -1) {
        //制作背景高亮
        var title = data[i]['title'].substr(0, start);
        title += '<span style="background:orange;">' + data[i]['title'].substr(start, val.length) + '</span>';
        title += data[i]['title'].substr(start+val.length);
        str += '<article class="widget"> <header class="widget-header"> <h2 class="widget-title"> <a href="post.html?id='+ data[i]['id'] +'">'+ title +'</a> </h2> <div class="widget-meta"> <span>发表于 '+ data[i]['time'] +'</span> <span class="divider">/</span> </div> <div class="hr-line"></div> </header> <section class="widget-body"> '+ data[i]['des'] +'</section> <section class="widget-footer"> <a class="btn" href="post.html?id='+ data[i]['id'] +'">阅读全文</a> </section> </article>';
      }
    }

    //判断没搜到数据
    if (str.indexOf('style') == -1) {
      str += '<section class="widget"><h2>暂无数据</h2></section>';
    }
    $('#main_content_wrap').html(str);

    //取消加载数据
    flag = false;
  }
  return false;
}

//取消搜索
function cancel(){
  $('#main_content_wrap').empty();
  $('#search').val('');
  p = 1;
  page(p);
  flag = true;
}

//随机显示标题
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