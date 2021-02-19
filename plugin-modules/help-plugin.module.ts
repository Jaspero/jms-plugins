export const HELP_PLUGIN_MODULE = {
  id: 'help',
  name: 'HELP_PLUGIN.TITLE',
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
          title: 'HELP_PLUGIN.INSTANCE.GENERAL',
          fields: [
            '/title',
            '/module'
          ]
        },
        {
          title: 'HELP_PLUGIN.INSTANCE.CONTENT',
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
        {key: '/title', label: 'HELP_PLUGIN.TABLE.TITLE'},
        {key: '/module', label: 'HELP_PLUGIN.TABLE.MODULE'},
        {key: '/excerpt', label: 'HELP_PLUGIN.TABLE.EXCERPT'}
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
      order: {type: 'number'}
    },
    required: [
      'title',
      'module'
    ]
  },
  definitions: {
    title: {label: 'HELP_PLUGIN.DEFINITIONS.TITLE'},
    excerpt: {
      label: 'HELP_PLUGIN.DEFINITIONS.EXCERPT',
      component: {
        type: 'textarea'
      }
    },
    short: {
      label: 'HELP_PLUGIN.DEFINITIONS.SHORT_DESCRIPTION',
      component: {
        type: 'tinymce'
      }
    },
    full: {
      label: 'HELP_PLUGIN.DEFINITIONS.CONTENT',
      component: {
        type: 'tinymce'
      }
    },
    module: {
      label: 'HELP_PLUGIN.DEFINITIONS.MODULE',
      component: {
        type: 'select',
        configuration: {
          populate: {
            collection: 'modules',
            mapResults: `it => [{id: 'general', name: 'General'}, ...it]`
          }
        }
      }
    }
  }
};
