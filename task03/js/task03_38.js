window.onload = function() {
	var table = document.getElementById('sort_table'),
		ascendClass = 'ascend_btn',
		descend_btn = 'descend_btn',
		tableSort = new TableSort(table, ascendClass, descend_btn);
	tableSort.init();
}

function TableSort(table, ascendClass, descendClass) {
	this._table = table;
	this._ascendClassName = ascendClass;
	this._descendClassName = descendClass;
}
TableSort.prototype = {
	_sort: function(isAscend, thIndex) {
		var table = this._table,
			trArr = [],
			trs = table.getElementsByTagName('tr'),
			scores = [];
		for (var i=1,len=trs.length; i < len; i++) {
			trArr.push(trs[i]);
		}
		trArr.sort(function(eleA, eleB) {
			var returnVal = eleA.getElementsByTagName('td')[thIndex].innerHTML.trim() - 
							eleB.getElementsByTagName('td')[thIndex].innerHTML.trim();
			if (!isAscend) returnVal = -returnVal;
			return returnVal;
		});
		for (i=0; i < trArr.length; i++) {
			table.appendChild(trArr[i])
		}
	},
	init: function() {
		var that = this,
			ascendBtn = that._ascendBtn,
			descendBtn = that._descendBtn,
			ascendClassName = that._ascendClassName,
			btns = that._table.getElementsByTagName('tr')[0].getElementsByTagName('i');

		for (var i=0, len=btns.length; i < len; i++) {
			btns[i].addEventListener('click', function() {
				var tagetTh = this.parentNode,
					thIndex = -1,
					isAscend = true,
					ths = that._table.getElementsByTagName('tr')[0].getElementsByTagName('th');
				for (var i=0, len=ths.length; i < len; i++) {
					if (tagetTh == ths[i]) {
						thIndex = i;
						break;
					}
				}
				isAscend = this.className.split(/\s/)[0] == ascendClassName ? true : false;
				that._sort(isAscend, thIndex);
			}, false);
		}
	}
}