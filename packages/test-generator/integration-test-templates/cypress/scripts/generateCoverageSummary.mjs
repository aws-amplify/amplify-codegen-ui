/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';

import coverageJSON from '../../coverage/coverage-final.json' assert { type: 'json' };

// TODO: move this to root project as env vars.
const MIN_COVERAGE_THRESHOLDS = {
  lines: 70,
  statements: 70,
  functions: 65,
  branches: 50,
};

const map = libCoverage.createCoverageMap();
const summary = libCoverage.createCoverageSummary();

const jsonCoverageMap = libCoverage.createCoverageMap(coverageJSON);
map.merge(jsonCoverageMap);

map.files().forEach((f) => {
  const fc = map.fileCoverageFor(f);
  const s = fc.toSummary();

  summary.merge(s);
});

const context = libReport.createContext({
  defaultSummarizer: 'nested',
  coverageMap: map,
});
const report = reports.create('text');

// call execute to synchronously create and write the report to disk
report.execute(context);

// print combined summary of integ test coverage
console.log(summary);

Object.entries(MIN_COVERAGE_THRESHOLDS).forEach(([coverage, threshold]) => {
  if (summary[coverage].pct <= threshold) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      `Failed to meet ${coverage.toLocaleUpperCase()} threshold: ${summary[coverage].pct}% < ${threshold}%`,
    );
    process.exit(1);
  }
});
