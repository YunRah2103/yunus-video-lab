import {runY004AgentCFixtureChecks} from './contractChecks';
import {runY004FVisualCorrectionChecks} from '../guides/correctionChecks';
const report=runY004AgentCFixtureChecks();
console.log(JSON.stringify({baseline:report,FVisualCorrections:runY004FVisualCorrectionChecks()},null,2));
