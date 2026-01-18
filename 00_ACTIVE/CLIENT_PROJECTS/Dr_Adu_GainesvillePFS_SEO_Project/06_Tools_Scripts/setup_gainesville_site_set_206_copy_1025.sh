#!/bin/bash
# setup_gainesville_site.sh
# Builds the Gainesville Psychiatry and Forensic Services site scaffold
# Generates folders, assets, and SEO-ready HTML templates

set -e  # Exit immediately on any error

ROOT_DIR="gainesville_pfs_website"
PAGES=("index.html" "about.html" "services.html" "mental-health-services.html" "neurostar-tms.html" "forensic.html" "appointments.html" "contact.html")

echo "🚀 Initializing Gainesville PFS SEO site structure..."

# Create folder structure
for dir in \
  "$ROOT_DIR/assets/css" \
  "$ROOT_DIR/assets/js" \
  "$ROOT_DIR/assets/images" \
  "$ROOT_DIR/pages" \
  "$ROOT_DIR/schema" \
  "$ROOT_DIR/reports"; do
  mkdir -p "$dir"
  echo "Created directory: $dir"
done

# CSS baseline
cat > "$ROOT_DIR/assets/css/style.css" <<'EOF'
body {
  font-family: 'PT Serif', 'Arial', sans-serif;
  background-color: #f8f9fa;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
h1, h2 {
  color: #2c3e50;
}
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
}
EOF

# JS placeholder
cat > "$ROOT_DIR/assets/js/main.js" <<'EOF'
// Placeholder script
document.addEventListener("DOMContentLoaded", () => {
  console.log("Gainesville PFS site initialized successfully.");
});
EOF

# HTML generator function
create_html() {
  local filename="$1"
  local title="$2"
  local description="$3"
  local h1="$4"
  local file_path="$ROOT_DIR/pages/$filename"

  cat > "$file_path" <<EOF
<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>$title</title>
  <meta name="description" content="$description">
  <link rel="canonical" href="$filename">
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
  <div class="container">
    <h1>$h1</h1>
    <p>Page content for <strong>$filename</strong> will be added here.</p>
  </div>
  <script src="../assets/js/main.js" defer></script>
</body>
</html>
EOF

  echo "✓ Generated: $filename"
}

echo "🧩 Generating HTML pages..."

# Homepage
create_html "index.html" \
"Top Psychiatrist Gainesville FL | TMS Therapy & Forensic Psychiatry | Dr. Lawrence Adu" \
"Board-certified Gainesville psychiatrist Dr. Lawrence Adu provides TMS therapy, forensic psychiatry, and comprehensive mental health care." \
"Welcome to Gainesville Psychiatry & Forensic Services"

# About page
create_html "about.html" \
"About Dr. Lawrence Adu | Gainesville Psychiatrist | Forensic Psychiatry Expert" \
"Meet Dr. Adu, a Gainesville psychiatrist with expertise in TMS therapy, forensic psychiatry, and addiction medicine." \
"About Dr. Lawrence Adu"

# Services
create_html "services.html" \
"NeuroStar TMS Therapy Gainesville FL | Depression Treatment | Dr. Lawrence Adu" \
"FDA-approved NeuroStar TMS therapy in Gainesville FL for depression treatment. Accepting insurance." \
"Our Psychiatric Services"

# Mental Health Services
create_html "mental-health-services.html" \
"Mental Health Services Gainesville FL | TMS Therapy | Dr. Lawrence Adu" \
"Comprehensive psychiatric care in Gainesville FL including TMS, forensic psychiatry, and addiction medicine." \
"Comprehensive Mental Health Services"

# NeuroStar TMS
create_html "neurostar-tms.html" \
"NeuroStar TMS Therapy Gainesville FL | Drug-Free Depression Treatment" \
"Noninvasive NeuroStar TMS therapy for treatment-resistant depression in Gainesville, FL." \
"NeuroStar TMS Therapy"

# Forensic
create_html "forensic.html" \
"Forensic Psychiatry Gainesville FL | Competency & Expert Witness Evaluations" \
"Forensic psychiatric evaluations, competency assessments, and expert witness services in Gainesville, FL." \
"Forensic Psychiatry Services"

# Appointments
create_html "appointments.html" \
"Schedule Psychiatrist Appointment Gainesville FL | TMS & Forensic Psychiatry" \
"Book a psychiatric or TMS appointment with Dr. Adu in Gainesville FL. Call (352) 378-9116." \
"Schedule an Appointment"

# Contact
create_html "contact.html" \
"Contact Dr. Lawrence Adu | Gainesville Psychiatrist | (352) 378-9116" \
"Contact Dr. Adu’s office for psychiatric, forensic, or TMS therapy in Gainesville FL." \
"Contact Our Office"

# Structured data
cat > "$ROOT_DIR/schema/localbusiness.json" <<'EOF'
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness","MedicalBusiness"],
  "name": "Gainesville Psychiatry and Forensic Services",
  "url": "https://www.gainesvillepfs.com/",
  "telephone": "(352) 378-9116",
  "faxNumber": "(352) 378-9779",
  "email": "GPFS1026@yahoo.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1103 SW 2nd Ave Ste C",
    "addressLocality": "Gainesville",
    "addressRegion": "FL",
    "postalCode": "32601",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 29.6516,
    "longitude": -82.3248
  },
  "openingHours": "Mo-Fr 09:00-17:00",
  "medicalSpecialty": [
    "Psychiatry",
    "ForensicPsychiatry",
    "AddictionMedicine",
    "TMS"
  ],
  "founder": {
    "@type": "Person",
    "name": "Dr. Lawrence Adu",
    "jobTitle": "Psychiatrist"
  }
}
EOF

# SEO report generation
cat > "$ROOT_DIR/reports/SEO_SUMMARY.md" <<'EOF'
# SEO Site Setup Summary

All base pages created with SEO-optimized titles and meta descriptions.

**Primary Focus Areas:**
- Local search optimization (Gainesville FL)
- TMS and forensic psychiatry focus
- Structured data for MedicalBusiness
- Schema.org validation-ready JSON
- Canonical tagging on all pages

Next Steps:
1. Insert actual content blocks per service.
2. Validate schema via https://search.google.com/test/rich-results
3. Connect Google Analytics 4 & Search Console.
EOF

echo "📘 SEO schema and summary report generated."
echo "✅ Project setup complete: $ROOT_DIR/"
