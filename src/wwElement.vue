<template>
  <div class="tk-badge-root" :style="rootStyle" @click="handleClick">
    <!-- Primary badge -->
    <span
      v-if="primaryLabel"
      class="tk-badge"
      :class="[sizeClass, styleClass]"
      :style="primaryStyle"
    >
      <span v-if="content?.showDot !== false" class="tk-dot" :style="primaryDotStyle"></span>
      <span class="tk-label">{{ primaryLabel }}</span>
    </span>

    <!-- Secondary badge (optional, for compound states like Partial + Closed) -->
    <span
      v-if="secondaryLabel"
      class="tk-badge"
      :class="[sizeClass, styleClass]"
      :style="secondaryStyle"
    >
      <span v-if="content?.showDot !== false" class="tk-dot" :style="secondaryDotStyle"></span>
      <span class="tk-label">{{ secondaryLabel }}</span>
    </span>
  </div>
</template>

<script>
import { computed, watch } from 'vue';

// ── Built-in status color presets (Tokban Design System 2025) ──
const STATUS_PRESETS = {
  // Lifecycle
  draft:      { dot: '#A8A8A8', text: '#616161', bg: '#E8E8E8' },   // neutral
  pending:    { dot: '#FFB300', text: '#7A5100', bg: '#FFF0CC' },   // warning
  approved:   { dot: '#1565C0', text: '#0D47A1', bg: '#E8F1FA' },   // info
  confirmed:  { dot: '#1565C0', text: '#0D47A1', bg: '#E8F1FA' },   // info

  // Fulfillment
  sent:       { dot: '#4F0BA7', text: '#4F0BA7', bg: '#F0E8F8' },   // secondary (purple)
  partial:    { dot: '#FFB300', text: '#7A5100', bg: '#FFF0CC' },   // warning
  delivered:  { dot: '#4CAF50', text: '#1B5E20', bg: '#D7F0D7' },   // success
  completed:  { dot: '#4CAF50', text: '#1B5E20', bg: '#EDFAED' },   // success (lighter)

  // Financial
  paid:       { dot: '#4CAF50', text: '#1B5E20', bg: '#D7F0D7' },   // success
  overdue:    { dot: '#E53935', text: '#B71C1C', bg: '#FAD8D7' },   // danger

  // Terminal
  cancelled:  { dot: '#E53935', text: '#B71C1C', bg: '#FEF2F2' },   // danger (lighter)
  closed:     { dot: '#A8A8A8', text: '#616161', bg: '#E8E8E8' },   // neutral
};

// Fallback for unknown statuses
const FALLBACK_COLORS = { dot: '#A8A8A8', text: '#616161', bg: '#E8E8E8' };

function resolveColors(statusKey, customStatuses) {
  if (!statusKey) return FALLBACK_COLORS;

  const key = String(statusKey).toLowerCase().trim();

  // Check custom overrides first
  if (Array.isArray(customStatuses)) {
    const custom = customStatuses.find(
      (s) => s?.key && String(s.key).toLowerCase().trim() === key
    );
    if (custom) {
      return {
        dot:  custom.dotColor  || FALLBACK_COLORS.dot,
        text: custom.textColor || FALLBACK_COLORS.text,
        bg:   custom.bgColor   || FALLBACK_COLORS.bg,
      };
    }
  }

  // Check built-in presets
  return STATUS_PRESETS[key] || FALLBACK_COLORS;
}

