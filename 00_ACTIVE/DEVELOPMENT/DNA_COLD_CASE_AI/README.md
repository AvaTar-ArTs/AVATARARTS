# DNA Cold Case AI Program

An advanced AI-powered system for analyzing DNA evidence in cold case investigations using forensic genetic genealogy, machine learning, and probability simulations.

## Features

- **DNA Matching Engine**: Calculate kinship coefficients and IBD (Identity-by-Descent) segments
- **Forensic Genetic Genealogy**: Cross-reference DNA profiles with ancestry databases
- **Probability Simulations**: Monte Carlo simulations for relationship likelihood estimation
- **Machine Learning Models**: Prioritize investigative leads using ensemble learning
- **Case Management**: Track evidence, suspects, and investigation progress
- **Statistical Validation**: Likelihood ratio calculations with confidence intervals
- **Audit Trail**: Complete chain-of-custody logging for courtroom admissibility

## Technology Stack

- **Python 3.9+**
- **NumPy/SciPy**: Statistical computations
- **Scikit-learn**: Machine learning models
- **Pandas**: Data manipulation
- **Matplotlib/Plotly**: Visualization
- **SQLite**: Case database

## Installation

```bash
cd ~/AVATARARTS/DNA_COLD_CASE_AI
pip install -r requirements.txt
```

## Quick Start

```python
from src.core.dna_matcher import DNAMatcher
from src.core.case_manager import CaseManager

# Initialize case
case = CaseManager.create_case(
    case_id="CC-1998-0042",
    description="1998 homicide - degraded DNA sample"
)

# Load DNA profile
matcher = DNAMatcher()
crime_profile = matcher.load_profile("data/evidence/sample_001.vcf")

# Find matches
matches = matcher.find_matches(
    crime_profile,
    min_cm=15.0,
    confidence_threshold=0.85
)

# Calculate probabilities
for match in matches:
    lr = matcher.calculate_likelihood_ratio(match)
    print(f"Match: {match.id} | LR: {lr:.2e} | Relationship: {match.predicted_relationship}")
```

## Project Structure

```
DNA_COLD_CASE_AI/
├── src/
│   ├── core/           # Core DNA analysis modules
│   ├── models/         # ML models and algorithms
│   ├── analysis/       # Genealogy and probability analysis
│   └── utils/          # Helper functions
├── data/
│   ├── cases/          # Case files
│   ├── evidence/       # DNA profiles and evidence
│   └── profiles/       # Database profiles
├── config/             # Configuration files
├── logs/               # Audit logs
├── reports/            # Generated reports
└── tests/              # Unit tests
```

## Ethical Guidelines

⚠️ **IMPORTANT**: This system is designed for authorized law enforcement use only.

- Use only on violent crimes (murder, rape) and unidentified remains
- Respect database opt-in/opt-out preferences
- Maintain strict chain-of-custody
- Document all statistical assumptions
- Require judicial oversight for familial searching
- Protect privacy of non-suspects

## Legal Compliance

- Follows DOJ Interim Policy on Forensic Genetic Genealogy
- Implements NIST standards for statistical validation
- Generates court-admissible reports with confidence intervals
- Maintains blockchain-verified audit trails

## Documentation

See `/docs` directory for:
- API Reference
- Statistical Methods
- Case Studies
- Best Practices

## License

Restricted use - Law Enforcement Only

## Contributors

Built using research from Othram Labs, NIST, and leading forensic geneticists.

---

**Version**: 1.0.0
**Last Updated**: 2026-01-03
