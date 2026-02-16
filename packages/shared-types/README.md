# @fullstack/shared-types

Shared TypeScript types, DTOs, and Zod validators for the full-stack monorepo.

## Installation

This package is part of the monorepo workspace. It's automatically linked via `pnpm` workspaces.

```bash
# In backend or frontend package.json
"dependencies": {
  "@fullstack/shared-types": "workspace:*"
}
```

## Usage

### Import Types

```typescript
import { UserDto, LoginDto, ApiResponse } from '@fullstack/shared-types';
```

### Use Zod Schemas for Validation

```typescript
import { LoginDtoSchema, UserDtoSchema } from '@fullstack/shared-types';

// Validate data
const loginData = LoginDtoSchema.parse({ email: '...', password: '...' });

// Safe parse with error handling
const result = UserDtoSchema.safeParse(userData);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Type Guards

```typescript
import { isSuccessResponse } from '@fullstack/shared-types';

const response = await apiClient.get('/users');
if (isSuccessResponse(response)) {
  console.log(response.data);
} else {
  console.error(response.error);
}
```

## Included Types

### DTOs
- `UserDto` - User data transfer object
- `CreateUserDto` - Create user request
- `UpdateUserDto` - Update user request
- `LoginDto` - Login credentials
- `LoginResponseDto` - Login response with tokens
- `RefreshTokenDto` - Refresh token request
- `RefreshTokenResponseDto` - Refresh token response

### API Responses
- `ApiResponse<T>` - Standard API response (success or error)
- `SuccessResponse<T>` - Successful API response
- `ErrorResponse` - Error API response
- `PaginatedResponse<T>` - Paginated data response

### Constants
- `UserRole` - User role enum (USER, ADMIN)

## Development

```bash
# Build the package
pnpm build

# Type check
pnpm typecheck

# Clean build artifacts
pnpm clean
```

## License

MIT
