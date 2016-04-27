window.onload = function() {
	var windowUI = new Window(),
		triggerWindowBtn = document.querySelector('.trigger_window');
	triggerWindowBtn.addEventListener('click', function() {
		windowUI.alert();
	}, false);
}

function Window() {
	this.cfg = {
		width: '450px',
		height: '240px',
		title: '这是一个浮出层',
		content: '这是一个浮出层',
		hasMask: true,
		isDraggable: true,
	};
	this.mask = document.querySelector('.window_mask');
	this.window  = document.querySelector('.window');
	this.windowHeader = this.window.querySelector('.window_header');
}
Window.prototype = {
	_renderUI: function() {
		var _window = document.querySelector('.window');
		_window.className += ' dis_block';
		if (this.cfg.hasMask) {
			document.querySelector('.window_mask').className += ' dis_block';
		}
		_window.querySelector('.window_title').innerHTML = this.cfg.title;
		_window.querySelector('.window_body').innerHTML = this.cfg.content;
	},
	_syncUI: function() {
		if (this.cfg.isDraggable) {
			var that = this;
			this.windowHeader.addEventListener('mousedown', function (ev) {
				var oEvent = ev || event,
					
					disX = oEvent.clientX - that.window.offsetLeft,
					disY = oEvent.clientY - that.window.offsetTop;

				that.window.style.cursor = 'move';
				document.onmousemove = function(ev) {
					var oEvent = ev || event,
						theLeft = oEvent.clientX - disX,
						theTop = oEvent.clientY - disY;

					theLeft = theLeft < 0 ? 0 : theLeft;
					theLeft = theLeft > (document.documentElement.clientWidth-
						that.window.offsetWidth) ? (document.documentElement.clientWidth-
						that.window.offsetWidth) : theLeft;
					theTop = theTop < 0 ? 0 : theTop;
					theTop = (theTop > document.documentElement.clientHeight-
						that.window.offsetHeight)? (document.documentElement.clientHeight-
						that.window.offsetHeight) : theTop;
						
					document.title = theLeft + '|' + theTop;
					that.window.style.left = theLeft + 'px';
					that.window.style.top = theTop + 'px';
				};
			}, false);
			document.onmouseup = function (){
				document.onmousemove =null;
			}

		}
	},
	_cancel: function() {
		var that = this;
		this.mask.addEventListener('click', function() {
			removeClass(that.window, 'dis_block');
			removeClass(this, 'dis_block');
		}, false);
	},
	alert: function(cfg) {
		extend(this.cfg, cfg);
		this._renderUI();
		this._syncUI();
		this._cancel();
	}
}

function extend(primaryObj, newObj) {
	for (index in newObj) {
		if (index in primaryObj) {
			primaryObj[index] = newObj[index];
		}
	}
	return primaryObj;
}
function removeClass(obj, className) {
	var classArr = obj.className.split(/\s+/),
		index = classArr.indexOf(className);
	if (index != -1) {
		classArr.splice(index, 1);
	}
	obj.className = classArr.join(' ');
}