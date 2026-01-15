import { Request, Response } from 'express';
import { n8nService } from '../services/n8n-integration.service';

export const n8nController = {
  async triggerWebhook(req: Request, res: Response) {
    try {
      const { webhookUrl, data } = req.body;
      const result = await n8nService.triggerWebhook(webhookUrl, data);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async executeWorkflow(req: Request, res: Response) {
    try {
      const { workflowId } = req.params;
      const data = req.body;
      const result = await n8nService.executeWorkflow(workflowId, data);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getWorkflows(req: Request, res: Response) {
    try {
      const workflows = await n8nService.getWorkflows();
      res.json({ success: true, data: workflows });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
