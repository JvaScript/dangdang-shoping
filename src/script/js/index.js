define(['config'],function(){
	require(['jquery'],function(){
		return{
			//检查是否已登录
			check:(function(){
				var $user_name=$('.topNav_left_user');//登录用户名
				var $user_menu=$('.topNav_left_userMenu');//用户详情box
				$user_name.hover(function(){
					$(this).find('.topNav_left_userMenu').show();
				},function(){
					$(this).find('.topNav_left_userMenu').hide();
				});
			})(),
			//banner图效果
			banner:(function(){
				var $banner_img=$('.banner_img_list');
				var $banner_btn=$('.banner_btn_list');
				var banner_timer=null;
				var $banner_img_li=$('.banner_img_list li');
				var num=-1;//当前索引
				
				//切换函数
				function tabswitch(n){
					if(n>$banner_btn.find('li').length-1){
						num=0;
					}
					if(n<0){
						num=$banner_btn.find('li').length-1;
					}
					$banner_img.find('li').eq(num).stop(false,true).animate({opacity:1}).siblings().stop(false,true).animate({opacity:0});
					$banner_btn.find('li').eq(num).addClass('active').siblings().removeClass('active');
				}
				//开始显示第一张banner图
				// setTimeout(function(){
				//     tabswitch(num);
				// },400)
				//右箭头切换
				var $next=$('.next');
				$next.on('click',function(){
					tabswitch(++num);
				});
				//左箭头切换
				var $prev=$('.prev');
				$prev.on('click',function(){
					tabswitch(--num);
				});
				//自动切换
				banner_timer=setInterval(function(){
					tabswitch(++num);
				},2000);
				//点击切换
				$banner_btn.on('click','li',function(){
					$(this).addClass('active').siblings().removeClass('active');
					num=$(this).index();
					tabswitch(num);
				});
				//鼠标悬停停止切换
				var $banner_box=$('.banner');
				$banner_box.hover(function(){
					clearInterval(banner_timer);
					$next.stop(false,true).animate({opacity:1});
					$prev.stop(false,true).animate({opacity:1});
				},function(){
					$next.stop(false,true).animate({opacity:0});
					$prev.stop(false,true).animate({opacity:0});
					banner_timer=setInterval(function(){
						tabswitch(++num);
					},2000);
				})
			})(),

			//获取搜索数据
			//http://suggest.video.iqiyi.com/?if=mall&key=111
			git:(function(){
				var $search_box=$('.suggest_box');
				var $suggest_list=$('.suggest_list');
				var $search_text=$('.search_text');
				$('body').append('<script id="search_js"></script>');
				$search_text.on('input',function(){
					if($search_text.val()!=''){
						$.ajax({
							url:'http://suggest.video.iqiyi.com/?if=mall&key='+$search_text.val(),
							dataType:'json'
						}).done(function(d){
							if(d.data.length!=0){
								$search_box.show();
								$suggest_list.html('');
								$.each(d.data,function(index,value){
									$suggest_list.append('<li class="suggest_li"><a href="javascript:;" class="suggest_link"><span class="suggest_linkL">'+value.name+'</span><span class="suggest_linkR">约'+value.item_cnt+'个商品</span></a></li>')
								})
							}else{
								$search_box.hide();
							}
						});
					}else{
						$search_box.hide();
					}
				});
				$search_text.on('blur',function(){
					$search_box.hide();
				});
			})(),

			//右上角广告切换
			tab:(function(){
				var $adbtn=$('.arrow_items');
				var $adbox=$('.header_right_ad');
				var $box=$('.header_right');
				var ad_timer=null;
				function tabswitch(){
					$adbox.find('.active').removeClass('active').siblings().addClass('active');
				}
				//点击切换
				$adbtn.on('click',function(){
					tabswitch();
				});

				//鼠标悬浮停止
				$box.hover(function(){
					clearInterval(ad_timer);
				},function(){
					ad_timer=setInterval(function(){
						tabswitch();
					},2000);
				});
				//自动
				ad_timer=setInterval(function(){
					tabswitch();
				},2000);
			})(),

			//每日精选图片放大
			day:(function(){

				var $imgbox=$('.every_product_pic');
				$imgbox.hover(function(){
					$(this).find('img').stop(true).animate({
						width:150,
						height:150,
					});
				},function(){
					$(this).find('img').stop(true).animate({
						width:140,
						height:140,
					});
				});
				//热销榜单图片放大
				var $hot_imgBox=$('.hotSale_img a');
				$hot_imgBox.hover(function(){
					$(this).find('img').stop(true).animate({
						width:100,
						height:100,
					});
				},function(){
					$(this).find('img').stop(true).animate({
						width:90,
						height:90,
					});
				});
			})(),
			//今日特卖图片变亮
			img:(function(){
				setTimeout(function(){
					var $sp_imgBox=$('.shopImg a');
					$sp_imgBox.hover(function(){
						$(this).find('img').stop(true).animate({
							opacity:0.7,
							filter:'alpha(opacity=70)'
						});
					},function(){
						$(this).find('img').stop(true).animate({
							opacity:1,
							filter:'alpha(opacity=100)'
						});       
					});
				},0);   
			})(),

			//返回顶部
			return:(function(){
				var $top=$('.goto_top');
				$top.hide();
				$(window).on('scroll',function(){
					if($(document).scrollTop()>700){
						$top.show();
					}else{
						$top.hide();
					}
					
				});
				$top.on('click',function(){
					$('html,body').animate({scrollTop:'0'},500);
				});
			})(),
		}
	});
});

