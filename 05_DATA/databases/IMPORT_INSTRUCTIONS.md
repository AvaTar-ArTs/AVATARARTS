# Database Import Instructions - Notion & Airtable

## Quick Start

Choose your platform and follow the instructions below. Both databases are designed to track your revenue implementation plan.

---

## 🟢 NOTION IMPORT

### Option 1: CSV Import (Recommended)

1. **Go to Notion**
   - Open Notion app or website
   - Create a new page or workspace

2. **Import CSV Files**
   - Type `/import` or click "Import" in sidebar
   - Select "CSV"
   - Upload files from `CSV_FILES/` folder:
     - `implementation_tasks.csv`
     - `revenue_streams.csv`
     - `weekly_goals.csv`

3. **Set Up Properties**
   - After import, go to each database
   - Click "..." → "Properties"
   - Match CSV columns to Notion properties:
     - Status → Select (add options)
     - Priority → Select (add options)
     - Revenue Impact → Select (add options)
     - Dates → Date
     - Numbers → Number
     - Currency → Number (format as currency)

4. **Create Relationships**
   - In Clients database, add "Revenue Records" property
   - Type: Relation → Link to Revenue Tracking
   - In Revenue Tracking, add "Client" property
   - Type: Relation → Link to Clients

5. **Add Formulas**
   - In Weekly Goals, add "Completion %" formula:
     ```
     prop("Tasks Completed") / prop("Tasks Total") * 100
     ```
   - In Revenue Tracking, add "Month" formula:
     ```
     formatDate(prop("Date"), "YYYY-MM")
     ```

### Option 2: Manual Setup

1. **Create Databases**
   - Create 6 new databases (one for each table)
   - Name them according to structure document

2. **Add Properties**
   - Follow the property structure in `notion_database_structure.md`
   - Set correct property types
   - Add select options

3. **Add Sample Data**
   - Manually enter or copy from CSV files
   - Use templates for common entries

### Notion Views to Create

1. **Task Board** (Kanban)
   - Group by: Status
   - Sort by: Priority, Day

2. **Revenue Dashboard**
   - Group by: Revenue Stream
   - Sort by: Amount (descending)

3. **Client Pipeline**
   - Group by: Status
   - Filter: Active + Prospect

---

## 🔵 AIRTABLE IMPORT

### Option 1: CSV Import (Recommended)

1. **Create Base**
   - Go to Airtable.com
   - Click "Add a base" → "Import data"
   - Select "CSV file"

2. **Import Each Table**
   - Import `implementation_tasks.csv` → Name table "Implementation Tasks"
   - Import `revenue_streams.csv` → Name table "Revenue Streams Overview"
   - Import `weekly_goals.csv` → Name table "Weekly Goals"

3. **Set Field Types**
   - After import, click each field header
   - Change field types:
     - Status, Priority, Category → Single select
     - Estimated Hours, Actual Hours → Number (decimal)
     - Revenue Impact → Single select
     - Dates → Date
     - Amount fields → Currency

4. **Create Remaining Tables**
   - Create "Revenue Tracking" table manually
   - Create "Clients" table manually
   - Create "Marketing Activities" table manually
   - Follow structure from `airtable_database_structure.md`

5. **Set Up Relationships**
   - In Clients table, add "Revenue Records" field
   - Type: Link to another record → Revenue Tracking
   - In Revenue Tracking, add "Client" field
   - Type: Link to another record → Clients

6. **Add Formulas**
   - In Weekly Goals, add "Completion %":
     ```
     ({Tasks Completed} / {Tasks Total}) * 100
     ```
   - In Revenue Tracking, add "Month":
     ```
     DATETIME_FORMAT({Date}, "YYYY-MM")
     ```

### Option 2: Template Duplication

1. **Use Airtable Template**
   - Search Airtable template gallery for "Project Management"
   - Duplicate a similar template
   - Modify to match our structure

2. **Customize**
   - Rename tables
   - Add/remove fields
   - Adjust views

### Airtable Views to Create

1. **Task Kanban**
   - View type: Kanban
   - Group by: Status
   - Sort by: Priority

2. **Revenue Dashboard**
   - View type: Grid
   - Group by: Revenue Stream
   - Summary: Sum of Amount

3. **Client Pipeline**
   - View type: Grid
   - Group by: Status
   - Filter: Active OR Prospect

---

## 📋 SETUP CHECKLIST

