# AGENTS.md - Development Guidelines for Trackei

This document provides comprehensive guidelines for agentic coding assistants working on the Trackei codebase. It covers build commands, testing, code style, and development conventions.

## Table of Contents

1. [Build and Development Commands](#build-and-development-commands)
2. [Testing](#testing)
3. [Code Style Guidelines](#code-style-guidelines)
4. [PHP/Laravel Conventions](#phplaravel-conventions)
5. [Frontend (React/TypeScript) Conventions](#frontend-reacttypescript-conventions)
6. [File Structure and Organization](#file-structure-and-organization)
7. [Quality Assurance](#quality-assurance)

## Build and Development Commands

### Full Development Environment

```bash
composer run dev  # Runs Laravel server, queue worker, logs, and Vite dev server concurrently
```

### Individual Services

```bash
# Laravel server
php artisan serve

# Queue worker
php artisan queue:listen --tries=1

# Logs
php artisan pail --timeout=0

# Frontend dev server
npm run dev
```

### Build Commands

```bash
# Production build
npm run build

# SSR build
npm run build:ssr
```

### Initial Setup

```bash
composer run setup  # Installs dependencies, generates keys, migrates DB, builds assets
```

## Testing

### PHP Testing with Pest

```bash
# Run all tests
./vendor/bin/pest

# Run specific test file
./vendor/bin/pest tests/Feature/DashboardTest.php

# Run single test by name
./vendor/bin/pest --filter "profile page is displayed"

# Run tests with coverage
./vendor/bin/pest --coverage
```

### Frontend Testing

_No frontend testing framework currently configured. Use manual testing and TypeScript type checking._

### CI/CD Testing

Tests run automatically on pushes/PRs to `develop` and `main` branches via GitHub Actions.

## Code Style Guidelines

### General

- Use 4 spaces for indentation (configured in `.editorconfig`)
- UTF-8 encoding, LF line endings
- Trim trailing whitespace, add final newlines
- Use single quotes for strings (JavaScript) / double quotes for strings (PHP)
- Maximum line length: 80 characters (Prettier)

### Import Organization

- Group imports by type: external libraries, internal modules, types
- Use absolute imports with `@/` alias for TypeScript
- Organize imports with `prettier-plugin-organize-imports`

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Functions/Variables**: camelCase
- **Classes**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with descriptive names

### Error Handling

- Use try-catch blocks for expected errors
- Throw specific exception types, not generic Error
- Validate input data early with Laravel Form Requests
- Use Laravel's validation with `validate()` method

## PHP/Laravel Conventions

### Code Style

- Follow PSR-12 standards (enforced by Laravel Pint)
- Use type hints for all method parameters and return values
- Add PHPDoc blocks for public methods and complex logic
- Use dependency injection in controllers

### Controller Structure

```php
<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }
}
```

### Form Requests

- Create dedicated Form Request classes for validation
- Place in `app/Http/Requests/` with appropriate namespace
- Use `authorize()` method for authorization logic

### Testing with Pest

```php
<?php

use App\Models\User;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
});
```

## Frontend (React/TypeScript) Conventions

### Component Structure

- Use functional components with hooks
- Type all props and state with TypeScript interfaces
- Use named exports for components
- Follow component composition patterns

### TypeScript Configuration

- Strict mode enabled
- Use `unknown` over `any`
- Define interfaces for complex object types
- Use union types for variant props

### State Management

- Use Redux Toolkit for global state
- Prefer local state with `useState` for component-specific state
- Use React Query for server state (when implemented)

### Styling

- Use Tailwind CSS with design tokens
- Leverage Shadcn/ui component library
- Use CSS variables for theming
- Follow mobile-first responsive design

### Example Component

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface UserFormProps {
    onSubmit: (data: UserData) => void;
    initialData?: Partial<UserData>;
}

interface UserData {
    name: string;
    email: string;
}

export function UserForm({ onSubmit, initialData }: UserFormProps) {
    const [formData, setFormData] = useState<UserData>({
        name: initialData?.name ?? '',
        email: initialData?.email ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                value={formData.name}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Name"
            />
            <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Email"
            />
            <Button type="submit">Save</Button>
        </form>
    );
}
```

## File Structure and Organization

### Backend (Laravel)

```
app/
├── Http/
│   ├── Controllers/     # Request handlers
│   ├── Requests/        # Form validation classes
│   └── Middleware/      # HTTP middleware
├── Models/              # Eloquent models
├── Services/            # Business logic services
└── Events/              # Event classes

tests/
├── Feature/             # Integration tests
├── Unit/                # Unit tests
└── Pest.php            # Test configuration
```

### Frontend (React/TypeScript)

```
resources/
├── js/
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and helpers
│   ├── pages/           # Page components
│   └── types/           # TypeScript type definitions
└── css/
    └── app.css          # Global styles and Tailwind
```

### Configuration Files

- `.editorconfig` - Editor-independent formatting
- `eslint.config.js` - JavaScript/TypeScript linting
- `.prettierrc` - Code formatting
- `tsconfig.json` - TypeScript compiler options
- `phpstan.neon` - PHP static analysis
- `components.json` - Shadcn/ui configuration

## Quality Assurance

### Pre-commit Quality Checks

Run these commands before committing:

```bash
# PHP quality checks
./vendor/bin/pint          # Code formatting
./vendor/bin/phpstan       # Static analysis
./vendor/bin/pest          # Run tests

# Frontend quality checks
npm run lint               # ESLint
npm run types              # TypeScript checking
npm run format:check       # Prettier check
```

### CI/CD Quality Gates

- **GitHub Actions**: Runs on pushes to `develop`/`main` and PRs
- **PHPStan**: Static analysis at level 5
- **Pest**: Full test suite
- **ESLint + Prettier**: Frontend code quality
- **TypeScript**: Type checking

### Code Review Checklist

- [ ] Tests pass locally
- [ ] Code style checks pass (`pint`, `eslint`, `prettier`)
- [ ] TypeScript types are correct
- [ ] No PHPStan errors
- [ ] Database migrations included if schema changes
- [ ] Documentation updated for API changes
- [ ] Security considerations reviewed

### Security Best Practices

- Use Laravel's built-in CSRF protection
- Validate all user input through Form Requests
- Use parameterized queries (Eloquent ORM handles this)
- Store sensitive data in `.env` files
- Use Laravel Sanctum for API authentication
- Follow principle of least privilege for database queries

---

_This document should be updated when development practices or tooling change. Last updated: January 2026_</content>
<parameter name="filePath">/home/mateus/trackei/AGENTS.md
