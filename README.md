# RAMPA Cash Web

> Financial empowerment platform for families

Rampa brings Web3 and decentralized apps to real people, making it so simple that they don't realize they're using them. Built with Next.js.

## 🚀 Quick Start (Docker)

This project is designed to run in Docker. For the complete setup, see the main [rampa-cash-docker README](../../README.md).

### Prerequisites

- Docker and Docker Compose installed
- Access to the `rampa-cash-docker` repository

### First-time Setup

1. **Set up environment variables**:
   ```bash
   # Create .env file in this directory
   # Configure backend API URL and other required variables
   ```

2. **Start services from the root directory**:
   ```bash
   cd ../..  # Go to rampa-cash-docker root
   make up
   ```

3. **Access the application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001

### Environment Configuration

Create a `.env` file in this directory with:
```env
# Backend API Configuration
BACKEND_API_URL=http://localhost:3001
# Add other required environment variables
```

## 📋 Available Commands

### Development (Inside Container)

```bash
# Access Web container
make shell-web  # From rampa-cash-docker root

# Inside container:
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Using Make Commands (From Root Directory)

```bash
make shell-web   # Access Web container shell
make logs-web    # View Web container logs
make restart     # Restart all services
```

## 🏗️ Project Structure

```
rampa-cash-web/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI components
├── domain/             # Feature modules
│   ├── auth/           # Authentication logic
│   ├── dashboard/      # Dashboard features
│   ├── ramp/           # On/off-ramp features
│   ├── transactions/   # Transaction features
│   ├── visa-card/      # VISA card features
│   └── wallet/         # Wallet features
├── lib/                # Utility libraries
│   ├── api-client.ts   # Centralized API client
│   ├── api-utils.ts     # API utilities & error handling
│   └── validators.ts    # Zod validation schemas
├── pages/              # Next.js pages and API routes
├── public/             # Static assets
└── styles/             # Global styles
```

## 🔧 Development

### Hot Reload

The development server supports hot reload. Changes to files are automatically reflected in the browser.

### Code Style

This project uses ESLint with Next.js configuration:
```bash
make shell-web
npm run lint
```

## 🐛 Troubleshooting

### Container Issues

- View Web logs: `make logs-web`
- Access container shell: `make shell-web`
- Check service status: `make status` (from root directory)
- Rebuild containers: `make build` (from root directory)

### Build Issues

- Ensure all environment variables are set in `.env` file
- Check that Docker has enough memory allocated (recommended: 4GB+)
- Verify all dependencies are installed correctly
- Check logs: `make logs-web`

### Common Errors

1. **"Cannot connect to API"**: Verify backend API is running and `BACKEND_API_URL` is correct
2. **"Port already in use"**: Ensure port 3000 is available or change it in `docker-compose.yml`
3. **"Module not found"**: Rebuild containers: `make build` (from root directory)

## 📚 Additional Resources

- Main Docker setup: See [rampa-cash-docker README](../../README.md)
- Next.js Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev/
