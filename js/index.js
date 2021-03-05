function renderChart(series) {
	JSC.Chart('chartDiv', {
		title_label_text: 'Temperature in Pierre se vis tenk',
		annotations: [{
			label_text: 'Data verskaf deur \'Pappabeer Tikwerke\' :)',
			position: 'bottom left'
		}],
		legend_visible: false,
		xAxis_crosshair_enabled: true,
		defaultSeries_firstPoint_label_text: '<b>%seriesName</b>',
		defaultPoint_tooltip: '%seriesName <b>%yValue</b>°C',
		series: series
	});
}

var socket = io.connect();
socket.on("temperature", function(data){
	console.log(data);
	$('#currentTemperature').html(data.currentTemp+"°C");
	renderChart([{name: 'Temperature', points: data.chartData}]);
})