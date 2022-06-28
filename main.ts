function savePosition (cmd: string) {
    temp = cmd.split(",")
    time = temp[1]
    latitude = temp[2]
    longitude = temp[4]
    altitude = temp[9]
    serial.writeLine("" + (time))
    serial.writeLine("" + (latitude))
    serial.writeLine("" + (longitude))
    serial.writeLine("" + (altitude))
}
let received_cmd = ""
let altitude = ""
let longitude = ""
let latitude = ""
let time = ""
let temp: string[] = []
serial.redirect(
SerialPin.P1,
SerialPin.P0,
BaudRate.BaudRate9600
)
serial.setRxBufferSize(254)
basic.forever(function () {
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
    received_cmd = "deadbeef"
    while (!(received_cmd.includes("GPGGA,"))) {
        received_cmd = serial.readUntil(serial.delimiters(Delimiters.Dollar))
    }
    serial.redirectToUSB()
    serial.writeLine(received_cmd)
    savePosition(received_cmd)
    serial.redirect(
    SerialPin.P1,
    SerialPin.P0,
    BaudRate.BaudRate9600
    )
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
})
