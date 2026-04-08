import React from 'react';
import { motion } from 'framer-motion';

const COLORS = [
  'rgb(125 211 252)',
  'rgb(249 168 212)',
  'rgb(134 239 172)',
  'rgb(253 224 71)',
  'rgb(252 165 165)',
  'rgb(216 180 254)',
  'rgb(147 197 253)',
  'rgb(165 180 252)',
  'rgb(196 181 253)',
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const rows = new Array(150).fill(0);
const cols = new Array(100).fill(0);

function BoxesCore({ style }) {
  return (
    <div style={{
      transform: 'translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)',
      position: 'absolute',
      left: '25%',
      top: '-25%',
      padding: 16,
      display: 'flex',
      translate: '-50% -50%',
      width: '100%',
      height: '100%',
      zIndex: 0,
      ...style,
    }}>
      {rows.map((_, i) => (
        <div key={`row${i}`} style={{ width: 64, height: 32, borderLeft: '1px solid #334155', position: 'relative', flexShrink: 0 }}>
          {cols.map((_, j) => (
            <motion.div
              key={`col${j}`}
              whileHover={{ backgroundColor: getRandomColor(), transition: { duration: 0 } }}
              animate={{ transition: { duration: 2 } }}
              style={{ width: 64, height: 32, borderRight: '1px solid #334155', borderTop: '1px solid #334155', position: 'relative' }}
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  style={{ position: 'absolute', height: 24, width: 40, top: -14, left: -22, color: '#334155', strokeWidth: 1, pointerEvents: 'none' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

export const Boxes = React.memo(BoxesCore);
