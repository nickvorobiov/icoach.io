$(function() {

	var $body = $('body');
	var $header = $('.header');

	$(document).on('mouseover touchstart', '.student', function(e) {
		e.preventDefault();
		$(this).siblings().removeClass('is-active');
		$(this).addClass('is-active');
	});

	// 30 personal achievements

	$(document).on('click', '.js-show', function(e){
		e.preventDefault();
		$(this).parent().find('div.hidden').fadeIn(300);
		$(this).hide();
	});

  $(document).on('click', '.js-show-listitem', function(e){
    e.preventDefault();

    $(this).parent().parent().find('div.hidden').hide();
    $(this).parent().parent().find('.js-show-listitem').fadeIn(300);

    $(this).hide();
    var descr = $(this).parent().find('div.hidden');
    descr.fadeIn(300);

    var pageTop = $(window).scrollTop();
    var elementTop = $(descr).offset().top;
    if (elementTop < pageTop) {
      $(window).scrollTop(elementTop-40);
    }
  });

	// Smooth scroll

	$(document).on('click', '.js-scr', function(e){
		e.preventDefault();
		var href = $(this).attr("href");
		var offsetTop = href === "#" ? 0 : $(href).offset().top;
		$('html, body').stop().animate({ scrollTop: offsetTop}, 700);
	});

  // form

  $(document).on('submit', 'form', function (e){
    //console.log('form: отправляю..');
    var msg = $(this).serialize();

    var $vk = $(this).find('[name=vk]');
    var $fb = $(this).find('[name=fb]');
    var $email = $(this).find('[name=email]');

    var post_params = {
      vk: $vk.val(),
      fb: $fb.val(),
      email: $email.val(),
    };

    if(post_params.vk !== undefined && !post_params.vk.length) {
      $vk.addClass('error');
      e.preventDefault();
      return message.error('Укажи ссылку на свою страницу ВКонтакте, пожалуйста!', 'warning');
    }

    if(post_params.fb !== undefined && !post_params.fb.length) {
      $fb.addClass('error');
      e.preventDefault();
      return message.error('Укажи ссылку на свой профиль в Facebook, пожалуйста!', 'warning');
    }

    if(post_params.email !== undefined && !post_params.email.length) {
      $email.addClass('error');
      e.preventDefault();
      return message.error('Укажи свой адрес электронной почты, пожалуйста!', 'warning');
    }
  });

  // MESSAGE

  var message = {
    error:  function (msg) {
      var cls = 'warning';
      message.init(msg,cls);
    },
    success:  function (msg) {
      var cls = 'success';
      message.init(msg,cls);
    },
    init: function(msg, cls) {
      $body.append('<div class="notice notice--'+cls
        +'" style="opacity:0;"><div class="wrapper">'+msg+'</div></div>');

      var height_notice = $('.notice').height();
      $('.notice').css('bottom', '-'+height_notice+'px');
      $('.notice').animate({
          bottom: 0,
          opacity: 1
      }, 300);

      message.close(3000);
      return false;
    },
    close: function(time) {
      function notice_hide() {
        $(".notice").animate({
          opacity: 0},
          500, function() {
            $(this).remove();
        });
        $('.input').removeClass('error');
      }
      setTimeout(notice_hide, time);
    }
  };

});

// сохраняем поля querystring utm_* в куках и потом передаём в формы в поле traffic_source

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getURLUTMParameters() {
  var pageURL = window.location.search.substring(1);
  var URLVariables = pageURL.split('&');
  var res = {};
  for (var i = 0; i < URLVariables.length; i++) {
    var parameterName = URLVariables[i].split('=');
    if (parameterName[0].substr(0, 4) == 'utm_') {
      res[parameterName[0]] = parameterName[1];
    }
  }
  return res;
}

function getCookie(cookieName){
  var name = cookieName + "=";
  var cookieArray = document.cookie.split(';');
  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i].replace(/^\s+|\s+$/g, '');
    if (cookie.indexOf(name)==0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
} 

function setCookie(cookie, value){
  var expires = new Date();
  expires.setTime(expires.getTime() + 62208000000); //1000*60*60*24*30*24 (2 years)
  document.cookie = cookie + "=" + value + "; expires=" + expires.toGMTString() + "; path=/";
}

var utmParams = getURLUTMParameters();
var trafficSource;
if (Object.keys(utmParams).length > 0) {
  var trafficSource = JSON.stringify(utmParams);
  console.log(trafficSource);
  setCookie('traffic_source', trafficSource);
} else {
  trafficSource = getCookie('traffic_source');
  console.log(trafficSource);
}

$(document).ready(function() {
  $('input[name=traffic_source]').val(trafficSource);
  $('input[data-field=traffic_source]').val(trafficSource);

  $('form').submit(function(){
    $('input[name=roistat]').val(getCookie('roistat_visit'));
    $('input[data-field=roistat]').val(getCookie('roistat_visit'));
  })

  $('input[data-field=referer]').val(document.location.href);
});