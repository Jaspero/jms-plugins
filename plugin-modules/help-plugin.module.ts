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
        {key: '/title', label: 'Title'},
        {key: '/module', label: 'Module'},
        {key: '/excerpt', label: 'Excerpt'}
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
    title: {label: 'Title'},
    excerpt: {
      label: 'Excerpt',
      component: {
        type: 'textarea'
      }
    },
    short: {
      label: 'Short Description',
      component: {
        type: 'tinymce'
      }
    },
    full: {
      label: 'Content',
      component: {
        type: 'tinymce'
      }
    },
    module: {
      label: 'Module',
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
