import {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class AgendaRapidoApi implements ICredentialType {
  name = 'agendaRapidoApi';
  displayName = 'AgendaRapido API';
  documentationUrl = 'https://github.com/joaz0/smart-calendar';
  properties: INodeProperties[] = [
    {
      displayName: 'API URL',
      name: 'apiUrl',
      type: 'string',
      default: 'http://localhost:3000',
      required: true,
      description: 'Base URL do backend Smart Calendar',
    },
    {
      displayName: 'Email',
      name: 'email',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
    },
  ];

  async authenticate(credentials: any): Promise<any> {
    const { apiUrl, email, password } = credentials;
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return { token: `Bearer ${data.token}` };
  }

  test = {
    request: {
      baseURL: '={{$credentials.apiUrl}}',
      url: '/api/auth/me',
      headers: {
        Authorization: '={{$credentials.token}}',
      },
    },
  };
}