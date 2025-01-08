const sdk = require('tellojs')
const spawn = require('child_process').exec;

timeing = process.argv[2]
console.log(`Timeing: ${timeing}`)

async function run(){
	await sdk.control.connect()
	battery = await sdk.read.battery();
	console.log(`Battery: ${battery}`)
	if(process.argv[3] == "s"){
		sdk.receiver.video.bind()
	}
	setTimeout(async function(){
		doStuff()
	}, 1000)
}
run()

async function doStuff(){
	await sdk.control.takeOff() 
	//sdk.control.rotate.clockwise(360)
	mat(()=>{
		console.log("Forward")
		moveS("front", 10.5-3)
		mat(()=>{
			console.log("Clockwise")
			sdk.control.rotate.clockwise(90)
			mat(()=>{
				console.log("Forward")
				moveS("front", 1.5)
				mat(()=>{
					console.log("Clockwise")
					sdk.control.rotate.clockwise(90)
					mat(()=>{
						console.log("Forward")
						moveS("front", 10.5-3)
						mat(()=>{
							console.log("Counter Clockwise")
							sdk.control.rotate.counterClockwise(90)
							mat(async()=>{
								console.log("landing")
								await sdk.control.stop()
								await sdk.control.land()
							})
						})
					})
				})
			})
		})
	})
}

function mat(input){
	samount = timeing/1000
	for(let i=1; i<samount; i++){
		setTimeout(async function(){
			console.log(`${samount-i}`)
		}, i*1000)
	}
	
	setTimeout(async function(){
		input()
	}, timeing)
}

function moveS(where, dir){
	ndir = dir*30.48
	move(where, ndir)
}
function move(where, dir){ sdk.control.move[where](dir) }

/*
//CONTROL COMMANDS
await sdk.control.connect()                     // Enter SDK mode.
await sdk.control.takeOff()                     // Auto takeoff.
await sdk.control.land()                        // Auto landing.
await sdk.control.emergency()                   // Stop motors immediately
await sdk.control.stop()                        // Hovers in the air
await sdk.control.move.up(x)                    // Ascend to “x” cm.
await sdk.control.move.down(x)                  // Descend to “x” cm.
await sdk.control.move.left(x)                  // move left to “x” cm.
await sdk.control.move.right(x)                 // move right to “x” cm.
await sdk.control.move.front(x)                 // move forward to “x” cm.
await sdk.control.move.back(x)                  // move backwards to “x” cm.
await sdk.control.move.go(end, speed)           //  fly to x y z in speed (cm/s)
await sdk.control.move.curve(start, end, speed) //  fly to x y z in speed (cm/s)
await sdk.control.rotate.clockwise(x)           // rotate clockwise 'x' degrees.
await sdk.control.rotate.counterClockwise(x)    // rotate counter clockwise 'x' degrees.
await sdk.control.flip.left()                   // Flip to the left.
await sdk.control.flip.right()                  // Flip to the right.
await sdk.control.flip.back()                   // Flip in backward.
await sdk.control.flip.front()                  // Flip in forward.

//SET COMMANDS
await sdk.set.speed(x)                          // set speed to x cm/s
await sdk.set.rc(x, y, z, yaw)                  // Send RC control via four channels.
await sdk.set.wifi(ssid, password)              // Set Wi-Fi with SSID password

//READ COMMANDS
await sdk.read.speed()                          // Obtain current speed (cm/s).
await sdk.read.battery()                        // Obtain current battery percentage.
await sdk.read.time()                           // Obtain current flight time.
await sdk.read.height()                         // Obtain get height (cm)
await sdk.read.temperature()                    // Obtain temperature (°C)
await sdk.read.attitude()                       // Obtain IMU attitude data
await sdk.read.barometer()                      // Obtain barometer value (m)
await sdk.read.tof()                            // Obtain distance value from TOF（cm）
await sdk.read.acceleration()                   // Obtain IMU angular acceleration data (0.001g)
await sdk.read.wifi()                           // Obtain Wi-Fi SNR.

//STREAM STATE
const stateEmitter = sdk.receiver.state.bind()  // Binding to port of state
stateEmitter.on('message', res => console.log)  // React to messages on received
sdk.receiver.state.close()                      // Stop receiving messages

//STREAM VIDEO
const videoEmitter = sdk.receiver.video.bind()  // Binding to port of video
videoEmitter.on('message', res => console.log)  // React to messages on received
sdk.receiver.video.close()                      // Stop receiving messages

/*
Example output of state:
{ 
    pitch: 1,
    roll: 0,
    yaw: 0,
    speed: { x: 0, y: 0, z: 0 },
    temperature: { low: 51, high: 53 },
    tof: 6553,
    heigh: 0,
    battery: 87,
    barometer: 24.65,
    time: 0,
    acceleration: { x: 16, y: 3, z: -990 } 
}

Example output of video: is binary ;)
*/