function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  const s = str.trim();
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default {
  props: {
    uid:     { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {

    // ── Internal variables ──
    const { value: currentStatus, setValue: setCurrentStatus } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid, name: 'currentStatus', type: 'string', defaultValue: '',
    });
    const { value: currentSecondary, setValue: setCurrentSecondary } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid, name: 'currentSecondaryStatus', type: 'string', defaultValue: '',
    });

    // ── Resolved labels ──
    const primaryLabel = computed(() => {
      const status = props.content?.status;
      if (!status || typeof status !== 'string' || !status.trim()) return '';
      // Check if custom status has a display label
      const key = status.toLowerCase().trim();
      const customs = props.content?.customStatuses;
      if (Array.isArray(customs)) {
        const custom = customs.find((s) => s?.key && String(s.key).toLowerCase().trim() === key);
        if (custom?.label) return custom.label;
      }
      return capitalize(status);
    });

    const secondaryLabel = computed(() => {
      const status = props.content?.secondaryStatus;
      if (!status || typeof status !== 'string' || !status.trim()) return '';
      const key = status.toLowerCase().trim();
      const customs = props.content?.customStatuses;
      if (Array.isArray(customs)) {
        const custom = customs.find((s) => s?.key && String(s.key).toLowerCase().trim() === key);
        if (custom?.label) return custom.label;
      }
      return capitalize(status);
    });

    // ── Colors ──
    const primaryColors = computed(() =>
      resolveColors(props.content?.status, props.content?.customStatuses)
    );
    const secondaryColors = computed(() =>
      resolveColors(props.content?.secondaryStatus, props.content?.customStatuses)
    );

    // ── Size class ──
    const sizeClass = computed(() => {
      const s = props.content?.size || 'md';
      return `tk-size-${s}`;
    });

    // ── Style class (filled / outline / minimal) ──
    const styleClass = computed(() => {
      const s = props.content?.pillStyle || 'filled';
      return `tk-style-${s}`;
    });

    // ── Inline styles ──
    const rootStyle = computed(() => ({
      '--tk-badge-radius': props.content?.borderRadius || '9999px',
      '--tk-badge-gap': props.content?.gap || '6px',
      '--tk-badge-font': props.content?.fontFamily || 'inherit',
    }));

    const primaryStyle = computed(() => {
      const c = primaryColors.value;
      const style = props.content?.pillStyle || 'filled';
      if (style === 'outline') {
        return { color: c.text, borderColor: c.dot, backgroundColor: 'transparent' };
      }
      if (style === 'minimal') {
        return { color: c.text, borderColor: 'transparent', backgroundColor: 'transparent' };
      }
      return { color: c.text, backgroundColor: c.bg, borderColor: 'transparent' };
    });
    const primaryDotStyle = computed(() => ({
      backgroundColor: primaryColors.value.dot,
    }));

    const secondaryStyle = computed(() => {
      const c = secondaryColors.value;
      const style = props.content?.pillStyle || 'filled';
      if (style === 'outline') {
        return { color: c.text, borderColor: c.dot, backgroundColor: 'transparent' };
      }
      if (style === 'minimal') {
        return { color: c.text, borderColor: 'transparent', backgroundColor: 'transparent' };
      }
      return { color: c.text, backgroundColor: c.bg, borderColor: 'transparent' };
    });
    const secondaryDotStyle = computed(() => ({
      backgroundColor: secondaryColors.value.dot,
    }));

    // ── Sync internal variables ──
    watch(() => props.content?.status, (v) => {
      setCurrentStatus(v || '');
    }, { immediate: true });

    watch(() => props.content?.secondaryStatus, (v) => {
      setCurrentSecondary(v || '');
    }, { immediate: true });

    // ── Click handler ──
    const handleClick = () => {
      emit('trigger-event', {
        name: 'click',
        event: {
          status: props.content?.status || '',
          secondaryStatus: props.content?.secondaryStatus || '',
        },
      });
    };

    /* wwEditor:start */
    const isEditing = computed(() => props.wwEditorState?.isEditing);
    /* wwEditor:end */

    return {
      primaryLabel,
      secondaryLabel,
      sizeClass,
      styleClass,
      rootStyle,
      primaryStyle,
      primaryDotStyle,
      secondaryStyle,
      secondaryDotStyle,
      handleClick,
      /* wwEditor:start */
      isEditing,
      /* wwEditor:end */
    };
  },
};
</script>

<style scoped>
.tk-badge-root {
  display: inline-flex;
  align-items: center;
  gap: var(--tk-badge-gap);
  font-family: var(--tk-badge-font);
}

/* ── Badge pill ── */
.tk-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: var(--tk-badge-radius);
  font-weight: 500;
  white-space: nowrap;
  cursor: inherit;
  border: 1.5px solid transparent;
  transition: filter 0.15s ease;
  line-height: 1;
  box-sizing: border-box;
}

/* ── Sizes ── */
.tk-size-sm {
  padding: 2px 8px;
  font-size: 11px;
}
.tk-size-sm .tk-dot {
  width: 5px;
  height: 5px;
}

.tk-size-md {
  padding: 4px 10px;
  font-size: 12px;
}
.tk-size-md .tk-dot {
  width: 6px;
  height: 6px;
}

.tk-size-lg {
  padding: 5px 14px;
  font-size: 14px;
}
.tk-size-lg .tk-dot {
  width: 8px;
  height: 8px;
}

/* ── Style: outline ── */
.tk-style-outline {
  border-style: solid;
  background-color: transparent !important;
}

/* ── Style: minimal ── */
.tk-style-minimal {
  padding-left: 0 !important;
  padding-right: 0 !important;
  background-color: transparent !important;
  border-color: transparent !important;
}

/* ── Dot indicator ── */
.tk-dot {
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── Label text ── */
.tk-label {
  line-height: 1.4;
  letter-spacing: 0.01em;
}
</style>
