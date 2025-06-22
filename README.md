# RAMPA Cash Web

> Fast, secure money transfers powered by Web3 technology

[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](*)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=fff)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)

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

## 🛠️ Tech Stack

### Frontend
- **Next.js** `^14.0.0` - React framework with server-side rendering
- **React** `^18.2.0` - Modern React with hooks and concurrent features
- **React DOM** `^18.2.0` - React rendering for web
- **TypeScript** `^5.0.0` - Type-safe JavaScript development
- **Tailwind CSS** `^3.0.0` - Utility-first CSS framework
- **Framer Motion** `^11.0.0` - Smooth animations and transitions
- **Radix UI** `^1.2.0` - Accessible component primitives
- **Class Variance Authority** `^0.7.1` - Component variant management
- **CLSX** `^2.1.1` - Conditional className utility
- **Tailwind Merge** `^3.2.0` - Tailwind CSS class merging utility

### Backend & APIs
- **Next.js API Routes** `^14.0.0` - Serverless API endpoints
- **Solana Web3.js** `^1.98.2` - Solana blockchain integration
- **SPL Token** `^0.1.8` - Solana token program integration
- **Twilio** `^5.6.1` - WhatsApp Business API integration
- **BS58** `^6.0.0` - Base58 encoding/decoding for Solana

### Development Tools
- **ESLint** `^8.0.0` - Code linting and quality assurance
- **ESLint Config Next** `^14.0.0` - Next.js ESLint configuration
- **PostCSS** `^8.4.0` - CSS processing
- **Autoprefixer** `^10.4.16` - CSS vendor prefixing
- **Node Types** `^20.0.0` - TypeScript definitions for Node.js
- **React Types** `^18.2.0` - TypeScript definitions for React
- **React DOM Types** `^18.2.0` - TypeScript definitions for React DOM
- **Twilio Types** `^3.19.2` - TypeScript definitions for Twilio
- **BS58 Types** `^4.0.4` - TypeScript definitions for BS58

### Runtime Requirements
- **Node.js** `18+` - JavaScript runtime
- **npm/yarn** - Package manager

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Solana CLI (optional, for development)

### Setup Instructions

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

### Vercel (Recommended)
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