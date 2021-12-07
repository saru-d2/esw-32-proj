#include "WiFi.h"
#include "HTTPClient.h"
#include "AESLib.h"
#include "ESP32_MailClient.h"

char *ssid = "";
char *pwd = "";

//REALTIME START
const char* ntpServer = "pool.ntp.org";
const long timeOffset = 19800;
const int daylightOffset = 0;
//REALTIME END

//ENCRYPTION START
unsigned char cleartext[(128 + 1)] = {0}; // THIS IS INPUT BUFFER (FOR TEXT)
unsigned char ciphertext[2*(128 + 1)] = {0}; // THIS IS OUTPUT BUFFER (FOR BASE64-ENCODED ENCRYPTED DATA)


#define GMAIL_SMTP_SEVER "smtp.gmail.com"
#define GMAIL_SMTP_USERNAME ""
#define GMAIL_SMTP_PASSWORD ""
#define GMAIL_SMTP_PORT 465  
SMTPData data;

String sendEmail(int PH) {
  
  Serial.println("sending mail");
  data.setLogin(GMAIL_SMTP_SEVER, GMAIL_SMTP_PORT, GMAIL_SMTP_USERNAME, GMAIL_SMTP_PASSWORD);
  data.setSender("team32", GMAIL_SMTP_USERNAME);
  data.setSubject("team32 dash");
  data.setMessage("pH (" + String(PH) + ") is out of safe range", false);
  data.addRecipient("");
  delay(100);
  Serial.println(MailClient.sendMail(data));
  if (!MailClient.sendMail(data)) 
    Serial.println(MailClient.smtpErrorReason());
    return MailClient.smtpErrorReason();
  return "";
}

uint16_t encrypt_to_ciphertext(char * msg, uint16_t msgLen, byte iv[]) {
  Serial.println("Calling encrypt (string)...");
  // AES Encryption Key (same as in node-js)
  byte aes_key[] = { 0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C };
  AESLib aesLib;
  int cipherlength = aesLib.encrypt((byte*)msg, msgLen, (char*)ciphertext, aes_key, sizeof(aes_key), iv);
  return cipherlength;
}
//ENCRYPTION END

// OM2M START
String createCI(String val)
{
  //encrypting
  byte enc_iv[N_BLOCK] =      { 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA };
  byte enc_iv_to[N_BLOCK]   = { 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA };

  sprintf((char*)cleartext, "%s", val.c_str());
  Serial.println((char*)cleartext);
  uint16_t msgLen = val.length();
  memcpy(enc_iv, enc_iv_to, sizeof(enc_iv_to));
  uint16_t encLen = encrypt_to_ciphertext((char*)cleartext, msgLen, enc_iv);
  Serial.print("Encrypted length = "); Serial.println(encLen );
  String crypted = (char*)ciphertext;
  Serial.println("Encrypted stuffs = " + crypted);
  //encryption done
  
  HTTPClient http;
  http.begin("https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data");
  Serial.println("https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data");                     
  //http.begin("localhost:4000");
  //Serial.println("localhost:4000");
  http.addHeader("X-M2M-Origin", "lV2tfIWL8r:DPiZn9pxhA");
  http.addHeader("Content-Type", "application/json;ty=4");
  int code = http.POST("{\"m2m:cin\": {""\"con\":\"" + crypted + "\"""}}");
 
  http.end();
  if(code==-1)
    ESP.restart();
}
//OM2M END

//THINGSPEAK START
void sendData(String url){
  HTTPClient http; // Initialize our HTTP client

  http.begin(url.c_str()); // Initialize our HTTP request
      
  int httpResponseCode = http.GET(); // Send HTTP request

  http.end();
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
}
//THINGSPEAK END

void setup()
{
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pwd);
  Serial.print("Connecting to "); Serial.println(ssid);
 
  uint8_t i = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print('.');
    delay(500);
 
    if ((++i % 16) == 0)
    {
      Serial.println(F(" still trying to connect"));
    }
  }
 
  Serial.print(F("Connected. My IP address is: "));
  Serial.println(WiFi.localIP());

  configTime(timeOffset, daylightOffset, ntpServer);
  
  Serial.println("Setup done");
}

void loop() 
{
  //real time code
  struct tm timeinfo;
  String timetosend;
  if (!getLocalTime(&timeinfo))
    timetosend = "Failed to obtain time";
  else
    timetosend = String(timeinfo.tm_year + 1900) + String(timeinfo.tm_mon + 1) + String(timeinfo.tm_mday) + String(timeinfo.tm_hour) + String(timeinfo.tm_min) + String(timeinfo.tm_sec);

  //Sensor data (not real)
  int PH = random(14);
  int TDS = random(100);
  int TURB = random(100);
  int ORP = random(100);
  int TEMP = random(100);

  if (PH > 8 || PH < 4)
    sendEmail(PH);

  // Send data to OneM2M server
  String sensor_string = timetosend + "," + String(PH) + ","+ String(TDS) + ","+ String(TURB) + ","+ String(ORP) + ","+ String(TEMP) ;
  createCI(sensor_string);
  
  // Send data to ThingSpeak
  String TSsend = "https://api.thingspeak.com/update?api_key=VOQD3DX80YY1IDPM" +  String("&field1=") + String(PH) + "&field2=" + String(TDS) + "&field3=" + String(TURB) + "&field4=" + String(ORP) + "&field5=" + String(TEMP) ;
  sendData(TSsend);
  
  delay(2000);
}