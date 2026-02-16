@echo off
REM Setup Script for Next.js Template (Windows)
REM This script helps you quickly customize the template for your project

setlocal enabledelayedexpansion

echo ================================
echo 🚀 Next.js Template Setup
echo ================================
echo.

REM Step 1: Project Name
set /p project_name="📝 Project name (default: next-template): "
if "!project_name!"=="" set project_name=next-template

REM Step 2: Description
set /p project_description="📄 Project description: "
if "!project_description!"=="" set project_description="A Next.js project"

REM Step 3: Author
set /p author_name="👤 Author name: "
if "!author_name!"=="" set author_name="Your Name"

REM Step 4: API Base URL
set /p api_url="🔗 API Base URL (default: http://localhost:3000/api): "
if "!api_url!"=="" set api_url=http://localhost:3000/api

echo.
echo 📦 Updating package.json...
call npm pkg set name="!project_name!"
call npm pkg set description="!project_description!"
call npm pkg set author="!author_name!"

echo.
echo 🔧 Creating .env.local...
(
  echo # API Configuration
  echo NEXT_PUBLIC_API_BASE_URL=!api_url!
  echo.
  echo # Add your environment variables here
) > .env.local

echo.
echo 📥 Installing dependencies...
call npm install

echo.
echo ✅ Running code quality checks...
call npm run typecheck
call npm run lint

echo.
echo ================================
echo ✨ Setup Complete!
echo ================================
echo.
echo 📚 Next steps:
echo 1. Start development: npm run dev
echo 2. Open http://localhost:3000
echo 3. Read docs/GETTING_STARTED.md for more info
echo 4. Check docs/CUSTOMIZATION_GUIDE.md for customization
echo.
echo Happy coding! 🎉

pause
