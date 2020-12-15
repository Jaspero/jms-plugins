# JMS Plugins

## Notes

A custom element intended for use on overview pages. It's a way for 
adding notes to any document. You would typically use it in `layout.table.actions` like this:

```json
{
  "actions": [{
    "value": `it => '<jms-e-notes data-id="' + it.id + '"></jms-e-notes>'`
  }]
}
```

### Setup

Import the `JMSPNotesModule` in the `ModuleInstanceModule` in your JMS project.
You're now ready to use the notes element inside of your schemas. This is the default
selector `jms-e-notes`.

## Development

### Creating a plugin

1. Run `ng g library [plugin-name]`
2. Add `@jaspero/` prefix in the projects `package.json`
3. Add a `release` property as well. Example from `notes` plugin.
    ```json
      "release": {
        "pkgRoot": "../../dist/@jaspero/jmsp-notes",
        "branch": "master",
        "verifyConditions": [
          "@semantic-release/changelog",
          "@semantic-release/npm",
          "@semantic-release/git"
        ],
        "prepare": [
          "@semantic-release/changelog",
          "@semantic-release/npm",
          "@semantic-release/git"
        ],
        "publish": [
          "@semantic-release/npm",
          [
            "@semantic-release/github",
            {
              "assets": [
                "dist/@jaspero/jmsp-notes"
              ]
            }
          ]
        ],
        "plugins": [
          "@semantic-release/commit-analyzer",
          "@semantic-release/release-notes-generator"
        ]
      }
    ```
4. Create `ng-package.prod.json` example from notes
    ```json
    {
      "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
      "dest": "../../dist/@jaspero/fb-tinymce",
      "lib": {
        "entryFile": "src/public-api.ts"
      }
    }
    ```
5. In `angular.json` extend the `architect.configurations.production` with `ng-package.prod.json`
    ```json
     "configurations": {
       "production": {
         "tsConfig": "projects/notes/tsconfig.lib.prod.json",
         "project": "projects/notes/ng-package.prod.json"
       }
    }
    ```
6. Add build scripts for the library in to the root `package.json`
7. Build the library and publish an initial version manually. This is required because since it's a scoped
package it needs to be explicitly flagged as public. You can do this by running `npm publish --access public` in `dist/@jaspero/[package-name]`.

## License

MIT © [Jaspero Ltd](mailto:info@jaspero.co)
