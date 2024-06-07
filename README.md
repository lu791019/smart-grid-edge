此專案為Node.js 以 HONO framework為基礎搭架。
在這個專案中,src目錄下有多個子目錄,代表了不同的應用程式組件:

在這個專案中，src 目錄下有多個子目錄，代表了不同的應用程式組件：

controllers: 包含用於處理特定協議（如 Modbus 和 SNMP）的控制器。

- readModbus.ts: 處理 Modbus 相關的讀取操作。
- readSnmp.ts: 處理 SNMP 相關的讀取操作。

interface: 定義了應用程式中使用的介面。

- interface.ts: 包含應用程式中所需的介面定義。

routes: 管理應用程式的路由。

- route.ts: 定義了應用程式的路由。
- index.ts: 匯總並導出所有路由。

schedulers: 包含定期執行的任務或排程器。

services: 提供應用程式的核心服務邏輯。

- modbusServices.ts: 提供 Modbus 協議相關的服務。
- mqttServices.ts: 提供 MQTT 協議相關的服務。
- snmpServices.ts: 提供 SNMP 協議相關的服務。

types: 定義應用程式使用的類型和型別。

utility: 包含各種實用工具和設定。

- config.ts: 應用程式的配置文件。
- response.ts: 定義了標準的回應格式。
- snmpConfig.ts: SNMP 相關的配置。

app.ts: 包含應用程式的主要邏輯和設定。
index.ts: 是應用程式的主要入口點。

這個專案的目的是建立一個中介軟體,使用Modbus TCP通訊協定連接電網設備,透過HONO建立 API Server 將資料拋送至MQTT。
總的來說,這是一個典型的Node.js專案結構,結合了HONO框架和Modbus TCP協定支援,用於實現物聯網資料收集和傳輸的功能。

```
npm install
npm run format
npm run dev
```

```
open http://localhost:3000

GET http://localhost:3000/api/modbus
```
