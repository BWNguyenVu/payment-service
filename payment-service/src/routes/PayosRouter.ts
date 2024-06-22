import express from 'express';
import {PayosController} from '../controllers/PayosController';
import authMiddleware from '../middlewares/AuthMiddleware';

const router = express.Router();

const payosController = new PayosController();

router.post("/create", payosController.createPaymentLink);
router.get("/:orderId", authMiddleware, payosController.getPaymentById);
router.post("/cancel/:id", payosController.cancelPayment);
router.post("/purchaseWithPayos", authMiddleware, payosController.purchaseWithPayos);

module.exports = router