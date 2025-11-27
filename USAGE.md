# Usage Guide

## Remote Usage (Like nest new)

### Option 1: Using npx (No Installation Required)

```bash
npx create-backend my-app
```

This downloads and runs the latest version without installing it globally.

### Option 2: Using npm create

```bash
npm create backend my-app
```

This is equivalent to `npx create-backend my-app`.

### Option 3: Global Installation

```bash
npm install -g create-backend
create-backend my-app
```

### Option 4: From Git Repository (Without Publishing)

If you haven't published to npm, you can use it directly from GitHub:

```bash
npx github:fighteros/NestOps my-app
```

Or using the full git URL:

```bash
npx https://github.com/fighteros/NestOps.git my-app
```

## Local Development

If you're developing the CLI tool itself:

```bash
# Clone the repository
git clone https://github.com/fighteros/NestOps.git
cd NestOps

# Install dependencies (if any)
npm install

# Run the script
npm run create-backend my-app
```

## Publishing to npm

1. **Update package.json:**
   - Set a unique package name
   - Update repository URL
   - Update version number

2. **Login to npm:**
   ```bash
   npm login
   ```

3. **Publish:**
   ```bash
   npm publish
   ```

4. **After publishing, users can use:**
   ```bash
   npx create-backend my-app
   ```

## Making it Work from Git

To use directly from a git repository without publishing:

1. Make sure your repository is public (or user has access)
2. Users can run:
   ```bash
   npx github:username/repo-name my-app
   ```

Note: The repository must have a `package.json` with a `bin` field pointing to the script.

