# Appstage.io Upload Files Github Action

![GitHub Release](https://img.shields.io/github/v/release/appstage-io/upload-files-action)

Github action to ease uploading of multiple files to [Appstage.io](https://www.appstage.io) project live builds.

## Usage

Add appstage-actions to the workflow to upload your new ipa or apk build to appstage. The below example builds an iOS installer using fastlane then deletes the previous ipa before uploading the new build to appstage.io:-

```yaml
name: "Build and Publish iOS"
on:
  push:
   branches: [ "master" ]

jobs:
  build:
    runs-on: macos-latest
    timeout-minutes: 30
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Update dependencies
        run: |
          bundle
          bundle update fastlane
          pod repo update

      - name: Build ipa with fastlane
        id: build_ipa
        run: bundle exec fastlane beta

      - name: List current files on Appstage.io
        uses: appstage-io/list-files-action@master
        with:
          token: ${{ secrets.APPSTAGE_JWT }}

      - name: Delete old ipa from Appstage.io
        uses: appstage-io/delete-files-action@master
        with:
          token: ${{ secrets.APPSTAGE_JWT }}
          pattern: '.ipa'

      - name: Deploy new ipa to Appstage.io
        uses: Appstage-io/actions/upload-files@master
        with:
          token: ${{ secrets.APPSTAGE_JWT }}
          folder: './build'
          pattern: '.ipa'
```

## Upload files

### Description

Uploads all files matching the pattern in the specified folder to the Live builds release on Appstage.io.

### Example

```yaml
- name: Deploy new ipa's to Appstage.io
  uses: Appstage-io/actions/upload-files@master
  with:
    token: ${{ secrets.APPSTAGE_JWT }}
    folder: './build'
    pattern: '.ipa'
```

### Inputs

| Input | Required? | Default | Description |
| ----- | --------- | ------- | ----------- |
| token | true | |Project Access Token|
| folder | true | | The folder from which to upload the files|
| pattern | false | .* | The folder from which to upload the files|

### Outputs

| Output | Description |
| ----- | ----------- |
| files | The uploaded files details as JSON payload|

Example files output:-

```json
  [
    {
      "id":"baec6517-65de-4484-b27c-5bc674817849",
      "name":"readme.txt",
      "created_at":"2024-03-11T16:10:17.421Z",
      "size":587
    },
    {
      "id":"fbce383c-f455-4f05-8b78-9e6858c9c279",
      "name":"motorise.ipa",
      "created_at":"2024-03-11T16:10:18.017Z",
      "size":15395922
    }
  ]
```