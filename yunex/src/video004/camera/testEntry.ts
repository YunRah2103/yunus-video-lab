import {runY004AgentCFixtureChecks} from './contractChecks';
const report=runY004AgentCFixtureChecks();
console.log(JSON.stringify(report,null,2));
