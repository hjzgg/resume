/**
 * Created by HJZ on 2017/2/18.
 */

function ballFrameOnload(){
//    $('#more-content').height($('#ball-frame').contents().find("body").height());
}

function adjustProject(projectDiv, leftDiv, rightDiv) {
    projectDiv.each(function(index){
        if(((index+1)&1) == 0) {
            rightDiv.append($(this));
        } else {
            leftDiv.append($(this));
        }
    });
}

function project() {
	$('#my-project>div>div').replaceWith(function(index){
		/*
		 * The style, class and title attributes of the p are copied to the
		 * slideout:
		 */
		
		return '\
		<div class="slideOutTip" >\
			\
			<div class="tipVisible">\
				<div class="tipIcon"><div class="plusIcon"></div></div>\
				<p class="tipTitle">'+$(this).attr('title')+'<span class="tipDate">'+$(this).attr('date')+'</span></p>\
			</div>\
			\
			<div class="slideOutContent">\
				'+$(this).html()+'\
			</div>\
		</div>';
	});
	
	//加载 p-div中的内容
	$('#my-project .p-div .content').each(function(index){
		$.ajax( {
		    url: 'resume/../project_template/project' + index + '.html', //这里是静态页的地址
		    type: "GET", //静态页用get方法，否则服务器会抛出405错误
		    success: (data)=>{$(this).html(data);},
		    error: (data)=>{$(this).html('<p>加载错误!!!</p>');}
		});
	});

    var myProjectDivH = $('#my-project').height();
	//将p-div中的内容放到 left-div（奇数） 和 right-div(偶数)
	var leftDiv = $('<div class="left-div"></div>');
	var rightDiv = $('<div class="right-div"></div>');
	var projectDiv = $($.makeArray($('#my-project .p-div')).reverse());

    adjustProject(projectDiv, leftDiv, rightDiv);

	$('#my-project').empty().append(leftDiv).append(rightDiv);
	
	$('#my-project .slideOutTip').each(function(){

		/*
		 * Implicitly defining the width of the slideouts according to the width
		 * of its title, because IE fails to calculate it on its own.
		 */
		
		$(this).width(45+$(this).find('.tipTitle').width());
	});
	
	/* Listening for the click event: */
	
	$('#my-project .tipVisible').bind('click',function(){
		var tip = $(this).parent();
		
		/* If a open/close animation is in progress, exit the function */
		if(tip.is(':animated'))
			return false;

		if(tip.find('.slideOutContent').css('display') == 'none') {
            var pdiv = tip.parent(), delDiv, addDiv;

            if(pdiv.parent().is(leftDiv)) {
                delDiv = leftDiv;
                addDiv = rightDiv;
            } else {
                delDiv = rightDiv;
                addDiv = leftDiv;
            }
            delDiv.children().each(function(){
                var curPdiv = $(this);
                if(!curPdiv.is(pdiv)) {
                    curPdiv.detach();
                    addDiv.append(curPdiv);
                }
            });
			tip.trigger('slideOut');
		}
		else {
            projectDiv.each(function () {
                $(this).detach();
            })
            adjustProject(projectDiv, leftDiv, rightDiv);
            tip.trigger('slideIn');
        }

	});
	
	$('#my-project .slideOutTip').bind('slideOut',function(){

		var tip = $(this);
		var slideOut = tip.find('.slideOutContent');
		
		/* Closing all currently open slideouts: */
		$('.slideOutTip.isOpened').trigger('slideIn');
		
		/* Executed only the first time the slideout is clicked: */
		if(!tip.data('dataIsSet'))
		{
			tip	.data('origWidth',tip.outerWidth())
				.data('origHeight',tip.outerHeight())
				.data('dataIsSet',true);
			
			if(tip.hasClass('openTop'))
			{
				/*
				 * If this slideout opens to the top, instead of the bottom,
				 * calculate the distance to the bottom and fix the slideout to
				 * it.
				 */
				
				tip.css({
					bottom	: tip.parent().height()-(tip.position().top+tip.outerHeight()),
					top		: 'auto'
				});
				
				/*
				 * Fixing the title to the bottom of the slideout, so it is not
				 * slid to the top on open:
				 */
				tip.find('.tipVisible').css({position:'relative',bottom:3});
				
				/*
				 * Moving the content above the title, so it can slide open to
				 * the top:
				 */
				tip.find('.slideOutContent').remove().prependTo(tip);
			}
			
			if(tip.hasClass('openLeft'))
			{
				/*
				 * If this slideout opens to the left, instead of right, fix it
				 * to the right so the left edge can expand without moving the
				 * entire div:
				 */
				tip.css({
					right	: Math.abs(tip.parent().outerWidth()-(tip.position().left+tip.outerWidth())),
					left	: 'auto'
				});
				
				tip.find('.tipVisible').css({position:'absolute',right:3});
			}
		}
		
		/*
		 * Resize the slideout to fit the content, which is then faded into
		 * view:
		 */
        var slideOutTipH = slideOut.outerHeight() + tip.data('origHeight');
        var leftOrRightDivH = Math.max(leftDiv.height(), rightDiv.height());
		tip.addClass('isOpened').animate({
			width	: Math.max(slideOut.outerWidth(),tip.data('origWidth')),
			height	: slideOutTipH
		},function(){
			slideOut.fadeIn();
		});

		if(slideOutTipH > myProjectDivH || leftOrRightDivH > myProjectDivH) {
            $('#my-project').animate({height: slideOutTipH > leftOrRightDivH ? slideOutTipH : leftOrRightDivH});
        }

	}).bind('slideIn',function(){
		var tip = $(this);

		/* Hide the content and restore the original size of the slideout: */
		
		tip.find('.slideOutContent').fadeOut('fast',function(){
			tip.animate({
				width	: tip.data('origWidth'),
				height	: tip.data('origHeight')
			},function(){
				tip.removeClass('isOpened');
			});
            $('#my-project').animate({height: myProjectDivH});
		});

	});
}

