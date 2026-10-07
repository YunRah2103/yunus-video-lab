import {auditY003CircuitCoverage} from './coverage';

const report = auditY003CircuitCoverage();
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
