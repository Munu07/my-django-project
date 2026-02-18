
# Project Memory: Java Concept & Logic Practice Platform

## Project Overview
A web-based platform for learning Java concepts, logic building, and OOP principles.
Frontend: HTML, CSS, JavaScript.
Backend: Django (Python) for running Java code and serving dynamic content.

## Architecture
- **HTML Pages:**
  - `index.html`: Homepage with 4 main sections (Fundamentals, Logic, OOP, Advanced).
  - `section.html`: Intermediate page using the standard sidebar layout. Lists topics for a selected section and prompts user selection.
  - `topic.html`: Theory view with a persistent sidebar for topic switching. Uses Prism.js for syntax highlighting.
  - `practice.html`: Practice view for logic topics. Sidebar shows 20 programs. Features an IDE-like textarea, logic breakdown, solution with Prism.js highlighting, and animation panel.
- **Data Source:** `data.json` - single source of truth for all sections, topics, and programs.
- **Styling:** `style.css` - Flexbox-based sidebar layout, responsive design, dark-themed code blocks for IDE feel.
- **Logic:** `script.js` - Centralized functions for fetching data, populating sidebars, and managing practice state.

## State Management
- Routing is handled via URL parameters: `section`, `topic`.
- Sidebars are context-aware (Theory vs. Practice).

## Conventions
- **Ids:** Section IDs correspond to keys in `data.json` (e.g., `fundamentals`, `logic`).
- **Navigation:** Query parameters (`?section=...&topic=...`) are used to maintain state across pages without a router.
- **Animations:** Animations are triggered by `showAnimation()` and rendered in `#animation-panel`. Future specific animations should be modularized.

## Key Files
- `data.json`: The source of truth for all content. Contains 4 main sections (Fundamentals, Logic, OOP, Advanced). The Logic section contains 20 distinct program slots per topic.
- `script.js`: Core controller logic. Handles routing, dynamic content loading, sidebar population, homepage initialization (`loadHomepage`), and the animation framework.
- `practice.html`: The complex view for the "Programming Logic" section. Features IDE-like textarea, logic visualization, and a dedicated animation panel.

## Troubleshooting
- **Data Loading Issues**: If `data.json` fails to load (blank homepage), it is likely a CORS issue when opening via `file://`. Use a local server (e.g., `npx serve .` or VS Code Live Server).

## Content Structure
- **Fundamentals & OOP & Advanced:** Topic-based theory, syntax, examples, and logic breakdown.
- **Logic Practice:** 20 specific programs per topic. Each program has Statement, Input/Output, Sample Code, Logic Steps, and Animation Type.

## Technical Implementation Details
### Syntax Highlighting
- **Prism.js**: Integrated for high-quality Java code highlighting.
- Used in `topic.html` and `practice.html`.
- Triggered dynamically via `Prism.highlightAll()` or `Prism.highlightElement(elem)` in `script.js` after content updates.

### Routing
State is maintained via URL parameters:
- `?id=...` for section selection.
- `?section=...&topic=...` for specific content navigation.
- Django handles URL routing via `masterclass/urls.py` and `learning/urls.py`. API endpoints are prefixed with `/api/`.

### Sidebars
Sidebars are generated dynamically using `populateSidebar(sectionId, currentTopicId, type)`. 
- `type='topics'`: Displays all topics in a section (used in `topic.html`).
- `type='programs'`: Displays 20 programs for a specific logic topic (used in `practice.html`).

### Animations
Animations are implemented in `script.js` as `async` functions:
- `showAnimation()`: Entry point that sets up the animation panel and triggers specific logic.
- `runFactorialAnim`, `runFibonacciAnim`, `runBubbleSortAnim`: Specific logic-driven visualizations using async/await and `sleep`.
- `sleep(ms)`: Helper for timing steps.
- **Visuals**: Uses `.anim-box` for simple numbers and `.array-box` (with height mapping) for sorting.
- **Feedback**: `anim-step-desc` provides textual explanation of what the code is doing at each step.

### Code Display
- **Prism.js**: Integrated via CDN. `Prism.highlightAll()` or `Prism.highlightElement()` is called after dynamic content injection.
- **IDE Style**: Practice page uses a dark-themed textarea (`.ide-textarea`) and Prism's `tomorrow` theme for solutions.

### UI & Styling
- **Prism.js**: Used for syntax highlighting of Java code blocks. Integrated via CDN.
- **Responsive Sidebar**: The sidebar is fixed on the left for desktop views and hidden/accessible via navigation on smaller screens.
- **Theme**: Light-themed with blue accents, while code areas use a dark theme (`prism-tomorrow`) for an IDE-like feel.
- **Data Driven**: Content is entirely dynamic, loaded from `data.json`.
