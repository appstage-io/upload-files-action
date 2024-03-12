
const core = require("@actions/core");
const path = require('node:path'); 
const axios = require("axios");
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');

const token = core.getInput('token');
const folder = core.getInput('folder');
const pattern = core.getInput('pattern');
const host = core.getInput('host') || 'https://www.appstage.io';

(async () => {
  try {
    const matchRegex = new RegExp(pattern, "g")
    const content = fs.readdirSync(folder, { withFileTypes: true });
    const fileList = content
      .filter(currentElement => currentElement.isFile())
      .filter((file) => file.name.match(matchRegex))
      .map(file => file.name);

    const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });

    let uploaded_files = []
    for(const file of fileList){
      const file_path = path.join(folder, file)
      console.log(`Uploading ${file_path}`)  

      const nextFile = fs.readFileSync(file_path);
      let formData = new FormData();
      formData.append("release_file[cloud_stored_file]", nextFile, file);
  
      const { data } = await instance.post(`${host}/api/live_builds`, formData,{
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
            'Authorization': `Bearer ${token}`
        }
      });
      console.log(`File ${data.display_name} uploaded`)  
      uploaded_files.push(data)
    }
    core.setOutput("files", uploaded_files);
  } catch (error) {
    core.setFailed(`File upload failed - ${error.message}`);
  }
})();
  