$(function () {
    //头像
    $(".message_head_content").mouseover(function () {
        $(this).find("#head_one").stop().animate({opacity: 0}, 300);
        $(this).find("#head_two").stop().animate({opacity: 1}, 300);
    }).mouseout(function () {
        $(this).find("#head_one").stop().animate({opacity: 1}, 300);
        $(this).find("#head_two").stop().animate({opacity: 0}, 300);
    });

    //专业技能
    var skill_mastery = [90, 80, 75, 85, 85];
    $(".skill_icon").click(function () {
        if ($(this).siblings(".skill_int").is(":visible")) {
            $(this).siblings(".skill_int").slideUp(200);
            $(this).siblings(".skill_flag").removeClass("skill_flag_scale");
        } else {
            $(this).siblings(".skill_int").slideDown(400);
            $(this).siblings(".skill_flag").addClass("skill_flag_scale");

            $(this).parent().siblings().find(".skill_int").slideUp(200);
            $(this).parent().siblings().find(".skill_flag").removeClass("skill_flag_scale");

            //熟练度
            var index = $(this).parent().index();
            $('.ability-list #info').stop().prop('number', 0).animateNumber(
                {
                    number: skill_mastery[index],
                    easing: 'easeInQuad',
                    numberStep:  function(now, tween) {
                        var floored_number = Math.floor(now),
                        target = $(tween.elem);
                        target.prop('number', now).text("熟练程度: " + floored_number + "%");
                    }
                },
                1000
            );
            $('.ability-list li').eq(index).css("opacity", "0.8").width("0%").stop().animate({width: skill_mastery[index]+"%"}, 1000).siblings("li").css("opacity", "0");
        }
    });

	
    //header
    var $links = $('header .nav-links .link');
    $links.hover(function () {
        $('header .nav-links .nav-slide').stop().animate({
            left: $(this).position().left
        }, 300);
    }, function () {
        $('header .nav-links .nav-slide').stop().animate({
            left: $('header .nav-links .link.active').position().left
        }, 300);
    });
    var $sections = $('section');
    $links.click(function () {
        var $window = $(window);
        $window.unbind('scroll');
        var $this = $(this);
        var index = $this.index();
        $this.addClass('active').siblings().removeClass('active');
        $('html,body').animate({
            scrollTop: $sections.eq(index).offset().top
        }, 300, function () {
            $window.bind('scroll', scrollHandler);
        });
    });
    //滚动监听
    var scrollHandler = function () {
        var scrollTop = $('html,body').scrollTop();
        $sections.each(function (index, item) {
            var $item = $(item);
            var top = $item.offset().top;
            if($item.next().length > 0) {
                var nexttop = $item.next().offset().top;
                if (scrollTop >= top && scrollTop <= nexttop) {
                    $links.eq(index).addClass('active').siblings().removeClass('active');
                    $('header .nav-links .nav-slide').stop().animate({
                        left: $('header .nav-links .link.active').position().left
                    }, 300);
                }
            }
        });

    };
    $(window).bind('scroll', scrollHandler);

    //aboutme
    var $aboutme = $('#aboutme');

    //experience
    var $experience = $('#experience');

    var $slides = $aboutme.find('.slides .slide');
    var $vslides = $experience.find('.vertical-slides .vslide');

    $slides.each(function (index, item) {
        var $item = $(item);
        $item.css('left', $item.width() * index + 'px');
        //因为初始的时候，非第一个 slide display 为none
        if(index != 0) {$item.css("display", "table");}
    });

    $vslides.eq(0).siblings().fadeOut();

    !function () {
    	//自我介绍描述
    	var tops = [];
    	$(".slides .slide #myself .info>p").each(function () {
            tops.push($(this).position().top);
            $(this).hide();
            $(this).css("top", $(this).parent().height());
        });
        
        var $aboutmetemp = $aboutme;
        var $slidestep = $slides;
        var index = 0, vindex = 0;
        var count = $slidestep.length;
        var duration = 500;
        var width = $slidestep.width();
        var $points = $aboutmetemp.find('.points .point');
        $points.click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            index = $(this).index();

            //自我介绍 info动画
            if(index == 2) {
                !function(){
                    var info_p = $(".slides .slide #myself .info>p");
                    info_p.each(function () {
                        $(this).hide();
                        $(this).css("top", $(this).parent().height());
                    });
                    info_p.each(function(index) {
                        setTimeout(()=>{
                            $(this).show();
                            $(this).animate({top: tops[index]+"px"}, 1500);
                        }, index*200);
                    });
                }();
            }

            $aboutmetemp.find('.slides').animate({
                'left': -index * width + 'px'
            }, duration);
        });

        $(window).resize(function () {
            $slides.each(function (index, item) {
                var $item = $(item);
                width = $item.width();
                $(item).css('left', width * index + 'px');
            });
            $aboutmetemp.find('.slides').css({
                'left': -index * width + 'px'
            });
        });
        
        $aboutmetemp.find('.btns .pre').click(function () {
            index = (index + 2) % count;
            $points.eq(index).click();
        });

        $aboutmetemp.find('.btns .next').click(function () {
            index = (index + 1) % count;
            $points.eq(index).click();
        });

        //experience 垂直滚动
        $experience.find('.ebtns .pre').click(function () {
            $vslides.eq(vindex).fadeOut(400);
            $vslides.eq((vindex = (vindex+1)%$vslides.length)).fadeIn(500);
        });
        $experience.find('.ebtns .next').click(function () {
            $vslides.eq(vindex).fadeOut(400);
            $vslides.eq((vindex = (vindex-1+$vslides.length)%$vslides.length)).fadeIn(500);
        });
        
        //项目简介
    	project();
    }();
});
