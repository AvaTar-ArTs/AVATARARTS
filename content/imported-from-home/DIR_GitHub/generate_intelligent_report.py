#!/usr/bin/env python3
"""
📊 Intelligent Organization Report Generator
===========================================

Generates comprehensive reports and actionable recommendations from intelligent analysis.
"""

import json
from pathlib import Path
from typing import Dict, List, Any
from collections import Counter, defaultdict
from datetime import datetime


class IntelligentReportGenerator:
    """Generate comprehensive reports from intelligent analysis"""

    def __init__(self, analysis_file: Path):
        self.analysis_file = Path(analysis_file)
        self.data = self._load_analysis()

    def _load_analysis(self) -> Dict:
        """Load analysis data"""
        with open(self.analysis_file, "r") as f:
            return json.load(f)

    def generate_markdown_report(self, output_path: Path) -> str:
        """Generate comprehensive markdown report"""
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        analyses = self.data.get("analyses", {})
        plan = self.data.get("organization_plan", {})
        confidence_stats = plan.get("confidence_stats", {})

        report = []
        report.append("# 🧠 Intelligent Workspace Analysis Report\n")
        report.append(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        report.append(f"**Workspace**: {self.data.get('workspace', 'Unknown')}\n")
        report.append(f"**Total Files Analyzed**: {plan.get('total_files', 0)}\n\n")

        # Executive Summary
        report.append("## 📊 Executive Summary\n\n")
        report.append(f"- **Total Files**: {plan.get('total_files', 0)}\n")
        report.append(f"- **Average Confidence**: {confidence_stats.get('average', 0):.1%}\n")
        report.append(f"- **High Confidence (>80%)**: {confidence_stats.get('high_confidence', 0)}\n")
        report.append(f"- **Medium Confidence (50-80%)**: {confidence_stats.get('medium_confidence', 0)}\n")
        report.append(f"- **Low Confidence (<50%)**: {confidence_stats.get('low_confidence', 0)}\n\n")

        # Categories
        report.append("## 📁 Category Distribution\n\n")
        categories = plan.get("categories", {})
        for category, files in sorted(categories.items(), key=lambda x: len(x[1]), reverse=True):
            report.append(f"- **{category}**: {len(files)} files\n")

        report.append("\n")

        # Technology Usage
        report.append("## 🔧 Technology Stack Analysis\n\n")
        tech_usage = plan.get("technology_usage", {})
        if isinstance(tech_usage, dict):
            tech_counter = Counter(tech_usage)
        else:
            tech_counter = tech_usage

        for tech, count in tech_counter.most_common(15):
            report.append(f"- **{tech}**: {count} files\n")

        report.append("\n")

        # Complexity Distribution
        report.append("## 📈 Complexity Distribution\n\n")
        complexity_dist = plan.get("complexity_distribution", {})
        if isinstance(complexity_dist, dict):
            complexity_counter = Counter(complexity_dist)
        else:
            complexity_counter = complexity_dist

        for complexity, count in complexity_counter.most_common():
            report.append(f"- **{complexity}**: {count} files\n")

        report.append("\n")

        # Top Files by Category
        report.append("## 🎯 Top Files by Category\n\n")
        for category, files in sorted(categories.items(), key=lambda x: len(x[1]), reverse=True)[:10]:
            report.append(f"### {category.title()} ({len(files)} files)\n\n")
            # Show top 5 files by confidence
            top_files = sorted(files, key=lambda x: x["analysis"]["confidence"], reverse=True)[:5]
            for file_info in top_files:
                file_path = Path(file_info["path"])
                analysis = file_info["analysis"]
                report.append(
                    f"- `{file_path.name}` - "
                    f"Confidence: {analysis['confidence']:.1%}, "
                    f"Complexity: {analysis['complexity']}, "
                    f"Quality: {analysis['quality_score']:.2f}\n"
                )
            report.append("\n")

        # Recommendations
        report.append("## 💡 Intelligent Recommendations\n\n")
        recommendations = self._generate_recommendations(analyses, plan)
        for i, rec in enumerate(recommendations, 1):
            report.append(f"{i}. {rec}\n")

        report.append("\n")

        # Action Plan
        report.append("## 🚀 Action Plan\n\n")
        action_plan = self._generate_action_plan(categories)
        for i, action in enumerate(action_plan, 1):
            report.append(f"{i}. {action}\n")

        report_content = "".join(report)

        with open(output_path, "w") as f:
            f.write(report_content)

        print(f"✅ Report saved to {output_path}")
        return report_content

    def _generate_recommendations(self, analyses: Dict, plan: Dict) -> List[str]:
        """Generate intelligent recommendations"""
        recommendations = []

        confidence_stats = plan.get("confidence_stats", {})
        low_confidence = confidence_stats.get("low_confidence", 0)
        total_files = plan.get("total_files", 1)

        if low_confidence / total_files > 0.5:
            recommendations.append(
                "Many files have low confidence scores. Consider adding more descriptive "
                "imports, function names, or docstrings to improve categorization accuracy."
            )

        categories = plan.get("categories", {})
        utilities_count = len(categories.get("utilities", []))
        if utilities_count > total_files * 0.3:
            recommendations.append(
                f"Large number of utility files ({utilities_count}). Consider creating "
                "subcategories or reviewing if some can be better categorized."
            )

        # Check for high complexity files
        high_complexity = sum(
            1 for a in analyses.values() if isinstance(a, dict) and a.get("complexity") == "high"
        )
        if high_complexity > 10:
            recommendations.append(
                f"Found {high_complexity} high-complexity files. Consider refactoring "
                "or breaking into smaller modules."
            )

        # Technology recommendations
        tech_usage = plan.get("technology_usage", {})
        if isinstance(tech_usage, dict):
            tech_counter = Counter(tech_usage)
        else:
            tech_counter = tech_usage

        if tech_counter.get("testing", 0) < total_files * 0.1:
            recommendations.append(
                "Low test coverage detected. Consider adding more test files to improve code quality."
            )

        return recommendations

    def _generate_action_plan(self, categories: Dict) -> List[str]:
        """Generate actionable organization plan"""
        actions = []

        # Organize by category
        for category, files in sorted(categories.items(), key=lambda x: len(x[1]), reverse=True):
            if len(files) > 5:
                actions.append(
                    f"Create `{category}/` directory and move {len(files)} files from this category"
                )

        # High confidence files first
        actions.append(
            "Start with high-confidence categorizations (>80%) as they are most reliable"
        )

        # Review low confidence
        actions.append(
            "Review low-confidence files manually to ensure proper categorization"
        )

        return actions

    def generate_csv_summary(self, output_path: Path):
        """Generate CSV summary for easy analysis"""
        import csv

        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        analyses = self.data.get("analyses", {})

        with open(output_path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(
                [
                    "File Path",
                    "Category",
                    "Confidence",
                    "Complexity",
                    "Quality Score",
                    "Maintainability",
                    "Technologies",
                    "Architectural Patterns",
                    "Purpose",
                ]
            )

            for file_path, analysis in analyses.items():
                if isinstance(analysis, dict):
                    writer.writerow(
                        [
                            file_path,
                            analysis.get("primary_category", "unknown"),
                            f"{analysis.get('confidence', 0):.2%}",
                            analysis.get("complexity", "unknown"),
                            f"{analysis.get('quality_score', 0):.2f}",
                            f"{analysis.get('maintainability', 0):.2f}",
                            ", ".join(analysis.get("technologies", [])),
                            ", ".join(analysis.get("architectural_patterns", [])),
                            analysis.get("purpose", "unknown"),
                        ]
                    )

        print(f"✅ CSV summary saved to {output_path}")


def main():
    """Main function"""
    import sys

    workspace_root = Path(__file__).parent
    analysis_file = workspace_root / "09_documentation" / "reports" / "intelligent_analysis.json"

    if not analysis_file.exists():
        print(f"❌ Analysis file not found: {analysis_file}")
        print("   Run intelligent_organizer.py first to generate analysis")
        return 1

    generator = IntelligentReportGenerator(analysis_file)

    # Generate markdown report
    md_report = workspace_root / "09_documentation" / "reports" / "intelligent_analysis_report.md"
    generator.generate_markdown_report(md_report)

    # Generate CSV summary
    csv_summary = workspace_root / "09_documentation" / "reports" / "intelligent_analysis_summary.csv"
    generator.generate_csv_summary(csv_summary)

    print("\n✅ Reports generated successfully!")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main())

