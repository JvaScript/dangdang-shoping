//从url获取商品sid方法
$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//拉取数据
;(function($){

    var $shop_addr=$('.shop_addr_name');//站内路径
    var $title=$('.detail_title')//商品标题
    var $subtitle=$('.detail_subtitle')//副标题
    var $price=$('.price');//价格
    var $sale_num=$('.sale_num');//销量
    var $comment=$('.comment_num')//评论
    var $deliveryFrom=$('.deliveryFrom')//发货城市
    var $deliveryTo=$('.deliveryTo');//到达城市
    var $deliveryPrice=$('.deliveryPrice');//快递费
    var $pick_list=$('.detail_pick_list');//类型选择ul-拼接li
    var $amount_forSale=$('.amount_forSale');//库存
    var $amount_forSale_arr=[];//单独库存
    var $amount_sum=0;//库存总和

    var sid=$.getUrlParam('sid');//商品ID
    //console.log(sid);
    $.ajax({
        url:'../../php/get_details.php',
        dataType:'json',
        data:{"id":sid}
    }).done(function(d){
        //console.log(d);
        $shop_addr.html(d.detail[0].title);//站内路径
        $title.html(d.detail[0].title);//商品标题
        $subtitle.html(d.detail[0].subtitle);//副标题
        $price.html(d.detail[0].price);//价格
        $sale_num.html(d.detail[0].sale);//销量
        $comment.html(d.detail[0].comment);//评论
        $deliveryFrom.html(d.detail[0].city_from);//发货城市
        $deliveryTo.html(d.detail[0].city_to);//到达城市
        $deliveryPrice.html('快递：'+d.detail[0].delivery_price)//快递价格
        $amount_forSale_arr=[];//单独库存
        
        //类型
        for(var i=1;i<5;i++){
            if(d.type[0]['type_'+i]!=''){
                var data=d.type[0]['type_'+i].split(',');//分割数据
                $pick_list.append('<li><a href="javascript:;" class="pick_link" style="background-image:url('+data[0]+')" title="'+data[1]+'"></a></li>');
                $amount_forSale_arr.push(data[2]);
                $amount_sum+=parseInt(data[2]);
            }
        }
        $amount_forSale.html('库存'+$amount_sum+'件');//总库存
        //选择商品类型
        var $typeUl=$('.detail_pick_list');
        $typeUl.on('click','li a',function(){//委托父元素ul
            $('.detail_pick_list a').removeClass('pick_choose');
            $(this).addClass('pick_choose');
            $amount_forSale.html('库存'+$amount_forSale_arr[$(this).parent().index()-1]+'件');//库存
            $('.type_no').html('')//清除请选择类型提示
        });
        //获取图片
        var $small=$('.scale_pic_small img');//预览大图
        var $big=$('.scale_pic_big img');//放大镜大图
        var $imglist=$('.pic_list li img');//缩略图

        $small.attr('src',d.img[0].addr_1);
        $big.attr('src',d.img[0].addr_1);
        $imglist.each(function(index,element){
            if(d.img[0]['addr_'+(index+1)]!=''){
                $(this).attr('src',d.img[0]['addr_'+(index+1)]).parent().show();
            }
        });
        // var $imglist_box=$('.pic_list');
        // console.log(d.img[0]);
        // for(var i=1;i<6;i++){
        //     $imglist_box.append('<li class="select"><img src="" alt=""></li>');
        // }
    });
})(jQuery);

