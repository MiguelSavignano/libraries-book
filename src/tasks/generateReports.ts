require('dotenv').config();
import * as fs from 'fs-extra';
import { Parser } from 'json2csv';
import slugify from 'slugify';
import { orderBy } from 'lodash';
import { executeQuery } from '../graphql/execute';

const QUERY_NODEJS = `{
  reportsNodejs {
    name
    repositories {
      repository
      packageJSON
      packageLock
      versionSize
    }
  }
}`;

const QUERY_RUBY = `{
  reportsRuby {
    name
    repositories {
      repository
      gem
      gemfileLock
      versionSize
    }
  }
}`;

const writeCSV = (filePath: string, fields: string[], data: object) => {
  const parser = new Parser({ fields });
  return fs.outputFileSync(filePath, parser.parse(data));
};

async function run() {
  try {
    const {
      data: { reportsNodejs },
    } = await executeQuery(QUERY_NODEJS);

    reportsNodejs.forEach((report) => {
      const data = orderBy(report.repositories, ['versionSize'], ['desc']);

      writeCSV(
        `./reports/nodejs/${slugify(report.name.replace('/', '-'))}.csv`,
        ['repository', 'packageJSON', 'packageLock'],
        data,
      );
    });

    console.log(reportsNodejs.length);

    const {
      data: { reportsRuby },
    } = await executeQuery(QUERY_RUBY);

    reportsRuby.forEach((report) => {
      writeCSV(
        `./reports/ruby/${slugify(report.name)}.csv`,
        ['repository', 'gem', 'gemfileLock'],
        orderBy(report.repositories, ['versionSize'], ['desc']),
      );
    });
    console.log(reportsRuby.length);
  } catch (e) {
    console.error(e);
  }
}

run();
