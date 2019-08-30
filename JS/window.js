/* 这个得很多调用，用插件化
window.onload = function(){
    console.log(1);
    
    init();
}
function init(){
    initWindow();
}
var initWindow = (function(){
    var OprojectWrap = document.getElementsByClassName('projectwrap')[0],
        x,
        y;
    addEvent(OprojectWrap , 'mousedown',function(e){
       var _self = this;
            x = getPagePos(e).Left - getStyle(OprojectWrap,'left');
            y = getPagePos(e).Top - getStyle(OprojectWrap,'top');
       console.log('a'+OprojectWrap);
       addEvent(document,'mousemove',mouseMove);
        /*这样不好移除
        addEvent(document,'mousemove'，function(e){ 
            mouseMove.call(_self,e);
        });*//*
        addEvent(document , 'mouseup',mouseUp);
       
       
    }
    )
    
    function mouseMove(e){
        /* e.offsetX 是鼠标相对于元素左边距的距离，不是元素的大小*/
        /*
        OprojectWrap.style.left = (getPagePos(e).Left -x) +'px';
        OprojectWrap.style.top = (getPagePos(e).Top - y ) +'px'; 
       /* 相对来说不准确
        OprojectWrap.style.left = (getPagePos(e).Left - getStyle(OprojectWrap,'width') / 2 ) +'px';
        OprojectWrap.style.top = (getPagePos(e).Top - getStyle(OprojectWrap,'height') / 2 ) +'px'; 
        */
       /*
       console.log(getStyle(OprojectWrap,'width'));
       
      
    }
       
    
    function mouseUp(e){
        console.log('dasd');
        removeEvent(document,'mousemove',mouseMove);
        removeEvent(document,'mouseup',mouseUp);
    }

});*/
var Dragmove = (function(){
    var Dragmove = function(Elem){
        var _self = this;
        this.counter = 0;
        this.upTime1 = 0;
        this.upTime2 = 0;
        this.t = 0;
        this.nowCoord = [];
        this.Elem = Elem;
        this.enterContextmenuFlag = 0;  
        //**右键显示 */     
        this.menuWrap = this.getChideByClassName(findElementChildNode(this.Elem),'menuwrap');
        this.menuWrap.style.left = 50 + 'px';
        this.menuWrap.style.top = 50 + 'px';
        /**下面文字的修改 */
        this.titlewrap = this.getChideByClassName(findElementChildNode(this.Elem),'titlewrap');
        this.title = this.getChideByClassName(findElementChildNode(this.titlewrap),'title');
        this.titleShow = this.getChideByClassName(findElementChildNode(this.titlewrap),'titleshow');
        this.titleShow.className += ' active';
        //this.title.className += ' active';/** 为什么不能输入？？？*/
    }

    Dragmove.prototype = {
        init : function(obj){
            this.obj = obj ;
            this.bindEvent.call(this,this);          
            this.createListItem(this.menuWrap);           
        },

        bindEvent : function(){
            var _self = this;
            this.mouseup = this.mouseUp.bind(this);/** 可绑定mouseUp函数并且保存this的指向*/
            this.mousemove = this.mouseMove.bind(this); //然后用this.mousemove代替this.mouseMove.bind(this)即可
            this.mousedown = this.mouseDown.bind(this);/** bind 改变this的指向并且可以不执行 但是这样无法解除绑定（执行了）*/
            addEvent(this.menuWrap,'mousedown',function(e){
                /** 这里的点击函数click失效 down时其父元素已经去执行其他的了，怎么办？*/
                _self.jump(e);
                stopDefault(e);
                cancelBubble(e);
               // window.open('https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_3469441177274516676%22%7D&n_type=0&p_from=1');
            });
            removeEvent(this.menuWrap,'mousedown',function(e){
                /** 这里的点击函数click失效 down时其父元素已经去执行其他的了，怎么办？*/
                _self.jump(e);
                stopDefault(e);
                cancelBubble(e);
               // window.open('https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_3469441177274516676%22%7D&n_type=0&p_from=1');
            });
            addEvent(this.Elem , 'mousedown' , this.mousedown);/*为什么不能解绑这个函数？ */
            addEvent(document , 'contextmenu' , function(e){
                var e = e || window.event;
                stopDefault(e);
            })
        },

        mouseDown : function(e){
            this.nowCoord = [getStyle(this.Elem, 'left'),getStyle(this.Elem,'top')];
            var enterContextmenuFlag = 0; 
            if(0 == e.button){
                /**左键 */
                 /* this.time1 = new Date().getMilliseconds();*/
                // if(1 == this.enterContextmenuFlag){
                this.menuWrap.className = 'menuwrap';
               //     this.enterContextmenuFlag = 0;
               // }              
                this.time1 = new Date().getTime();
                this.x = getPagePos().Left - getStyle(this.Elem, 'left'); //不能中点
                this.y = getPagePos().Top - getStyle(this.Elem , 'top');
                addEvent(document, 'mouseup' , this.mouseup);
                addEvent(document , 'mousemove' , this.mousemove);/** 会因为冒泡如果点击元素的话会执行两次（一次元素，一次document）*/   
            }
            else if(2 == e.button){
                /**右键 */
                this.enterContextmenuFlag = 1;
                this.contextMenu(e);
            }
            cancelBubble(e);
            stopDefault(e);/* 如果不加阻止默认事件的发生，那么会禁止拖拽*/
        },

        mouseMove : function(){
            //this.Elem.style.left = (getPagePos().Left - getStyle(this.Elem, 'width')/2) + 'px';//是中点
            //this.Elem.style.top = (getPagePos().Top - getStyle(this.Elem, 'height')/2) + 'px';//是中点
            this.setBorder();  
        },

        mouseUp : function(e){
            /*this.time2 = new Date().getMilliseconds();/** 用毫秒不行，毫秒是循环计数的0-999 要用获取时间戳*/
            /**模拟双击 */
             var  _self = this;
            _self.counter++;
            if(1 == _self.counter){
                this.upTime1 = new Date().getTime();
            }
            if(2 == _self.counter){
                this.upTime2 = new Date().getTime();
            }
            if(this.upTime1 && this.upTime2 && (this.upTime2 - this.upTime1 < 200)){
                    /** 双击*/
                    this.Elem.style.left = this.nowCoord[0];
                    this.Elem.style.top = this.nowCoord[1];
            }
            this.t = setTimeout(function(){
                _self.upTime1 = 0;
                _self.upTime2 = 0;
                _self.time1 = 0;
                _self.time2 = 0;
                _self.time3 = 0;    
                _self.counter = 0;
                clearTimeout(this.t);
            },200);

            /**模拟大方块单击 */
            this.time2 = new Date().getTime();
            if((this.time2 - this.time1) < 100){
                /**鼠标松开在鼠标按下的100ms内,可视为点击*/  
                /**现在会如果隔很久触发mousedown时也会无法触发 在延时器里置0可解决，为什么？ */
                this.Elem.style.left = this.nowCoord[0];
                this.Elem.style.top = this.nowCoord[1];
                //window.open('https://www.baidu.com/?tn=22073068_9_oem_dg');
                window.open('https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_3469441177274516676%22%7D&n_type=0&p_from=1');
            }
            else{
               // removeEvent(this.Elem , 'mousedown' , this.mouseDown.unbind(this));
            }
            /**模拟右键显示的方块的单击 */
            if((this.time2 - this.time3) < 100){
                /**鼠标松开在鼠标按下的100ms内,可视为点击*/  
                this.Elem.style.left = this.nowCoord[0];
                this.Elem.style.top = this.nowCoord[1];
                this.tojump();
                
            }
            else{
               // removeEvent(this.Elem , 'mousedown' , this.mouseDown.unbind(this));
            }
            removeEvent(document , 'mousemove' , this.mousemove);
            removeEvent(document, 'mouseup' , this.mouseup);/** 每次都要去除鼠标松开的事件，要不然下次执行鼠标松开的事件时会继续执行这次的松开的事件*/
            //removeEvent(this.Elem , 'mousedown' , this.mousedown);
            cancelBubble(e);
        },

        leftButton : function(e){
            /**左键 */
        },

        contextMenu : function(e){
            /*右键 */
            this.menuWrap.className += ' active';
            
        },

        jump : function(e){
            var e = e || window.event,
                tar = e.target || e.srcElement;
                this.tarIndex = Array.prototype.indexOf.call(this.menuWrap.childNodes[1].childNodes,tar);
                this.time3 = new Date().getTime();
                addEvent(document, 'mouseup' , this.mouseup);
        },

        tojump : function(){
            switch(this.tarIndex){
                case 1 :
                window.open('../../book finnally/html/book.html');
                break;
                case 2 :
                window.open('../../toDoList/HTML/toDoList.html');
                break;
                case 3 :
                window.open('../../placeHolder/HTML/placeHolder.html');
                break;
                case 4 :
                window.open('../../mouse/HTML/mouse.html');
                break;
                case 5 :
                window.open('../../forecast/html/forecast.html');
                break;
                case 6 :
                window.open('../../amplifier/html/amplifier.html');
                break;
                case 7 :
                window.open('../../snake/HTML/snake.html');
                break;
            }
        },

        setBorder : function(){
            /**即元素的左边距和上边距的相应问题 */
            var 
                OHeight = getStyle(this.Elem,'height'),
                OWidth = getStyle(this.Elem,'width'),
                setLeft = getPagePos().Left - this.x,
                setTop = getPagePos().Top - this.y,
                msetLeft = 50,
                msetTop = 50,/** 相对定位，不需要坐标值，只需要相对和父元素的值*/
                OmWidth = getStyle(this.menuWrap,'width'),
                OmHeight = getStyle(this.menuWrap,'height');

                /** 设置的是外面的盒子*/
                if(setLeft < 0){
                    setLeft = 0;
                }else if(setLeft + OWidth >= pageRange().Left){
                    setLeft =  pageRange().Left - OWidth -1; 
                }
                if(setTop < 0){
                    setTop = 0;  
                   
                }else if(setTop + OHeight >= pageRange().Top){
                    setTop = pageRange().Top - OHeight -1;
                }
                this.Elem.style.left = setLeft +'px';
                this.Elem.style.top = setTop + 'px'; 

                 /**msetLeft 设置里面的盒子  因为是被包裹，故会因为继承，所以得相对定位*/  
                 if((setLeft + OmWidth + 50 ) >= pageRange().Left){
                    msetLeft -= (OmWidth+1);
                } 
                if( setTop + OmHeight +50 >= pageRange().Top){
                    msetTop -= (OmHeight +1);
                }
                this.menuWrap.style.left = msetLeft  + 'px';/** 相对于其父级元素定位*/
                this.menuWrap.style.top =  msetTop  + 'px';
        },
        createListItem : function(elem){
                var Ofrag = document.createDocumentFragment(),
                    OLi ;
                for(var i = 0; i < this.obj.length; i++){
                    OLi = document.createElement('li');
                    OLi.innerHTML = this.obj[i];
                    OLi.className = 'listItem';
                    OLi.style.left = 0 + 'px';
                    OLi.style.top = 20*i +'px';
                    Ofrag.appendChild(OLi);
                }
                elem.childNodes[1].appendChild(Ofrag);

        },
        getChideByClassName : function(Elem,className){
            /*发现Elem里的类名是className的元素*/
            /*if(1 === this.flag){
                return this.ClassNameElement;
            }*/
            for(var i = 0 ; i < Elem.length ; i++){
                if(className == Elem[i].className){                  
                    return Elem[i];
                }
            }
            return undefined;
        }
        

    }

    return Dragmove;
})();

var projectMove = new Dragmove(document.getElementsByClassName('projectwrap')[0]); 
var resumeMove = new Dragmove(document.getElementsByClassName('resumewrap')[0]); 
//console.log(findElementChildNode(document.getElementsByClassName('projectwrap')[0])[2]);
/** 要求传一个类数组*/
projectMove.init({
    '0' : 'novel',/**/
    '1' : 'toDoList',/**/
    '2' : 'placeholder',/**/
    '3' : 'mouseover and mouseout',/*鼠标滑入滑出窘境*/
    '4' : 'forecast',/** 鼠标行为预测*/
    '5' : 'amplifier',/*放大器*/
    '6' : 'snake',/**贪吃蛇 */   
    'length':7,
    'splice' :Array.prototype.splice
});
resumeMove.init({
    '0' :'自我介绍',/**/
    '1' : '主要工作',/**/
    '2' : '比赛获奖',/**/
    '3' : '',/*鼠标滑入滑出窘境*/
    '4' : 'forecast',/** 鼠标行为预测*/
    '5' : 'amplifier',/*放大器*/
    '6' : 'snake',/**贪吃蛇 */   
    'length':3,
    'splice' :Array.prototype.splice

})