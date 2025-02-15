# Tree Adoption Platform - Project Reference

## Project Overview
A web application for environmental conservation that connects people with trees they can adopt and track.

## Team Members
- Samarth Shinde (Leader)
- Rohit Gajbhiye
- Mrunali Patil
- Sakshi Pawar

## Tech Stack
- Frontend: React + Tailwind CSS
- Backend: Firebase
- Image Storage: Cloudinary
- Authentication: Firebase Auth
- Database: Firebase Realtime Database/Firestore

## Core Features

### 1. User Features
- User registration and authentication
- Browse tree catalog
- View detailed tree information
- Adopt trees
- Track adopted trees' progress
- Receive notifications on tree milestones
- User dashboard

### 2. Admin Features
- Secure admin panel
- Manage tree catalog
- Add new trees
- Update tree status and progress
- Monitor adoption statistics
- Manage user data

### 3. Tree Catalog Features
- Tree listings with images
- Detailed tree information
  - Species information
  - Location data
  - Growth progress
  - Adoption status
- Search and filter capabilities

### 4. Technical Requirements
- Responsive design
- Real-time updates
- Image optimization
- Push notifications
- Secure data management
- Interactive UI/UX

## Optional Enhancements
- Interactive maps (Google Maps API)
- Donation system (Stripe/PayPal)
- Social sharing features
- Community forum
- Environmental impact metrics

## Target Beneficiaries
1. Environmental Conservation Organizations
2. Local Communities
3. Individual Adopters
4. Policy Makers & Researchers

## Expected Outcomes
- Increased environmental engagement
- Real-time reforestation tracking
- Community building
- Scalable conservation model
- Positive environmental impact

## Database Structure (Firebase)

### Collections/Nodes
1. Users
   - Personal information
   - Adopted trees
   - Notification preferences

2. Trees
   - Species details
   - Location
   - Growth status
   - Adoption status
   - Images

3. Adoptions
   - User reference
   - Tree reference
   - Adoption date
   - Updates

4. Admin
   - Admin users
   - Permissions
   - Activity logs

## UI/UX Requirements
- Modern, clean design
- Intuitive navigation
- Mobile-responsive
- Easy adoption process
- Clear progress tracking
- Engaging visual feedback

## Security Considerations
- Secure authentication
- Data privacy
- Admin access control
- API security
- Image upload validation

## Technical Specifications

### Color Scheme & Branding
📌 Nature-inspired color palette:
```css
/* Primary Colors */
--forest-green: #2D5A27;  /* Main brand color */
--sage-green: #86A97C;    /* Secondary color */
--earth-brown: #795548;   /* Accent color */

/* Supporting Colors */
--leaf-green: #4CAF50;    /* Success/Action buttons */
--sky-blue: #03A9F4;      /* Interactive elements */
--cream: #F5F5DC;         /* Background */
--white: #FFFFFF;         /* Text backgrounds */
--dark-gray: #333333;     /* Text color */
```

### External APIs Integration

#### Tree Data APIs (Free)
- Trefle.io - Comprehensive plant/tree database
  - Features: Species data, plant characteristics
  - Documentation: https://trefle.io/

- PlantNet API - Plant identification
  - Features: Image-based identification
  - Documentation: https://my.plantnet.org/doc/openapi

- OpenTreeMap - Tree mapping data
  - Features: Geographic tree data
  - Documentation: https://www.opentreemap.org/api

- Global Forest Watch API - Forest coverage data
  - Features: Forest statistics, environmental data
  - Documentation: https://www.globalforestwatch.org/help/api/

#### Payment Integration
- Platform: Stripe
- Features:
  - One-time adoption payments
  - Optional recurring donations
  - Secure payment processing
- Requirements:
  - Test API keys for development
  - Production API keys for deployment

### Image Management (Cloudinary)
📌 Image Specifications:
```
Tree Images:
- Main catalog: 800x600px
- Thumbnails: 400x300px
- Detail view: 1200x900px
- Format: WebP with JPEG fallback
- Max file size: 2MB
```

### Deployment Configuration
📌 Platform: Vercel
- Requirements:
  - GitHub repository integration
  - Environment variables setup
  - Automatic deployments from main branch
  - Custom domain configuration (optional)
- Development Workflow:
  - Branch protection rules
  - Preview deployments
  - Production deployments

## Detailed Page Structure

### 1. Landing Page (Home)
📌 Purpose: Introduce the platform and encourage tree adoption
- Hero section: "Adopt a Tree, Make an Impact!"
- Quick stats display
  - Total trees adopted
  - CO₂ absorbed
  - Community size
- Primary CTAs
  - 🌱 Adopt a Tree → Tree selection
  - 📖 Learn More → Benefits & process

### 2. User Authentication
📌 Purpose: Secure user login for tracking tree adoption
- Firebase Authentication integration
  - Google login
  - Email login
- Profile creation
  - Name
  - Location
  - Profile Picture
- Dashboard access post-login

### 3. Tree Selection Page
📌 Purpose: Users browse and select trees for adoption
- Tree catalog features
  - Name and details
  - Image (Cloudinary)
  - Location (Google Maps API)
  - Status (Available/Adopted)
- Filter options
  - Tree type
  - Location
  - Adoption method
- Adopt button functionality

### 4. Choose Adoption Type
📌 Purpose: Hybrid model selection for user flexibility
- Virtual Adoption
  - NGO/organization tree care
  - Periodic growth updates
  - Status reports with images
- Physical Adoption
  - User-managed tree care
  - Care tips and guidelines
  - Tracking tools
- Confirmation process
- Dashboard access setup

### 5. My Trees (Dashboard)
📌 Purpose: Show user's adopted trees & allow engagement
- Virtual Adoption Features
  - Tree growth updates
  - NGO-uploaded images
  - Environmental impact statistics
- Physical Adoption Features
  - Progress image uploads
  - Growth tracking
    - Height
    - Leaf count
    - Watering schedule
  - Care reminders
  - Option to switch to Virtual Adoption

### 6. Community & Engagement
📌 Purpose: Encourage participation & build green community
- Social Features
  - User stories
  - Testimonials
  - Leaderboard
    - Top adopters
    - Most active users
  - Social media integration
- Gamification
  - Tree adoption challenges
  - Achievement system

### 7. Admin Panel
📌 Purpose: Manage trees, monitor adoptions & update growth
- Tree Management
  - Add new trees
  - Update existing trees
- User Management
  - Verify uploads
  - Approve progress
- Statistics Dashboard
  - Adoption metrics
  - Growth tracking

### 8. About & Contact Page
📌 Purpose: Provide project details & support info
- Project Information
  - Impact explanation
  - Partner NGOs list
  - Organization details
- Support
  - Contact form
  - Query handling
  - Collaboration opportunities

This reference will be updated as the project evolves. 