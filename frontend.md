# Checklist de Finalização Frontend - TrackEi

Este documento foca exclusivamente nas tarefas de frontend necessárias para levar a interface ao estado de produção.

## 0. Correções Urgentes
- [ ] **Bug Dashboard:** Corrigir erro que impede a exibição do dashboard (Verificar importações, exports e caminhos de arquivo no Inertia).

## 1. Otimização e Mobile-First (PWA)
- [ ] **Configuração PWA:** Implementar `vite-plugin-pwa` para suporte a instalação e offline básico.
- [ ] **Service Workers:** Configurar cache de assets estáticos e rotas principais.
- [ ] **Manifesto Web:** Definir ícones, cores de tema e splash screens para Android/iOS.
- [ ] **Suporte Offline:** Adicionar feedback visual ("Você está offline") e cache dos últimos pacotes visualizados pelo motorista.

## 2. UX Avançado e Polimento
- [ ] **Refinamento de Skeletons:** Garantir que todas as páginas (`Dashboard`, `Packages`, `Track`) tenham loaders que preservem o layout.
- [ ] **Captura de Erros (Error Boundaries):** Implementar componentes de fallback para erros em partes críticas (ex: falha ao carregar o mapa).
- [ ] **Estados de Formulário:** Adicionar animações de "Sucesso" (check azul) e "Erro" após submissões de formulários.
- [ ] **Acessibilidade (a11y):** Revisar contraste de cores (especialmente no modo dark) e adicionar labels para leitores de tela.

## 3. Performance e SEO
- [ ] **Bundle Analysis:** Executar `rollup-plugin-visualizer` para identificar e remover dependências pesadas.
- [ ] **Code Splitting:** Garantir que o Leaflet e outros componentes pesados sejam carregados apenas quando necessário (Dynamic Imports).
- [ ] **Metatags e SEO:** Configurar títulos dinâmicos e descrições para a Landing Page e Página de Rastreio.
- [ ] **Lighthouse Audit:** Atingir score > 90 em Performance e Best Practices.

## 4. Testes de Interface
- [ ] **E2E Testing:** Criar fluxos de teste com Playwright/Cypress para:
    - Fluxo de Login -> Criação de Pacote.
    - Fluxo de Motorista -> Aceitar Entrega -> Finalizar Entrega.
    - Busca de código na Página de Rastreio Pública.

---

## Status das Fases Anteriores (Concluído)
- [x] Refatoração de Formulários com Zod/React Hook Form.
- [x] Integração com Laravel Echo para notificações real-time.
- [x] Layouts Mestres (Public, App, Driver).
- [x] Sistema de Mapas (Leaflet) integrado.
- [x] Identidade Visual (Tailwind 4).
