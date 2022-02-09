## Configure

Local environment

```
npm install
```

Set GITHUB_TOKEN

```
.env.example > .env
```

## Github action

Edit `.github/workflows/report.yaml` and set `GITHUB_LOGIN`

## Start graphql server

```
npm run dev
```

## For all repositories dowload dependencies files

```
npx ts-node src/tasks/fetchAllPackagesVersionsParse.ts
```

## Generate reports in CSV

```
npx ts-node src/tasks/generateReports.ts
```
