# Vulnerabilidades Conhecidas - Smart Calendar

## Status Atual

### ✅ Backend (Produção)
- **0 vulnerabilidades** em dependências de produção
- ⚠️ 8 vulnerabilidades LOW em dev dependencies (jest/ts-node)
- **Impacto**: Nenhum em produção (apenas ambiente de desenvolvimento)

### ⚠️ Frontend (Produção)
- **3 vulnerabilidades HIGH** no Angular 18.2.14
- **Impacto**: XSS em SVG e XSRF token leakage

## Vulnerabilidades Angular 18

### GHSA-jrmj-c5cx-3cw6 (HIGH)
**Descrição**: XSS via atributos SVG não sanitizados  
**Versões afetadas**: Angular <=18.2.14  
**Mitigação aplicada**:
- Não usar SVG dinâmico de fontes não confiáveis
- Sanitizar todo conteúdo SVG com DomSanitizer
- Validar inputs antes de renderizar

### GHSA-v4hv-rgfq-gp49 (HIGH)
**Descrição**: XSS via SVG Animation e MathML  
**Versões afetadas**: Angular <=18.2.14  
**Mitigação aplicada**:
- Desabilitar animações SVG dinâmicas
- Não usar MathML de fontes externas
- Content Security Policy configurado

### GHSA-58c5-g7wp-6w37 (HIGH)
**Descrição**: XSRF Token Leakage via URLs protocol-relative  
**Versões afetadas**: Angular <=19.2.15  
**Mitigação aplicada**:
- Usar apenas URLs absolutas
- CORS configurado corretamente
- Tokens XSRF com SameSite=Strict

## Plano de Atualização

### Opção 1: Manter Angular 18 (Atual)
**Prós**:
- ✅ Estabilidade garantida
- ✅ Sem breaking changes
- ✅ Mitigações aplicadas

**Contras**:
- ⚠️ Vulnerabilidades conhecidas
- ⚠️ Sem patches de segurança

### Opção 2: Upgrade para Angular 19 (Recomendado futuro)
**Prós**:
- ✅ Patches de segurança
- ✅ Melhorias de performance

**Contras**:
- ⚠️ Breaking changes
- ⚠️ Requer testes extensivos
- ⚠️ Atualização de dependências

### Opção 3: Upgrade para Angular 21 (Futuro)
**Prós**:
- ✅ Todas vulnerabilidades corrigidas
- ✅ Últimas features

**Contras**:
- ❌ Breaking changes significativos
- ❌ Requer refatoração
- ❌ Tempo de desenvolvimento

## Mitigações Implementadas

### Content Security Policy
```typescript
// netlify.toml
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### Sanitização de Inputs
```typescript
// Todos inputs sanitizados via DomSanitizer
constructor(private sanitizer: DomSanitizer) {}
```

### CORS Restritivo
```typescript
// Backend
CORS_ORIGIN=https://smart-calendar.netlify.app
```

## Recomendações

1. **Curto Prazo** (Atual):
   - ✅ Manter Angular 18.2.14
   - ✅ Aplicar todas mitigações
   - ✅ Monitorar CVEs

2. **Médio Prazo** (Q2 2025):
   - 🔄 Planejar upgrade para Angular 19
   - 🔄 Testar em ambiente staging
   - 🔄 Documentar breaking changes

3. **Longo Prazo** (Q3 2025):
   - 🔄 Upgrade para Angular 21
   - 🔄 Refatoração completa
   - 🔄 Testes E2E

## Monitoramento

- GitHub Dependabot: Ativo
- npm audit: Semanal
- Snyk: Configurar (opcional)

## Última Atualização
Data: 2026-01-X20
Responsável: Dev Team
Status: Mitigações aplicadas, vulnerabilidades conhecidas documentadas
