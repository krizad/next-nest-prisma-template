# Skill Development Guide

## Overview

A Skill is a specialized, reusable module that extends agent capabilities. Skills encapsulate domain-specific knowledge, tools, and workflows that agents can utilize to accomplish complex tasks. This guide provides comprehensive instructions for creating, publishing, and maintaining skills.

## What is a Skill?

A Skill is:
- **Focused** - Solves a specific domain problem
- **Reusable** - Can be integrated into multiple agents
- **Well-documented** - Clear purpose and usage
- **Tested** - Thoroughly validated
- **Maintainable** - Clean code and clear structure

## Skill Structure

```
skill-name/
├── SKILL.md                    # Skill metadata and documentation
├── src/
│  ├── index.ts                # Main export
│  ├── types.ts                # TypeScript interfaces
│  ├── service.ts              # Core implementation
│  ├── tools/
│  │  ├── index.ts
│  │  ├── tool-1.ts
│  │  └── tool-2.ts
│  ├── utils/
│  │  ├── index.ts
│  │  ├── validators.ts
│  │  └── formatters.ts
│  └── tests/
│     ├── service.test.ts
│     ├── tools.test.ts
│     └── integration.test.ts
├── examples/
│  └── usage-example.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Creating a Skill

### Step 1: Define Skill Metadata

Create `SKILL.md`:

```markdown
# Skill Name

## Metadata
- **Version**: 1.0.0
- **Author**: Your Name
- **Status**: Active
- **Last Updated**: 2026-02-14

## Description
Clear, concise description of what this skill does.

## Use Cases
- Use case 1
- Use case 2
- Use case 3

## Dependencies
- dependency-1: ^1.0.0
- dependency-2: ^2.0.0
```

### Step 2: Define Types

```typescript
// src/types.ts
export interface SkillConfig {
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface ToolInput {
  [key: string]: unknown;
}

export interface ToolOutput {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface SkillResult {
  toolName: string;
  input: ToolInput;
  output: ToolOutput;
  executionTime: number;
}
```

### Step 3: Create Service

```typescript
// src/service.ts
import { SkillConfig, ToolInput, ToolOutput, SkillResult } from './types';

export class SkillService {
  private config: SkillConfig;
  private tools: Map<string, Function>;

  constructor(config: SkillConfig = {}) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      ...config
    };
    this.tools = new Map();
  }

  registerTool(name: string, handler: Function): void {
    this.tools.set(name, handler);
  }

  async executeTool(
    toolName: string,
    input: ToolInput
  ): Promise<SkillResult> {
    const startTime = Date.now();
    
    try {
      const tool = this.tools.get(toolName);
      if (!tool) {
        throw new Error(`Tool not found: ${toolName}`);
      }

      const data = await tool(input);
      
      return {
        toolName,
        input,
        output: { success: true, data },
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        toolName,
        input,
        output: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        executionTime: Date.now() - startTime
      };
    }
  }

  getAvailableTools(): string[] {
    return Array.from(this.tools.keys());
  }
}
```

### Step 4: Implement Tools

```typescript
// src/tools/tool-1.ts
import { ToolInput, ToolOutput } from '../types';

export async function tool1(input: ToolInput): Promise<unknown> {
  // Validate input
  if (!input.requiredParam) {
    throw new Error('Missing required parameter: requiredParam');
  }

  // Execute tool logic
  const result = await performAction(input);

  return result;
}

async function performAction(input: ToolInput): Promise<unknown> {
  // Implementation
  return { success: true };
}
```

### Step 5: Create Utility Functions

```typescript
// src/utils/validators.ts
export function validateInput(input: unknown, schema: unknown): boolean {
  // Validation logic
  return true;
}

export function sanitizeInput(input: ToolInput): ToolInput {
  // Sanitization logic
  return input;
}

// src/utils/formatters.ts
export function formatOutput(data: unknown): string {
  // Formatting logic
  return JSON.stringify(data);
}
```

### Step 6: Write Tests

```typescript
// src/tests/service.test.ts
import { SkillService } from '../service';

describe('SkillService', () => {
  let service: SkillService;

  beforeEach(() => {
    service = new SkillService();
  });

  it('should register and execute tools', async () => {
    service.registerTool('testTool', async (input) => {
      return { result: input.value * 2 };
    });

    const result = await service.executeTool('testTool', { value: 5 });
    expect(result.output.data).toEqual({ result: 10 });
  });

  it('should handle missing tools', async () => {
    const result = await service.executeTool('nonExistent', {});
    expect(result.output.success).toBe(false);
  });
});
```

### Step 7: Export Public API

```typescript
// src/index.ts
export { SkillService } from './service';
export * from './types';
export * from './tools';
export * from './utils';
```

### Step 8: Create Usage Example

```typescript
// examples/usage-example.ts
import { SkillService } from '../src';

async function main() {
  const skill = new SkillService({
    apiKey: process.env.API_KEY,
    timeout: 30000
  });

  // Register tools
  skill.registerTool('fetchData', async (input) => {
    // Tool implementation
    return { data: 'example' };
  });

  // Execute tool
  const result = await skill.executeTool('fetchData', { id: '123' });
  console.log(result);
}

