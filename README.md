# Rent Inspect System

A comprehensive web-based property inspection system for residential units. This single-page application allows property managers and inspectors to conduct thorough inspections, document findings, and generate professional reports.

## Features

### 🎨 Step 1: Customization & Property Information
- **Logo Upload** - Upload company logo for branded reports
- **Color Customization** - Customize primary, secondary, and dark colors throughout the system
- **Branding Text** - Customize header title and footer branding text
- **Property Database** - 16 pre-configured properties with auto-population
- **Auto-Fill** - Selecting a property automatically populates:
  - Multiple property addresses (dropdown)
  - City, State, ZIP
  - Inspector names (dropdown)
  - Inspector email addresses
- **Custom Entry** - Option to manually enter custom property information
- **Property Details** - Track unit number, inspection date, notice served date, inspection type

### 📐 Step 2: Unit Layout Configuration
Dynamically configure which rooms and items to inspect:
- **Entry** - Yes/No
- **Kitchen** - Yes/No
- **Dining Room** - Yes/No
- **Living Room** - Yes/No
- **Number of Bedrooms** - 0-10
- **Number of Bathrooms** - 0-10
- **Laundry Room** - Yes/No
- **Number of Hallways/Stairways** - 0-5
- **Outside Deck/Patio** - Yes/No
- **Number of Smoke Alarms** - 0-20 (generates dynamic inspection forms)
- **Number of Appliances** - 0-20 (generates dynamic inspection forms)

### ⚠️ Step 3: Safety Inspection
Dynamic smoke/CO alarm tracking with:
- Location
- Type (Smoke/CO/Combo)
- Power Source (Hardwired/Battery/Both)
- Alert Type (Audible/Visual/Both)
- Interconnected (Yes/No checkbox)
- Condition (Good/Fair/Poor/N/A)
- Comments with photo upload capability

### 🔌 Step 4: Appliance Inspection
Comprehensive appliance tracking with:
- **Location dropdown** (populated from configured rooms)
- **Type selection** (Refrigerator, Stove/Range, Range Hood, Dishwasher, Microwave, Washer, Dryer, Air Conditioner, Water Heater, Garbage Disposal, Other)
- **Brand, Model, Serial Number**
- **Condition** (Good/Fair/Poor/N/A)
- **Special Water Heater Fields**:
  - Temperature Setting
  - Plumbing Condition
  - Leaks checkbox
  - TPM Valve checkbox
  - Proper Gas Exhaust checkbox
  - Discharge Pipe checkbox
  - Drain Pan checkbox
- **Comments** (auto-reveal for Fair/Poor conditions)
- **Photo upload** for each appliance with comments

### 🏠 Step 5: Room-by-Room Inspection
Automatically generates inspection forms for all configured rooms with room-specific sections:

#### All Rooms Include:
- **Housekeeping** - Clean/Needs Cleaning/Unacceptable/N/A
- **Door** - Quantity, Type (Wood/Metal/Fiberglass/Glass/Sliding/Composite), Dimensions, Locks function checkbox, Condition
- **Threshold** - Condition assessment
- **Flooring** - Type selection, Condition
- **Walls/Ceiling** - Condition assessment
- **Bullnose/Corners** - Condition assessment
- **Outlets** - Loose checkbox, Functioning checkbox, Condition
- **Light Fixtures** - Condition, Functioning checkbox
- **Light Bulbs** - All working checkbox
- **Light Switches** - Functioning checkbox

#### Kitchen-Specific:
- **GFI Outlets** - Loose checkbox, Functioning checkbox, Tested checkbox
- **Sink** - Condition, Faucets working, Drains properly
- **Sink Plumbing** - Leaks checkbox, Condition
- **Cabinets** - Doors function, Secure mounting, Condition
- **Shelves** - Secure mounting, Condition
- **Drawers** - Function properly, Condition
- **Drawer Tracks** - Condition
- **Mold** - Present checkbox with comments

#### Bathroom-Specific:
- **GFI Outlets** - Full GFI testing
- **Sink** - Full sink inspection
- **Toilet** - Caulking condition, Flushes properly, Tank functions, Plumbing leaks
- **Tub/Shower** - Condition, Caulking intact, Drains properly, Fixtures work, Plumbing condition
- **Medicine Cabinet/Mirror** - Secure, Condition
- **Cabinets, Shelves, Drawers** - Full inspection
- **Mold** - Presence tracking

