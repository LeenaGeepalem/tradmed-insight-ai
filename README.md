# TRADMED-ICD11 Integration Platform (Ayurveda-Bridge AI)

An AI-powered interoperability framework that bridges Traditional Medicine (TRADMED) taxonomy with ICD-11 (International Classification of Diseases, 11th Revision) using FHIR standards and AI-assisted ontology mapping.

## 🌟 Features

### 🧠 AI-Powered Semantic Mapping
- Advanced NLP models for semantic alignment between TRADMED and ICD-11 entities
- Context-aware reasoning for accurate concept mapping
- Confidence scoring and alternative suggestions
- Support for multiple traditional medicine systems (Ayurveda, Siddha, Unani, Yoga)

### 🏥 FHIR Integration
- HL7-FHIR compliant data exchange
- Standardized resource mapping
- Compatible with modern healthcare infrastructure
- Seamless EHR and HIS integration

### 📊 Analytics & Visualization
- Interactive mapping performance dashboard
- System-wise distribution analytics
- Confidence score tracking
- Historical mapping trends
- User-specific insights

### 🛡️ Advanced Features
- Bidirectional translation (TRADMED ↔ ICD-11)
- Complete audit trail with reasoning chains
- Confidence scoring system
- Alternative mapping suggestions
- Professional UI with modern design patterns

## 🚀 Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom themes
- **Components**: Shadcn/UI component library
- **State Management**: React Query
- **Charts**: Chart.js with React wrapper
- **Icons**: Lucide React

### Backend & Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: RESTful with FHIR compliance
- **AI Integration**: Advanced NLP Models
- **Hosting**: Vercel/Netlify
- **Version Control**: Git (GitHub)

## 🏗️ Project Structure
```
tradmed-insight-ai/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components
│   │   └── ...           # Feature-specific components
│   ├── pages/            # Application routes/pages
│   ├── integrations/     # External service integrations
│   │   └── supabase/     # Supabase client & services
│   ├── services/         # Business logic services
│   ├── types/           # TypeScript type definitions
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
└── supabase/           # Supabase configurations
    ├── functions/      # Edge functions
    └── migrations/     # Database migrations
```

## 🛠️ Core Components

### 1. Mapping Engine (`src/services/mapping-engine.ts`)
- AI-powered semantic analysis for accurate term matching
- Context-aware concept alignment
- Confidence scoring with detailed reasoning
- Historical mapping pattern learning
- Alternative suggestions generation

### 2. Data Persistence (`src/integrations/supabase/data-service.ts`)
- FHIR-compliant data storage
- Efficient querying and caching
- Real-time synchronization
- Audit trail management

### 3. Analytics Dashboard (`src/pages/Analytics.tsx`, `Dashboard.tsx`)
- Real-time mapping statistics visualization
- System distribution charts
- Confidence tracking over time
- User performance metrics
- Interactive data exploration

### 4. Authentication System (`src/integrations/supabase/auth.tsx`)
- Secure user authentication
- Role-based access control
- Session management
- Profile management

## 🎯 Implemented Features

### Mapping Interface
- Real-time TRADMED to ICD-11 mapping
- Confidence score display
- Alternative suggestions
- FHIR bundle generation
- Mapping history

### Dashboard
- Quick statistics overview
- Recent mapping history
- System distribution
- Performance metrics
- Interactive charts

### Analytics
- Mapping success rates
- System-wise breakdown
- Temporal trends
- User performance tracking
- Export capabilities

### Knowledge Base
- TRADMED concept browsing
- ICD-11 code exploration
- Mapping reference database
- Search and filter capabilities

## 🔒 Security Features

- Secure authentication flow
- Data encryption at rest
- HTTPS enforcement
- Session management
- Role-based permissions

## 📋 Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/LeenaGeepalem/tradmed-insight-ai.git
cd tradmed-insight-ai
```

2. Install dependencies:
```bash
bun install   # or npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Required environment variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
bun dev   # or npm run dev
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Traditional Medicine practitioners for their invaluable insights
- World Health Organization (WHO) for ICD-11 classification
- Healthcare informatics community
- Open-source contributors and maintainers

---

Built with ❤️ for bridging ancient wisdom with modern healthcare
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c71da586-7203-46ad-b3aa-c6a55407afdd) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
