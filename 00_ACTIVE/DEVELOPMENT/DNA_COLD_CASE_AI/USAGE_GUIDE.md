# DNA Cold Case AI - Usage Guide

## Quick Start

### 1. Installation

```bash
cd ~/AVATARARTS/DNA_COLD_CASE_AI

# Install dependencies
pip install -r requirements.txt

# Verify installation
python src/dna_cold_case_ai.py
```

### 2. Run Demo

The demo will:
- Create a sample cold case
- Generate synthetic DNA matches
- Prioritize suspects using ML
- Generate investigative report

```bash
python src/dna_cold_case_ai.py
```

## Core Workflows

### Workflow 1: Analyze New Cold Case

```python
from src.dna_cold_case_ai import DNAColdCaseAI

# Initialize system
ai_system = DNAColdCaseAI()

# Create case
case = ai_system.case_manager.create_case(
    case_id="CC-2024-001",
    case_number="24-HOMI-001",
    jurisdiction="Metro PD",
    crime_type="homicide",
    incident_date="2000-05-15",
    location="123 Main St",
    description="Unsolved homicide with DNA evidence",
    victim_name="John Doe",
    priority=1
)

# Add DNA evidence
evidence = ai_system.case_manager.add_evidence_to_case(
    case_id=case.case_id,
    evidence_id="EV-2024-001-A",
    evidence_type="blood",
    collection_date="2000-05-16",
    location="Crime scene",
    description="Blood sample from perpetrator",
    handler="Det. Smith",
    dna_profile_path="path/to/sample.vcf"
)

# Run analysis
results = ai_system.analyze_cold_case(
    case_id=case.case_id,
    evidence_dna_profile_path="path/to/sample.vcf",
    min_cm=20.0,
    confidence_threshold=0.70
)

# Generate report
report = ai_system.generate_investigative_report(
    case_id=case.case_id,
    output_path=f"reports/{case.case_id}_report.txt"
)
```

### Workflow 2: DNA Matching Only

```python
from src.core.dna_matcher import DNAMatcher

# Initialize matcher
matcher = DNAMatcher(min_segment_cm=7.0, min_total_cm=15.0)

# Load DNA profile
crime_profile = matcher.load_profile("evidence/sample.vcf")

# Find matches in database
matches = matcher.find_matches(
    crime_profile,
    min_cm=20.0,
    confidence_threshold=0.70
)

# Display results
for match in matches[:10]:
    print(f"Match: {match.profile_id}")
    print(f"  Shared: {match.shared_cm:.1f} cM")
    print(f"  Relationship: {match.predicted_relationship}")
    print(f"  LR: {match.likelihood_ratio:.2e}")
    print(f"  Confidence: {match.confidence*100:.1f}%")
```

### Workflow 3: Probability Simulation

```python
from src.analysis.probability_simulator import ProbabilitySimulator

# Initialize simulator
simulator = ProbabilitySimulator(random_seed=42)

# Simulate relationship
result = simulator.simulate_relationship(
    relationship='3rd_cousin',
    num_simulations=10000
)

print(f"Mean shared cM: {result.mean_shared_cm:.1f}")
print(f"95% CI: {result.confidence_intervals[95]}")

# Calculate likelihood ratio
lr_result = simulator.simulate_likelihood_ratio(
    observed_cm=75.0,
    hypothesized_relationship='3rd_cousin',
    num_simulations=10000
)

print(f"Likelihood Ratio: {lr_result['likelihood_ratio']:.2e}")
print(f"Interpretation: {lr_result['interpretation']}")
```

### Workflow 4: ML Match Prioritization

```python
from src.models.ml_prioritizer import MLMatchPrioritizer, MatchFeatures

# Initialize prioritizer
prioritizer = MLMatchPrioritizer()

# Train model (uses synthetic data by default)
prioritizer.train()

# Create match features
features = MatchFeatures(
    shared_cm=85.0,
    longest_segment_cm=45.0,
    num_segments=12,
    kinship_coefficient=0.0042,
    likelihood_ratio=2.3e4,
    confidence=0.87,
    database_size_log=6.0,
    population_frequency=0.5,
    geographic_distance_km=25.0,
    age_match=True,
    prior_criminal_record=False
)

# Get priority score
score = prioritizer.predict_priority_score(features)
print(f"Priority Score: {score:.3f}")

# Get explanation
explanation = prioritizer.explain_prediction(features)
print(f"Interpretation: {explanation['interpretation']}")
```

