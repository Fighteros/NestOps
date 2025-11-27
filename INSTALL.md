# Installation & Remote Usage

## Option 1: Using npx (Recommended - No Installation)

Use it directly without installing anything:

```bash
npx create-backend my-app
```

Or using npm create:

```bash
npm create backend my-app
```

This will:
- Download the latest version
- Run it immediately
- Create your app
- Clean up after

## Option 2: Global Installation

Install it globally so you can use it from anywhere:

```bash
npm install -g create-backend
create-backend my-app
```

## Option 3: From Git Repository (Without Publishing to npm)

If you haven't published to npm yet, you can use it directly from GitHub:

```bash
npx github:fighteros/NestOps my-app
```

Or using the full git URL:

```bash
npx https://github.com/fighteros/NestOps.git my-app
```

## Option 4: Publish to npm

To make it available to everyone via `npx create-backend`:

1. **Update package.json:**
   - Change `"name"` to your desired package name (must be unique on npm)
   - Update `"repository"` URL
   - Set `"private": false`
   - Update version number

2. **Login to npm:**
   ```bash
   npm login
   ```

3. **Publish:**
   ```bash
   npm publish
   ```

4. **After publishing, anyone can use:**
   ```bash
   npx create-backend my-app
   ```

## Local Development

If you're developing the CLI tool itself:

```bash
# Clone the repository
git clone <repository-url>
cd Nestops

# Install dependencies (if any)
npm install

# Run the script locally
npm run create-backend my-app
```

## Testing Before Publishing

Test locally by linking:

```bash
# In the project directory
npm link

# Now you can use it from anywhere
create-backend my-app
```

To unlink:
```bash
npm unlink -g create-backend
```

