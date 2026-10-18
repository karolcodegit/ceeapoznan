// cloud/index.js – serwis "ceea-api": /register + /tpay-webhook
// Wczytuje .env lokalnie; na Cloud Run zmienne są ustawiane w usłudzie
require("dotenv").config()

const functions = require("@google-cloud/functions-framework")
const cors = require("cors")
const { registerHandler } = require("./src/register")
const { webhookHandler } = require("./src/webhook")
const { markPaidHandler } = require("./src/markPaid")
const { simulateHandler } = require("./src/simulate")
const { myMaterialsHandler } = require("./src/materials")
const { orderStatusHandler } = require("./src/orderStatus")
const { bookOrderHandler } = require("./src/bookOrder")
const { contactHandler } = require("./src/contact");
const { bookNotifyHandler } = require("./src/bookNotify");
const { productsHandler } = require("./src/products")
const { productStockHandler } = require("./src/productStock") 
const { sponsorsHandler } = require('./src/sponsors')
const { faqHandler } = require('./src/faq')
const { employeesHandler } = require('./src/employees')
const { companyHandler } = require("./src/company")
const { coursesHandler } = require("./src/courses")

const corsHandler = cors({ origin: true })

functions.http("handler", async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*")
      res.set("Access-Control-Allow-Methods", "GET", "POST")
      res.set("Access-Control-Allow-Headers", "Content-Type")
      res.set("Access-Control-Max-Age", "3600")
      return res.status(204).send("")
    }

    try {
      if (req.path === "/tpay-webhook") {
        // functions-framework udostepnia surowe body jako req.rawBody (Buffer)
        return await webhookHandler(req, res)
      }
      if (req.path === "/order-status") {
        return await orderStatusHandler(req, res)
      }
      if (req.path === "/my-materials") {
        return await myMaterialsHandler(req, res)
      }
      if (req.path === "/simulate") {
        return await simulateHandler(req, res)
      }
      if (req.path === "/mark-paid") {
        return await markPaidHandler(req, res)
      }
      if (req.path === "/register" || req.path === "/") {
        return await registerHandler(req, res)
      }
      if (req.path === "/book-order") {
        return await bookOrderHandler(req, res)
      }
      if (req.path === "/contact") {
        return await contactHandler(req, res)
      }
      if (req.path === "/book-notify") {
        return await bookNotifyHandler(req, res)
      }
      if (req.path === "/products") {
        return await productsHandler(req, res)
      }
      if (req.path === "/product-stock") {
        return await productStockHandler(req, res)
      }
      if (req.path === '/sponsors'){
        return await sponsorsHandler(req, res)
      }
      if (req.path === '/faq'){
        return await faqHandler(req, res)
      }
      if (req.path === '/employees'){
        return await employeesHandler(req, res)
      }
      if (req.path === "/company") {
        return await companyHandler(req, res)
      }
      if (req.path === "/courses") {
        return await coursesHandler(req, res)
      }
      return res.status(404).json({ error: "Not found" })
    } catch (error) {
      console.error("❌", error.message)
      return res.status(500).json({ error: error.message })
    }
  })
})
