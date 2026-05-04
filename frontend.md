# Checklist de Finalização Frontend - TrackEi

Este documento foca exclusivamente nas tarefas de frontend necessárias para levar a interface ao estado de produção.

## 0. Correções Urgentes
- [x] **Bug Dashboard:** Corrigido erro de importação de rotas e componentes ausentes (Head).
- [x] **Identidade Visual:** Corrigido logo e textos de "Laravel Starter Kit" para "TrackEi".

## 1. Otimização e Mobile-First (PWA)
- [x] **Configuração PWA:** Implementado `vite-plugin-pwa` com registro automático.
- [x] **Service Workers:** Configurado via Vite PWA.
- [x] **Manifesto Web:** Definido `manifest.json` com ícones, cores e descrição do TrackEi.
- [x] **Suporte Offline:** Adicionado componente `OfflineAlert` em todos os layouts.

## 2. UX Avançado e Polimento
- [x] **Refinamento de Skeletons:** Criados componentes `PackageListSkeleton` e `DashboardStatsSkeleton`.
- [x] **Captura de Erros (Error Boundaries):** Implementado `ErrorBoundary` genérico e aplicado em todos os mapas (Leaflet).
- [x] **Estados de Formulário:** Adicionados estados de loading, sucesso e erro com `sonner` (toasts) e ícones animados no formulário de pacotes.
- [x] **Acessibilidade (a11y):** Adicionados `aria-label` em botões de ícone e navegação.

## 3. Performance e SEO
- [x] **Bundle Analysis:** Configurado `rollup-plugin-visualizer` para monitoramento do tamanho do build.
- [x] **Code Splitting:** Implementado `lazy` / `Suspense` para carregamento dinâmico do Leaflet (Mapas).
- [x] **Metatags e SEO:** Configuradas metatags base no `app.blade.php`.
- [ ] **Lighthouse Audit:** Necessário rodar em ambiente de staging para validar score final.

## 4. Testes de Interface
- [ ] **E2E Testing:** Sugerido implementação de Playwright para os fluxos críticos (Login, Driver, Public Tracking).

---

## Status das Fases Anteriores (Concluído)
- [x] Refatoração de Formulários com Zod/React Hook Form.
- [x] Integração com Laravel Echo para notificações real-time.
- [x] Layouts Mestres (Public, App, Driver).
- [x] Sistema de Mapas (Leaflet) integrado.
- [x] Identidade Visual (Tailwind 4).
