#include "WiFi.h"
#include "HTTPClient.h"
#include "ArduinoJson.h"

char *ssid = "";
char *pwd = "";
//String cse_ip = "192.168.43.59";
String cse_ip = "https://esw-onem2m.iiit.ac.in";

StaticJsonBuffer<200> jsonBuffer;
JsonObject& user_data = jsonBuffer.createObject();
JsonObject& temp_user_data = jsonBuffer.createObject();
JsonObject& sensor_data = jsonBuffer.createObject();

String server = cse_ip+"/~/in-cse/in-name/";

String createCI(String server, String ae, String cnt, String val)
{
  HTTPClient http;
  http.begin("https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data");
  Serial.println("https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data");
//  String postRequest = String() + "POST " + url + " HTTP/1.1\r\n" +
//                       "Host: " + CSE_IP + ":" + CSE_HTTP_PORT + "\r\n" +
//                       "X-M2M-Origin: " + CSE_M2M_ORIGIN + "\r\n" +
//                       "Content-Type: application/json;ty=" + ty + "\r\n" +
//                       "Content-Length: " + rep.length() + "\r\n"
//                       "Connection: close\r\n\n" +
//                       rep;
//                       
  http.addHeader("X-M2M-Origin", "lV2tfIWL8r:DPiZn9pxhA");
  http.addHeader("Content-Type", "application/json;ty=4");
  http.addHeader("Content-Length", "100");
  http.addHeader("Connection", "close");
//  http.addHeader("Content-Type", "application/json;ty=3");
//  http.addHeader("Content-Length", "100");
//  http.addHeader("Connection", "keep-alive");
//  http.addHeader("Accept-Encoding", "gzip, deflate, br");
//  http.addHeader("Accept", "*/*");
  int code = http.POST("{\"m2m:cin\": {\"lbl\": \"hi\", \"con\": \"12\" }}");
 
  http.end();
  Serial.print("shit: ");
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

//  WiFi.mode(WIFI_STA);
//  WiFi.disconnect();

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
  Serial.println("Setup done");
}


int total_time=0;
void loop()
{
  //To GET values
  //http.begin("http://192.168.0.113:8080/~/in-cse/in-name/verte001/DATA/la");
  //http.begin("http://192.168.0.113:8080/~/in-cse");
  //int httpCode = http.GET();

  int ntu = random(100);
  
  Serial.print ("Sensor Output (ntu):");
  Serial.println (ntu);
  Serial.println();

  String sensor2 = String(ntu); 

  String sensor_string = sensor2;

  sensor_string = "\"" + sensor_string + "\""; // DO NOT CHANGE THIS LINE

  // Send data to OneM2M server
  createCI(server, "Team_32", "Node_1", sensor_string);
  
//  Serial.println(total_time);
//  float ss = sensorValue;
//  float s = (ss*5.0)/4096.0;
//  Serial.println(sensorValue);

//  delay(500);
  delay(2000); // DO NOT CHANGE THIS LINE/
//  total_time++;
//  if(total_time==10)
//  {
//    ESP.restart();
//  }
//  
}
