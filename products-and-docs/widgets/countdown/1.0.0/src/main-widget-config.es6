($ => {

  const DEFAULT_API_KEY = apiKeyService.getApiWidgetsKey();

  let widget = widgetsCountdown[0];
  var themeConfig = {
    simple_countdown: {
        sizes: {
          s: {
            width: 180,
            height: 150,
            layout: 'horizontal'
          },
          m: {
            width: 300,
            height: 250,
            layout: 'vertical'
          },
          l: {
            width: 160,
            height: 600,
            layout: 'horizontal'
          },
          xl: {
            width: 728,
            height: 90,
            layout: 'horizontal'
          },
          xxl: {
            width: 300,
            height: 600,
            layout: 'vertical'
          },
          custom: {
            width: 350,
            height: 600,
            layout: 'vertical'
          },
          fullwidth: {
            width: '100%',
            height: 700,
            layout: ''
          }
        },
        initSliderSize: {
          width: 350,
          height: 600,
          maxWidth: 500,
          minWidth: 350
        }
      }
  };

  var $widthController = $('#w-width').slider({
      tooltip: 'always',
      handle: 'square'
    }),
    $borderRadiusController = $('#w-borderradius').slider({
      tooltip: 'always',
      handle: 'square'
    }),
    $getCodeButton = $('.js_get_widget_code'),
    widgetNode = document.querySelector("div[w-tmapikey]"),
    $tabButtons = $('.js-tab-buttons'),
    $layoutBox = $('#js-layout-box'),
    $configForm = $(".main-widget-config-form"),
    $widgetModal = $('#js_widget_modal'),
    $widgetModalNoCode = $('#js_widget_modal_no_code');

  //variables for fixed widget
  var $window = $(window),
      $containerWidget = $(".widget-container-wrapper"),
      $configBlock = $(".config-block"),
      window_min = 0,
      window_max = 0,
      desktopWidth = 1200,
      threshold_offset = 50;
  /*
   set the container's maximum and minimum limits as well as movement thresholds
   */
  function setLimits(){
    //max and min container movements
    var topCss = ($containerWidget.css("top")>0) ? parseInt($containerWidget.css("top")) : 0;
    var headerOffset = $('.top-bar').height() + /*padding of top-bar*/8 + /*bottom-margin*/10;
    var max_move = $configBlock.offset().top + $configBlock.height() - $containerWidget.height() - topCss - headerOffset;
    var min_move = $configBlock.offset().top - headerOffset;

    $containerWidget
      .data('min', min_move)
      .data('max',max_move);

    //window thresholds so the movement isn't called when its not needed!
    window_min = min_move - threshold_offset;
    window_max = max_move + $containerWidget.height() + threshold_offset;
  }

  /*
   widget container scroll handler
   */
  function windowScroll(){
    let innerWidth = window.innerWidth;
    let j = 0;
    function updateScroll() {
      //if the window is within the threshold, begin movements
      if ($window.scrollTop() >= window_min && $window.scrollTop() < window_max) {
        if ($containerWidget.height() < $configBlock.height() && innerWidth >= desktopWidth) {
          //reset the limits (optional)
          setLimits();
          //move the container
          containerMove();
        }
      }
      j++;
    }
    if(j === 0) updateScroll();

    setTimeout(() => {
      if (innerWidth < desktopWidth && $containerWidget.height() > $configBlock.height()) {
        containerMove_clearOffset();
        updateScroll();
      }
      if($containerWidget.height() < $configBlock.height() || innerWidth >= desktopWidth) {
        if( innerWidth < desktopWidth ){
          containerMove_clearOffset();
        }
        updateScroll();
      }
    }, 200);    

  }

  $window.on("scroll resize", windowScroll);

  /**
   * Clear top offset of widget container
   */
  function containerMove_clearOffset(){
    $containerWidget.css("margin-top", 0);
  }
  /**
   * Handles moving the container if needed.
   **/
  function containerMove(){
    let marginTop = 0;
    const wst = $window.scrollTop(),
      {min, max} = $containerWidget.data();

    //if the window scroll is within the min and max (the container will be 'sticky';
    if( wst >= min && wst <= max ){
      //if the window scroll is below the minimum move it down!
      marginTop = wst - min;
    }else if( wst > max ){
      marginTop = max - min;
    }
    $containerWidget.css('marginTop', (marginTop > 0 ? marginTop : 0));
  }

  /**
   * Toggle 'width slider' and width
   * @param targetValue(string) -
   * @param widgetNode(object) - current widget
   */
  var fullWidth = function(targetValue , widgetNode){
    let widthSlider = $('.js_widget_width_slider'),
        widgetContainerWrapper = $containerWidget,
        widgetContainer = $(".widget-container", widgetContainerWrapper),
        $border_slider = $('.js_widget_border_slider');

    if(targetValue === 'fullwidth'){
      widthSlider.slideUp("fast");
      $borderRadiusController.slider('setValue', 0);
      widgetNode.setAttribute('w-borderradius', 0);
      widgetContainerWrapper.css({width: "100%"});
      widgetContainer.css({ width: '100%' });
      // widgetNode.setAttribute('w-height', 700);
    }else {
      $border_slider.slideDown("fast");
      $borderRadiusController.slider('setValue', 4);
      widgetNode.setAttribute('w-borderradius', 4);
      widgetContainerWrapper.css({ width: 'auto' });
      widgetContainer.css({ width: 'auto' });
      if(targetValue === 'custom'){widthSlider.slideDown("fast");}
      //resetWidget($configForm );
    }
  };

  var changeState = function(event){
    if(!event.target.name){return;}
    const targetValue = event.target.value,
          targetName = event.target.name;

    if(targetName === "w-layout"){
      let sizeConfig = themeConfig.simple_countdown.initSliderSize;

      if(targetValue === 'horizontal'){
        sizeConfig = {
          width: 620,
          height: 252,
          maxWidth: 900,
          minWidth: 620
        };
      }

      $widthController.slider({
          setValue: sizeConfig.width ,
          max: sizeConfig.maxWidth,
          min: sizeConfig.minWidth
        })
        .slider('refresh');

      widgetNode.setAttribute('w-width', sizeConfig.width);
      widgetNode.setAttribute('w-height', sizeConfig.height);
    }

    //Check fixed sizes for 'simple_countdown' theme
    if(targetName === "w-proportion") {
      let widthSlider = $('.js_widget_width_slider'); //if init it on top -> then see bug on Vertical/Horizontal layout change
      let sizeConfig = {
        width: themeConfig.simple_countdown.sizes[targetValue].width,
        height: themeConfig.simple_countdown.sizes[targetValue].height,
        maxWidth: 600,
        minWidth: 350
      };

      fullWidth(targetValue, widgetNode);

      //set layout
      widgetNode.setAttribute('w-layout', themeConfig.simple_countdown.sizes[targetValue].layout);

      if (targetValue !== 'custom') {
        $tabButtons.slideUp("fast");
        widthSlider.slideUp("fast");
      }else{
        $tabButtons.slideDown("fast");
        widthSlider.slideDown("fast");
        $('input:radio[name="w-layout"][value="vertical"]',$tabButtons).prop('checked', true);

        sizeConfig = { //default size
          width: themeConfig.simple_countdown.initSliderSize.width,  //350
          height: themeConfig.simple_countdown.initSliderSize.height,  //600
          maxWidth: themeConfig.simple_countdown.initSliderSize.maxWidth,  //500
          minWidth: themeConfig.simple_countdown.initSliderSize.minWidth // 350
        };
        $widthController.slider({
            setValue: sizeConfig.width,
            max: sizeConfig.maxWidth,
            min: sizeConfig.minWidth
          })
          .slider('refresh');
      }

      widgetNode.setAttribute('w-width', sizeConfig.width);
      widgetNode.setAttribute('w-height', sizeConfig.height);
    }

    widgetNode.setAttribute(event.target.name, event.target.value); //set attr in widget


    widget.update();

    windowScroll();//recalculate widget container position
  };

  var resetWidget = function(configForm , excludeOption) {
    let widthSlider = $('.js_widget_width_slider'),
        widgetContainerWrapper = $('.widget-container-wrapper'),
        height = 600,
        theme,
        layout,
        $border_slider = $('.js_widget_border_slider');
        $tabButtons = $('.js-tab-buttons');

    widgetContainerWrapper.removeAttr('style');

    configForm.find("input[type='text']").each(function(){
      let $self = $(this),
          data = $self.data(),
          value = data.userAPIkey || data.defaultValue || '';
      
      if(data.sliderValue){
        value = data.sliderValue;
        $self.slider({
          setValue: value,
          max: data.sliderMax,
          min: data.sliderMin
        })
        .slider('refresh');
      }else{
        $self.val(value);
      }

      widgetNode.setAttribute($self.attr('name'), value);
    });

    configForm.find("input[type='radio']").each(function(){
      var $self = $(this);
      if($self.data('is-checked')){
        let name = $self.attr('name'),
            val = $self.val();
        if(name === 'w-theme'){
          theme = val;
        }else if(name === 'w-layout'){
          layout = val;
        }else if(name === 'w-proportion'){
          $layoutBox.slideDown("fast");
          $border_slider.slideDown("fast");
          $borderRadiusController.slider('setValue', 4);
          $tabButtons.slideDown("fast");
          widthSlider.slideDown("fast");
          $widthController.slider('refresh');
        }
        $self.prop('checked', true);
        widgetNode.setAttribute($self.attr('name'), val);
      }
    });

    if(typeof excludeOption !== 'undefined' && typeof excludeOption.id !== 'undefined'){
      widgetNode.setAttribute('w-id', excludeOption.id); //set val in widget
        $('#w-id').val(excludeOption.id);//set val in cofigurator
    }    
    $layoutBox.slideDown("fast");
    $border_slider.slideDown("fast");
    $borderRadiusController.slider('setValue', 4);
    $widthController.slider('refresh');
    $tabButtons.slideDown("fast");
    widthSlider.slideDown("fast");

    if(layout === 'horizontal'){
      //height = getHeightByTheme(theme);
      height = 252;
    }
    widgetNode.setAttribute('w-height', height);

    // toggleDisabled(widgetNode);//set disabled btn if input is empty

    widget.update();
  };

  var init = function (){
    //sets the limits for the first load
    setLimits();

    //do one container move on load
    containerMove();

    // Set min widget size on mobile devices
    if(parseInt($(window).width(), 10) < 767){
      $('#w-fixed-300x250').trigger('click');
    }
  };

  /**
   * Events
   */
  function addEvents() {

    $configForm.on("change", changeState);
    // Mobile devices. Force 'change' by 'Go' press

    $configForm.on("submit", function (e) {
      $configForm.find('input:focus').trigger('blur');
      e.preventDefault();
    });

    /*set tooltip value above slider*/
    $configForm.find("input[type='text']").each(function () {
      var $self = $(this);
      $self.data('default-value', $self.val());
    });

    $configForm.find("input[type='radio']").each(function () {
      var $self = $(this);
      if ($self.is(':checked'))
        $self.data('is-checked', 'checked');
    });

    $getCodeButton.on('click', function () {
      var codeCont = document.querySelector(".language-html.widget_dialog__code");

      var htmlCode = document.createElement("div");
      for (var key in widget.config) {
        htmlCode.setAttribute("w-" + key, widget.config[key]);
      }
      var tmp = document.createElement("div");
      tmp.appendChild(htmlCode);
      codeCont.textContent = tmp.innerHTML;
      $widgetModal.modal();
    });

    $('.js_reset_widget').on('click', function () {
      resetWidget($configForm);
    });

    $('#js_widget_modal__close').on('click', function () {
      $widgetModal.modal('hide');
    });

    $('#js_widget_modal_no_code__close').on('click', function () {
      $widgetModalNoCode.modal('hide');
    });

    $('#js_styling_nav_tab').on('shown.bs.tab', function (e) {
      $widthController.slider('relayout');
      $borderRadiusController.slider('relayout');
      windowScroll();//recalculate widget container position
    });
  }

  addEvents();

  init();

})(jQuery);
