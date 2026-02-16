#!/bin/bash

# 🚀 Setup Script for Next.js Template
# This script helps you quickly customize the template for your project

set -e

echo "================================"
echo "🚀 Next.js Template Setup"
echo "================================"
echo ""

# Step 1: Project Name
read -p "📝 Project name (default: next-template): " project_name
project_name=${project_name:-next-template}

# Step 2: Description
read -p "📄 Project description: " project_description
project_description=${project_description:-"A Next.js project"}

# Step 3: Author
read -p "👤 Author name: " author_name
author_name=${author_name:-"Your Name"}

# Step 4: API Base URL
read -p "🔗 API Base URL (default: http://localhost:3000/api): " api_url
api_url=${api_url:-"http://localhost:3000/api"}

# Update package.json
echo ""
echo "📦 Updating package.json..."
npm pkg set name="$project_name"
npm pkg set description="$project_description"
npm pkg set author="$author_name"

# Create .env.local
echo ""
echo "🔧 Creating .env.local..."
cat > .env.local <<EOF
# API Configuration
NEXT_PUBLIC_API_BASE_URL=$api_url

# Add your environment variables here
EOF

# Update layout.tsx metadata
echo ""
echo "🎨 Updating layout.tsx metadata..."
sed -i '' "s/title: \"Next.js Template\"/title: \"$project_name\"/" src/app/layout.tsx
sed -i '' "s/description: \"A scalable Next.js template with feature-based architecture\"/description: \"$project_description\"/" src/app/layout.tsx

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install

# Run checks
echo ""
echo "✅ Running code quality checks..."
npm run typecheck
npm run lint

echo ""
echo "================================"
echo "✨ Setup Complete!"
echo "================================"
echo ""
echo "📚 Next steps:"
echo "1. Start development: npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Read docs/GETTING_STARTED.md for more info"
echo "4. Check docs/CUSTOMIZATION_GUIDE.md for customization"
echo ""
echo "Happy coding! 🎉"
