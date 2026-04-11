# AGENTS.md - Development Guidelines for Trackei

Laravel 12 + Inertia.js + React 19 + TypeScript + Tailwind CSS v4 + Shadcn/ui. Multi-role auth (users, businesses, clients, drivers) with real-time package tracking.

## Commands

### Development

```bash
composer run dev       # Full dev: server, queue, logs, Vite
npm run dev            # Frontend only
php artisan serve      # Laravel server
php artisan queue:listen --tries=1  # Queue worker
```

### Build

```bash
npm run build          # Production build
npm run build:ssr      # SSR build
composer run setup     # Full setup (install, migrate, build)
```

### Testing

```bash
./vendor/bin/pest                           # All tests
./vendor/bin/pest tests/Feature/AuthTest    # Single file
./vendor/bin/pest --filter "test name"      # Single test by name
./vendor/bin/pest --coverage                # With coverage
composer run test                           # Via composer (config:clear + test)
```

### Quality Checks

```bash
./vendor/bin/pint        # PHP formatting
./vendor/bin/phpstan     # PHP static analysis
npm run lint             # ESLint (auto-fix)
npm run types            # TypeScript check
npm run format:check     # Prettier check
npm run format           # Prettier fix
```

## Code Style

### General

- 4 spaces indentation, 80 char max line width
- Single quotes (JS/TS), double quotes (PHP)
- UTF-8, LF line endings, trailing newline
- No emojis in code

### PHP/Laravel

- PSR-12 standard (enforced by Pint)
- Type hints on all parameters and returns
- PHPDoc for public methods and complex logic
- Dependency injection in controllers
- Form Requests for validation
- Single quotes for array keys: `['key' => 'value']`

```php
public function update(ProfileUpdateRequest $request): RedirectResponse
{
    $request->user()->fill($request->validated());
    $request->user()->save();
    return to_route('profile.edit');
}
```

### TypeScript/React

- Strict mode, `unknown` over `any`
- Functional components with hooks
- Named exports, PascalCase components
- Type all props with interfaces
- Use `@/` path aliases (`@/components`, `@/lib`, `@/ui`, `@/hooks`)

```tsx
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface FormProps {
    onSubmit: (data: FormData) => void;
}

export function UserForm({ onSubmit }: FormProps) {
    const [value, setValue] = useState('');
    return <Button onClick={() => onSubmit({ value })}>Submit</Button>;
}
```

### Naming

- **Files**: PascalCase (components), camelCase (utils)
- **Classes**: PascalCase
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

### Styling

- Tailwind CSS with design tokens
- Shadcn/ui components (Radix primitives)
- CSS variables for theming
- Mobile-first responsive
- Use `cn()` for conditional classes

### State Management

- Redux Toolkit for global state
- `useState` for component-local state
- Redux Persist for persistence

## File Structure

```
app/
├── Http/Controllers/    # Request handlers
├── Http/Requests/       # Form validation
├── Models/              # Eloquent models
├── Services/            # Business logic
resources/js/
├── components/          # Reusable UI
├── hooks/               # Custom hooks
├── lib/                 # Utilities
├── pages/               # Page components
└── types/               # TypeScript types
```

## Error Handling

- Validate early with Form Requests
- Try-catch for expected errors
- Throw specific exception types
- Return proper HTTP status codes

## Security

- CSRF protection (built-in)
- Validate all input via Form Requests
- Store secrets in `.env` only
- Sanctum for API auth
- Principle of least privilege

## Pre-commit Checklist

- [ ] `./vendor/bin/pint` passes
- [ ] `./vendor/bin/phpstan` passes
- [ ] `./vendor/bin/pest` passes
- [ ] `npm run lint` passes
- [ ] `npm run types` passes
- [ ] Migrations included for schema changes

_Last updated: January 2026_
