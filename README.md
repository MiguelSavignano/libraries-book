# Libraries book

Generate reports in CSV for all Github repositories and the libraries versions. Using Github actions you can store the reports in the same repositorie.

Example:

![image](https://user-images.githubusercontent.com/6641863/153316035-4d73c984-2a89-4761-9dee-fbe83fbad23f.png)

## Configure

Local environment

```
npm install
```

Set GITHUB_TOKEN

```
.env.example > .env
```

Libraies to analize:

- Nodejs: ./src/data-sources/npmPacakges/allPackages.json
- Ruby: ./src/data-sources/npmPacakges/allGems.json

## Github action

Edit `.github/workflows/report.yaml` and set `GITHUB_LOGIN`

The reports will be saved in the git repository in the reports folder

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
