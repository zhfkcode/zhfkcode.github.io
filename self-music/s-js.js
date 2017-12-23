;(function($){
    var MusicEngine = function(option){
        var self =this;
        this.option = option;
        this.audio = document.getElementById('music-audio');
        this.musicKindHead = option.find(".music-kind-head");
        this.songListContent = option.find(".song-list-content");
        this.backMusicList = option.find('.back-list');
        this.currentSongId = '';
        this.bgImage = option.find('.bg-player');
        //音乐控制按键
        this.prevBtn = option.find(".player-prev");
        this.playBtn = option.find(".player-play");
        this.nextBtn = option.find(".player-next");
        this.volumeBtn = option.find(".player-volume i");
        this.volumeProcess = option.find(".volume-process")
        //歌曲分类
        this.SongHead = option.find('.menu-head');
        this.songList = option.find(".song-list");
        //控制器
        this.control = option.find('.palyer-bar');
        this.songNameSinger = this.control.find('.bat-song-info');
        this.songPalyTime = this.control.find('.bat-song-timer');
        this.songProcess = this.control.find('.bar-process');
        this.timer = null;
        //歌词区域
        this.musicLry = option.find('.music-lry');
        this.lyrContent = this.musicLry.find('.lry-content');
        this.songTime = [];
        this.songTimeLocation = 0;
        //获取所有歌曲信息
        this.songsInfo = '';
        //歌曲分类点击事件
        this.SongHead.on('click','li',function(){
            var songKind = $(this).data('key');
            $(this).addClass('active').siblings().removeClass('active');
            self.musicKindHead.hide();
            self.getSongsInfo(songKind);
            self.songListContent.show();
        });
    //    返回总列表
        this.backMusicList.click(function(){
            self.musicKindHead.show();
            self.songListContent.hide();
        })
    //    点击播放
        this.songList.on('click','.song-item',function(){
            var thisDataId = $(this).data('mid');
            self.songPlay(thisDataId);
        });
    //    播放按钮事件
        this.playBtn.click(function(){
            if($(this).hasClass('_play')){
                self.songPause();
            }else{
                self.songPlay();
            }
        });
    //    下一曲
        this.nextBtn.click(function(){ self.nextSong()});
    //    上一曲
        this.prevBtn.click(function(){self.prevSong()});
    //    音量控制
        this.volumeBtn.click(function () {
            $(this).toggleClass('icon-volume-medium icon-volume-mute2');
            if($(this).hasClass('_muted')){
                $(this).removeClass('_muted');
                self.audio.muted=false;
            }else{
                $(this).addClass('_muted')
                self.audio.muted=true;
            }
        })
        // this.volumeProcess.click(function (e) {
        //     var thisWidth = $(this).width();
        //     var x=e.offsetX;
        //     var volumeValue = (x/thisWidth).toFixed(2);
        //     $(this).find('.ball').width(x);
        //     self.audio.volume = volumeValue;
        //     console.log(thisWidth,x,volumeValue)
        // })
        this.volumeProcess.on('mousedown ',function (e) {
            var x=e.offsetX;
            $(this).find('.ball').width(x);
        })
        this.volumeProcess.on('mouseup',function (e) {
            var thisWidth = $(this).width();
            var x=e.offsetX;
            var volumeValue = (x/thisWidth).toFixed(2);
            console.log(x);
            $(this).find('.ball').width(x);
            self.audio.volume = volumeValue;
        })
    };
    MusicEngine.prototype={
        //获取歌词
        getLyric:function (lyrLink) {
            var _this = this;
            this.songTime = [];
          $.ajax({
              type:'GET',
              url:lyrLink,
              success:function (data) {
                  var originLyr = data;
                  var splitFirst = originLyr.split('[');
                  var fLength = splitFirst.length;
                  var str = '';
                  for(var i=1;i<fLength; i++){
                      var longTime = splitFirst[i].split("]")[0];
                      var shortTime = _this.timeChange('clock',longTime);
                      var lyris = splitFirst[i].split("]")[1];
                      if(lyris !== '\n'){
                          _this.songTime.push(shortTime);
                      str+= `<p data-time="${shortTime}">
                        ${lyris}
                        </p>`;
                      }
                  }
                  _this.lyrContent.html(str);
              }
          })
        },
        //时间转换
        timeChange:function (kind,value) {
            if(kind==='clock'){
               var s= parseInt(value.split(':')[0]*60)+parseInt(value.split(':')[1]);
               return s;
            }else if(kind==='second'){
                var min = Math.floor(value/60);
                var sec = Math.floor(value%60);
                min= min>=10 ?min:'0'+ min;
                sec = sec>=10 ?sec:'0'+ sec;
                return min+":"+sec;
            }
        },
        //进度条
        controlProcess:function(dataId){
            var _this = this;
            var totalTimeString = this.songsInfo[dataId-1].musicTime;
            var totalTime = this.timeChange('clock',totalTimeString);
            var procssBarWidth = this.songProcess.width();
            //进度条
            this.timer = setInterval(function(){
                if(_this.audio.ended){
                    _this.nextSong();
                }
                //进度条
                var currentTime = _this.audio.currentTime;
                var currentLocation = _this.songTime[_this.songTimeLocation];
                var currentTop = parseInt(_this.lyrContent.css('top'));
                var goWidth =Math.floor(procssBarWidth*(currentTime/totalTime));
                _this.songProcess.find('.ball').width(goWidth);
                _this.control.find('.current-time').html(_this.timeChange('second',currentTime));
                //    歌词
                // console.log(_this.songTime,currentTime,_this.songTimeLocation);
                if(Math.floor(currentTime) >= currentLocation && currentLocation !== ''){
                    // console.log(currentLocation,currentTop);
                    _this.lyrContent.find('p').eq(_this.songTimeLocation).addClass('played').siblings().removeClass('played');
                    _this.lyrContent.animate({'top':currentTop-30},1000);
                    _this.songTimeLocation++;
                }
            },1000);

        },
        //歌曲放入信息
        fillInfo:function (dataId) {
            this.songNameSinger.html(this.songsInfo[dataId].musicName+"-"+this.songsInfo[dataId].musicSinger);
            this.songPalyTime.find('.total-time').html(this.songsInfo[dataId].musicTime);
            this.musicLry.find('.song-name').html(this.songsInfo[dataId].musicName);
            this.musicLry.find('.singer').html(this.songsInfo[dataId].musicSinger);
            this.musicLry.find('.album').html(this.songsInfo[dataId].musicKind);
            this.musicLry.find('img').attr('src',this.songsInfo[dataId].musicPic);
            this.bgImage.css('backgroundImage',"url(../self-music/"+this.songsInfo[dataId].musicPic +")");
            this.getLyric(this.songsInfo[dataId].lyricsLink);
        },
        //上一曲
        prevSong: function () {
            this.currentSongId--;
            if(this.currentSongId <= 0 || this.currentSongId===''){
                this.playBtn.removeClass('_play').find('i').attr('class','icon-play3');
                this.songList.find('.song-item').removeClass('bepaly');
            }
            this.songPlay(this.currentSongId);
        },
        //下一曲
        nextSong: function () {
            var songListLength = this.songList.find('.song-item').length;
            if(songListLength <=this.currentSongId || this.currentSongId===''){
                this.playBtn.removeClass('_play').find('i').attr('class','icon-play3');
                this.songList.find('.song-item').removeClass('bepaly');
            }
            this.currentSongId++;
            this.songPlay(this.currentSongId);
        },
        //播放
        songPlay:function(dataId){
            if(dataId){
                clearInterval(this.timer);
                this.currentSongId = dataId;
                this.audio.src= this.songsInfo[dataId-1].musicLink;
                this.fillInfo(dataId-1);
                this.songTimeLocation =0;
                this.lyrContent.css('top','30%');
            }else if(this.currentSongId === ''){
                this.currentSongId = 1;
                this.audio.src= this.songsInfo[0].musicLink;
                this.fillInfo(0);
            }
            this.audio.play();
            this.controlProcess(this.currentSongId);
            this.songList.find('.song-item').eq(this.currentSongId-1).addClass('bepaly').siblings().removeClass('bepaly');
            this.playBtn.addClass('_play').find('i').attr('class','icon-pause2');
        },
        //暂停
        songPause:function(){
            this.audio.pause();
            clearInterval(this.timer);
            this.playBtn.removeClass('_play').find('i').attr('class','icon-play3');
            this.songList.find('.song-item').removeClass('bepaly');
        },
        //获取歌曲信息
        getSongsInfo: function(songKind){
            var _this = this;
            $.ajax({
                type:'GET',
                url:'musicData.json',
                success:function(data){
                    _this.songsInfo = data[songKind];
                    _this.songShow(songKind);
                }
            });
        },
        //歌曲列表显示
        songShow:function(songKind){
            var _this = this;
            var listStr = '';
            var songIndex = 1;
            $.each(_this.songsInfo,function(i,item){
                        listStr+=`<ul class="song-item flex" data-mid="${songIndex}">
                                <li><span>${songIndex}</span>${item.musicName}</li>
                                <li>${item.musicSinger}</li>
                                <li>${item.musicTime}</li>
                            </ul>`;
                        songIndex++;
            });
            _this.songList.html(listStr);
        }
    };
    window["MusicEngine"] = MusicEngine;
})(jQuery);