# IconSpot

Generate Custom Icons in Seconds with AI-powered icon creation.

## Features

- 🎨 Multiple icon styles (Glass, Neon, Cyberpunk, Minimal)
- ⚡ Fast generation with AI
- 📱 Responsive design with bold, brutalist UI
- 🎯 High-quality icon outputs
- 💾 Easy download functionality

## Tech Stack

- **Frontend**: React 18 with Vite.js
- **Styling**: Tailwind CSS with custom brutalist design
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
iconspot/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   └── iconspot/     # App-specific components
│   ├── pages/            # Page components
│   ├── lib/              # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── components.json       # shadcn/ui configuration
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd iconspot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Development

### Component Architecture

- **StyleSelector**: Choose icon style (Glass, Neon, Cyberpunk, Minimal)
- **IconGrid**: Display generated icon variations
- **IconResult**: Show final high-quality icon with download options
- **Home**: Main page coordinating the icon generation flow

### Design System

The app uses a bold, brutalist design system with:
- Heavy black borders
- Bright, contrasting colors
- Bold, chunky shadows
- Playful rotations and transforms
- High contrast typography

### Adding New Styles

To add a new icon style:

1. Update the `styles` array in `StyleSelector.jsx`
2. Add appropriate icon and color scheme
3. Implement the style logic in your icon generation backend

## Build and Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment

The built files in `dist/` can be deployed to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -am 'Add some feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Integration with AI icon generation API
- [ ] User authentication and saved icons
- [ ] More icon styles and customization options
- [ ] Batch icon generation
- [ ] Icon history and favorites
- [ ] Export in multiple formats (SVG, PNG, ICO)
- [ ] Color customization
- [ ] Icon categories and templates