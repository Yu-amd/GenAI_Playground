# GenAI Playground

A modern web application for exploring and interacting with AI models and blueprints, built with React, TypeScript, and Vite.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Standard Installation](#standard-installation)
  - [WSL2 Installation (Windows)](#wsl2-installation-windows)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [Maintainer](#maintainer)
- [License](#license)
- [Blueprint Catalog Assets](#blueprint-catalog-assets)

## Features

- **Models Catalog**: Browse and explore different AI models
- **Blueprints**: Interactive AI application templates including ChatQnA, CodeGen, and more
- **GPU Cloud Integration**: Cloud computing resources for AI workloads
- **Real-time Interaction**: Chat interfaces and code generation tools

## Screenshots

### Landing Page
![GenAI Playground Landing Page](./screenshots/playground_landing.png)
*Modern landing page with navigation to Models, Blueprints, and GPU Cloud sections*

### Models Section
![Models Catalog](./screenshots/modelcatalog.png)
*Comprehensive catalog of AI models with filtering and search capabilities*

![Model Detail Card](./screenshots/modelcard.png)
*Detailed model information with specifications and capabilities*

![Model Interaction Interface](./screenshots/model_interact.png)
*Interactive chat interface for testing AI models with real-time responses*

### Blueprints Section
![Blueprints Catalog](./screenshots/blueprint_catalog.png)
*Collection of AI application blueprints including ChatQnA, CodeGen, and more*

![Blueprint Detail Card](./screenshots/blueprint_card.png)
*Detailed blueprint information with architecture and use cases*

![AIMs Tab](./screenshots/AIMs.png)
*AI Model Integration and Management System (AIMs) showing models and functional microservices*

### Functional Microservices
![Functional Service Overview](./screenshots/func_microservice_overview.png)
*Overview of functional microservices with detailed descriptions and capabilities*

![Functional Service Interaction](./screenshots/func_microservice_interact.png)
*Interactive interface for testing functional microservices*

![Functional Service Code](./screenshots/func_microservice_code.png)
*Code generation and API integration examples for functional microservices*

### GPU Cloud
![GPU Cloud Interface](./screenshots/gpucloud.png)
*GPU Cloud management interface for AI workload deployment and monitoring*

## Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Git

## Getting Started

### Standard Installation

#### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd ih-mockup-demo
```

#### 2. Install Dependencies
```bash
npm install
```

**Note**: If you encounter any missing icon dependencies, you may need to install react-icons:
```bash
npm install react-icons
```

#### 3. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### 4. Alternative Port (if 5173 is busy)
```bash
npm run dev -- --port 3000
```

### WSL2 Installation (Windows)

If you're running Windows with WSL2, follow these specific instructions:

#### 1. Install WSL2 (if not already installed)
```powershell
# In Windows PowerShell as Administrator
wsl --install
```

#### 2. Install Node.js in WSL2
```bash
# Update package list
sudo apt update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### 3. Install Git in WSL2
```bash
sudo apt install git
```

#### 4. Clone and Run the Project
```bash
# Navigate to your preferred directory (recommended: WSL2 file system)
cd ~/Desktop
git clone <your-github-repo-url>
cd ih-mockup-demo

# Install dependencies
npm install

# Start the development server
npm run dev
```

#### 5. Access the Application
- **Primary**: Open `http://localhost:5173` in your Windows browser
- **Alternative**: If localhost doesn't work, use the WSL2 IP address:
  ```bash
  # Get WSL2 IP address
  ip addr show eth0 | grep "inet\b" | awk '{print $2}' | cut -d/ -f1
  ```
  Then access: `http://<WSL2-IP>:5173`

#### 6. WSL2-Specific Tips

**File System Performance:**
- ✅ **Best**: Clone the project inside WSL2 file system (`/home/username/`)
- ❌ **Avoid**: Cloning in Windows file system (`/mnt/c/`) as it can be slower

**VS Code Integration:**
1. Install the "Remote - WSL" extension in VS Code
2. Open VS Code in WSL2: `code .` (from the project directory)
3. This gives you full IDE features while working in the Linux environment

**If localhost doesn't work:**
```bash
# Use host flag to bind to all interfaces
npm run dev -- --host 0.0.0.0
```

**Port Forwarding (if needed):**
```powershell
# In Windows PowerShell as Administrator
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=<WSL2-IP>
```

**Troubleshooting:**
```bash
# Fix npm permissions if needed
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Restart WSL2 if needed (in Windows PowerShell as Administrator)
wsl --shutdown
wsl
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable React components
├── pages/         # Page components
├── assets/        # Static assets (images, etc.)
├── data/          # Data files
└── App.tsx        # Main application component
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Heroicons
- React Icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Maintainer

**Yu Wang** - [yu.wang6@amd.com](mailto:yu.wang6@amd.com)

For questions, issues, or contributions related to this project, please contact the maintainer.

## License

[Your License Here]

## Blueprint Catalog Assets

The Blueprint Catalog mirrors the Model Catalog structure and provides a robust, extensible way to manage AI application blueprints. Below are the key assets and how to use them:

### 1. Blueprint Schema
- **Location:** `src/aim/blueprint_catalog_schema.json`
- **Purpose:** Defines the JSON/YAML schema for blueprint catalog entries. Use this for validation, IDE autocompletion, and documentation.

### 2. Blueprint Loader
- **Location:** `src/utils/blueprintLoader.ts`
- **Purpose:** Loads blueprint data from generated TypeScript or YAML files, similar to `modelLoader.ts`.
- **Usage:**
  - `loadBlueprintData(blueprintId: string): Promise<BlueprintData | null>`
  - `loadAllBlueprints(): Promise<BlueprintCatalogItem[]>`

### 3. Generated Blueprint Data
- **Location:** `src/utils/generatedBlueprintData.ts`
- **Purpose:** Auto-generated TypeScript file containing all blueprint data, built from YAML files. Do not edit manually.
- **Regenerate:** Run `npm run generate-blueprint-data` (see below).

### 4. Blueprint Data Generator Script
- **Location:** `scripts/generateBlueprintData.ts`
- **Purpose:** Reads all YAML files in `src/aim/blueprints/` and generates `generatedBlueprintData.ts`.
- **Usage:**
  - `npm run generate-blueprint-data` (add this to your package.json scripts if not present)

### 5. Blueprint Data Validator
- **Location:** `scripts/validateBlueprintData.ts`
- **Purpose:** Validates blueprint data structure, required fields, asset existence, and YAML compliance.
- **Usage:**
  - `npx tsx scripts/validateBlueprintData.ts`

### 6. Blueprint Unit Tests
- **Location:**
  - `src/tests/BlueprintDetail.test.tsx` (detail page)
  - `src/tests/BlueprintsCatalog.test.tsx` (catalog page)
- **Purpose:** Ensures UI and logic for blueprints are robust and match the Model Catalog experience.
- **Usage:**
  - `npm test` or `npx vitest`

### 7. Blueprint YAML Files
- **Location:** `src/aim/blueprints/`
- **Purpose:** Source of truth for blueprint metadata. Each YAML file must conform to the schema.
- **Example:** See `src/aim/blueprints/chatqna.yaml` for a complete example.

### 8. Adding/Editing Blueprints
- Add a new YAML file to `src/aim/blueprints/` following the schema.
- Run `npm run generate-blueprint-data` to update the generated data.
- Run the validator and tests to ensure correctness.

### 9. Regeneration & Validation Workflow
1. **Edit or add YAMLs:** `src/aim/blueprints/*.yaml`
2. **Regenerate TS data:** `npm run generate-blueprint-data`
3. **Validate:** `npx tsx scripts/validateBlueprintData.ts`
4. **Test:** `npm test` or `npx vitest`

### 10. Blueprint Catalog Conversion & Schema Validation
- **Location:**
  - Conversion: `scripts/convertToBlueprintCatalog.ts`
  - Schema Validation: `scripts/validateBlueprintCatalog.ts`
- **Purpose:**
  - Conversion: Aggregates all blueprint YAML files into a single catalog YAML file.
  - Schema Validation: Validates the catalog YAML/JSON file against the JSON schema for structure and content.
- **Usage:**
  - **Convert individual YAMLs to catalog:**
    ```bash
    npm run convert-blueprints
    # Options:
    #   --input-dir <dir>   # Directory of blueprint YAMLs (default: src/aim/blueprints)
    #   --output <file>     # Output catalog file (default: src/aim/blueprint-catalog.yaml)
    #   --validate          # Validate after conversion
    ```
  - **Validate catalog against schema:**
    ```bash
    npm run validate-blueprint-catalog
    # Options:
    #   --catalog <file>    # Path to catalog YAML/JSON (default: src/aim/blueprint-catalog.yaml)
    #   --schema <file>     # Path to schema (default: src/aim/schemas/blueprint_catalog.schema.json)
    ```

---

## Model Catalog Validation

- **Validate a Single Model YAML**
  ```bash
  python3 validate_model_yaml.py models/<model-filename>.yaml
  ```
- **Validate All Model YAMLs**
  ```bash
  python3 validate_model_yaml.py --all
  ```

## Blueprint Catalog Validation (Node/TypeScript)

- **Validate the full blueprint catalog YAML/JSON against the schema**
  ```bash
  npm run validate-blueprint-catalog
  # Options:
  #   --catalog <file>    # Path to catalog YAML/JSON (default: src/aim/blueprint-catalog.yaml)
  #   --schema <file>     # Path to schema (default: src/aim/schemas/blueprint_catalog.schema.json)
  ```
- **Convert all blueprint YAMLs to a single catalog file**
  ```bash
  npm run convert-blueprints
  # Options:
  #   --input-dir <dir>   # Directory of blueprint YAMLs (default: src/aim/blueprints)
  #   --output <file>     # Output catalog file (default: src/aim/blueprint-catalog.yaml)
  #   --validate          # Validate after conversion
  ```

For more details, see the comments in each script and the schema file. The Blueprint Catalog is designed to be extensible and maintainable, just like the Model Catalog.