## Use Cases

### Use Case 1: Golden State Killer Type Investigation

**Scenario**: Decades-old serial crimes with degraded DNA

```python
# Create case for serial investigation
case = ai_system.case_manager.create_case(
    case_id="CC-SERIAL-001",
    case_number="80-SERIES-001",
    jurisdiction="County Sheriff",
    crime_type="homicide",
    incident_date="1980-01-15",
    location="Multiple locations",
    description="Serial homicide investigation - DNA from multiple scenes",
    priority=1
)

# Add multiple evidence samples
for i, scene in enumerate(crime_scenes, 1):
    ai_system.case_manager.add_evidence_to_case(
        case_id=case.case_id,
        evidence_id=f"EV-SERIAL-{i:03d}",
        evidence_type="mixed",
        collection_date=scene['date'],
        location=scene['location'],
        description=f"Evidence from scene {i}",
        handler="Det. Jones",
        dna_profile_path=scene['dna_path']
    )

# Analyze with lower thresholds due to degraded samples
results = ai_system.analyze_cold_case(
    case_id=case.case_id,
    evidence_dna_profile_path=crime_scenes[0]['dna_path'],
    min_cm=12.0,  # Lower threshold
    confidence_threshold=0.60
)
```

### Use Case 2: Unidentified Remains

**Scenario**: Identify unknown victim

```python
case = ai_system.case_manager.create_case(
    case_id="CC-UIDREM-001",
    case_number="95-DOE-001",
    jurisdiction="State Police",
    crime_type="unidentified_remains",
    incident_date="1995-08-20",
    location="Rural area",
    description="Unidentified skeletal remains - attempting DNA identification",
    victim_name="Jane Doe 1995",
    priority=2
)

# Extract DNA from bones/teeth
evidence = ai_system.case_manager.add_evidence_to_case(
    case_id=case.case_id,
    evidence_id="EV-BONE-001",
    evidence_type="bone",
    collection_date="1995-08-21",
    location="Crime lab",
    description="Femur bone sample for DNA extraction",
    handler="Dr. Martinez",
    dna_profile_path="remains/doe_1995.vcf"
)

# Search for family members
results = ai_system.analyze_cold_case(
    case_id=case.case_id,
    evidence_dna_profile_path="remains/doe_1995.vcf",
    min_cm=20.0,
    confidence_threshold=0.75
)

# Contact potential family members for further testing
```

### Use Case 3: Recent Crime Prevention

**Scenario**: Active investigation - prevent case from going cold

```python
from src.core.dna_matcher import DNAMatcher

# Rapid DNA analysis
matcher = DNAMatcher(min_segment_cm=10.0, min_total_cm=20.0)

# Load fresh sample
crime_profile = matcher.load_profile("active/recent_assault.vcf")

# Quick database search
matches = matcher.find_matches(
    crime_profile,
    min_cm=25.0,
    confidence_threshold=0.80
)

# Generate immediate leads
if matches:
    print(f"URGENT: {len(matches)} potential matches found")
    for match in matches[:3]:
        print(f"  Priority match: {match.profile_id}")
        print(f"  LR: {match.likelihood_ratio:.2e}")
```

## Advanced Features

### Custom Database Integration

```python
# Load your own database profiles
database_profiles = []

for vcf_file in Path("database/").glob("*.vcf"):
    profile = matcher.load_profile(str(vcf_file))
    database_profiles.append(profile)

# Search custom database
matches = matcher.find_matches(
    crime_profile,
    database_profiles=database_profiles
)
```

### Batch Processing Multiple Cases

```python
case_ids = ["CC-001", "CC-002", "CC-003"]

for case_id in case_ids:
    try:
        results = ai_system.analyze_cold_case(
            case_id=case_id,
            evidence_dna_profile_path=f"evidence/{case_id}.vcf"
        )

        print(f"Case {case_id}: {results['total_matches']} matches")
    except Exception as e:
        print(f"Error processing {case_id}: {e}")
```