main().catch(console.error);
```

## Skill Categories

### 1. Data Processing Skills
- Data validation
- Formatting
- Transformation
- Aggregation

### 2. Integration Skills
- API integration
- Database operations
- External service connectivity
- Authentication

### 3. Analysis Skills
- Data analysis
- Metrics calculation
- Reporting
- Visualization

### 4. Business Logic Skills
- Workflow orchestration
- Decision making
- Rule execution
- Process automation

### 5. Utility Skills
- Logging
- Caching
- Error handling
- Performance monitoring

## Best Practices

### Code Quality
```typescript
// ✅ Good: Clear, focused, well-documented
export async function processData(input: ToolInput): Promise<ProcessedData> {
  // Validate input
  validateInput(input, schema);
  
  // Process data
  const result = transform(input);
  
  // Return structured result
  return result;
}

// ❌ Bad: Unclear, multi-purpose, poorly documented
export async function doStuff(x: any): Promise<any> {
  return process(x);
}
```

### Error Handling
```typescript
export async function robustTool(input: ToolInput): Promise<unknown> {
  try {
    validateInput(input);
    const result = await execute(input);
    return result;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new Error(`Invalid input: ${error.message}`);
    }
    throw new Error(`Execution failed: ${error instanceof Error ? error.message : 'unknown'}`);
  }
}
```

### Documentation
```typescript
/**
 * Fetches user data from the database
 * 
 * @param input - Tool input
 * @param input.userId - The user ID to fetch
 * @param input.includeProfile - Whether to include profile data
 * @returns User data object
 * @throws {Error} If user not found
 * 
 * @example
 * const user = await fetchUser({ userId: '123', includeProfile: true });
 */
export async function fetchUser(input: ToolInput): Promise<UserData> {
  // Implementation
}
```

### Testing Strategy
```typescript
describe('Skill Integration', () => {
  // Unit tests for individual tools
  describe('Individual Tools', () => {
    it('should handle valid input', () => {});
    it('should reject invalid input', () => {});
  });

  // Integration tests for tool combinations
  describe('Tool Combinations', () => {
    it('should chain multiple tools', () => {});
  });

  // Performance tests
  describe('Performance', () => {
    it('should execute within timeout', () => {});
  });

  // Error handling tests
  describe('Error Handling', () => {
    it('should handle network errors', () => {});
    it('should retry on failure', () => {});
  });
});
```

## Publishing a Skill

1. **Create Metadata** - Define `SKILL.md` with clear documentation
2. **Add to Registry** - Update the skills registry
3. **Version** - Follow semantic versioning
4. **Document** - Create comprehensive README
5. **Test** - Achieve >80% test coverage
6. **Review** - Have code reviewed by team
7. **Release** - Publish new version

## Skill Registry

```typescript
// skills-registry.ts
export const skillsRegistry = {
  'data-processing': {
    path: './skills/data-processing',
    version: '1.0.0',
    description: 'Data validation and transformation'
  },
  'user-management': {
    path: './skills/user-management',
    version: '2.1.0',
    description: 'User operations and management'
  },
  'reporting': {
    path: './skills/reporting',
    version: '1.5.2',
    description: 'Report generation and analytics'
  }
};
```

## Versioning Strategy

Follow Semantic Versioning (MAJOR.MINOR.PATCH):
- **MAJOR** - Breaking changes
- **MINOR** - New features, backward compatible
- **PATCH** - Bug fixes

```json
{
  "version": "1.2.3",
  "changelog": {
    "1.2.3": "Fixed data validation issue",
    "1.2.2": "Improved error messages",
    "1.2.0": "Added new export tool",
    "1.1.0": "Added caching support",
    "1.0.0": "Initial release"
  }
}
```

## Common Patterns

### Skill with Configuration
```typescript
interface Config {
  apiEndpoint: string;
  timeout: number;
  retryAttempts: number;
}

export class ConfigurableSkill {
  constructor(private config: Config) {}

  getConfig(): Config {
    return this.config;
  }

  updateConfig(partial: Partial<Config>): void {
    this.config = { ...this.config, ...partial };
  }
}
```

### Skill with State
```typescript
export class StatefulSkill {
  private state: Map<string, unknown> = new Map();

  setState(key: string, value: unknown): void {
    this.state.set(key, value);
  }

  getState(key: string): unknown {
    return this.state.get(key);
  }

  clearState(): void {
    this.state.clear();
  }
}
```

### Skill with Caching
```typescript
import NodeCache from 'node-cache';

export class CachedSkill {
  private cache = new NodeCache({ stdTTL: 600 });

  async execute(key: string, fn: () => Promise<unknown>): Promise<unknown> {
    const cached = this.cache.get(key);
    if (cached) return cached;

    const result = await fn();
    this.cache.set(key, result);
    return result;
  }
}
```

## Resources

- [Agent Guide](./AGENT.md) - Building AI agents
- [API Integration Guide](./API_INTEGRATION.md) - Integration patterns
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Development practices

## Support

For questions or issues, refer to the documentation or contact the development team.
