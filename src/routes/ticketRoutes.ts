import { Router } from 'express';
import {
  getTickets,
  createTicket,
  filterTickets,
  takeTicket,
  completeTicket,
  cancelTicket,
  cancelAllInProgress
} from '../controllers/ticketController';

const router = Router();

router.get('/tickets/get-tickets', getTickets);
router.post('/tickets/create', createTicket);
router.post('/tickets/filter', filterTickets);
router.put('/tickets/take', takeTicket);
router.put('/tickets/complete', completeTicket);
router.put('/tickets/cancel', cancelTicket);
router.delete('/tickets/cancel-all', cancelAllInProgress);


export default router;