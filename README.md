# RAMPA Cash Web

> Fast, secure money transfers powered by Web3 technology

[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](*)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=fff)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](#)

RAMPA is a modern money transfer platform that brings Web3 technology to real people, making cross-border payments so simple that users don't realize they're using blockchain services. Built with Next.js, Solana blockchain, and WhatsApp integration.

## 🚀 Features

### Core Functionality
- **WhatsApp Money Transfers**: Send money directly through WhatsApp
- **Solana Blockchain Integration**: Fast, secure transactions on Solana network
- **Waitlist System**: Early access signup with email collection
- **Real-time Exchange Rates**: Live market rates without hidden fees
- **Multi-Party Computation (MPC) Wallets**: Enhanced security for user funds

### User Experience
- **Intuitive Interface**: Clean, modern UI built with Tailwind CSS
- **Mobile-First Design**: Responsive design for all devices
- **Contact Management**: Predefined contacts and custom recipient addition
- **Instant Transfers**: Money arrives in seconds, not days

### Technical Features
- **TypeScript**: Full type safety across the application
- **API Routes**: RESTful API endpoints for all functionality
- **Environment Configuration**: Secure environment variable management
- **Error Handling**: Comprehensive error handling and user feedback
- **Docker Support**: Containerized deployment with optimized builds

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Solana CLI (optional, for development)
- Docker & Docker Compose (for containerized deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rampa-cash-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # Solana Configuration
   SOLANA_PRIVATE_KEY=your_solana_private_key_here
   
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
   
   # Optional: Database/Storage
   DATABASE_URL=your_database_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Setup

#### Prerequisites
- Docker installed on your system
- Docker Compose installed on your system

#### Production Deployment with Docker

**Using Docker Compose (Recommended):**

1. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

**Using Docker directly:**

1. **Build the image:**
   ```bash
   docker build -t rampa-cash-web .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 --env-file .env rampa-cash-web
   ```

#### Development Mode with Docker

For development with hot reloading:

```bash
docker-compose --profile dev up --build
```

This will run the development server on port 3001 with hot reloading enabled.

#### Docker Features

- **Production**: Multi-stage build with optimized Next.js standalone output
- **Development**: Single-stage build with volume mounting for hot reloading
- **Health Checks**: Built-in monitoring for API endpoints
- **Security**: Non-root user execution
- **Optimization**: Alpine Linux base image for minimal size

#### Ports

- **Production**: `http://localhost:3000`
- **Development**: `http://localhost:3001`

## 🏗️ Project Structure

```
rampa-cash-web/
├── components/          # React components
│   ├── Navigation.tsx   # Main navigation component
│   ├── WaitlistSignup.tsx # Waitlist signup form
│   └── ui/             # Reusable UI components
├── data/               # Static data files
│   └── waitlist.json   # Waitlist data storage
├── lib/                # Utility libraries
│   ├── utils.ts        # General utilities
│   └── waitlist-storage.ts # Waitlist management
├── pages/              # Next.js pages and API routes
│   ├── api/            # API endpoints
│   │   ├── waitlist.ts # Waitlist management API
│   │   ├── solana-transfer.ts # Solana transfer API
│   │   ├── whatsapp-webhook.ts # WhatsApp webhook
│   │   └── ...         # Other API routes
│   ├── admin/          # Admin pages
│   └── index.tsx       # Home page
├── public/             # Static assets
├── styles/             # Global styles
├── Dockerfile          # Production Docker configuration
├── Dockerfile.dev      # Development Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── .dockerignore       # Docker build exclusions
└── package.json        # Dependencies and scripts
```

## 🔌 API Endpoints

### Waitlist Management
- **POST** `/api/waitlist` - Add email to waitlist
- **GET** `/api/waitlist` - Get waitlist count (admin)

### Solana Transfers
- **POST** `/api/solana-transfer` - Process Solana blockchain transfers
  - Body: `{ recipientAddress, amount }`
  - Returns: `{ success, signature }`

### WhatsApp Integration
- **POST** `/api/whatsapp-webhook` - Handle WhatsApp messages
- **POST** `/api/whatsapp-transfer` - Initiate WhatsApp transfers
- **POST** `/api/send-whatsapp` - Send WhatsApp messages

## 🚀 Deployment

### Docker Deployment (Recommended)
Follow the Docker setup instructions above for containerized deployment.

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Environment Variables for Production
Ensure all required environment variables are set in your production environment:
- `SOLANA_PRIVATE_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
This project uses ESLint with Next.js configuration. Run `npm run lint` to check for code style issues.

### Testing
Currently, the project doesn't include automated tests. Consider adding:
- Unit tests with Jest
- Integration tests for API endpoints
- E2E tests with Playwright or Cypress

## 🔐 Security Considerations

### Production Security
- **Never commit private keys** to version control
- Use environment variables for sensitive data
- Implement proper authentication for admin routes
- Add rate limiting to API endpoints
- Use HTTPS in production

### Solana Security
- Store private keys in secure vaults (not in code)
- Implement proper key management
- Use hardware wallets for large amounts
- Regular security audits

### Docker Security
- Never commit `.env` files to version control
- Use Docker secrets for sensitive environment variables in production
- The production container runs as a non-root user (nextjs:nodejs)
- Regular base image updates

## 📱 WhatsApp Integration

### Setup Requirements
1. Twilio account with WhatsApp Business API
2. Verified WhatsApp Business number
3. Webhook URL configuration

### Message Flow
1. User visits `/whatsapp-transfer`
2. System initiates transfer via WhatsApp
3. User selects recipient from contacts
4. Confirmation and processing
5. Transfer completion notification

## 🐛 Troubleshooting

### Build Issues
- Ensure all environment variables are set in `.env` file
- Check that Docker has enough memory allocated (recommended: 4GB+)
- Verify all dependencies are installed correctly

### Runtime Issues
- Check container logs: `docker-compose logs`
- Verify environment variables are loaded: `docker-compose exec rampa-cash-web env`
- Check application logs for specific error messages

### Performance
- The production image uses Next.js standalone output for optimal performance
- Alpine Linux base image keeps the container size minimal
- Health checks ensure application availability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Additional payment methods
- [ ] Enhanced security features
- [ ] Regulatory compliance tools

---

**RAMPA** - Making Web3 invisible, making money transfers instant. 🚀 