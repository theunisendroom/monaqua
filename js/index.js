function renderTemperatureChart(series) {
	JSC.Chart('temperatureChartDiv', {
		title_label_text: 'Temperature',
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
		defaultPoint_tooltip: '%seriesName <b>%yValue</b>%',
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
		defaultPoint_tooltip: '%seriesName <b>%yValue</b>',
		series: series
	});
}

var socket = io.connect();
socket.on("currentDataValues", function(data){
	console.log(data);
	$('#lastReadingDate').html("Last data reading: "+data.lastReadingDate);

	$('#waterTemperatureCurrent').html(data.waterTemperatureCurrent+"°C");
	$('#waterTemperatureMin').html(data.waterTemperatureMin+"°C");
	$('#waterTemperatureMax').html(data.waterTemperatureMax+"°C");

	$('#airTemperatureCurrent').html(data.airTemperatureCurrent+"°C");
	$('#airTemperatureMin').html(data.airTemperatureMin+"°C");
	$('#airTemperatureMax').html(data.airTemperatureMax+"°C");

	$('#heatIndexCurrent').html(data.heatIndexCurrent+"°C");
	$('#heatIndexMin').html(data.heatIndexMin+"°C");
	$('#heatIndexMax').html(data.heatIndexMax+"°C");

	$('#humidityCurrent').html(data.humidityCurrent+"%");
	$('#humidityMin').html(data.humidityMin+"%");
	$('#humidityMax').html(data.humidityMax+"%");

	$('#lightIntensityCurrent').html(data.lightIntensityCurrent);
	$('#lightIntensityMin').html(data.lightIntensityMin);
	$('#lightIntensityMax').html(data.lightIntensityMax);
})
socket.on("temperature", function(data){
	console.log(data);
	renderTemperatureChart([{name: 'Air Temperature', points: data.airTemperaturesData},
							{name: 'Heat Index', points: data.heatIndexData},
							{name: 'Water Temperature', points: data.waterTemperaturesData}]);
})

socket.on("humidity", function(data){
	console.log(data);
	renderHumidityChart([{name: 'Humidities', points: data.chartData}]);
})

socket.on("lightIntensity", function(data){
	console.log(data);
	
	renderLightIntensityChart([{name: 'Light Intensities', points: data.chartData}]);
})