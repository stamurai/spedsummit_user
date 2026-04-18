import { motion } from 'framer-motion';

const SIZE = {
  sm:      { height: 32,  padding: '0 12px', fontSize: 13, borderRadius: 8  },
  default: { height: 40,  padding: '0 16px', fontSize: 14, borderRadius: 8  },
  lg:      { height: 48,  padding: '0 24px', fontSize: 16, borderRadius: 10 },
  'icon-sm': { height: 32,  width: 32,  padding: 0, fontSize: 14, borderRadius: 8  },
  'icon':    { height: 40,  width: 40,  padding: 0, fontSize: 14, borderRadius: 8  },
  'icon-lg': { height: 48,  width: 48,  padding: 0, fontSize: 16, borderRadius: 10 },
};

const VARIANT = {
  default: {
    background: '#f59e0b',
    color: '#000000',
    border: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 4px 16px rgba(245,158,11,0.25)',
    hover: { background: '#d97706' },
  },
  outline: {
    background: '#ffffff',
    color: '#2B2E33',
    border: '1px solid #e5e7eb',
    boxShadow: 'none',
    hover: { background: '#f9fafb' },
  },
  secondary: {
    background: '#f3f4f6',
    color: '#5D636F',
    border: 'none',
    boxShadow: 'none',
    hover: { background: '#e5e7eb' },
  },
  ghost: {
    background: 'transparent',
    color: '#2B2E33',
    border: 'none',
    boxShadow: 'none',
    hover: { background: '#f3f4f6' },
  },
};

export function Button({
  children,
  variant = 'default',
  size = 'default',
  onClick,
  disabled,
  style,
  ...props
}) {
  const v = VARIANT[variant] ?? VARIANT.default;
  const s = SIZE[size]       ?? SIZE.default;

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
        fontWeight: 600,
        border: v.border,
        boxShadow: v.boxShadow,
        background: v.background,
        color: v.color,
        height: s.height,
        width: s.width ?? 'auto',
        padding: s.padding,
        fontSize: s.fontSize,
        borderRadius: s.borderRadius,
        transition: 'background 0.15s, box-shadow 0.15s',
        flexShrink: 0,
        ...style,
      }}
      onMouseEnter={e => {
        if (!disabled && v.hover.background) e.currentTarget.style.background = v.hover.background;
      }}
      onMouseLeave={e => {
        if (!disabled) e.currentTarget.style.background = v.background;
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