#### Bedroom-Specific:
- **Closet** - Optional section with door, opening, shelving inspection
- **Windows** - Quantity, Open/close properly, Locks function, Condition
- **Window Coverings** - Present, Functional, Condition
- **Window Sills** - Condition
- **Window Screens** - Present, Intact, Condition
- **Heater** - Functions properly, Adequate heat, Condition

#### Living/Dining Room-Specific:
- **Windows** - Complete window inspection
- **Heater** - Full heater inspection
- **Thermostat** - Functions properly, Accurate, Condition

#### Outside Deck/Patio:
- **Surface** - Material, Level, Secure, Condition
- **Railing** - Height, Secure, Balusters spacing, Condition

### 📷 Photo Documentation
- **Smart Photo Buttons** - Automatically generated for any field with comments
- **Multiple Photos** - Upload multiple photos per item
- **Photo Preview** - View and remove photos before generating report
- **Context Preservation** - Photos linked to specific items and comments
- **Mobile Camera** - Optimized for mobile device camera capture

### 📋 Step 6: Report Generation
- **Comprehensive Reports** - All inspection data formatted professionally
- **Print Optimization** - Perfect formatting for PDF generation
- **Email Integration** - Pre-formatted email with dynamic subject line
- **Photo Inclusion** - All uploaded photos included in report
- **Organized Sections** - Safety, Appliances, Room-by-Room with clear headers
- **Branding** - Company logo and branding included

### 💾 Data Management
- **Auto-Save** - Inspection data automatically saved to browser localStorage
- **Load Saved** - Resume interrupted inspections
- **Storage Warning** - Alerts when photo storage limit approached
- **Data Persistence** - All data preserved between sessions

### Pre-Loaded Properties
The system comes pre-configured with 16 properties:
- **Park Village 1 & 2** (Selah, WA)
- **Huntington Court 1 & 2** (Ellensburg, WA)
- **Windsor Park** (Ellensburg, WA)
- **Hampton Court** (Ellensburg, WA)
- **Spurling Court** (Ellensburg, WA)
- **Berg Rose** (Leavenworth, WA)
- **Cashmere Park** (Cashmere, WA)
- **Pennsylvania Place** (Roslyn, WA)
- **Westview Villa** (Cle Elum, WA)
- **Chestnut Grove** (Moses Lake, WA)
- **Vineyard Apartments** (Grandview, WA)
- **Vineyard 2 Apartments** (Grandview, WA)
- **Edison Park** (Sunnyside, WA)
- **Paragon Apartments** (Sunnyside, WA)
- **Valley Commons 1 Apartments** (Sunnyside, WA)
- **Valley Commons 2 Apartments** (Sunnyside, WA)

## Deployment to GitHub Pages

### Option 1: Using GitHub Web Interface

1. **Create a new repository** on GitHub
2. **Upload the `index.html` file** to the repository
3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to Pages section
   - Select "main" branch as source
   - Click Save
4. Your site will be available at: `https://[username].github.io/[repository-name]/`

### Option 2: Using Git Command Line

```bash
# Clone your repository
git clone https://github.com/[username]/[repository-name].git
cd [repository-name]

# Add the index.html file
cp /path/to/index.html .

# Commit and push
git add index.html
git commit -m "Add rent inspection system"
git push origin main

# Enable GitHub Pages in repository settings (via web interface)
```

## Usage

1. **Customize Your Report**: Start by uploading your logo and customizing colors
2. **Enter Property Information**: Fill in property details, unit number, and inspection date
3. **Safety Inspection**: Document all smoke and CO alarms
4. **Appliances**: Record details of all appliances
5. **Room Inspections**: Add rooms and conduct detailed inspections
6. **Generate Report**: Review and print/email your professional report

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers supported

## Technical Details

- **Single File Application**: All HTML, CSS, and JavaScript in one file
- **No Dependencies**: No external libraries or frameworks required
- **Local Storage**: All data stored in browser (no server required)
- **Print Optimized**: Professional formatting for PDF generation

## File Structure

```
.
├── index.html          # Main application file
└── README.md          # This file
```

## Customization

The application allows customization of:
- Company logo
- Header title
- Branding footer text
- Primary, secondary, and dark colors
- Inspection categories and fields

## License

This project is provided as-is for property inspection purposes.

## Support

For issues or questions, please open an issue in the GitHub repository.
