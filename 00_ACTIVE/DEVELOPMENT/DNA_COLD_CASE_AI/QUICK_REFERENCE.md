# DNA Cold Case Quick Reference Guide

## 🚀 Quick Stats (2025-2026)

- **600+ cases solved** by Othram Labs
- **200+ cases solved** using FGG since 2018
- **5 cases/day** processing capacity (Othram)
- **80%+ success rate** for 3rd cousin or closer matches
- **65+ years** - oldest case solved (1957 murder)

## 🔑 Key Technologies

### 1. Forensic Genetic Genealogy (FGG)
- Upload crime DNA → Find distant relatives → Build family trees → Identify suspects
- **Breakthrough**: Golden State Killer (2018)
- **Success Rate**: 80%+ achieve actionable matches

### 2. Othram Labs
- **Forensic Grade Genome Sequencing**
- **5 cases/day** capacity
- Can process <1 ng DNA (vs. 10+ ng traditional)
- Handles 50+ year old samples

### 3. M-Vac System
- Wet-vacuum DNA extraction
- Recovers DNA from "exhausted" evidence
- **Case**: Sharon Schollmeyer (40 years old)

### 4. Rapid DNA
- **<2 hours** profile generation
- Direct crime scene analysis
- Limited to high-quality samples

## 📊 Relationship Detection

| Relationship | Kinship θ | Shared cM | Detection Accuracy |
|--------------|-----------|-----------|-------------------|
| Parent-Child | 0.25 | 3,400 | 99.9% |
| 1st Cousin | 0.0625 | 850 | 99.1% |
| 2nd Cousin | 0.0156 | 212 | 95.3% |
| 3rd Cousin | 0.0039 | 75 | 82.7% |
| 4th Cousin | 0.00098 | 30 | 65.2% |

## 🎯 Likelihood Ratio Tiers

- **Tier 1** (LR > 10⁶): Direct lineage - 99.98% confidence
- **Tier 2** (LR 10⁴-10⁶): 2nd-3rd cousins - 95-97% confidence  
- **Tier 3** (LR 10²-10⁴): Investigative leads - 85-94% confidence

## 🗄️ Databases

### GEDmatch
- **Size**: 1+ million profiles
- **LE Access**: Opt-in required (since May 2019)
- **Cases**: 120+ arrests, 11 Jane/John Doe IDs

### FamilyTreeDNA
- Commercial database
- Opt-in for law enforcement

### AncestryDNA & 23andMe
- **Prohibit forensic use**

### CODIS (FBI)
- Traditional LE database
- 13-20 STR markers
- Direct matches only

## 📈 Notable Cases

### United States
- **Golden State Killer** (2018) - First major FGG case
- **Joseph Augustus Zarelli** (2022) - 65-year-old case
- **Kalitzke/Bogle** (2021) - 65-year-old double homicide
- **Baby Angel** (2025) - Minnesota newborn case

### Canada
- **Catherine Daviau** (2025) - 2008 murder solved
- **Sharon Schollmeyer** - 40-year-old case via M-Vac

## ⚖️ Legal & Ethical

### DOJ Policy
- Use for violent crimes and remains ID only
- Require judicial oversight
- Document all searches

### Privacy
- GEDmatch: Opt-in required (default opt-out)
- Distant relatives never consented
- Fourth Amendment questions

### Court Admissibility
- Probabilistic reporting (LR, not absolutes)
- Confidence intervals required
- Validation studies needed

## 🔬 Technical Parameters

### Minimum Thresholds
- **Segment Length**: 7-12 cM
- **Total Shared**: 15-20 cM
- **Number of Segments**: 1+ (more = higher confidence)

### Key Algorithms
- **PLINK**: IBD detection
- **KING**: Kinship coefficients
- **GERMLINE**: IBD segments
- **BEAGLE**: SNP imputation

## 💰 Cost & Time

- **Cost per case**: $5,000-$15,000 (FGG)
- **Traditional methods**: $100K+
- **Time to ID**: 2-6 months average
- **Rapid DNA**: <2 hours (high-quality samples)

## 🔮 Future Directions

1. **Predictive Phenotyping** - Facial reconstruction from DNA
2. **Blockchain Auditing** - Immutable audit trails
3. **Real-Time Integration** - Hours instead of days
4. **AI Automation** - Automated family tree building
5. **Advanced Recovery** - Better degraded sample processing

## 📚 Key Resources

### Companies
- **Othram Labs**: othram.com
- **Parabon NanoLabs**: parabon-nanolabs.com
- **GEDmatch**: gedmatch.com

### Organizations
- **NIST**: Forensic DNA statistics
- **ISOGG**: Genetic genealogy wiki
- **FBI CODIS**: Traditional database

### Software
- **PLINK**: plink.genetics.utah.edu
- **KING**: king.genetics.utah.edu
- **BEAGLE**: faculty.washington.edu/browning/beagle/beagle.html

## 🎓 Key Formulas

### Kinship Coefficient (Wright's)
```
θ = (k₁/2) + k₂
```
Where k₁, k₂ = probabilities of sharing 1 or 2 alleles IBD

### Likelihood Ratio
```
LR = P(Data | Related) / P(Data | Unrelated)
```

### Posterior Probability (Bayesian)
```
P(H1|Evidence) = (LR × Prior_Odds) / (1 + LR × Prior_Odds)
```

## ⚠️ Important Notes

1. **Database Access**: Major limitation - GEDmatch opt-in reduced available profiles
2. **Sample Quality**: Degraded samples require specialized techniques (M-Vac, Othram)
3. **Statistical Rigor**: Essential for court admissibility
4. **Privacy**: Ongoing ethical debates and policy changes
5. **Bias**: Databases skew toward European ancestry

---

**For detailed information, see**: `DNA_COLD_CASE_DEEPDIVE.md`
