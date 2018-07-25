//从url获取商品sid方法
$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//切换登录注册页面
;(function(){
    if($.cookie('username')){
        window.location.href='index.html';
    }
    var $signup_box=$('.signup_box');//注册页面盒子
    var $signin_box=$('.signin_box');//登录页面盒子
    $go_signup=$('.signin_frame_bottom_cont');//切换注册页面按钮
    $go_signin=$('.goto_signin');//切换登录页面按钮

    if($.getUrlParam('type')=='signin'){
        $signin_box.show();
        $signup_box.hide();
    }else{
        $signin_box.hide();
        $signup_box.show();
    }

    $go_signup.on('click',function(){
        $signin_box.hide();
        $signup_box.show();
    });
    $go_signin.on('click',function(){
        $signin_box.show();
        $signup_box.hide();
    });
})();
//===================注册=======================
(function(){
    //获得焦点变绿
    var $info_container=$('.info_container');//获取盒子
    var $input_box=$('.input_box');//获取输入框
    $input_box.on('focus',function(){
        $info_container.removeClass('onfocus');
        $(this).parents('.info_container').addClass('onfocus');
        //$(this).parent().parent('.info_container').addClass('onfocus');
    });
    $input_box.on('blur',function(){
        $info_container.removeClass('onfocus');
    });


    var $signup_name=$('#signup_name');//用户名
    var $signup_name_error=$('.register_username p span');//用户名错误信息
    var namePass=false;
    var $signup_pass=$('#signup_pass');//密码
    var $signup_pass_error=$('.register_password p span');//密码错误信息
    var passPass=false;
    var $signup_repass=$('#signup_repass');//重复密码
    var $signup_repass_error=$('.register_repass p span');//重复密码错误信息
    var repassPass=false;
    var $signup_email=$('#signup_email');//邮箱
    var $signup_email_error=$('.register_email p span');//邮箱错误信息
    var emailPass=false;

    var $signup_btn=$('.btn_register');//注册按钮

    //检查用户名格式
    var regName=/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]{2,14}$/;
    $signup_name.on('input',function(){
        var $value=$signup_name.val();
        if(regName.test($value)){
            $.ajax({
                url:'../../php/checkname.php',
                data:{checkname:$value}
            }).done(function(d){
                if(d==0){
                    $signup_name_error.html('');
                    namePass=true;
                }else{
                    $signup_name_error.html('用户名存在');
                    namePass=false;
                }
            });
        }else{
            $signup_name_error.html('用户名应为3-15位字母或数字,必须以字母开头');
            namePass=false;
        }
        checkAll();
    });
    //检查密码格式
    var regPass=/^[a-zA-Z0-9\W_]{6,20}$/;
    $signup_pass.on('input',function(){
        var $value=$signup_pass.val();
        if(regPass.test($value)){
            $signup_pass_error.html('');
            passPass=true;
            if($signup_repass.val()){
                checkBoth();
            }
        }else{
            $signup_pass_error.html('密码应为6-20位');
            passPass=false;
            $signup_repass_error.html('密码不一致');
            repassPass=false;
        }
        checkAll();
    });
    //检查重复密码格式
    var regRepass=/^[a-zA-Z0-9\W_]{6,20}$/;
    $signup_repass.on('input',function(){
        var $value=$signup_repass.val();
        if(regRepass.test($value)){
            checkBoth();
        }else{
            $signup_repass_error.html('密码应为6-20位');
            repassPass=false;
        }
        checkAll();
    });
    function checkBoth(){//判断两次密码是否一致
        if($signup_pass.val()==$signup_repass.val()){//一致
            $signup_repass_error.html('');
            repassPass=true;
        }else{//不一致
            $signup_repass_error.html('密码不一致');
            repassPass=false;
        }
    }

    //检查邮箱格式
    var regEmail=/^\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w)*$/;
    $signup_email.on('input',function(){
        var $value=$signup_email.val();
        if(regEmail.test($value)){
            $signup_email_error.html('');
            emailPass=true;
        }else{
            $signup_email_error.html('邮箱格式错误');
            emailPass=false;
        }
        checkAll();
    });

    //判断是否全部完成
    function checkAll(){
        if(namePass&&passPass&&repassPass&&emailPass){
            $signup_btn.removeClass('btn_gray').addClass('btn_green');
            return true;
        }else{
            $signup_btn.removeClass('btn_green').addClass('btn_gray');
            return false;
        }
    }

    //注册按钮
    $signup_btn.on('click',function(){
        console.log(namePass);
        console.log(passPass);
        console.log(repassPass);
        console.log(emailPass);
        if(checkAll()){
            $.ajax({
                url:'../../php/checkname.php',
                type:'post',
                data:{
                        username:$signup_name.val(),
                        pass:$signup_pass.val(),
                        email:$signup_email.val()
                    }
            }).done(function(d){
                if(d==1){
                    $('.signup_box').hide();//注册页面盒子
                    $('.signin_box').show();//登录页面盒子

                }
            });
        }
    });
})();

//===================登录=======================
(function(){
    var $signin_name=$('#signin_name');//用户名
    var $signin_name_error=$('.signin_username p span');//用户名错误信息
    var signin_namePass=false;
    var $signin_pass=$('#signin_pass');//密码
    var $signin_pass_error=$('.signin_password p span');//密码错误信息
    var signin_passPass=false;
    var $signin_btn=$('.btn_signin');//登录按钮

    //检查用户名长度
    $signin_name.on('input',function(){
        if($(this).val().length<3||$(this).val().length>15){
            signin_namePass=false;
            $signin_name_error.html('用户名应为3-15位字母或数字');
        }else{
            signin_namePass=true;
            $signin_name_error.html('');
        }
        checkAll();
    });
    //检测密码长度
    $signin_pass.on('input',function(){
        if($(this).val().length<5||$(this).val().length>20){
            signin_passPass=false;
            $signin_pass_error.html('密码应为6-20位');
        }else{
            signin_passPass=true;
            $signin_pass_error.html('');
        }
        checkAll();
    });
    function checkAll(){
        if(signin_namePass&&signin_passPass){
            $signin_btn.removeClass('btn_gray').addClass('btn_green');
            return true;
        }else{
            $signin_btn.removeClass('btn_green').addClass('btn_gray');
            return false;
        }
    }
    //显示密码
    var $show_pass=$('#signin_pass');//显示密码按钮
    var bstop=false;
    $('.show_pass').on('click',function(){
        if(!bstop){
            $(this).removeClass('eye_close').addClass('eye_open');
            $show_pass.attr('type','text');
            bstop=true;
        }else{
            $(this).removeClass('eye_open').addClass('eye_close');
            $show_pass.attr('type','password');
            bstop=false;
        }
        
    });
    //点击登录
    $signin_btn.on('click',function(){
        if(checkAll()){
            $.ajax({
                url:'../../php/siginin.php',
                type:'post',
                data:{
                    username:$signin_name.val(),
                    pass:$signin_pass.val()
                }
            }).done(function(d){
                if(d){
                    $signin_pass_error.html('登陆成功');
                    $.cookie('username',$signin_name.val(),{ expires: 7 });
                    window.location.href='index.html';
                }else{
                    $signin_pass_error.html('用户名密码错误');
                }
            });
        }
    });
})();