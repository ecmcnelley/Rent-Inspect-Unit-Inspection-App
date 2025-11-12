# Rent Inspect System

A comprehensive web-based property inspection system for residential units. This single-page application allows property managers and inspectors to conduct thorough inspections, document findings, and generate professional reports.

## Features

- 🎨 **Customizable Branding** - Upload company logo, customize colors and header text
- 🏢 **Property Information** - Track property details, unit numbers, inspection type, and dates
- ⚠️ **Safety Inspection** - Document smoke and CO alarms with detailed tracking
- 🔌 **Appliance Tracking** - Record appliance conditions with brand, model, and serial numbers
- 🏠 **Room-by-Room Inspection** - Detailed inspection forms for bedrooms, bathrooms, kitchens, and more
- 📷 **Photo Documentation** - Attach photos to specific inspection items
- 📋 **Professional Reports** - Generate printable PDF reports
- 📧 **Email Integration** - Quick email sharing of inspection reports

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
