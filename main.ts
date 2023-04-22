function savePosition (cmd: string) {
    temp = cmd.split(",")
    time = temp[1]
    latitude = temp[2]
    longitude = temp[4]
    altitude = temp[9]
    serial.writeLine("" + (time))
    serial.writeLine("" + (latitude))
    serial.writeLine("" + (longitude))
    serial.writeLine(altitude)
}
let received_cmd = ""
let altitude = ""
let longitude = ""
let latitude = ""
let time = ""
let temp: string[] = []
IotLoRaNode.SetRegion(region.EU868)
IotLoRaNode.InitialiseRadioABP(
"260B0B32",
"3732CADD3D61809F9978E5983E81BC06",
"94CB3D750FC6E6314F6F4FC542E8EFFC",
SpreadingFactors.Seven
)
// Anschluss vom GPS (SIM28)
serial.redirect(
SerialPin.P1,
SerialPin.P2,
BaudRate.BaudRate9600
)
serial.setRxBufferSize(254)
basic.forever(function () {
    // Anschluss vom GPS (SIM28)
    serial.redirect(
    SerialPin.P1,
    SerialPin.P2,
    BaudRate.BaudRate9600
    )
    received_cmd = "deadbeef"
    while (!(received_cmd.includes("GPGGA,"))) {
        received_cmd = serial.readUntil(serial.delimiters(Delimiters.Dollar))
    }
    serial.redirectToUSB()
    serial.writeLine(received_cmd)
    savePosition(received_cmd)
    // Anschluss vom LoRa-Modul
    serial.redirect(
    SerialPin.P14,
    SerialPin.P15,
    BaudRate.BaudRate115200
    )
    IotLoRaNode.TemperatureValue(input.temperature(), Channels.One)
    IotLoRaNode.GPS(
    11,
    50,
    parseFloat(altitude),
    Channels.One
    )
    IotLoRaNode.loraTransmitPayload()
})
basic.forever(function () {
    basic.showString("" + (latitude))
    basic.showString("" + (longitude))
    basic.showString(altitude)
})
