Obrigatório:

@Component({
  selector: 'app-component-name',    // kebab-case
  standalone: true,                  // Todos componentes são standalone
  imports: [                         // Importar APENAS módulos usados
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './component-name.html',
  styleUrls: ['./component-name.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  // Quando possível
})
export class ComponentNameComponent implements OnInit, OnDestroy {
  // Implementação
}
