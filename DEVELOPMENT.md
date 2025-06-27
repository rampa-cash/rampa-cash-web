# Development Guidelines

## 🏗️ Project Structure

```
rampa-cash-web/
├── components/          # React components
│   ├── ui/             # Reusable UI components (Radix UI based)
│   ├── Navigation.tsx  # Main navigation
│   ├── WaitlistSignup.tsx # Waitlist form
│   └── ErrorBoundary.tsx # Error handling
├── lib/                # Utility libraries
│   ├── utils.ts        # General utilities (cn function)
│   ├── api-utils.ts    # API utilities and middleware
│   ├── types/          # TypeScript type definitions
│   └── waitlist-storage.ts # Data storage
├── pages/              # Next.js pages and API routes
│   ├── api/            # API endpoints
│   ├── admin/          # Admin pages
│   └── index.tsx       # Home page
├── __tests__/          # Test files
├── styles/             # Global styles
└── public/             # Static assets
```

## 📝 Coding Standards

### TypeScript
- **Strict Mode**: Always enabled (`strict: true` in tsconfig.json)
- **Type Annotations**: Use explicit types for function parameters and return values
- **Interfaces**: Define interfaces for component props and API responses
- **Enums**: Use enums for constants and error codes

### React Components
- **Functional Components**: Use functional components with hooks
- **Props Interface**: Always define TypeScript interfaces for component props
- **Default Props**: Use destructuring with default values
- **Error Boundaries**: Wrap components that might fail

### API Development
- **Validation**: Use Zod schemas for request/response validation
- **Error Handling**: Use standardized error responses with error codes
- **Rate Limiting**: Implement rate limiting for all public endpoints
- **CORS**: Handle CORS properly for cross-origin requests

### Styling
- **Tailwind CSS**: Use utility classes for styling
- **Component Variants**: Use Class Variance Authority (CVA) for component variants
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Follow WCAG guidelines

## 🧪 Testing

### Test Structure
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test API endpoints and component interactions
- **E2E Tests**: Test complete user workflows (future)

### Testing Guidelines
- **React Testing Library**: Use for component testing
- **Jest**: Use for unit testing and mocking
- **Test Coverage**: Aim for >80% coverage
- **Test Naming**: Use descriptive test names

### Example Test
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

## 🔧 Development Workflow

### Pre-commit Hooks
The project uses Husky for pre-commit hooks that run:
1. TypeScript type checking
2. ESLint linting
3. Unit tests

### Code Quality Tools
- **ESLint**: Code linting with strict TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Run linters on staged files

### Commands
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🚀 API Development

### Request Validation
Use Zod schemas for all API endpoints:

```typescript
const RequestSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive()
})
```

### Error Handling
Use standardized error responses:

```typescript
{
  success: false,
  error: "Error message",
  code: "ERROR_CODE",
  details: { /* additional info */ }
}
```

### Rate Limiting
Implement rate limiting for all public endpoints:

```typescript
const rateLimitCheck = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests'
})
```

## 🔐 Security Guidelines

### Environment Variables
- Never commit sensitive data to version control
- Use `.env.local` for local development
- Use environment variables in production

### API Security
- Validate all inputs
- Sanitize user data
- Implement proper authentication
- Use HTTPS in production

### Solana Integration
- Never store private keys in code
- Use secure key management
- Validate addresses and amounts
- Implement proper error handling

## 📦 Component Development

### UI Components
Use the component library in `components/ui/`:

```typescript
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'

// Use with variants
<Button variant="outline" size="sm">Click me</Button>
<Loading variant="spinner" size="md" text="Loading..." />
```

### Custom Components
Follow this structure for custom components:

```typescript
interface ComponentProps {
  title: string
  description?: string
  onAction?: () => void
}

const Component: React.FC<ComponentProps> = ({
  title,
  description,
  onAction
}) => {
  // Component logic
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

export default Component
```

## 🎨 Styling Guidelines

### Tailwind CSS
- Use utility classes for styling
- Create custom components for repeated patterns
- Use responsive prefixes (sm:, md:, lg:)

### Component Variants
Use Class Variance Authority for component variants:

```typescript
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        outline: "outline-classes"
      },
      size: {
        sm: "small-classes",
        md: "medium-classes"
      }
    }
  }
)
```

## 📚 Documentation

### Code Comments
- Comment complex logic
- Document API endpoints
- Explain business rules
- Use JSDoc for functions

### README Updates
- Keep README.md updated
- Document new features
- Update installation instructions
- Include troubleshooting guides

## 🚨 Error Handling

### Frontend Errors
- Use Error Boundaries for React errors
- Provide user-friendly error messages
- Log errors for debugging
- Implement retry mechanisms

### API Errors
- Use standardized error responses
- Include error codes for client handling
- Log errors with context
- Implement proper HTTP status codes

## 🔄 State Management

### Local State
- Use React hooks for local state
- Keep state as close to usage as possible
- Use useReducer for complex state

### Global State
- Consider context for shared state
- Use libraries like Zustand for complex state (future)
- Avoid prop drilling

## 📱 Performance

### Optimization
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Use code splitting

### Monitoring
- Monitor bundle size
- Track performance metrics
- Use React DevTools
- Implement error tracking

## 🤝 Contributing

### Pull Requests
1. Create feature branch
2. Write tests for new features
3. Update documentation
4. Ensure all checks pass
5. Request code review

### Code Review
- Review for security issues
- Check for performance problems
- Ensure proper error handling
- Verify accessibility compliance

---

**Remember**: This is a financial application. Security, reliability, and user experience are paramount. 