let search = document.getElementById('search')
let searchBtns = document.getElementsByClassName("search-btn")

let width = searchBtns[0].offsetWidth;
let btns = document.getElementsByClassName("btns")[0]
btns.style.cssText = "height:" + width + "px;line-height:" + width + "px";
btns.style.fontSize = width/10 + "px";

setTimeout(()=>{
    search.focus();
},0);
// 谷歌搜索
searchBtns[0].addEventListener("click",function(){
    window.location.href = "https://www.google.com/search?&q=" + search.value
})
// 必应：国际版
searchBtns[1].addEventListener("click",function(){
    window.location.href = "https://cn.bing.com/search?ensearch=1&q=" + search.value
})
// 百度
searchBtns[2].addEventListener("click",function(){
    window.location.href = "https://www.baidu.com/s?wd=" + search.value
})

document.onkeydown = function(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 112 || e.keyCode == 13) { // 按F1和回车 
        event.preventDefault(); //原F1是chrome帮助
        window.location.href = "https://www.google.com/search?&q=" + search.value
    }
    if (e && e.keyCode == 113) { // 按F2 
        event.preventDefault();
        window.location.href = "https://cn.bing.com/search?ensearch=1&q=" + search.value
    }
    if (e && e.keyCode == 114) { // 按F3
        event.preventDefault();
        window.location.href = "https://www.baidu.com/s?wd=" + search.value
    }

};

// get请求  跨域
// var xhr = new XMLHttpRequest();
// xhr.withCredentials = true;
// xhr.open('GET', 'https://v1.alapi.cn/api/hitokoto&format=json', true);
// xhr.send();

// xhr.onreadystatechange = function (e) {
//   if (xhr.readyState == 4 && xhr.status == 200) {
//     console.log(xhr.responseText);
//   }
// };

//调用Jsonp函数发送jsonp请求  解决了跨域但corb，被浏览器安全策略阻止了
// jsonp({
//     url:"https://v1.alapi.cn/api/hitokoto",
//     data:{
//         format:"json",
//     },
//     success:function(obj) {
//         console.log(obj);
//     }
// });

// function jsonp(obj) {
//     //定义一个处理Jsonp返回数据的回调函数
//     window["callback"] = function(object) {
//         obj.success(JSON.parse(object));
//     }
//     var script = document.createElement("script");
//     //组合请求URL
//     script.src = obj.url + "?fn=callback";
//     for(key in obj.data){
//         script.src +="&" + key + "=" + obj.data[key];
//     }
//     //将创建的新节点添加到BOM树上
//     document.getElementsByTagName("body")[0].appendChild(script);  
// }


var ajaxHdFn = function(uri, data, cb) {
   var getXmlHttpRequest = function() {
    if (window.XMLHttpRequest) {
       //主流浏览器提供了XMLHttpRequest对象
       return new XMLHttpRequest();
     } else if (window.ActiveXObject) {
       //低版本的IE浏览器没有提供XMLHttpRequest对象
       //所以必须使用IE浏览器的特定实现ActiveXObject
       return new ActiveXObject("Microsoft.XMLHttpRequest");
     }
 
   };
   var xhr = getXmlHttpRequest();
   xhr.onreadystatechange = function() {
    //  console.log(xhr.readyState);
     if (xhr.readyState === 4 && xhr.status === 200) {
       //获取成功后执行操作
       //数据在xhr.responseText
       var resJson = JSON.parse(xhr.responseText)
       cb(resJson);
     }
   };
   xhr.open("post", uri, true);
//    xhr.setRequestHeader("DeviceCode", "56");
//    xhr.setRequestHeader("Source", "API");
//    xhr.setRequestHeader("Authentication", "72b32a1f754ba1c09b3695e0cb6cde7f");
   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
   var dataStr = '';
   for (var i in data) {
     if (dataStr) {
       dataStr += '&';
     }
     dataStr += i + '=' + data[i];
   }
   xhr.send(dataStr);
 };


 
let title = document.getElementById('title')
let info = document.getElementById('info')
ajaxHdFn('https://v1.alapi.cn/api/hitokoto', {format: 'json'}, function(res) {
    // console.log(res)
    title.innerText = res.data.hitokoto;
    info.innerText = (res.data.from ? "《" + res.data.from + "》 " : "") + (res.data.creator ? "by：" + res.data.creator : "");
})