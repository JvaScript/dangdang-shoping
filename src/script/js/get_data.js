(function(){
    $.ajax({
        url:"../../php/get_data.php",
        dataType:'json'
    }).done(function(d){
        //console.log(d);
        //搜索推荐
        var $suggest=$('.search_hot');
        var suggest_n=0;
        $.each(d.search_hot,function(index,value){
            if(suggest_n!=0){
                $suggest.append('<div class="hot_cutline"></div>');
            }
            suggest_n=1;
            if(value.hot==1){
                $suggest.append('<a href="javascript:;" class="hot">'+value.search_word+'</a>');
            }else{
                $suggest.append('<a href="javascript:;">'+value.search_word+'</a>');
            }
        });
        //搜索右侧广告
        var $adbox=$('.header_right_ad');
        $adbox.html('');
        var num=1;
        $.each(d.search_right_ad,function(index,value){
            $adbox.append('<li><a href="'+value.link+'"><img src="'+value.img_addr+'"><p><b>'+value.title+'</b><span>'+value.subtitle+'</span></p></a></li>');
            if(num==1){
                var $li=$('.header_right_ad li');
                $li.addClass('active');
                num=0;
            }
        });
        });
        //拉取banner图片地址
        var $banner=$('.banner_img_list');
        $banner.html('');
        var $banner_btn=$('.banner_btn_list');
        $banner_btn.html('');
        $.each(d.banner_img,function(index,value){
            if(index==d.banner_img.length-1){
                $banner.append('<li class="banner_img_li"><a href="javascript:;" style="background-image: url('+value.img_addr+')"></a></li>');
                $banner_btn.append('<li class="banner_btn_li active"></li>');
            }else{
                $banner.append('<li class="banner_img_li"><a href="javascript:;" style="background-image: url('+value.img_addr+')"></a></li>');
                $banner_btn.append('<li class="banner_btn_li"></li>');
            }
        });
        //拉取每日精选
        var $everyday_link=$('.every_product_pic');//点击图片的商品链接
        var $everyday_titlelink=$('.every_product_title a');//点击标题的商品链接
        var $everyday_img=$('.every_product_pic img');//图片
        var $everyday_type=$('.every_product_status em');//促销类型
        var $everyday_subtitle=$('.every_product_describe');//商品描述
        var $everyday_price=$('.every_product_cost em');//商品价格
        var $everyday_sale=$('.every_product_sale em');//已售
        $everyday_link.each(function(index){//商品链接
            $(this).attr('href','details.html?sid='+d.everyday_info[index].sid);
        });
        $everyday_img.each(function(index){//图片地址
            $(this).attr('src',d.everyday_img[index].addr_1);
        });
        $everyday_titlelink.each(function(index){//名称链接
            $(this).attr('href','datails.html?sid='+d.everyday_info[index].sid).html(d.everyday_info[index].title);
        });
        $everyday_type.each(function(index){//商品类型
            $(this).html(d.everyday_info[index].tag);
        });
        $everyday_subtitle.each(function(index){//商品描述
            $(this).text(d.everyday_info[index].subtitle);
        });
        $everyday_price.each(function(index){//商品价格
            $(this).html(d.everyday_info[index].price);
        });
        $everyday_sale.each(function(index){//已售
            $(this).html(d.everyday_info[index].sale);
        });
        //拉取热销榜单
        var $hot_link=$('.hotSale_img a');//商品链接
        var $hot_img=$('.hotSale_img a img');//图片链接
        var $hot_title=$('.hotSale_title a');//商品名称+链接
        var $hot_price=$('.hotSale_price em');//价格
        var $hot_sale=$('.hotSale_saleNum em');//已售
        $hot_link.each(function(index){
            $(this).attr('href',d.hot_sale[index].link);
        });
        $hot_img.each(function(index){
            $(this).attr('src',d.hot_sale[index].img_addr);
        });
        $hot_title.each(function(index){
            $(this).attr('href',d.hot_sale[index].link).html(d.hot_sale[index].title);
        });
        $hot_price.each(function(index){
            $(this).html(d.hot_sale[index].price);
        });
        $hot_sale.each(function(index){
            $(this).html(d.hot_sale[index].sale);
        });
        //今日特卖
        var $today_list=$('.new_todaySale_list');//ul
        $.each(d.today,function(index,value){
            $today_list.append('<li><div class="shopInfo"><p class="shopTitle"><a href="'+value.link+'">'+value.title+'</a></p><p class="shopprice"><a href="javascript:;">'+value.subtitle+'</a></p></div><div class="shopImg"><a href="'+value.link+'"><img src="'+value.img_addr+'" alt=""></a></div></li>');
        });
        //热门推荐
        var $suggest_link=$('.hotRecomImg a');//图片链接
        var $suggest_img=$('.hotRecomImg img');//图片地址
        var $suggest_title=$('.hotRecomTitle');//标题
        var $suggest_subtitle=$('.hotRecomDescribe');//描述
        $suggest_link.each(function(index){
            $(this).attr('href',d.hot_suggest[index].link);
        });
        $suggest_img.each(function(index){
            $(this).attr('src',d.hot_suggest[index].img_addr);
        });
        $suggest_title.each(function(index){
            $(this).html(d.hot_suggest[index].title);
        });
        $suggest_subtitle.each(function(index){
            $(this).html(d.hot_suggest[index].subtitle);
        });

        //拉取中间广告
        var $mid_ad_box=$('.banner_ad_cont a');//广告位盒子
        $mid_ad_box.each(function(index,value){
            $(this).attr('href',d.mid_ad[index].link);
            $(this).find('img').attr('src',d.mid_ad[index].img_addr);
        });
    });
})();