# Couch-View jQuery Plugin

## Project Overview

**Couch-View** is a specialized jQuery plugin designed to map CouchDB views to HTML grids. It provides a lightweight, flexible solution for displaying JSON data from CouchDB (or any similar data source) in HTML tables with built-in features for pagination, sorting, and in-place editing.

### Key Features

- **HTML Agnostic**: Works with tables, divs, or any HTML structure for data layout
- **JSON Data Support**: Designed for CouchDB views but works with any JSON data source
- **Column Sorting**: Built-in sorting functionality using different CouchDB views
- **Pagination**: Full pagination support with configurable page sizes
- **JEditable Integration**: Compatible with JEditable plugin for in-place editing
- **Lightweight**: Under 3KB in size
- **Extensible**: Clean architecture allows subclassing of header/body/footer generation

## Architecture

The plugin follows a client-side MVC-like pattern:

### Core Components

1. **Grid Class**: Main controller that manages data loading, pagination, and UI state
2. **Table Renderer**: Handles HTML generation and data binding to DOM elements
3. **Pager**: Manages pagination controls and navigation
4. **Header Handler**: Manages column sorting and header interactions
5. **Data Loader**: AJAX-based data fetching from CouchDB views

### Data Flow

1. Plugin initializes with CouchDB view URL and configuration
2. Initial data load via JSONP to CouchDB view endpoint
3. HTML template populated with data using CSS class-based field mapping
4. User interactions (paging, sorting) trigger new data loads
5. DOM updates reflect new data state

## Directory Structure

```
/
├── README.textile          # Project documentation and usage guide
├── index.html             # Demo page with examples and documentation
├── jquery.couch-view.js   # Main plugin source code
└── .git/                  # Git repository metadata
```

## Key Files

### `jquery.couch-view.js`
The main plugin file containing:
- Grid constructor and state management
- AJAX data loading with JSONP support
- DOM manipulation and template rendering
- Event handlers for pagination and sorting
- JEditable integration for in-place editing

### `index.html`
Comprehensive demo and documentation page featuring:
- Live examples with different configurations
- Step-by-step usage guide
- CSS class reference tables
- Integration examples with JEditable

### `README.textile`
Detailed documentation in Textile format covering:
- Feature overview and benefits
- HTML structure requirements
- Configuration options
- Integration patterns

## CSS Class Conventions

### Data Binding Classes
- `.grid-test`: Applied to container element to initialize plugin
- `.field`: Marks data cells, `id` attribute maps to JSON field names
- `.data-row`: Template row that gets cloned for each data record
- `.data-body`: Container for data rows
- `.header-row`: Header row containing column definitions

### Pagination Classes
- `.pager-first`: First page navigation
- `.pager-prev-page`: Previous page navigation
- `.pager-prev`: Previous record navigation
- `.pager-next`: Next record navigation
- `.pager-next-page`: Next page navigation
- `.pager-last`: Last page navigation
- `.pager-page`: Displays current page number
- `.pager-page-total`: Displays total page count

### Interaction Classes
- `.data-sort`: Makes column headers sortable
- `.edit`: Marks fields as editable (requires JEditable)

## Dependencies

### Required
- **jQuery**: Version 1.3.1+ (tested with 1.4.2)

### Optional
- **JEditable**: For in-place editing functionality
- **CouchDB**: Primary data source (though any JSON API works)

## Configuration Options

### Plugin Options
```javascript
$(".grid-test").couchview({
    url: "http://server:port/db/_design/doc/_view/",  // CouchDB view URL
    limit: 10,        // Records per page (default: 10)
    key: 'id',        // Default sort field (default: 'id')
    row_mod: 2        // Row styling modulo (default: 2)
});
```

## Development Workflow

This is a client-side JavaScript plugin with no build process. Development workflow:

1. **Edit**: Modify `jquery.couch-view.js` directly
2. **Test**: Open `index.html` in browser to test changes
3. **Document**: Update examples in `index.html` and `README.textile`

### Testing
- Open `index.html` in web browser
- Requires local or remote CouchDB instance for full functionality
- Examples use hardcoded CouchDB URLs that may not be accessible

## Common Tasks

### Adding New Pagination Controls
1. Add HTML element with appropriate pager class (see CSS conventions)
2. No JavaScript changes needed - event handlers auto-attach

### Creating Custom Field Renderers
1. Extend `$.fn.couchview.table` function
2. Override field processing logic in the data binding loop
3. Maintain `id` attribute to field name mapping

### Adding New Sort Views
1. Create new CouchDB view with desired sort field as key
2. Add column header with `data-sort` class and `id` matching view name
3. Plugin automatically uses view name for sorting

### Integration with Other Plugins
- Add CSS classes to elements as needed by external plugins
- JEditable integration already implemented as example
- Plugin preserves DOM structure for compatibility

## Important Context

### Gotchas and Limitations

1. **Hardcoded URLs**: Demo examples contain hardcoded CouchDB URLs that may not be accessible
2. **JSONP Dependency**: Uses JSONP for cross-origin requests to CouchDB
3. **View-per-Sort**: Requires separate CouchDB view for each sortable column
4. **No Build Process**: Direct JavaScript file editing required
5. **jQuery Version**: Written for jQuery 1.3/1.4 era - may need updates for modern jQuery

### Data Structure Requirements

Expects CouchDB view response format:
```json
{
    "total_rows": 24,
    "offset": 0,
    "rows": [
        {
            "id": "doc_id",
            "key": "sort_key",
            "value": {
                "_id": "doc_id",
                "_rev": "revision",
                "field1": "value1",
                "field2": "value2"
            }
        }
    ]
}
```

### Legacy Considerations

- Uses older JavaScript patterns (pre-ES6)
- Alert-based error handling in places
- Inline event handlers rather than modern event delegation
- Mixed naming conventions (`couchview` vs `couch-view` vs `gridiron`)

This plugin represents an early approach to client-side data grids and CouchDB integration, designed for simplicity over modern development practices.