#!/bin/bash
# QuantumForgeLabs Deployment Script
# Uploads only quantumforgelabs-specific content to quantumforgelabs.org

echo "🚀 Starting QuantumForgeLabs Deployment..."
echo "📅 Date: $(date)"
echo "🎯 Target: quantumforgelabs.org"
echo ""

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p quantumforgelabs_deployment

# Copy quantumforgelabs-specific content
echo "📁 Copying quantumforgelabs content..."

# Core projects
echo "  - Copying 01_Comprehensive_Chat_Organization..."
cp -r 01_Comprehensive_Chat_Organization/ quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Directory not found"

echo "  - Copying 02_Content_Aware_Analysis..."
cp -r 02_Content_Aware_Analysis/ quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Directory not found"

echo "  - Copying Dr_Adu_GainesvillePFS_SEO_Project..."
cp -r Dr_Adu_GainesvillePFS_SEO_Project/ quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Directory not found"

echo "  - Copying 02_Business_and_Finance..."
cp -r 02_Business_and_Finance/ quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Directory not found"

echo "  - Copying Gallery_Analysis_Project..."
cp -r Gallery_Analysis_Project/ quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Directory not found"

echo "  - Copying ai-creator-tools-2025..."
cp -r ai-creator-tools-2025/ quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Directory not found"

echo "  - Copying multimedia-workflows..."
cp -r multimedia-workflows/ quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Directory not found"

echo "  - Copying SEO_MARKETING_STRATEGY..."
cp -r SEO_MARKETING_STRATEGY/ quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Directory not found"

echo "  - Copying steven-chaplinski-website..."
cp -r steven-chaplinski-website/ quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Directory not found"

echo "  - Copying www.superpowerdaily.com..."
cp -r www.superpowerdaily.com/ quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Directory not found"

# Documentation
echo "  - Copying documentation files..."
cp README.md quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  README.md not found"
cp QUANTUMFORGELABS_SETUP.md quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Setup file not found"
cp QUANTUMFORGELABS_DEPLOYMENT_STRATEGY.md quantumforgelabs_deployment/ 2>/dev/null || echo "    ⚠️  Strategy file not found"

# Copy other quantumforgelabs-specific files (exclude avatararts/gptjunkie)
echo "  - Copying additional quantumforgelabs files..."
find . -maxdepth 1 -name "*.md" -not -name "*avatar*" -not -name "*gptjunkie*" -exec cp {} quantumforgelabs_deployment/ \; 2>/dev/null || true
find . -maxdepth 1 -name "*.sh" -not -name "*avatar*" -not -name "*gptjunkie*" -exec cp {} quantumforgelabs_deployment/ \; 2>/dev/null || true

echo ""
echo "✅ QuantumForgeLabs content prepared for deployment"
echo "📊 Deployment directory contents:"
ls -la quantumforgelabs_deployment/

echo ""
echo "📊 Deployment directory size:"
du -sh quantumforgelabs_deployment/

echo ""
echo "🚀 Ready to upload to quantumforgelabs.org"
echo ""
echo "📋 Upload Commands:"
echo "   Option 1 - Direct Upload:"
echo "   rsync -avz quantumforgelabs_deployment/ u114071855@access981577610.webspace-data.io:/path/to/quantumforgelabs/"
echo ""
echo "   Option 2 - Git Upload:"
echo "   cd quantumforgelabs_deployment && git init && git add . && git commit -m 'QuantumForgeLabs deployment'"
echo "   git remote add origin u114071855@access981577610.webspace-data.io:/path/to/quantumforgelabs.git"
echo "   git push -u origin main"
echo ""
echo "🎪 QuantumForgeLabs Deployment Ready! 🎪"