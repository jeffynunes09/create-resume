# Create Resume

Uma aplicação moderna para criação e gerenciamento de currículos profissionais.

![CI](https://github.com/your-username/create-resume/workflows/CI/badge.svg)

## Funcionalidades

- Criação de currículos profissionais
- Edição com preview em tempo real
- Drag and drop para reordenar experiências, educação e habilidades
- Personalização de fonte, tamanho e cor
- Export para PDF e DOCX
- Autenticação JWT
- API RESTful documentada com Swagger

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Server state management
- **React Router** - Routing
- **Radix UI** - Accessible components
- **dnd-kit** - Drag and drop
- **Lucide React** - Icons
- **Storybook** - Component documentation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Prisma** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Swagger** - API documentation
- **Zod** - Validation

### Tooling
- **pnpm** - Package manager
- **Turborepo** - Monorepo management
- **ESLint** - Linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD

## Estrutura do Projeto

```
create-resume/
├── apps/
│   ├── api/                 # Backend Express
│   │   ├── prisma/          # Database schema and migrations
│   │   └── src/
│   │       ├── config/      # Configuration (Swagger, etc.)
│   │       ├── database/    # Prisma client
│   │       └── modules/     # Feature modules (auth, resume)
│   └── web/                 # Frontend React
│       ├── .storybook/      # Storybook configuration
│       └── src/
│           ├── components/  # UI components
│           ├── features/    # Feature modules
│           └── lib/         # Utilities
├── packages/
│   ├── api-client/          # HTTP client
│   ├── eslint-config/       # Shared ESLint config
│   ├── routes/              # Shared route definitions
│   ├── schemas/             # Zod validation schemas
│   ├── shared-types/        # TypeScript types
│   └── tsconfig/            # Shared TypeScript config
└── .github/
    └── workflows/           # CI/CD pipelines
```

## Pré-requisitos

- Node.js 20+
- pnpm 9+

## Instalação

```bash
# Clone o repositório
git clone https://github.com/your-username/create-resume.git
cd create-resume

# Instale as dependências
pnpm install

# Configure o banco de dados
pnpm --filter @create-resume/api db:push
pnpm --filter @create-resume/api db:seed
```

## Desenvolvimento

```bash
# Inicie todos os serviços em modo de desenvolvimento
pnpm dev

# Ou inicie separadamente:
pnpm --filter @create-resume/api dev   # API em http://localhost:3001
pnpm --filter @create-resume/web dev   # Web em http://localhost:5173
```

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia todos os serviços em modo dev |
| `pnpm build` | Build de produção de todos os pacotes |
| `pnpm lint` | Executa ESLint em todos os pacotes |
| `pnpm typecheck` | Verifica tipos TypeScript |
| `pnpm test` | Executa testes |
| `pnpm format` | Formata código com Prettier |
| `pnpm storybook` | Inicia Storybook |
| `pnpm build-storybook` | Build do Storybook |

## Documentação da API

A documentação da API está disponível via Swagger UI:

```
http://localhost:3001/api-docs
```

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Autenticação |
| GET | `/resumes` | Listar currículos |
| POST | `/resumes` | Criar currículo |
| GET | `/resumes/:id` | Buscar currículo |
| PUT | `/resumes/:id` | Atualizar currículo |
| DELETE | `/resumes/:id` | Excluir currículo |

## Storybook

Documentação visual dos componentes:

```bash
pnpm storybook
# Acesse http://localhost:6006
```

## Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes com watch mode
pnpm --filter @create-resume/api test:watch
```

## CI/CD

O projeto utiliza GitHub Actions para:

- **Lint** - Verificação de código com ESLint
- **Type Check** - Verificação de tipos TypeScript
- **Build** - Build de produção
- **Test** - Execução de testes

A pipeline é executada em:
- Push para `main` ou `master`
- Pull requests para `main` ou `master`

## Variáveis de Ambiente

### API (`apps/api/.env`)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
API_PORT=3001
API_HOST=0.0.0.0
```

### Web (`apps/web/.env`)

```env
VITE_API_URL=http://localhost:3001
```

## Usuário de Teste

Após executar o seed, você pode fazer login com:

```
Email: demo@example.com
Senha: demo123
```

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
