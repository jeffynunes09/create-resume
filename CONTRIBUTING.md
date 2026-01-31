# Contribuindo para o Create Resume

Obrigado por considerar contribuir para o Create Resume! Este documento fornece diretrizes para contribuir com o projeto.

## Código de Conduta

Este projeto segue um Código de Conduta. Ao participar, você concorda em respeitar todos os participantes.

## Como Contribuir

### Reportando Bugs

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/your-username/create-resume/issues)
2. Se não encontrar uma issue aberta, [crie uma nova](https://github.com/your-username/create-resume/issues/new)
3. Inclua um título claro e descrição detalhada
4. Adicione passos para reproduzir o problema
5. Inclua screenshots se aplicável

### Sugerindo Melhorias

1. Abra uma [nova issue](https://github.com/your-username/create-resume/issues/new)
2. Use um título claro e descritivo
3. Explique a melhoria em detalhes
4. Inclua exemplos de uso se possível

### Pull Requests

1. Fork o repositório
2. Clone seu fork localmente
3. Crie uma branch a partir de `main`:
   ```bash
   git checkout -b feature/minha-feature
   ```
4. Faça suas alterações
5. Execute os testes e linting:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```
6. Commit suas mudanças seguindo o padrão de commits
7. Push para seu fork
8. Abra um Pull Request

## Padrões de Código

### Commits

Utilizamos commits semânticos. Formato:

```
tipo(escopo): descrição

[corpo opcional]
```

Tipos:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (sem alteração de código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

Exemplos:
```
feat(resume): adicionar exportação para PDF
fix(auth): corrigir validação de token expirado
docs(readme): atualizar instruções de instalação
```

### TypeScript

- Use tipos explícitos quando possível
- Evite `any`
- Prefira interfaces a types para objetos

### React

- Use componentes funcionais
- Prefira hooks customizados para lógica reutilizável
- Mantenha componentes pequenos e focados

### Estilos

- Use Tailwind CSS para estilos
- Siga o design system existente
- Use as variáveis CSS definidas

## Estrutura de Diretórios

```
apps/
  api/           # Backend
  web/           # Frontend
packages/
  api-client/    # Cliente HTTP
  routes/        # Rotas compartilhadas
  schemas/       # Schemas de validação
  shared-types/  # Tipos TypeScript
  tsconfig/      # Configuração TypeScript
  eslint-config/ # Configuração ESLint
```

## Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Configurar banco de dados
pnpm --filter @create-resume/api db:push
pnpm --filter @create-resume/api db:seed

# Iniciar desenvolvimento
pnpm dev
```

## Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em watch mode
pnpm --filter @create-resume/api test:watch
```

## Documentação

### Storybook

Componentes UI devem ter stories:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Click me",
  },
};
```

### API (Swagger)

Endpoints devem ter documentação JSDoc:

```typescript
/**
 * @swagger
 * /endpoint:
 *   get:
 *     summary: Descrição do endpoint
 *     tags: [Tag]
 *     responses:
 *       200:
 *         description: Sucesso
 */
```

## Dúvidas?

Abra uma issue com a tag `question` ou entre em contato com os mantenedores.

Obrigado por contribuir!