### Notion Setup
- [ ] Create workspace/page
- [ ] Import or create 6 databases
- [ ] Set up all properties with correct types
- [ ] Add select options
- [ ] Create relationships between tables
- [ ] Add formulas
- [ ] Create views (Kanban, Timeline, etc.)
- [ ] Import or add sample data
- [ ] Customize for your needs

### Airtable Setup
- [ ] Create base
- [ ] Import or create 6 tables
- [ ] Set up all fields with correct types
- [ ] Configure select options
- [ ] Create relationships
- [ ] Add formulas
- [ ] Create views (Kanban, Calendar, etc.)
- [ ] Set up automations
- [ ] Create dashboard
- [ ] Import or add sample data
- [ ] Customize for your needs

---

## 🔗 RELATIONSHIPS TO CREATE

### Notion Relationships

1. **Clients ↔ Revenue Tracking**
   - In Clients: Add "Revenue Records" (Relation to Revenue Tracking)
   - In Revenue Tracking: Add "Client" (Relation to Clients)

2. **Weekly Goals ↔ Tasks**
   - In Weekly Goals: Add "Tasks" (Relation to Implementation Tasks)
   - In Implementation Tasks: Add "Week" (Relation to Weekly Goals)

3. **Revenue Streams ↔ Revenue Tracking**
   - In Revenue Streams: Add "Revenue Records" (Relation to Revenue Tracking)
   - In Revenue Tracking: Already has "Revenue Stream" (Select field)

### Airtable Relationships

1. **Clients ↔ Revenue Tracking**
   - Link field in both directions

2. **Weekly Goals ↔ Tasks**
   - Link field in both directions

3. **Revenue Streams ↔ Revenue Tracking**
   - Link field in both directions

---

## 📊 DASHBOARD SETUP

### Notion Dashboard

Create a new page with:

1. **Revenue Overview Section**
   - Embed Revenue Tracking database
   - Filter: This month
   - Group by: Revenue Stream

2. **Task Progress Section**
   - Embed Implementation Tasks database
   - Filter: This week
   - Group by: Status

3. **Client Pipeline Section**
   - Embed Clients database
   - Filter: Active + Prospect
   - Sort by: Monthly Revenue

### Airtable Dashboard

Create dashboard with:

1. **Revenue Overview**
   - Total MRR (summary field)
   - Monthly Revenue chart
   - Revenue by Stream pie chart

2. **Task Progress**
   - Tasks by Status chart
   - Completion % gauge
   - This Week tasks list

3. **Client Pipeline**
   - Active Clients count
   - Total MRR
   - Follow-ups needed list

---

## 🚀 QUICK START (5 Minutes)

### Fastest Setup: Notion

1. Create new page
2. Type `/table` → Create table
3. Copy structure from `notion_database_structure.md`
4. Add properties manually
5. Start adding data

### Fastest Setup: Airtable

1. Create new base
2. Import `implementation_tasks.csv`
3. Let Airtable auto-detect types
4. Adjust as needed
5. Start adding data

---

## 💡 PRO TIPS

### Notion Tips
- Use templates for recurring tasks
- Create database templates for new weeks
- Use rollups to calculate totals
- Set up reminders with dates

### Airtable Tips
- Use grid view for fast data entry
- Create saved filters
- Set up automations early
- Use mobile app for updates on the go

### Both Platforms
- Start simple, add complexity later
- Focus on data you'll actually use
- Update daily for best results
- Review weekly to stay on track

---

## 🆘 TROUBLESHOOTING

### Import Issues
- **CSV not importing:** Check file encoding (should be UTF-8)
- **Dates wrong:** Adjust date format in CSV
- **Select options missing:** Add them manually after import

### Relationship Issues
- **Links not working:** Ensure both tables have link fields
- **Data not showing:** Check filters in views

### Formula Issues
- **Formula errors:** Check field names match exactly
- **Not calculating:** Ensure field types are correct

---

## ✅ VERIFICATION

After setup, verify:

- [ ] All 6 databases/tables created
- [ ] All properties/fields added
- [ ] Relationships working
- [ ] Formulas calculating correctly
- [ ] Views displaying properly
- [ ] Sample data imported
- [ ] Can add new records
- [ ] Can update existing records
- [ ] Can filter and sort
- [ ] Dashboard showing summaries

---

**Your database is ready! Start tracking your revenue empire!** 🚀

**Questions? Refer to the structure documents for details.**
