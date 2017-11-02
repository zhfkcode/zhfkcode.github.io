 ;(function($){
     var Carousel=function(poster){
         var self=this;
         //保存单个对象
         this.poster         =poster;
         this.posterItemMain =poster.find("ul.poster-list");
         this.nextBtn        =poster.find("div.poster-next-btn");
         this.prevBtn        =poster.find("div.poster-prev-btn");
         this.posterItems    =poster.find("li.poster-item");
         if(this.posterItems.size()%2==0){
             this.posterItemMain.append(this.posterItems.eq(0).clone())
             this.posterItems=this.posterItemMain.children();
         }
         this.posterFirstItem=this.posterItemMain.find("li").eq(0);
         this.posterLastItem=this.posterItemMain.find("li").last();

         this.rotateFlag     =true;

         this.setting        ={
             "width":1000,
             "height":270,
             "posterWidth":640,
             "posterHeight":270,
             "scale":0.8,
             "autoPlay":true,
             "delay":2000,
             "speed":300
         };
         $.extend(this.setting,this.getSetting());
         this.setSettingValue();
         this. setPosterPos();

         this.nextBtn.click(function(){
             if(self.rotateFlag){
                 self.rotateFlag=false;
                 self.carouselRotate("left");
             }

         });
         this.prevBtn.click(function(){
             if(self.rotateFlag){
                 self.carouselRotate("right");
                 self.rotateFlag=false;
             }
         })
     //    是否自动播放
         if(this.setting.autoPlay){
             this.autoPlay();
             this.poster.hover(function(){window.clearInterval(self.timer)},function(){
                self.autoPlay();
             })
         }

     };
     Carousel.prototype={
            //自动播放
         autoPlay:function(){
             var self=this;
             this.timer= window.setInterval(function(){
                 self.nextBtn.click();
             },this.setting.delay);
         },
            //旋转
         carouselRotate:function(dir){
             var _this_=this;
             var zIndexArr=[];
             if(dir==="left"){
                 this.posterItems.each(function(){
                     var self=$(this),
                     prev=self.prev().get(0)?self.prev():_this_.posterLastItem,
                         width=prev.width(),
                         height=prev.height(),
                         zIndex=prev.css("zIndex"),
                         opacity=prev.css("opacity"),
                         left=prev.css("left"),
                         top=prev.css("top");
                     zIndexArr.push(zIndex);
                     self.animate({
                         width:width,
                         height:height,
                         opacity:opacity,
                         left:left,
                         top:top
                     },function(){
                         _this_.rotateFlag=true;
                     })
                 })
                 this.posterItems.each(function(i){
                         $(this).css("zIndex",zIndexArr[i]);
                     })
             }else{
                 this.posterItems.each(function(){
                     var self=$(this),
                         next=self.next().get(0)?self.next():_this_.posterFirstItem,
                         width=next.width(),
                         height=next.height(),
                         zIndex=next.css("zIndex"),
                         opacity=next.css("opacity"),
                         left=next.css("left"),
                         top=next.css("top");
                     zIndexArr.push(zIndex);
                     self.animate({
                         width:width,
                         height:height,
                         opacity:opacity,
                         left:left,
                         top:top
                     },function(){
                         _this_.rotateFlag=true;
                     })
                 })
                 this.posterItems.each(function(i){
                     $(this).css("zIndex",zIndexArr[i]);
                 })
             }
         },
            //设置剩余珍的方法
         setPosterPos:function(){
             var self=this;
           var sliceItems=this.posterItems.slice(1),
               sliceSize=sliceItems.size()/2,
               rightSlice=sliceItems.slice(0,sliceSize),
               leftSlice=sliceItems.slice(sliceSize),
               level     =Math.floor(this.posterItems.size()/2),
           rw=this.setting.posterWidth,
           rh=this.setting.posterHeight,
           gap=((this.setting.width-this.setting.posterWidth)/2)/level;
             var firstLeft=(this.setting.width-this.setting.posterWidth)/2;
             var fixOffsetLeft=firstLeft+rw;
           //  设置右边几帧的位置
             rightSlice.each(function(i){
                 level--;
                 rw=rw*self.setting.scale;
                 rh=rh*self.setting.scale;
                var j=i;
                 $(this).css({
                   zIndex:level,
                     width:rw,
                     heigth:rh,
                     opacity:1/++i,
                     left:fixOffsetLeft+gap*(++j)-rw,
                     top:self.setVerticalAlign(rh)

                 })
             })
         //    设置左边的位置
             var lw=rightSlice.last().width(),
                 lh=rightSlice.last().height();
             oloop=Math.floor(this.posterItems.size()/2),
                 leftSlice.each(function(i){
                     var j=i;
                     $(this).css({
                         zIndex:i,
                         width:lw,
                         heigth:lh,
                         opacity:1/oloop,
                         left:gap*i,
                         top:self.setVerticalAlign(lh)

                     })
                     lw=lw/self.setting.scale;
                     lh=lh/self.setting.scale;
                     oloop--;
                 })
         },
            //设置垂直排列
         setVerticalAlign:function(height){
             var vertivalType=this.setting.verticalAlign,
                 top=0;
             if(vertivalType==="middle"){
                 top=(this.setting.height-height)/2;
             }else if(vertivalType==="top"){
                 top=0
             }else if(vertivalType==="bottom"){
                 top=(this.setting.height-height)/2
             }else{
                 top=0;
             }
             return top;
         },
            //设置基本高度等参数
         setSettingValue:function(){
             this.poster.css({
                 width:this.setting.width,
                 height:this.setting.height
             });
             this.posterItemMain.css({
                 width:this.setting.width,
                 height:this.setting.height
             });
         //    计算上下切换按钮的宽度
             var w=(this.setting.width-this.setting.posterWidth)/2;
                this.nextBtn.css({
                    width:w,
                    height:this.setting.height,
                    zIndex:Math.ceil(this.posterItems.size()/2)
                });
             this.nextBtn.css({
                 width:w,
                 height:this.setting.height,
                 zIndex:Math.ceil(this.posterItems.size()/2)
             });
             this.posterFirstItem.css({
                 width:this.setting.posterWidth,
                 height:this.setting.posterHeight,
                 left:w,
                 zIndex:Math.floor(this.posterItems.size()/2)
             });
         },
            getSetting:function(){
                var setting=this.poster.attr("data-setting");
                if(setting && setting!=""){
                    return $.parseJSON(setting)
                }else{
                    return {}
                }
                return setting;
            }
     };
     Carousel.init=function(posters){
         var _this_=this;
         posters.each(function(){
             new _this_($(this));
         })
     };
     window["Carousel"]=Carousel;
 })(jQuery);