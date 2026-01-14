import * as Dialog from '@radix-ui/react-dialog';
import ReactECharts from 'echarts-for-react';
import type { Palette } from '../../types/palette';
import { getNormalizedColors } from '../../lib/color/parseColor';

interface PalettePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  palette: Palette | null;
}

const LINE_CATEGORIES = ['1', '2', '3'];
const BAR_CATEGORIES = [''];

function makeSeriesData(seed: number, length: number) {
  // Deterministic pseudo-random generator (LCG) so previews are stable.
  let x = (seed + 1) * 1103515245 + 12345;
  const out: number[] = [];
  for (let i = 0; i < length; i += 1) {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    out.push(12 + (x % 78)); // 12..89
  }
  return out;
}

export function PalettePreviewModal({ 
  open, 
  onOpenChange, 
  palette 
}: PalettePreviewModalProps) {
  if (!palette) return null;

  const colors = getNormalizedColors(palette.colors);
  const seriesColors = colors; // use all colors
  const seriesNames = seriesColors.map((c) => c.toUpperCase());

  const baseChartOptions = {
    color: seriesColors,
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: 'DM Sans, system-ui, sans-serif',
    },
    grid: {
      top: 8,
      left: 8,
      right: 8,
      bottom: 8,
      containLabel: false,
    },
    legend: { show: false },
    tooltip: { show: false },
  };

  const lineChartOptions = {
    ...baseChartOptions,
    xAxis: {
      type: 'category' as const,
      data: LINE_CATEGORIES,
      show: false,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      show: false,
    },
    series: seriesNames.map((name, i) => ({
      name,
      type: 'line' as const,
      data: makeSeriesData(i, LINE_CATEGORIES.length),
      smooth: false,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2, opacity: 0.92 },
    })),
  };

  const barChartOptions = {
    ...baseChartOptions,
    xAxis: {
      type: 'category' as const,
      data: BAR_CATEGORIES,
      show: false,
    },
    yAxis: {
      type: 'value' as const,
      show: false,
    },
    series: seriesNames.map((name, i) => ({
      name,
      type: 'bar' as const,
      data: makeSeriesData(i + 10, BAR_CATEGORIES.length),
      barWidth: 10,
    })),
  };

  const radarChartOptions = {
    ...baseChartOptions,
    radar: {
      // 3 dimensions, multiple series (layers) using all colors
      indicator: Array.from({ length: 3 }).map(() => ({ name: '', max: 100 })),
      radius: '82%',
      center: ['50%', '56%'],
      splitNumber: 4,
      axisName: {
        show: false,
      },
      splitLine: {
        lineStyle: { color: 'var(--color-border-strong)', opacity: 0.18 },
      },
      splitArea: {
        show: false,
      },
      axisLine: {
        lineStyle: { color: 'var(--color-border-strong)', opacity: 0.18 },
      },
    },
    series: [
      {
        type: 'radar' as const,
        data: seriesNames.map((name, i) => ({
          value: makeSeriesData(i + 30, 3),
          name,
          areaStyle: { opacity: 0.10 },
          lineStyle: { width: 2, opacity: 0.92 },
        })),
      },
    ],
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value.toUpperCase());
    } catch {
      // Clipboard might be unavailable (permissions); fail silently
    }
  };

  const onChartEvents = {
    click: (params: { seriesIndex?: number }) => {
      const idx = params?.seriesIndex;
      if (typeof idx !== 'number') return;
      const color = seriesColors[idx];
      if (!color) return;
      void copyToClipboard(color);
    },
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Portal>
        <Dialog.Content 
          className="fixed top-24 left-1/2 -translate-x-1/2
                     w-full max-w-3xl
                     cv-card rounded-[28px] p-5 sm:p-6 animate-scale-in z-50"
        >
          {/* Title */}
          <Dialog.Title
            className="text-lg sm:text-xl font-semibold mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            {palette.name}
          </Dialog.Title>

          {/* 3 charts (smaller rectangles, no borders between) */}
          <div className="overflow-hidden rounded-[18px]" style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
              <div className="h-[140px] sm:h-[160px]">
                <ReactECharts
                  option={lineChartOptions}
                  style={{ width: '100%', height: '100%' }}
                  opts={{ renderer: 'svg' }}
                  onEvents={onChartEvents}
                />
              </div>
              <div className="h-[140px] sm:h-[160px]">
                <ReactECharts
                  option={barChartOptions}
                  style={{ width: '100%', height: '100%' }}
                  opts={{ renderer: 'svg' }}
                  onEvents={onChartEvents}
                />
              </div>
              <div className="h-[160px] sm:h-[190px]">
                <ReactECharts
                  option={radarChartOptions}
                  style={{ width: '100%', height: '100%' }}
                  opts={{ renderer: 'svg' }}
                  onEvents={onChartEvents}
                />
              </div>
            </div>
          </div>

          {/* Shared legend: rounded rectangles, no visible color codes */}
          <div
            className="mt-4 grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${Math.min(seriesColors.length, 8)}, minmax(0, 1fr))`,
            }}
          >
            {seriesColors.map((color, i) => (
              <button
                key={`${color}-${i}`}
                type="button"
                className="h-7 w-full rounded-[var(--radius-swatch)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99]"
                style={{
                  backgroundColor: color,
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset',
                }}
                onClick={() => void copyToClipboard(color)}
                title={`Click to copy: ${color.toUpperCase()}`}
                aria-label={`Copy ${color.toUpperCase()}`}
              />
            ))}
          </div>

          {/* Close button */}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-muted)' 
              }}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
