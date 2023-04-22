function sendLoraData () {
    // Anschluss vom LoRa-Modul
    serial.redirect(
    SerialPin.P14,
    SerialPin.P15,
    BaudRate.BaudRate115200
    )
    IotLoRaNode.TemperatureValue(input.temperature(), Channels.One)
    IotLoRaNode.GPS(
    nb_latitude,
    nb_longitude,
    nb_altitude,
    Channels.One
    )
    IotLoRaNode.loraTransmitPayload()
}
function getAndStoreGpsData () {
    // Anschluss vom GPS (SIM28)
    serial.redirect(
    SerialPin.P1,
    SerialPin.P2,
    BaudRate.BaudRate9600
    )
    serial.setRxBufferSize(254)
    received_cmd = "deadbeef"
    while (!(received_cmd.includes("GPGGA,"))) {
        received_cmd = serial.readUntil(serial.delimiters(Delimiters.Dollar))
    }
    str_temp = received_cmd.split(",")
    str_time = str_temp[1]
    str_latitude = str_temp[2]
    nb_degree = parseFloat(str_latitude.substr(0, 2))
    nb_minutes = parseFloat(str_latitude.substr(2, 2)) / 60
    nb_seconds = parseFloat(str_latitude.substr(4, 5)) / 60
    nb_latitude = nb_degree + (nb_minutes + nb_seconds)
    str_longitude = str_temp[4]
    nb_degree = parseFloat(str_longitude.substr(0, 3))
    nb_minutes = parseFloat(str_longitude.substr(3, 2)) / 60
    nb_seconds = parseFloat(str_longitude.substr(5, 5)) / 60
    nb_longitude = nb_degree + (nb_minutes + nb_seconds)
    nb_numberOfSatellites = parseFloat(str_temp[7])
    nb_altitude = parseFloat(str_temp[9])
    serial.redirectToUSB()
    serial.writeLine(received_cmd)
    serial.writeLine("" + (str_time))
    serial.writeLine(str_latitude)
    serial.writeLine("" + (nb_degree))
    serial.writeLine("" + (nb_minutes))
    serial.writeLine("" + (nb_seconds))
    serial.writeLine("" + (nb_latitude))
    serial.writeLine(str_longitude)
    serial.writeLine("" + (nb_degree))
    serial.writeLine("" + (nb_minutes))
    serial.writeLine("" + (nb_seconds))
    serial.writeLine("" + (nb_longitude))
    serial.writeLine("" + (nb_numberOfSatellites))
    serial.writeLine("" + (nb_altitude))
}
let nb_numberOfSatellites = 0
let str_longitude = ""
let nb_seconds = 0
let nb_minutes = 0
let nb_degree = 0
let str_latitude = ""
let str_time = ""
let str_temp: string[] = []
let received_cmd = ""
let nb_altitude = 0
let nb_longitude = 0
let nb_latitude = 0
IotLoRaNode.SetRegion(region.EU868)
IotLoRaNode.InitialiseRadioABP(
"260B0B32",
"3732CADD3D61809F9978E5983E81BC06",
"94CB3D750FC6E6314F6F4FC542E8EFFC",
SpreadingFactors.Seven
)
loops.everyInterval(5000, function () {
    basic.showIcon(IconNames.SmallHeart)
    getAndStoreGpsData()
    sendLoraData()
    basic.showIcon(IconNames.Heart)
})
