var data;         //存放所有title数据
var total = 1;    //总页码数
var flag = true;  //是否加载数据
var p = 1;        //当前页，默认为1
page(p);          //默认加载第一页数据

/**
 * 请求title.html的数据
 * @param  {int} p   当前页，默认刷新就加载第一页的数据
 * @param  {int} num 每页显示几条数据，默认显示10条
 */
function page(p, num){
  //设置默认显示10条
  if (num === undefined) num = 10;

  //判断data是否有值
  if (data === undefined) {
    //ajax请求
    $.get('./title.html', '', function(res){
      data = res;
      total = Math.ceil(res.length / num);  //总页码数
      var end = Math.min(num, res.length);
      var str = '';
      for (var i = 0; i < end; i++) {
        str += '<section class="inner main_content"><h3><a class="title" href="./post/'+ res[i]['id'] +'.html">'+ res[i]['title'] +'</a><span class="pull-right">'+ res[i]['time'] +'</span></h3><p>'+ res[i]['des'] +'</p></section>';
      }

      $('#main_content_wrap').append(str);
    }, 'json');
  } else {
    var start = (p - 1) * num;
    var end = Math.min((start + num), data.length);
    var str = '';
    for (var i = start; i < end; i++) {
      str += '<section class="inner main_content"><h3><a class="title" href="./post/'+ data[i]['id'] +'.html">'+ data[i]['title'] +'</a><span class="pull-right">'+ data[i]['time'] +'</span></h3><p>'+ data[i]['des'] +'</p></section>';
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
    var str = '<section class="inner main_content"><button type="button" onclick="cancel()" class="btn-info">取消搜索</button></section>';
    for (var i in data) {
      var start = data[i]['title'].indexOf(val);
      if (start != -1) {
        //制作背景高亮
        var title = data[i]['title'].substr(0, start);
        title += '<span style="background:orange;">' + data[i]['title'].substr(start, val.length) + '</span>';
        title += data[i]['title'].substr(start+val.length);

        str += '<section class="inner main_content"><h3><a class="title" href="./post/'+ data[i]['id'] +'.html">'+ title +'</a><span class="pull-right">'+ data[i]['time'] +'</span></h3><p>'+ data[i]['des'] +'</p></section>';
      }
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