//放大镜
(function(){
    var $sbox=$('.scale_pic_small');//小图盒子
    var $simg=$('.scale_pic_small img');//小图
    var $sm=$('.pic_zoom');//小放大镜
    var $bm=$('.scale_pic_big');//大放大镜
    var $bimg=$('.scale_pic_big img')//大图
    var $imglist=$('.pic_list li');//缩略图

    $sbox.hover(function(){
        $sm.show();
        $bm.show();
        //放大镜设置大小
        $sm.css({
            width:$simg.width()/$bimg.width()*$bm.width(),
            height:$simg.height()/$bimg.height()*$bm.height(),
        });

        var scale=$bm.width()/$sm.width();//比率

        //添加鼠标移动事件
        $(this).on('mousemove',function(ev){
            var $left=ev.pageX-$simg.offset().left-$sm.width()/2+1;
            var $top=ev.pageY-$simg.offset().top-$sm.height()/2+1;
            if($left<=1){
                $left=1;
            }else if($left>=$simg.width()-$sm.width()){
                $left=$simg.width()-$sm.width();
            }
            if($top<=1){
                $top=1;
            }else if($top>=$simg.height()-$sm.height()){
                $top=$simg.height()-$sm.height();
            }
            $sm.css({
                left:$left,
                top:$top
            });
            $bimg.css({
                left:-$left*scale,
                top:-$top*scale
            });
        })
    },function(){
        $sm.hide();
        $bm.hide();
    });
    //点击切换图片
    $imglist.on('click',function(){
        $(this).addClass('select').siblings().removeClass('select');
        $simg.attr('src',$(this).find('img').attr('src'));
        $bimg.attr('src',$(this).find('img').attr('src'));
    });
})();

//选择商品数量
(function(){
    var $input=$('.amount_input');//输入框
    var $up=$('.amount_increase');//增加
    var $down=$('.amount_decrease');//减少
    var $num=0//库存
    var $no_num=$('.amount_no');//库存不足提示
    var $cart_btn=$('.btn_cart');//购物车按钮
    var $type_choose=$('.detail_pick_list')//是否选中类型-pick_choose
    
    $input.on('blur',function(){
        if($type_choose.find('.pick_choose')){
            ifnum();
        }
    });
    $up.on('click',function(){
        var temp=$input.val();
        changenum(++temp);
    });
    $down.on('click',function(){
        var temp=$input.val();
        changenum(--temp);
    });

    //更改数量
    function changenum(value){
        $num=$('.amount_forSale').html().replace(/[^0-9]/g,"");
        //console.log($num);
        $no_num.html('');
        if(value>$num){
            $input.val($num);
            $up.css({backgroundPosition:'-160px -66px'});
        }else if(value<1){
            $input.val(1);
            $down.css({backgroundPosition:'-180px -66px'});
        }else{
            $input.val(value);
            $up.css({backgroundPosition:'-160px -22px'});
            $down.css({backgroundPosition:'-180px -22px'});
        }
    }

    //判断货物是否充足
    function ifnum(){
        $num=parseInt($('.amount_forSale').html().replace(/[^0-9]/g,""));
        var value=parseInt($input.val());
        if(value>$num){
            $input.val($num);
        }else if(value<1){
            $input.val(1);
            $no_num.html('');
        }else{
            $no_num.html('');
        }
    }
    var sid=$.getUrlParam('sid');//商品ID
    //添加到购物车按钮
    var $no_choose=$('.type_no');
    $cart_btn.on('click',function(){
        if($type_choose.find('.pick_choose').length!=0){
            ifnum();
            var listArr=[];
            var numArr=[];
            if($.cookie('cart_id')&&$.cookie('cart_num')){
                listArr=$.cookie('cart_id').split(',');//读取购物车商品ID
                numArr=$.cookie('cart_num').split(',');//读取购物车商品数量
            }
            //如果购物车里没有该商品
            if(listArr.indexOf(sid)=='-1'){
                listArr.push(sid);
                numArr.push($input.val());
                $.cookie('cart_id',String(listArr));
                $.cookie('cart_num',String(numArr));
            }else{
                numArr[parseInt(listArr.indexOf(sid))]=String(parseInt(numArr[listArr.indexOf(sid)])+parseInt($input.val()));
                console.log(String(numArr));
                $.cookie('cart_num',String(numArr));
            }
            var $top_num=$('.topNav_cart_num');//顶部购物车件数
            var $right_num=$('.cart_num')//侧边购物车件数
            var ids=[];
            //设置购物车商品数量
            $top_num.html(listArr.length);
            $right_num.html(listArr.length);
            alert('商品已添加到购物车');
        }else{
            $no_choose.html('请选择类型').css({color:'red'});
        }
    });
})();
//返回顶部
(function(){
    $('.toobar_cart_link').on('click',function(){
        window.location.href='cart.html';
    });
    var $top=$('.totop_link');
    $top.on('click',function(){
        $('html,body').animate({scrollTop:'0'},500);
    });
})();