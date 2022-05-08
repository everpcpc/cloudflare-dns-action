/**
 * Create/Update CloudFlare DNS Record Action for GitHub
 */

const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function getCurrentRecordId(cli, name) {
  const res = await cli.get();
  core.info(res.data);
  res.data.result.forEach(record => {
    if (record.name == name) {
      return record.id;
    }
  });
  return null;
}

async function createRecord(cli, data) {
  const res = await cli.post('', data);
  core.info(res.data);
}

async function updateRecord(cli, id, data) {
  const res = await cli.put(id, data);
  core.info(res.data);
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
