# JMS Plugins

A set of plugins for [JMS](https://github.com/Jaspero/jms).

## Notes

A custom element intended for use on overview pages. It's a way for 
adding notes to any document. You would typically use it in `layout.table.actions` like this:

```json
{
  "actions": [{
    "value": "it => '<jms-e-notes data-id=' + it.id + '></jms-e-notes>'"
  }]
}
```

or you can use the `note-view` element in a single instance:

```json
{
  "instance": {
    "segments": [
      {
        "components": [{
          "selector": "note-view"
        }]
      }
    ]
  }
}
```

### Setup

1. Install the plugin `npm i --save @jaspero/jmsp-notes`
2. Import the `JMSPNotesModule` in the `ModuleInstanceModule` in your JMS project.

## Quick Edit

Adds the capability for editing documents through a dialog.

### Setup

1. Install the plugin `npm i --save @jaspero/jmsp-quick-edit`
2. Import the `JMSPQuickEditModule` in the `ModuleInstanceModule` in your JMS project.
3. For translations add the following to your `transloco.config.js`:
   ```js
   module.exports = {
      scopedLibs: [
        {
          src: './node_modules/@jaspero/jmsp-qe',
          dist: ['./projects/cms/src/assets/i18n/']
        }
      ]
    };

   ```
4. Import translations by running: `transloco:extract-scoped-libs`. 

You can now use `<jms-e-quick-edit data-id="some-id"></jms-e-quick-edit>`.

It's also possible to override which segments are shown in quick edit by using `metadata.quickEditSegments`.

## Help FlyOut

A popup for help articles. It's module based and changes dynamically based on what module the user is currently on.

### Setup

1. Install the plugin `npm i --save @jaspero/jmsp-help`
2. Import the `JMSPHelpModule` in the `DashboardModule` in your JMS project. You can use `JMSPHelpModule.forRoot()` to configure height, width as well as top and left position.
3. Add `<jmsp-help-toggle></jmsp-help-toggle>` somewhere in your project (it's mainly intended to go in the layout navigation).
4. In order to be able to add articles through JMS you will need to install the projects module `npm i --save @jaspero/jmsp-modules` in `setup` as well and add `HELP_PLUGIN_MODULE` to `modules.ts`.
5. For translations add the following to your `transloco.config.js`:
   ```js
   module.exports = {
      scopedLibs: [
        {
          src: './node_modules/@jaspero/jmsp-help',
          dist: ['./projects/cms/src/assets/i18n/']
        }
      ]
    };

   ```
6. Import translations by running: `transloco:extract-scoped-libs`. 
7. You will also need to add the following firestore index:
   ```json
   {
     "collectionGroup": "help",
     "queryScope": "COLLECTION",
     "fields": [
       {
         "fieldPath": "module",
         "order": "ASCENDING"
       },
       {
         "fieldPath": "order",
         "order": "ASCENDING"
       }
     ]
   }
   ```  
   
You can find an example implementation [here](https://github.com/Jaspero/jms/tree/example/help).

## GitHub Issues

A set of components for working with github issues.

## Development

### Creating a plugin

1. Run `ng g library [plugin-name] --prefix=jmsp`
2. Add `@jaspero/jmsp-` prefix in the projects `package.json`
3. Add a `release` property. Example from `notes` plugin (remember to replace all references of "notes").
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
4. Create `ng-package.prod.json`. Example from notes plugin (remember to replace all references of "notes").
    ```json
    {
      "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
      "dest": "../../dist/@jaspero/jmsp-notes",
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
