export default {
  editor: {
    label: { en: 'Tokban Status Badge' },
    icon: 'fontawesome/solid/circle-check',
  },
  triggerEvents: [
    { name: 'click', label: { en: 'On click' }, event: { status: '', secondaryStatus: '' } },
  ],
  properties: {

    // ─────────────────────────────────────────
    // STATUS VALUES
    // ─────────────────────────────────────────
    status: {
      label: { en: 'Status' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'draft',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Status text. Built-in presets: draft, pending, approved, confirmed, sent, partial, delivered, completed, paid, overdue, cancelled, closed',
      },
      propertyHelp: { tooltip: 'Bind to your data row status field. Colors are auto-resolved from built-in presets. Use Custom Statuses to add your own.' },
      /* wwEditor:end */
    },
    secondaryStatus: {
      label: { en: 'Secondary Status' },
      type: 'Text',
      section: 'settings',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Optional second badge shown next to the primary. Use for compound states like "Partial + Closed".',
      },
      propertyHelp: { tooltip: 'Leave empty for single badge. Bind to a computed field for double-badge scenarios.' },
      /* wwEditor:end */
    },

    // ─────────────────────────────────────────
    // DISPLAY OPTIONS
    // ─────────────────────────────────────────
    size: {
      label: { en: 'Size' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
      },
      defaultValue: 'md',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Valid values: sm | md | lg',
      },
      /* wwEditor:end */
    },
    showDot: {
      label: { en: 'Show Dot' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'boolean', tooltip: 'Show/hide the colored dot indicator' },
      /* wwEditor:end */
    },
    pillStyle: {
      label: { en: 'Badge Style' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'filled', label: 'Filled' },
          { value: 'outline', label: 'Outline' },
          { value: 'minimal', label: 'Minimal (text only)' },
        ],
      },
      defaultValue: 'filled',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Visual style: filled (colored background), outline (border only), minimal (text + dot only)',
      },
      /* wwEditor:end */
    },

    // ─────────────────────────────────────────
    // CUSTOM STATUS COLORS
    // ─────────────────────────────────────────
    customStatuses: {
      label: { en: 'Custom Statuses' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      options: {
        expandable: true,
        getItemLabel(item) {
          return item?.key || item?.label || 'Status';
        },
        item: {
          type: 'Object',
          defaultValue: { key: 'new_status', dotColor: '#6B7280', textColor: '#374151', bgColor: '#F3F4F6', label: '' },
          options: {
            item: {
              key:       { label: { en: 'Status Key' },        type: 'Text' },
              label:     { label: { en: 'Display Label' },     type: 'Text' },
              dotColor:  { label: { en: 'Dot Color' },         type: 'Color' },
              textColor: { label: { en: 'Text Color' },        type: 'Color' },
              bgColor:   { label: { en: 'Background Color' },  type: 'Color' },
            },
          },
        },
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of { key, label, dotColor, textColor, bgColor }. Overrides built-in presets when key matches.',
      },
      propertyHelp: { tooltip: 'Add custom statuses or override built-in colors. Key must match the status text (lowercase).' },
      /* wwEditor:end */
    },

    // ─────────────────────────────────────────
    // STYLE TAB
    // ─────────────────────────────────────────
    borderRadius: {
      label: { en: 'Border Radius' },
      type: 'Length',
      section: 'style',
      defaultValue: '9999px',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Badge pill border radius. Default 9999px = fully rounded.' },
      /* wwEditor:end */
    },
    fontFamily: {
      label: { en: 'Font Family' },
      type: 'Text',
      section: 'style',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Override font family. Leave empty to inherit from parent.' },
      /* wwEditor:end */
    },
    gap: {
      label: { en: 'Multi-badge Gap' },
      type: 'Length',
      section: 'style',
      defaultValue: '6px',
      bindable: true,
      hidden: (content) => !content?.secondaryStatus,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'Gap between primary and secondary badges' },
      /* wwEditor:end */
    },
  },
};
