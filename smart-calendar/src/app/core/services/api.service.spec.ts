import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, ApiResponse } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET request', () => {
    it('should make successful GET request', (done) => {
      const mockResponse: ApiResponse<any> = {
        success: true,
        data: { id: 1, name: 'Test' },
      };

      service.get('/test').subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should include Authorization header when token exists', (done) => {
      const token = 'test-token';
      localStorage.setItem('token', token);

      service.get('/test').subscribe(() => done());

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush({ success: true });
    });
  });

  describe('POST request', () => {
    it('should make successful POST request', (done) => {
      const body = { name: 'Test' };
      const mockResponse: ApiResponse<any> = {
        success: true,
        data: { id: 1, ...body },
      };

      service.post('/test', body).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('PUT request', () => {
    it('should make successful PUT request', (done) => {
      const body = { name: 'Updated' };
      const mockResponse: ApiResponse<any> = {
        success: true,
        data: { id: 1, ...body },
      };

      service.put('/test/1', body).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/test/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('PATCH request', () => {
    it('should make successful PATCH request', (done) => {
      const body = { name: 'Patched' };
      const mockResponse: ApiResponse<any> = {
        success: true,
        data: { id: 1, ...body },
      };

      service.patch('/test/1', body).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/test/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('DELETE request', () => {
    it('should make successful DELETE request', (done) => {
      const mockResponse: ApiResponse<void> = {
        success: true,
      };

      service.delete('/test/1').subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/test/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('Error handling', () => {
    it('should handle 401 error and clear auth', (done) => {
      const originalHref = window.location.href;
      Object.defineProperty(window.location, 'href', {
        writable: true,
        value: originalHref,
      });

      service.get('/test').subscribe({
        error: (error) => {
          expect(error.statusCode).toBe(401);
          expect(error.message).toBe('Sessão expirada. Faça login novamente.');
          expect(localStorage.getItem('token')).toBeNull();
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 404 error', (done) => {
      service.get('/test').subscribe({
        error: (error) => {
          expect(error.statusCode).toBe(404);
          expect(error.message).toBe('Recurso não encontrado');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      req.flush({ error: 'Not Found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle 500 error', (done) => {
      service.get('/test').subscribe({
        error: (error) => {
          expect(error.statusCode).toBe(500);
          expect(error.message).toBe('Erro no servidor. Tente novamente mais tarde.');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      req.flush({ error: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', (done) => {
      service.get('/test').subscribe({
        error: (error) => {
          expect(error.statusCode).toBe(0);
          expect(error.message).toBe('Não foi possível conectar ao servidor');
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      req.error(new ProgressEvent('error'), { status: 0 });
    });
  });

  describe('Loading state', () => {
    it('should update loading state during request', (done) => {
      const loadingStates: boolean[] = [];

      service.isLoading().subscribe((isLoading) => {
        loadingStates.push(isLoading);
      });

      service.get('/test').subscribe(() => {
        setTimeout(() => {
          expect(loadingStates).toContain(true);
          expect(loadingStates[loadingStates.length - 1]).toBe(false);
          done();
        }, 0);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      req.flush({ success: true });
    });
  });
});
