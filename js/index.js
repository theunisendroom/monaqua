function renderWaterTemperatureChart(series) {
	JSC.Chart('waterTemperatureChartDiv', {
		title_label_text: 'Water temperature',
		annotations: [{
			position: 'bottom left'
		}],
		legend_visible: false,
		xAxis_crosshair_enabled: true,
		defaultSeries_firstPoint_label_text: '<b>%seriesName</b>',
		defaultPoint_tooltip: '%seriesName <b>%yValue</b>°C',
		series: series
	});
}
function renderAirTemperatureChart(series) {
	JSC.Chart('airTemperatureChartDiv', {
		title_label_text: 'Air temperature',
		annotations: [{
			position: 'bottom left'
		}],
		legend_visible: false,
		xAxis_crosshair_enabled: true,
		defaultSeries_firstPoint_label_text: '<b>%seriesName</b>',
		defaultPoint_tooltip: '%seriesName <b>%yValue</b>°C',
		series: series
	});
}
function renderHumidityChart(series) {
	JSC.Chart('humidityChartDiv', {
		title_label_text: 'Humidity',
		annotations: [{
			position: 'bottom left'
		}],
		legend_visible: false,
		xAxis_crosshair_enabled: true,
		defaultSeries_firstPoint_label_text: '<b>%seriesName</b>',
		defaultPoint_tooltip: '%seriesName <b>%yValue</b>°C',
		series: series
	});
}
function renderHeatIndexChart(series) {
	JSC.Chart('heatIndexChartDiv', {
		title_label_text: 'Heat Index',
		annotations: [{
			position: 'bottom left'
		}],
		legend_visible: false,
		xAxis_crosshair_enabled: true,
		defaultSeries_firstPoint_label_text: '<b>%seriesName</b>',
		defaultPoint_tooltip: '%seriesName <b>%yValue</b>°C',
		series: series
	});
}
function renderLightIntensityChart(series) {
	JSC.Chart('lightIntensityChartDiv', {
		title_label_text: 'Light Intensity',
		annotations: [{
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
socket.on("waterTemperature", function(data){
	console.log(data);
	$('#waterTemperature').html("Water Temperature: "+data.waterTemperature+"°C");
	renderWaterTemperatureChart([{name: 'Water Temperatures', points: data.chartData}]);
})
socket.on("airTemperature", function(data){
	console.log(data);
	$('#airTemperature').html("Air Temperature: "+data.airTemperature+"°C");
	renderAirTemperatureChart([{name: 'Air Temperature', points: data.chartData}]);
})
socket.on("humidity", function(data){
	console.log(data);
	$('#humidity').html("Humidity: "+data.humidity+"%");
	renderHumidityChart([{name: 'Humidity', points: data.chartData}]);
})
socket.on("heatIndex", function(data){
	console.log(data);
	$('#heatIndex').html("Heat Index: "+data.heatIndex+"°C");
	renderHeatIndexChart([{name: 'Heat Index', points: data.chartData}]);
})
socket.on("lightIntensity", function(data){
	console.log(data);
	$('#lightIntensity').html("Light Intensity: "+data.lightIntensity);
	renderLightIntensityChart([{name: 'Light Intensity', points: data.chartData}]);
})