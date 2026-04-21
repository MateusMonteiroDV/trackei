# Plano de Reconstrução do Frontend - TrackEi

Este documento detalha o roteiro para reconstruir o frontend do TrackEi do zero, garantindo uma interface profissional, escalável e focada na melhor experiência de usuário (UX).

## 1. Fundamentos e Tecnologias Core

O backend já fornece uma base sólida com Laravel, Inertia e uma API robusta. Manteremos a stack moderna, mas com uma organização superior:

- **Framework:** React 19 + TypeScript.
- **Integração:** Inertia.js (para o Dashboard Admin) e React Router (para a Landing/Rastreio Público).
- **Estilização:** Tailwind CSS 4.0 (Aproveitando as novas funcionalidades de performance).
- **Componentes:** Shadcn UI (Radix UI) para componentes acessíveis e customizáveis.
- **Estado Global:** Redux Toolkit para gerenciar estados complexos (notificações, sessão do motorista).
- **Tempo Real:** Laravel Echo + Reverb para rastreamento ao vivo.
- **Validação:** Zod + React Hook Form.

---

## 2. Fase 1: Design System e Estrutura Base

Antes de criar telas, definiremos a identidade visual:

- [x] **Configuração do Tailwind 4:** Definir paleta de cores (ex: Azul Profundo para confiança, Âmbar para alertas de entrega).
- [x] **Biblioteca de Ícones:** Padronizar o uso de `lucide-react`.
- [x] **Layouts Mestres:**
    - `PublicLayout`: Para landing page e tela de rastreio.
    - `AppLayout`: Sidebar colapsável, Header com perfil e notificações.
    - `DriverLayout`: Focado em mobile, botões grandes e navegação simplificada.

---

## 3. Fase 2: Fluxo de Autenticação e Onboarding

O sistema é multi-tenant (Business). O fluxo precisa ser fluido:

- [x] **Login/Registro:** Validação em tempo real e feedback de erro claro.
- [x] **Onboarding de Empresa:** Fluxo de criação de `Business` logo após o registro, coletando CNPJ e dados de contato.
- [x] **Recuperação de Senha:** Telas limpas e integradas ao backend.

---

## 4. Fase 3: Dashboard Administrativo (Core)

Onde o dono da empresa gerencia tudo:

### Gerenciamento de Pacotes
- [x] **Lista Avançada:** Tabela com filtros (status, data, motorista), busca instantânea e paginação.
- [x] **Criação de Pacotes:** Formulário inteligente com busca de endereço (via API de CEP) e geração automática de código de rastreio.
- [x] **Detalhes do Pacote:** Timeline da entrega (status history) e mapa mostrando a última localização conhecida.

### Gerenciamento de Motoristas
- [x] **Dashboard de Motoristas:** Visualização de quem está `available` ou `on_delivery`.
- [x] **Cadastro de Motorista:** Vinculação de `User` como `Driver`.
- [x] **Rastreamento ao Vivo:** Mapa (Leaflet/Google Maps) mostrando a posição de todos os motoristas ativos.

---

## 5. Fase 4: Portal do Motorista (Mobile-First)

Interface otimizada para quem está na rua:

- [x] **Lista de Entregas:** Cards grandes com endereço e botão direto para o Waze/Google Maps.
- [x] **Atualização de Status:** Botão de "Iniciar Entrega" e "Confirmar Entrega".
- [x] **Geolocalização:** Script de background para enviar a posição GPS via API (`/api/driver/location`) a cada X minutos.

---

## 6. Fase 5: Rastreio Público (Experiência do Cliente)

A cara do sistema para o cliente final:

- [x] **Página de Rastreio:** Input simples de código -> Timeline visual da entrega.
- [x] **Notificações:** Feedback visual de "Em trânsito", "Saiu para entrega" e "Entregue".

---

## 7. Fase 6: Integrações e Real-time

- [x] **Notificações Push/Toast:** Usar o sistema de notificações do backend para mostrar alertas em tempo real quando um pacote muda de status.
- [x] **Sincronização de Estado:** Garantir que o Dashboard atualize sem refresh quando um motorista aceita um pacote.

---

## 8. Fase 7: Polimento e Produção

- [x] **Skeleton Loaders:** Para todas as chamadas assíncronas (evitar layout shift).
- [x] **Empty States:** Ilustrações amigáveis quando não houver dados.
- [x] **Error Boundaries:** Impedir que o app quebre inteiramente por erro em um componente.
- [ ] **SEO & Performance:** Otimização do bundle via Vite e metatags para a Landing Page.
- [ ] **PWA (Opcional):** Transformar o Portal do Motorista em PWA para facilitar o acesso no celular.

---

## Checklist de Execução Técnica

1. [x] Limpar `resources/js/components` de componentes não utilizados.
2. [x] Reorganizar `resources/js/pages` seguindo os módulos acima.
3. [x] Implementar `Zod` em todos os formulários.
4. [x] Configurar `Laravel Echo` no frontend.
5. [ ] Rodar `npm run build` e validar performance no Lighthouse.