### Chain of Custody Tracking

```python
# Load evidence
case = ai_system.case_manager.load_case("CC-001")
evidence = case.evidence_items[0]

# Add custody entries
evidence.add_custody_entry(
    handler="Det. Smith",
    action="transferred to lab",
    notes="Sent for DNA extraction"
)

evidence.add_custody_entry(
    handler="Lab Tech Jones",
    action="processed",
    notes="DNA extracted and profiled"
)

evidence.add_custody_entry(
    handler="Det. Smith",
    action="received from lab",
    notes="Results obtained, profile uploaded"
)

# Verify integrity
for entry in evidence.chain_of_custody:
    print(f"{entry['timestamp']}: {entry['action']} by {entry['handler']}")
    print(f"  Hash: {entry['hash']}")
```

## Interpreting Results

### Likelihood Ratio Scale

| LR Value | Interpretation | Action |
|----------|---------------|--------|
| > 10^6 | Extremely strong support | Immediate investigation |
| 10^4 - 10^6 | Very strong support | High priority |
| 10^3 - 10^4 | Strong support | Priority investigation |
| 100 - 1000 | Moderate support | Standard follow-up |
| 10 - 100 | Weak support | Additional validation |
| < 10 | Minimal/No support | Low priority |

### Confidence Scores

- **> 0.90**: Very high confidence - Clear match
- **0.75 - 0.90**: High confidence - Strong candidate
- **0.60 - 0.75**: Moderate confidence - Worth investigating
- **< 0.60**: Low confidence - Additional evidence needed

### ML Priority Scores

- **> 0.90**: CRITICAL - Immediate action
- **0.75 - 0.90**: HIGH - Priority investigation
- **0.50 - 0.75**: MODERATE - Standard follow-up
- **0.30 - 0.50**: LOW - Additional validation
- **< 0.30**: MINIMAL - Likely false positive

## Best Practices

### 1. Evidence Quality

- **Fresh samples**: Use highest quality DNA available
- **Degraded samples**: Lower thresholds, increase simulations
- **Mixed samples**: Require expert interpretation

### 2. Statistical Rigor

- Always report confidence intervals
- Document all assumptions
- Use multiple models (ensemble approach)
- Validate with known relationships when possible

### 3. Privacy & Ethics

- Only use for violent crimes and unidentified remains
- Respect database opt-in/opt-out preferences
- Maintain strict chain of custody
- Require judicial oversight for familial searches

### 4. Documentation

- Log all queries and analyses
- Maintain detailed case notes
- Generate audit-ready reports
- Preserve original evidence metadata

### 5. Investigative Follow-Up

- ML scores guide priority, not conclusions
- Conduct genealogical research on matches
- Verify relationships through additional testing
- Build traditional evidence alongside DNA

## Troubleshooting

### Low Match Quality

```python
# Try lowering thresholds
matches = matcher.find_matches(
    crime_profile,
    min_cm=10.0,  # Lower from 15.0
    confidence_threshold=0.50  # Lower from 0.70
)

# Increase simulation iterations
sim_result = simulator.simulate_likelihood_ratio(
    observed_cm=45.0,
    hypothesized_relationship='4th_cousin',
    num_simulations=100000  # Increase from 10000
)
```

### Degraded DNA Samples

- Use specialized extraction techniques (M-Vac)
- Consider whole genome amplification
- Accept lower marker counts
- Increase error margins in calculations

### Database Size Effects

```python
# Adjust for large databases
features.database_size_log = np.log10(5_000_000)  # 5M profiles

# Run database search simulation
db_result = simulator.simulate_database_search(
    query_relationship='3rd_cousin',
    database_size=5_000_000,
    false_match_rate=0.001
)
```

## References

- DOJ Interim Policy on Forensic Genetic Genealogy
- NIST Standards for Forensic DNA
- ISOGG Law Enforcement Guidelines
- Othram Labs Technical Documentation

## Support

For issues or questions:
- Check logs in `logs/` directory
- Review case files in `data/cases/`
- Consult USAGE_GUIDE.md (this file)
- Contact forensic genetics expert

---

**Version**: 1.0.0
**Last Updated**: 2026-01-03
