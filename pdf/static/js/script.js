// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

jQuery(document).ready(function($) {
    $(".left-label").attr('contenteditable', 'true');
    $(".label-value").attr('contenteditable', 'true');
    $(".info-title").attr('contenteditable', 'true');
    $("h3").attr('contenteditable', 'true');
    $("p").attr('contenteditable', 'true');
    $(".right-paragraph p").attr('contenteditable', 'true');
    $("#username").attr('contenteditable', 'true');
    $("#persona-tag").attr('contenteditable', 'true');
    $(".info-unit ul li").append('<span class="item-remove"><i class="iconfont icon-delete"></i></span>');
    
    $(".info-unit").filter(function(index) {
        return ($(this).children('ul').length);
    }).children("h2").append('<span class="item-add"><i class="iconfont icon-playlistadd"></i></span>');

    $(".info-unit h2").append('<span class="unit-remove"><i class="iconfont icon-delete"></i></span>');
    

    var portrait_modal = $('[data-remodal-id=portrait-modal]').remodal();
    $(".portrait").click(function(event) {
        portrait_modal.open();
    });
    $('[data-remodal-id=portrait-modal] button').click(function(event) {
        $(".portrait").css('background-image', 'url("{0}")'.format($("#avatar-url").val()));
    });
    var weixin_modal = $('[data-remodal-id=weixin-modal]').remodal();
    $(".weixin").click(function(event) {
        weixin_modal.open();
    });
    $('[data-remodal-id=weixin-modal] button').click(function(event) {
        $(".weixin img").attr('src', $("#weixin-url").val());
    });

    $('.info-header').hover(function() {
        /* Stuff to do when the mouse enters the element */
        $(this).children('.unit-remove').css('visibility', 'visible');
        $(this).children('.item-add').css('visibility', 'visible');

    }, function() {
        /* Stuff to do when the mouse leaves the element */
        $(this).children('.unit-remove').css('visibility', 'hidden');
        $(this).children('.item-add').css('visibility', 'hidden');
    });

    $('.info-unit ul li').hover(function() {
        /* Stuff to do when the mouse enters the element */
        $(this).children('.item-remove').css('visibility', 'visible');

    }, function() {
        /* Stuff to do when the mouse leaves the element */
        $(this).children('.item-remove').css('visibility', 'hidden');
    });

    $('.unit-remove').click(function(event) {
        $(this).closest(".info-unit").remove();
    });

    $('.item-remove').click(function(event) {
        $(this).closest("li").remove();
    });

    $('.item-add').click(function(event) {
        var unit = $(this).closest(".info-unit");
        if (unit.children('ul')){
            var list = unit.children('ul');
            var clone = list.children('li:first-child').clone(true);
            list.append(clone);
        }

    });
    $("progress").click(function(event) {
        $(this).attr("value", event.offsetX/$(this).width()/0.8 * $(this).attr("max"));
    });

    open_edit_strategy();

    //是否禁用内容可编辑
    // $("*").removeAttr('contenteditable');
    edit(false);
});

function open_edit_strategy() {
    console.log("鼠标在建立内容上按照'单击，单击，单击，双击'的操作，打开建立的编辑功能!!!");

    var openkey = 0;
    var opening = false;

    $('div[class="container"]').dblclick(function () {
        if(opening) return;
        if(openkey == 5) {
            opening = true;
            edit(true);
        } else {
            openkey = 0;
        }
    });

    var pre_click_date;

    $('div[class="container"]').click(function () {
        if(opening) return;
        if(pre_click_date) {
            var now_click_date = Date.now();
            if(now_click_date - pre_click_date > 2000) {
                openkey = 0;
                now_click_date = null;
            }
            pre_click_date = now_click_date;
        } else {
            pre_click_date = Date.now();
        }
        ++openkey;
        if(openkey > 5) {
            openkey = 1;
        }
    });

}

function edit(editable) {
    if(editable) {
        $('div[class="container"] .side,.main').css("pointer-events", "");
    } else {
        $('div[class="container"] .side,.main').css("pointer-events", "none");
    }
}