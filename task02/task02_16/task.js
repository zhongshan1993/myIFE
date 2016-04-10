/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = document.getElementById("aqi-city-input").value,
		value = document.getElementById("aqi-value-input").value;
	aqiData[city] = value;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var aqiTable = document.getElementById("aqi-table");
	aqiTable.innerHTML = "";
	for (city in aqiData) {
		aqiTable.innerHTML += "<tr><td>"+city+"</td><td>"+aqiData[city]+"</td><td><button>删除</button></td></tr>";
	}
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(target) {
  // do sth.
  var tr = target.parentElement.parentElement;
  var city = tr.children[0].innerHTML;
  delete aqiData[city];
  renderAqiList();
}

function addEvent(element, type, handler) {
	if (element.addEventListener) {
		element.addEventListener(type, handler, false);
	} else if (element.attachEvent) {
		element.attachEvent("on"+type, handler);
	} else {
		element["on"+type] = handler;
	}
}
function init() {
	var addBtn = document.getElementById("add-btn"),
		table = document.getElementById("aqi-table"),
		buttonArr = table.getElementsByTagName("button");

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  	addEvent(addBtn, "click", function() {
  		addBtnHandle();
  	});
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
	addEvent(table, "click", function(e) {
		var oEvent = e || event;
		if (oEvent.target && oEvent.target.nodeName === "BUTTON") {
			delBtnHandle(oEvent.target);
		}
	})
}

window.onload = function() {
	init();
}