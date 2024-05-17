此專案為Node.js 以 HONO framework為基礎搭架。
在這個專案中,src目錄下有多個子目錄,代表了不同的應用程式組件:

schedulers: 包含定期執行的任務或排程器
index.ts: 是應用程式的主要入口點
app.ts: 包含應用程式的主要邏輯和設定
objects: 定義了應用程式使用的資料模型和物件
server.ts: 是Web服務器的設定和處理程序

這個專案的目的是建立一個中介軟體,使用Modbus TCP通訊協定連接電網設備,透過HONO建立 API Server 將資料拋送至MQTT。
總的來說,這是一個典型的Node.js專案結構,結合了HONO框架和Modbus TCP協定支援,用於實現物聯網資料收集和傳輸的功能。


```
npm install
npm run dev
```

```
open http://localhost:3000
```
