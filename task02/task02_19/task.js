// 存放随机数据
var chartData = [];
// 渲染时用的快照
var snapshoot = [];
// 产生随机数据
function randomBuildData(seed) {
  var returnData = [];
  for (var i = 0; i < 40; i++) {
    returnData[i] = Math.ceil(Math.random() * seed);
  }
  return returnData;
}

function renderChart(arr) {
  var parentWidth = 800,
      barCount = arr.length,
      barWidth = 15,
      barHeight = 0,
      aqiChartWrap = document.getElementById('aqi-chart-wrap');
  aqiChartWrap.innerHTML = "";
  for (var i=0; i<barCount; i++) {
    aqiChartWrap.innerHTML += '<div class="bar"><div style="display:inline-block;background-color:'+
      getBgc(arr[i])+';width:'+
     barWidth+'px;height:'+arr[i]+'px"></div></div>';
  }

}

function animationRender() {
  var i = 0,
      timer = null,
      len = snapshoot.length;
      // alert(len)
  setInterval(function() {
    if (i < len) {
      renderChart(snapshoot[i]);
    } else {
      clearInterval(timer);
    }
    i++;
  }, 500);
  console.log(snapshoot);
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



function bubleSort() {
  var i = 0,
      j = 0,
      temp = 0;
      len = chartData.length,

  snapshoot = [];
  for (i=0; i < len; i++) {
    for (j = len-1; j > i; j--) {
      if (chartData[j-1] > chartData[j]) {

        temp = chartData[j-1];
        chartData[j-1] = chartData[j];
        chartData[j] = temp;
        // 记录快照
        snapshoot.push(JSON.parse(JSON.stringify(chartData)));
        // console.log(chartData);
      }
    }
    
  }
  // console.log(chartData);
  // return chartData;
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

function initForm() {
  var sortButton = document.getElementById('sort-button');

  addEvent(sortButton, 'click', function() {
    bubleSort();
    animationRender();
  })
}
function init() {
  chartData = randomBuildData(500);
  renderChart(chartData);
  initForm();
}

window.onload = function() {
  init();
}