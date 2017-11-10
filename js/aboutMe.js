$(function(){
    let windowH = $(window).height();
    let dataPge = 0;
    let aLength = $('article').length;
    let pageLi = $('.page-menu li');
    let flag =true;
    $('article').eq(0).addClass('animate')
    $('.info-wrapper').mousewheel(function(event, delta){
        if(!flag){return}
        flag = false;
        let way = delta > 0? -1: 1;
        dataPge+=way;
        if(dataPge < 1){
            dataPge=0;
        }else if(dataPge > aLength){
            dataPge = aLength-1;
        }
        let scrollH = windowH*dataPge;
        $('article').eq(dataPge).addClass('animate');
        pageLi.eq(dataPge).addClass('active').siblings().removeClass('active');
        $(this).stop().animate({ scrollTop: scrollH }, 400,function(){
            flag=true
        }) ;
    })
    pageLi.click(function(){
        let index = $(this).index();
        dataPge = index;
        let scrollH = windowH*dataPge;
        $('article').eq(dataPge).addClass('animate');
        $(this).addClass('active').siblings().removeClass('active');
        $('.info-wrapper').animate({ scrollTop: scrollH }, 400) ;
    })
})
window.onload = function(){
        var oWrap = document.getElementById("wrap");
        var oImg = oWrap.getElementsByTagName("img");
        var Deg = 360 / oImg.length;
        var x, y, x_, y_, xN, yN;
        var roX = -10, roY = 0;

        for(var i = 0; i < oImg.length; i++){
            oImg[i].style.transform = 'rotateY('+ Deg * i + 'deg) translateZ(350px)';
            oImg[i].ondragstart = function(){
                return false;
            }
        }

        document.onmousedown = function(ev){
            ev = ev || window.event;
            x_ = ev.clientX;
            y_ = ev.clientY;
            this.onmousemove = function(ev){
                ev = ev || window.event;
                x = ev.clientX;
                y = ev.clientY;

                xN = x - x_;
                yN = y - y_;

                roY += xN * 0.2;
                roX -= yN * 0.1;

                oWrap.style.transform = 'perspective(800px) rotateX('+ roX+'deg) rotateY('+ roY+'deg)';



                x_ = ev.clientX;
                y_ = ev.clientY;
            }

            this.onmouseup = function(){
                this.onmousemove = null;
            }
        }
    }