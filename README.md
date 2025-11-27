# Trackei

Trackei é um sistema completo de rastreamento em tempo real, desenvolvido para simular um fluxo real de operações logísticas.

## Objetivo do Projeto

O projeto demonstra, na prática, como construir um ecossistema capaz de:

- Gerenciar entregadores, clientes e entregas
- Atualizar em tempo real a localização dos entregadores
- Exibir no painel do cliente o deslocamento do entregador no mapa
- Criar endpoints robustos seguindo boas práticas de arquitetura
- Trabalhar com integrações assíncronas e notificações

## Tecnologias Utilizadas

### Backend
- Laravel 11
- PostgreSQL
- WebSockets / Laravel Echo / Laravel WebSockets
- Redis (fila e broadcast)
- Arquitetura MVC organizada com separação clara de responsabilidades
- Jobs e Events para comunicação assíncrona

### Frontend
- React
- Vite
- Leaflet ou Google Maps API para visualização do trajeto
- WebSockets para atualização em tempo real

## Funcionalidades

### Para entregadores
- Autenticação
- Visualização das entregas disponíveis
- Início e finalização de entregas
- Envio periódico da localização atual para o servidor

### Para clientes
- Consulta da sua entrega ativa
- Mapa mostrando a posição do entregador em tempo real
- Atualizações automáticas sem recarregar a página

### Para administradores
- Cadastro de entregadores
- Listagem e gerenciamento de entregas
- Acompanhamento geral do sistema

## Arquitetura

Trackei segue uma arquitetura pensada para simular um ambiente real:

- Backend responsivo usando eventos para broadcast
- Atualizações em tempo real via canais privados
- Filas de processamento usando Redis
- Organização preparada para escalar horizontalmente

## Como Rodar o Projeto

### Backend

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
