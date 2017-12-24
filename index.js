const { Gateway, Device } = require('losant-mqtt');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;


const gateway = new Gateway({
	id: '5a3f38345a4c13000653c92c',
	key: '7bb95e5b-d629-4189-97a7-1c148f9cea0f',
	secret: 'bcca09d2d3f8050e67dc24e79397bf3e21fc45e181d400c33893525aaeb4a5b6'
});

gateway.connect();
const phSensor = gateway.addPeripheral('5a3f396b399722000728489a');

const port = new SerialPort('/dev/ttyACM0', (err) => {
	if (err) {
		console.error('Error:', err);
	}
})


function toJSON(data) {
	const values = data.split('\t');
	const result = {};
	values.forEach((strValue) => {
		const [key, value] = strValue.split('=').map((s) => s.trim());
		result[key] = value;
	})
	return result

}

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
parser.on('data', (data) => {
	const json = toJSON(data);
	phSensor.sendState(json);
});


