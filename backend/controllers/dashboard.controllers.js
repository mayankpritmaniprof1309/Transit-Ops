import * as DashboardService from '../services/dashboard.services.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const kpis = await DashboardService.getDashboardKPIs(req.query);
    res.status(200).json({ success: true, data: kpis });
  } catch (error) {
    next(error);
  }
};
