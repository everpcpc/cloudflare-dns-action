/**
 * Create/Update CloudFlare DNS Record Action for GitHub
 */

const core = require('@actions/core');
const axios = require('axios');

async function getCurrentRecordId(cli, recordName) {
  try {
    const res = await cli.get();
    core.info(JSON.stringify(res.data.result_info));
    for (let record of res.data.result) {
      if (record.name === recordName) {
        return record.id;
      }
    }
  } catch (error) {
    core.setFailed(`failed getting record list: ${error.message}`);
    process.exit(1);
  }
  return null;
}

async function createRecord(cli, data) {
  try {
    const res = await cli.post('', data);
    return res.data.result;
  } catch (error) {
    core.setFailed(`failed creating record: ${error.message}`);
    process.exit(1);
  }
}

async function updateRecord(cli, id, data) {
  try {
    const res = await cli.put(id, data);
    return res.data.result;
  } catch (error) {
    core.setFailed(`failed updating record: ${error.message}`);
    process.exit(1);
  }
}

async function run() {
  try {
    const inputToken = core.getInput('token');
    const inputEmail = core.getInput('email');
    const inputApiKey = core.getInput('apiKey');
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
    if (inputToken) {
      cli.defaults.headers.common['Authorization'] = `Bearer ${inputToken}`;
    } else {
      cli.defaults.headers.common['X-Auth-Email'] = inputEmail;
      cli.defaults.headers.common['X-Auth-Key'] = inputApiKey;
    }

    const oldRecordID = await getCurrentRecordId(cli, inputName);
    const data = {
      type: inputType,
      name: inputName,
      content: inputContent,
      ttl: Number(inputTTL),
      proxied: Boolean(inputProxied == "true"),
    };

    let result;
    if (oldRecordID === null) {
      result = await createRecord(cli, data);
    } else {
      core.info(`record exists with ${oldRecordID}, updating...`);
      result = await updateRecord(cli, oldRecordID, data);
    }
    core.setOutput('record_id', result.id);
    core.setOutput('name', result.name);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
