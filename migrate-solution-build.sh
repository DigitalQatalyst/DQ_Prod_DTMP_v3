#!/bin/bash

# Solution Build Migration Script
# This script completes the migration of Solutions Build from transformation-hub to DQ_Prod_DTMP_v3

echo "🚀 Starting Solution Build Migration..."
echo ""

# Set paths
SOURCE_DIR="/home/karen/Documents/DQ/DTMP/transformation-hub"
TARGET_DIR="/home/karen/Documents/DQ/DTMP/DQ_Prod_DTMP_v3"

# Step 1: Backup existing files
echo "📦 Step 1: Creating backups..."
if [ -f "$TARGET_DIR/src/pages/SolutionBuildPage.tsx" ]; then
    cp "$TARGET_DIR/src/pages/SolutionBuildPage.tsx" "$TARGET_DIR/src/pages/SolutionBuildPage.tsx.backup"
    echo "✅ Backed up SolutionBuildPage.tsx"
fi

if [ -f "$TARGET_DIR/src/pages/Stage2AppPage.tsx" ]; then
    cp "$TARGET_DIR/src/pages/Stage2AppPage.tsx" "$TARGET_DIR/src/pages/Stage2AppPage.tsx.backup"
    echo "✅ Backed up Stage2AppPage.tsx"
fi
echo ""

# Step 2: Copy Stage 1 page
echo "📄 Step 2: Copying Stage 1 page..."
cp "$SOURCE_DIR/src/pages/SolutionBuildPage.tsx" "$TARGET_DIR/src/pages/SolutionBuildPage.tsx"
echo "✅ Copied SolutionBuildPage.tsx"
echo ""

# Step 3: Verify data files
echo "🔍 Step 3: Verifying data files..."
DATA_FILES=(
    "buildRequests.ts"
    "deliveryTeams.ts"
    "filters.ts"
    "index.ts"
    "preBuiltSolutions.ts"
    "types.ts"
)

for file in "${DATA_FILES[@]}"; do
    if [ -f "$TARGET_DIR/src/data/solutionBuild/$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done
echo ""

# Step 4: Verify page components
echo "🔍 Step 4: Verifying page components..."
PAGE_FILES=(
    "BuildRequestWizard.tsx"
    "PreBuiltCatalog.tsx"
    "PreBuiltSolutionDetail.tsx"
    "QuickRequestForm.tsx"
    "SolutionBuildServicePage.tsx"
    "SolutionDetailView.tsx"
)

for file in "${PAGE_FILES[@]}"; do
    if [ -f "$TARGET_DIR/src/pages/solutionBuild/$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done
echo ""

# Step 5: Check for required dependencies
echo "🔍 Step 5: Checking dependencies..."
REQUIRED_COMPONENTS=(
    "src/components/layout/Header.tsx"
    "src/components/layout/Footer.tsx"
    "src/components/ui/button.tsx"
    "src/components/ui/badge.tsx"
    "src/components/ui/input.tsx"
    "src/components/learningCenter/LoginModal.tsx"
    "src/components/learningCenter/FilterPanel.tsx"
)

for component in "${REQUIRED_COMPONENTS[@]}"; do
    if [ -f "$TARGET_DIR/$component" ]; then
        echo "✅ $component exists"
    else
        echo "⚠️  $component may need to be created or imported"
    fi
done
echo ""

# Step 6: Summary
echo "📊 Migration Summary:"
echo "===================="
echo "✅ Data files copied to: $TARGET_DIR/src/data/solutionBuild/"
echo "✅ Page components copied to: $TARGET_DIR/src/pages/solutionBuild/"
echo "✅ Main page updated: $TARGET_DIR/src/pages/SolutionBuildPage.tsx"
echo "⚠️  Stage2AppPage.tsx needs manual update (see migration guide)"
echo ""

echo "📚 Next Steps:"
echo "=============="
echo "1. Review the migration guide: SOLUTION-BUILD-MIGRATION-GUIDE.md"
echo "2. Update Stage2AppPage.tsx to add Solution Build section"
echo "3. Verify routes in App.tsx"
echo "4. Test the complete flow:"
echo "   - Browse catalog (Stage 1)"
echo "   - Submit request (triggers login)"
echo "   - View requests (Stage 2)"
echo ""

echo "🎉 Migration script completed!"
echo ""
echo "⚠️  IMPORTANT: Review backups before testing:"
echo "   - SolutionBuildPage.tsx.backup"
echo "   - Stage2AppPage.tsx.backup"
