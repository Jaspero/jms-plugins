export const HELP_PLUGIN_MODULE = {
  id: 'help',
  name: 'jmspHelp.TITLE',
  authorization: {
    read: ['admin', 'user'],
    write: ['admin']
  },
  layout: {
    editTitleKey: 'title',
    sort: {
      active: 'order',
      direction: 'asc'
    },
    sortModule: {
      sortKey: 'order',
      sortTitle: 'title'
    },
    instance: {
      segments: [
        {
          title: 'jmspHelp.INSTANCE.GENERAL',
          fields: [
            '/title',
            '/module',
            '/roles'
          ]
        },
        {
          title: 'jmspHelp.INSTANCE.CONTENT',
          fields: [
            '/excerpt',
            '/short',
            '/full'
          ]
        }
      ]
    },
    table: {
      hideImport: true,
      hideExport: true,
      tableColumns: [
        {key: '/title', label: 'jmspHelp.TABLE.TITLE'},
        {key: '/module', label: 'jmspHelp.TABLE.MODULE'},
        {key: '/excerpt', label: 'jmspHelp.TABLE.EXCERPT'}
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      title: {type: 'string'},
      excerpt: {type: 'string'},
      short: {type: 'string'},
      full: {type: 'string'},
      module: {type: 'string', default: 'general'},
      order: {type: 'number'},
      roles: {type: 'array'}
    },
    required: [
      'title',
      'module'
    ]
  },
  definitions: {
    title: {label: 'jmspHelp.DEFINITIONS.TITLE'},
    excerpt: {
      label: 'jmspHelp.DEFINITIONS.EXCERPT',
      component: {
        type: 'textarea'
      }
    },
    short: {
      label: 'jmspHelp.DEFINITIONS.SHORT_DESCRIPTION',
      component: {
        type: 'tinymce'
      }
    },
    full: {
      label: 'jmspHelp.DEFINITIONS.CONTENT',
      component: {
        type: 'tinymce'
      }
    },
    module: {
      label: 'jmspHelp.DEFINITIONS.MODULE',
      component: {
        type: 'select',
        configuration: {
          populate: {
            collection: 'modules',
            mapResults: `it => [{id: 'general', name: 'General'}, ...it]`
          }
        }
      }
    },
    roles: {
      label: 'Roles',
      component: {
        type: 'select',
        configuration: {
          multiple: true,
          populate: {
            collection: 'roles'
          }
        }
      }
    }
  }
};
