Injeção de dependências:

// ✅ BOM - Usar inject()
private service = inject(MyService);
private router = inject(Router);

// ❌ RUIM - Constructor complexo
constructor(
  private service1: Service1,
  private service2: Service2,
  private service3: Service3
) {}

// Mocks para testes
export class MockService {
  getData = jasmine.createSpy('getData').and.returnValue(of(mockData));
}
