export const HELP_PLUGIN_MODULE = {
  id: 'help',
  name: 'jmsp-help.TITLE',
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
          title: 'jmsp-help.INSTANCE.GENERAL',
          fields: [
            '/title',
            '/module',
            '/roles'
          ]
        },
        {
          title: 'jmsp-help.INSTANCE.CONTENT',
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
        {key: '/title', label: 'jmsp-help.TABLE.TITLE'},
        {key: '/module', label: 'jmsp-help.TABLE.MODULE'},
        {key: '/excerpt', label: 'jmsp-help.TABLE.EXCERPT'}
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
    title: {label: 'jmsp-help.DEFINITIONS.TITLE'},
    excerpt: {
      label: 'jmsp-help.DEFINITIONS.EXCERPT',
      component: {
        type: 'textarea'
      }
    },
    short: {
      label: 'jmsp-help.DEFINITIONS.SHORT_DESCRIPTION',
      component: {
        type: 'tinymce'
      }
    },
    full: {
      label: 'jmsp-help.DEFINITIONS.CONTENT',
      component: {
        type: 'tinymce'
      }
    },
    module: {
      label: 'jmsp-help.DEFINITIONS.MODULE',
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
