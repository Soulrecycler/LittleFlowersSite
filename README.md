This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build Static Export

This project is configured for static export (`output: "export"`) so it can be hosted on Firebase Hosting.

```bash
npm run build
# Windows PowerShell fallback:
npm.cmd run build
```

Build output is generated in `out/`.

## Firebase Hosting Deployment

1. Install Firebase CLI (already done once on this machine):

```bash
npm.cmd install -g firebase-tools
```

2. Login from your local interactive terminal:

```bash
firebase login
# or in PowerShell if policy blocks scripts:
firebase.cmd login
```

3. Set your Firebase project id in `.firebaserc`:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

4. Deploy:

```bash
firebase deploy
# or
firebase.cmd deploy
```

Your hosting config is in `firebase.json` and serves the `out/` directory.
