#include "WiFi.h"
#include "HTTPClient.h"
#include "Arduino_JSON.h"

char *ssid = "";
char *pwd = "";

String server = "https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/";

const char* ntpServer = "pool.ntp.org";
const long timeOffset = 19800;
const int daylightOffset = 0;

String createCI(String val)
{
  HTTPClient http;
  http.begin("https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data");
  Serial.println("https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data");                     
  http.addHeader("X-M2M-Origin", "lV2tfIWL8r:DPiZn9pxhA");
  http.addHeader("Content-Type", "application/json;ty=4");
  int code = http.POST("{\"m2m:cin\": {""\"con\":\"" + val + "\"""}}");
 
  http.end();
  Serial.print("code: ");
  Serial.println(code);
  if(code==-1)
  {
    ESP.restart();
  }
  delay(300);
}

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
  struct tm timeinfo;
  String timetosend;
  if (!getLocalTime(&timeinfo))
    timetosend = "Failed to obtain time";
  else
    timetosend = String(timeinfo.tm_year + 1900) + String(timeinfo.tm_mon + 1) + String(timeinfo.tm_mday) + String(timeinfo.tm_hour) + String(timeinfo.tm_min) + String(timeinfo.tm_sec);

  Serial.println(timetosend);
  
  int ntu = random(100);
  int otherdata = random(50);
  int nextdata = random(10);
  int lmaowhat = random(1000);
  int lasttime = random(400);
  
  Serial.print ("Sensor Output (ntu):");
  Serial.println (ntu);

  String sensor_string = "[" + timetosend + "," + String(ntu) + String(otherdata) + String(nextdata) + String(lmaowhat) + String(lasttime) + "]";

  // Send data to OneM2M server
  createCI(sensor_string);

  delay(2000);
}
