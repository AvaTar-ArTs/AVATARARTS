#!/bin/bash
#
# Safe Duplicate Cleanup Script
# Removes confirmed duplicate files (keeps newest/largest versions)
#

set -e  # Exit on error

DIR="/Users/steven/Documents/markD/ai-ml-notes"
cd "$DIR" || exit 1

echo "==================================================================================="
echo "Duplicate File Cleanup - Safe Deletion List"
echo "==================================================================================="
echo ""
echo "Working directory: $DIR"
echo ""

# Counter for deleted files
DELETED=0
TOTAL_SIZE=0

# Function to safely delete file
safe_delete() {
    local file="$1"
    if [ -f "$file" ]; then
        local size=$(stat -f%z "$file" 2>/dev/null || echo "0")
        echo "  ✓ Deleting: $file ($(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo "${size} bytes"))"
        rm "$file"
        ((DELETED++))
        ((TOTAL_SIZE+=size))
    else
        echo "  ⊘ Not found: $file"
    fi
}

echo "Phase 1: Large Conversation Duplicates"
echo "--------------------------------------"

# DeepSeek exports (keep Oct 24, delete Oct 17)
safe_delete "DeepSeek---Into-the-Unknown-2025-10-17.md"

# Scripty Python MP3 (keep version 3, delete others)
safe_delete "Scripty---Python-MP3-generator-2025-10-07.md"
safe_delete "Scripty---Python-MP3-generator-2025-10-07 (1).md"
safe_delete "Scripty---Python-MP3-generator-2025-10-07 (2).md"

# gemini AI business (keep larger version 1)
safe_delete "gemini_five-ai-business-ideas-explained.md"

# QuantumForgeLabs (keep comprehensive _1 version)
safe_delete "QuantumForgeLabs.md"

# ChatGPT Conversations (keep larger version 2)
safe_delete "ChatGPT_Conversation (1).md"

# Link Sharing (keep main version)
safe_delete "Link_Sharing_and_Optimization_1.md"

echo ""
echo "Phase 2: Analysis Document Duplicates"
echo "-------------------------------------"

# Dr. Rosado analysis (keep larger _1 version)
safe_delete "Analysis of Dr. Joseph Rosado's Medical Practice.md"

# Python Skills Gallery (keep comprehensive _1 version)
safe_delete "Python_Prof_Skills_Gall.md"

echo ""
echo "Phase 3: Smaller Duplicate Pairs"
echo "--------------------------------"

# How to work with LLMs (keep main version without _1)
safe_delete "how_to_work_with_large_language_models_1.md"

# Text comparison examples (keep main version)
safe_delete "text_comparison_examples_1.md"

# What makes documentation good (keep main version)
safe_delete "what_makes_documentation_good_1.md"

# Create trendy SEO (keep version without (1))
safe_delete "create_trendy_seo_keyword_optimized_shorts_in_the_top_1_5_with_(1).md"

# Contributing guide (keep main version)
safe_delete "CONTRIBUTING_1.md"

# Etsy product prompts (keep main version)
safe_delete "Etsy_Product_Prompt_Creation_1.md"

# The convergence (keep main version without (4))
safe_delete "the_convergence_of_mathematical_harmony_and_cosmic_communication_exploring_(4).md"

# AI Comic Factory (keep main version without _1)
safe_delete "ai_Comic_Factory_SetUP_1.md"

# How would you suggest (keep main version)
safe_delete "how_would_you_suggest_i_start_sharing_my_coding_and_digital_art_skills_(1).md"
safe_delete "how_would_you_suggest_i_start_sharing_my_coding_and_digital_art_skills_copy.md"

# How to create pricing system (keep main version)
safe_delete "how_to_create_a_system_of_prices_for_services_invoice_etc_for_a_freelancer_(1).md"

echo ""
echo "==================================================================================="
echo "Cleanup Summary"
echo "==================================================================================="
echo "Files deleted: $DELETED"
echo "Space freed: $(numfmt --to=iec-i --suffix=B $TOTAL_SIZE 2>/dev/null || echo "$TOTAL_SIZE bytes")"
echo ""
echo "✓ Cleanup complete!"
echo ""
echo "Note: Largest/newest versions have been kept."
echo "Backup recommendation: Keep a Time Machine backup before running this script."
echo "==================================================================================="
