/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};
console.log(aqiSourceData);

// 用于渲染图表的数据
var chartData = {
  city: '',
  displayMethod: '' // day, week, month
};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

function getJsonObjLength(jsonObj) {
  var length = 0;
  for (var item in jsonObj) {
      length++;
  }
  return length;
}
/**
 * 渲染图表
 */
function renderChart() {
  var parentWidth = 800,
      displayMethod = chartData.displayMethod,
      city = chartData.city,
      barCount = 0,
      barWidth = 0,
      barHeight = 0,
      degreeData = {};
      aqiChartWrap = document.getElementById('aqi-chart-wrap');
  aqiChartWrap.innerHTML = "";
  if (displayMethod === "day") {
    // aqiChartWrap.innerHTML = "111";
    degreeData = aqiSourceData[city];
    // console.log(degreeData);
    barCount = getJsonObjLength(degreeData);
    barWidth = parentWidth/barCount;
    // console.log(barWidth);
    for (index in degreeData) {
      aqiChartWrap.innerHTML += '<div title="'+index+'|'+
        degreeData[index]+'" class="bar" style="display:inline-block;background-color:'+
        getBgc(degreeData[index])+';width:'+
       barWidth+'px;height:'+degreeData[index]+'px"></div>';
    }
  } else if (displayMethod === 'week') {
    // aqiChartWrap.innerHTML = "222";
    var day = -1;
    var degree = 0;
    var degreeCount = 0;
    var degreeDataArr = [];
    for (index in aqiSourceData[city]) {
      day = (new Date(index)).getDay();
      if (day === 0) {
        degreeDataArr.push(Math.floor(degree/degreeCount));
        degreeCount = 0;
        degree = 0;
      }
      degreeCount++;
      degree += aqiSourceData[city][index];
    }

    if (degreeCount > 0) {
      degreeDataArr.push(Math.floor(degree/degreeCount));
    }
    var len=degreeDataArr.length;
    barWidth = parentWidth/len;
    // console.log(barWidth);
    for (var i=0; i < len; i++) {
      aqiChartWrap.innerHTML += '<div title="第'+(i+1)+'周|'+
        degreeDataArr[i]+'" class="bar" style="display:inline-block;background-color:'+
        getBgc(degreeDataArr[i])+';width:'+
        barWidth+'px;height:'+degreeDataArr[i]+'px"></div>';
    }
  } else { // month
    // aqiChartWrap.innerHTML = "333";
    var monthData = {};
    var month = -1;
    for (index in aqiSourceData[city]) {
      month = (new Date(index)).getMonth() + 1;
      if (month in monthData) {
        monthData[month].push(aqiSourceData[city][index]);
      } else {
        monthData[month] = [];
        monthData[month].push(aqiSourceData[city][index]);
      }
    }
    var totalRes = 0;
    var len = 0;
    var average = 0;
    for (month in monthData) {
      totalRes = 0;
      len=monthData[month].length;
      for (var i=0; i < len; i++) {
        totalRes += monthData[month][i];
      }
      average = totalRes/len;
      barWidth = parentWidth/getJsonObjLength(monthData);
      aqiChartWrap.innerHTML += '<div title="第'+month+'月|'+
        average+'"class="bar" style="background-color:'+
        getBgc(average)+';width:'+
        barWidth+'px;height:'+average+'px"></div>';
    }
  }
}

function getBgc(degree) {
  if (degree > 200) {
    return "black";
  } else if (degree > 150 && degree <= 200) {
    return "purple";
  } else if (degree > 100 && degree <= 150) {
    return "red";
  } else if (degree > 50 && degree <= 100) {
    return "blue";
  } else {
    return "green";
  }
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var formGraTime = document.getElementById('form-gra-time'),
      radioInputs = formGraTime.getElementsByTagName('input'),
      displayMethod = '';
  for (var i=0, len=radioInputs.length; i < len; i++) {
    if (radioInputs[i].checked) {
      displayMethod = radioInputs[i].value;
      break;
    }
  }
  // 设置对应数据
  if (displayMethod !== chartData.displayMethod) {
    chartData.displayMethod = displayMethod;
    // 调用图表渲染函数
    renderChart();
  }
  

  
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  var citySelect = document.getElementById('city-select');
  // 确定是否选项发生了变化 
  if (citySelect.value !== chartData.city) {
    // 设置对应数据
    chartData.city = citySelect.value;
    // 调用图表渲染函数
    renderChart();
  }
  

  
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var formGraTime = document.getElementById('form-gra-time'),
      labels = formGraTime.getElementsByTagName('label'),
      displayMethod = '';
  for (var i=0, len=labels.length; i < len; i++) {
    addEvent(labels[i], 'click', function() {
      // (function() {
        displayMethod = this.children[0].value;
        graTimeChange();
      // })();
    })
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect = document.getElementById('city-select');
  citySelect.innerHTML = "";
  for (city in aqiSourceData) {
    citySelect.innerHTML += "<option>"+city+"</option>";
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEvent(citySelect, 'change', function() {
    citySelectChange();
  })
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  chartData.city = "北京";
  chartData.displayMethod = "day";
  renderChart();
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

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
}

window.onload = function() {
  init();
}
