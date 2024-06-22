const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const paymentRouter = require('./src/routes/PayosRouter');
const {startConsumer} = require('./src/utils/PayosConsumer')
import KafkaConfig from './src/config/KafkaConfig' ;
const {connectDB} = require("./src/config/DbConnection")
require('dotenv').config();
const app = express();
const kafkaConfig = new KafkaConfig();
const port = process.env.PORT
connectDB()
startConsumer().catch(console.error);
kafkaConfig.connectProducer()
app.use(cors());
app.use(express.json());

// app.get("/", (req: any, res: any) => {
//   res.send("Hello World");
// });

app.use("/", paymentRouter)

app.listen(port, () => {
  console.log(`Payment-server is Listening to Port ${port}`);
});