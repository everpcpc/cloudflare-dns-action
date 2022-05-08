/**
 * Create/Update CloudFlare DNS Record Action for GitHub
 */

const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function getCurrentRecordId(cli, recordName) {
  core.info('trying to get record list...');
  try {
    const res = await cli.get();
    core.info(JSON.stringify(res.data.result_info));
    res.data.result.forEach(record => {
      core.info(record.name);
      core.info(typeof(record.name));
      if (record.name === recordName) {
        return record.id;
      }
    });
  } catch (error) {
    core.setFailed(`failed getting record list: ${error.message}`);
    process.exit(1);
  }
  core.info(`record with name ${recordName} not found`);
  return null;
}

async function createRecord(cli, data) {
  const res = await cli.post('', data);
  core.info(JSON.stringify(res.data));
}

async function updateRecord(cli, id, data) {
  const res = await cli.put(id, data);
  core.info(JSON.stringify(res.data));
}

async function run() {
  try {
    const inputToken = core.getInput('token');
    const inputZone = core.getInput('zone');
    const inputType = core.getInput('type');
    const inputName = core.getInput('name');
    const inputContent = core.getInput('content');
    const inputTTL = core.getInput('ttl');
    const inputProxied = core.getInput('proxied');

    const cli = axios.create({
      baseURL: `https://api.cloudflare.com/client/v4/zones/${inputZone}/dns_records`,
      timeout: 3000,
    });
    cli.defaults.headers.common['Authorization'] = `Bearer ${inputToken}`;

    const oldRecordID = await getCurrentRecordId(cli, inputName);
    const data = {
      type: inputType,
      name: inputName,
      content: inputContent,
      ttl: Number(inputTTL),
      proxied: Boolean(inputProxied == "true"),
    };

    if (oldRecordID === null) {
      await createRecord(cli, data);
    } else {
      core.info(`record exists with ${oldRecordID}, updating...`);
      await createRecord(cli, oldRecordID, data);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
