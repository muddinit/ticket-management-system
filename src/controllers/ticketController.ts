import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Ticket from '../models/ticketModel';


export const getTickets = async (req: Request, res: Response) => {
  try {
    res.json(await Ticket.findAll());
  } catch (error) {
    console.error('Ошибка при поиске обращений:', error);
    res.status(500).json({ message: 'Ошибка сервера при поиске обращений' });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { subject, message } = req.body;
    const ticket = await Ticket.create({ subject, message });
    res.status(201).json({ message: 'Обращение создано' });
  } catch (error) {
    console.error('Ошибка при создании обращения:', error);
    res.status(500).json({ message: 'Произошла ошибка при создании обращения' });
  }
};

export const filterTickets = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body; // Extract from body
  const whereClause: any = {};

  try {

    if (!startDate || typeof startDate !== 'string' || !startDate.trim()) {
      res.status(400).json({ message: 'Нужна дата для фильтраций' });
    }

    const startDateObj = new Date(startDate as string);
    const startOfDay = new Date(startDateObj.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(startDateObj.setHours(23, 59, 59, 999)); // End of the day

    // Ставим фильтры только на первую дату 
    whereClause.createdAt = {
      [Op.gte]: startOfDay,
      [Op.lte]: endOfDay,
    };

    if (endDate && typeof endDate === 'string' && endDate.trim()) {
      const endDateObj = new Date(endDate as string);
      const endOfEndDate = new Date(endDateObj.setHours(23, 59, 59, 999));

      // Обновляем фильтр и добавляем вторую дату если она имеется
      whereClause.createdAt = {
        [Op.gte]: startOfDay, // Start of the day for startDate
        [Op.lte]: endOfEndDate, // End of the day for endDate
      };
    }

    // Выдаем фильтрированный список обращений
    const tickets = await Ticket.findAll({ where: whereClause });
    res.json(tickets);
  } catch (error) {
    console.error('Ошибка при поиске обращений:', error);
    res.status(500).json({ message: 'Ошибка сервера при поиске обращений' });
  }
};

export const takeTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const ticket = await Ticket.findByPk(id);
    if (ticket) {
      console.log("Ticket status:", ticket.status);
      if (ticket.status === 'Новое') {
        ticket.status = 'В работе';
        await ticket.save();
        res.status(201).json({ message: 'Обращение принято в работу' });
      } else {
        res.status(400).json({ message: 'Обращение уже в работе' });
      }
    } else {
      res.status(404).json({ message: 'Обращение не найдено' });
    }
  } catch (error) {
    console.error('Ошибка при обработке обращения:', error);
    res.status(500).json({ message: 'Произошла ошибка при обработке обращения' });
  }
};

export const completeTicket = async (req: Request, res: Response) => {
  try {
    const { id, completeReason } = req.body;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      res.status(404).json({ message: 'Обращение не найдено' });
    } else
      if (ticket.status === 'В работе') {
        ticket.status = 'Завершено';
        ticket.resolution = completeReason;
        await ticket.save();
        res.json({ message: 'Обращение завершено' });
      } else {
        res.status(400).json({ message: 'Обращение не в работе' });
      }
  } catch (error) {
    console.error('Ошибка при завершении обращения:', error);
    res.status(500).json({ message: 'Произошла ошибка при завершении обращения' });
  }
};

export const cancelTicket = async (req: Request, res: Response) => {
  try {
    const { id, cancelReason } = req.body;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      res.status(404).json({ message: 'Обращение не найдено' });
    } else
      if (ticket.status !== 'Завершено') {
        ticket.status = 'Отменено';
        ticket.cancellationReason = cancelReason;
        await ticket.save();
        res.json({ message: 'Обращение отменено' });
      } else {
        res.status(400).json({ message: 'Обращение уже завершено' });
      }
  } catch (error) {
    console.error('Ошибка при отмене обращения:', error);
    res.status(500).json({ message: 'Произошла ошибка при отмене обращения' });
  }
};


export const cancelAllInProgress = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.findAll({ where: { status: 'В работе' } });

    await Promise.all(tickets.map(ticket => {
      ticket.status = 'Отменено';
      return ticket.save();
    }));

    res.json({ message: 'Все обращения в работе отменены' });
  } catch (error) {
    console.error('Ошибка при отмене обращений:', error);
    res.status(500).json({ message: 'Произошла ошибка при отмене обращений' });
  }
};