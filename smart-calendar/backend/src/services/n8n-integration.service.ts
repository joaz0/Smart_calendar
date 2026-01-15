import axios from 'axios';

interface N8nWebhook {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  active: boolean;
}

export class N8nIntegrationService {
  private n8nUrl: string;
  private apiKey: string;

  constructor(n8nUrl?: string, apiKey?: string) {
    this.n8nUrl = n8nUrl || process.env.N8N_URL || 'http://localhost:5678';
    this.apiKey = apiKey || process.env.N8N_API_KEY || '';
  }

  async triggerWebhook(webhookUrl: string, data: any): Promise<any> {
    try {
      const response = await axios.post(webhookUrl, data);
      return response.data;
    } catch (error: any) {
      throw new Error(`N8N webhook error: ${error.message}`);
    }
  }

  async executeWorkflow(workflowId: string, data: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.n8nUrl}/api/v1/workflows/${workflowId}/execute`,
        data,
        {
          headers: {
            'X-N8N-API-KEY': this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`N8N workflow execution error: ${error.message}`);
    }
  }

  async getWorkflows(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.n8nUrl}/api/v1/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey,
        },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(`N8N get workflows error: ${error.message}`);
    }
  }
}

export const n8nService = new N8nIntegrationService();
