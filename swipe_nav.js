;(function($){
	var swipe_nav = {
		wrap_nav: '#swipe_nav_wrap',
		$wrap_nav: null,
		inner_nav: '#swipe_nav',
		$inner_nav: null,
		current_x : 0, // x轴 当前的 坐标
		hidden_width: 0, // 隐藏区域的 宽度
		inner_width: 0, // 可滑动区块的 宽度
		start_x: 0, // 开始触发滑动 坐标
		move_x: 0, // 滑动触发滑动 坐标
		distance: 0,// 触发结束和开始的 差值

		init: function(outer,inner){
			var self = this;

			self.$wrap_nav = $(self.wrap_nav)[0];
			self.$inner_nav = $(self.inner_nav);

			$child_div = self.$inner_nav.children(),
			childs_num = $child_div.length;
			// 获取 inner_nav 子元素总的宽度
			$child_div.each(function(index, el) {
				self.inner_width = self.inner_width+$(el).width();	
			});

			// 初始化 元素
			self.wrap_nav = outer || self.wrap_nav;
			self.inner_nav = inner || self.inner_nav;

			// 获取 hidden_width
			self.hidden_width = self.inner_width-$(self.wrap_nav).width();

			// 设置inner_nav 的宽带
			self.$inner_nav.width(self.inner_width);
			
			// 监控 滑动start事件
			self.$wrap_nav.addEventListener('touchstart', self.eventListener, false);
		},
		eventListener: {
			handleEvent : function(e){
				switch(e.type){
					case 'touchstart':
						this.start(e);
						break;
					case 'touchmove':
						this.move(e);
						break;
					case 'touchend':
						this.end(e);
						break;
					default:
						break;
				}
			},
			start: function(event){
				event.preventDefault();

				swipe_nav.start_x = event.touches[0].pageX;
				// 监听 move 事件
				swipe_nav.$wrap_nav.addEventListener("touchmove", this, false);
			},
			move: function(event){
				event.preventDefault();
				event.stopPropagation();

				// 获取 当前触点			
				swipe_nav.move_x = event.touches[0].pageX;
				// 当前所处的位置
				swipe_nav.current_x = swipe_nav.current_x+(swipe_nav.move_x-swipe_nav.start_x);

				// 再次初始化 start_x
				swipe_nav.start_x = swipe_nav.move_x; 
				// 调用 animate 方法
				swipe_nav.transform(swipe_nav.current_x);
			},
			end: function(event){
				// 删除监听事件
				swipe_nav.outer.removeEventListener('touchmove', this, false)
                swipe_nav.outer.removeEventListener('touchend', this, false)
			}
		},
		transform: function(x){
			var self = this;
			if(-x>=self.hidden_width){ // >= 右边界
				x=self.current_x= -self.hidden_width;
			}else if(x>=0){ // <= 左边界
				x=self.current_x= 0;
			}
			// 滑动效果 translate 
			self.$inner_nav.animate({'translate3d': x+'px,0px,0px'},500,'cubic-bezier(0.175, 0.885, 0.320, 1.275)');
		}
	};
	// 加载调用的页面中
	swipe_nav.init();
})(Zepto);