import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import ReactECharts from 'echarts-for-react';
import type { Palette } from '../../types/palette';
import { getNormalizedColors } from '../../lib/color/parseColor';

interface PalettePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  palette: Palette | null;
}

// Deterministic sample data for consistency
const SAMPLE_DATA = {
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  radarIndicators: [
    { name: 'Sales', max: 100 },
    { name: 'Admin', max: 100 },
    { name: 'Tech', max: 100 },
    { name: 'Support', max: 100 },
    { name: 'Dev', max: 100 },
    { name: 'Marketing', max: 100 },
  ],
  seriesData: [
    [65, 59, 80, 81, 56, 55],
    [28, 48, 40, 19, 86, 27],
    [45, 25, 16, 36, 67, 78],
    [32, 72, 55, 42, 38, 65],
    [18, 35, 62, 78, 45, 52],
    [52, 68, 24, 58, 72, 41],
  ],
  radarSeriesData: [
    [65, 59, 80, 81, 56, 55],
    [28, 48, 40, 19, 86, 27],
    [45, 25, 16, 36, 67, 78],
    [32, 72, 55, 42, 38, 65],
  ],
};

export function PalettePreviewModal({ 
  open, 
  onOpenChange, 
  palette 
}: PalettePreviewModalProps) {
  if (!palette) return null;

  const colors = getNormalizedColors(palette.colors);
  const numSeries = Math.min(colors.length, 6);

  const baseChartOptions = {
    color: colors,
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: 'DM Sans, system-ui, sans-serif',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    legend: {
      textStyle: {
        color: 'var(--color-text-secondary)',
      },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'var(--glass-bg)',
      borderColor: 'var(--glass-border)',
      textStyle: {
        color: 'var(--color-text)',
      },
    },
  };

  const lineChartOptions = {
    ...baseChartOptions,
    xAxis: {
      type: 'category' as const,
      data: SAMPLE_DATA.categories,
      axisLine: { lineStyle: { color: 'var(--color-border-strong)' } },
      axisLabel: { color: 'var(--color-text-secondary)' },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { lineStyle: { color: 'var(--color-border-strong)' } },
      axisLabel: { color: 'var(--color-text-secondary)' },
      splitLine: { lineStyle: { color: 'var(--color-border-strong)', opacity: 0.3 } },
    },
    series: SAMPLE_DATA.seriesData.slice(0, numSeries).map((data, i) => ({
      name: `Series ${i + 1}`,
      type: 'line' as const,
      data,
      smooth: true,
      symbolSize: 6,
    })),
  };

  const barChartOptions = {
    ...baseChartOptions,
    xAxis: {
      type: 'category' as const,
      data: SAMPLE_DATA.categories,
      axisLine: { lineStyle: { color: 'var(--color-border-strong)' } },
      axisLabel: { color: 'var(--color-text-secondary)' },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { lineStyle: { color: 'var(--color-border-strong)' } },
      axisLabel: { color: 'var(--color-text-secondary)' },
      splitLine: { lineStyle: { color: 'var(--color-border-strong)', opacity: 0.3 } },
    },
    series: SAMPLE_DATA.seriesData.slice(0, numSeries).map((data, i) => ({
      name: `Series ${i + 1}`,
      type: 'bar' as const,
      data,
      barGap: '10%',
      barCategoryGap: '30%',
    })),
  };

  const radarChartOptions = {
    ...baseChartOptions,
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: 'var(--glass-bg)',
      borderColor: 'var(--glass-border)',
      textStyle: {
        color: 'var(--color-text)',
      },
    },
    radar: {
      indicator: SAMPLE_DATA.radarIndicators,
      axisName: {
        color: 'var(--color-text-secondary)',
      },
      splitLine: {
        lineStyle: { color: 'var(--color-border-strong)', opacity: 0.3 },
      },
      splitArea: {
        show: false,
      },
      axisLine: {
        lineStyle: { color: 'var(--color-border-strong)', opacity: 0.3 },
      },
    },
    series: [
      {
        type: 'radar' as const,
        data: SAMPLE_DATA.radarSeriesData.slice(0, Math.min(colors.length, 4)).map((data, i) => ({
          value: data,
          name: `Series ${i + 1}`,
          areaStyle: { opacity: 0.2 },
        })),
      },
    ],
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in z-50" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-full max-w-3xl max-h-[90vh] overflow-auto
                     glass-strong rounded-2xl p-6 animate-scale-in z-50"
        >
          {/* Header */}
          <div className="mb-6">
            <Dialog.Title 
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--color-text)' }}
            >
              {palette.name}
            </Dialog.Title>
            
            {/* Color strip */}
            <div className="h-8 rounded-lg overflow-hidden flex">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 relative group cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => navigator.clipboard.writeText(color)}
                  title={`Click to copy: ${color}`}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ 
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      color: 'white'
                    }}
                  >
                    {color.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs.Root defaultValue="line" className="w-full">
            <Tabs.List 
              className="flex gap-1 p-1 rounded-xl mb-4"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              {['line', 'bar', 'radar'].map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                             data-[state=active]:bg-white data-[state=active]:shadow-sm
                             dark:data-[state=active]:bg-slate-700"
                  style={{ 
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Chart
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value="line" className="animate-fade-in">
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                <ReactECharts 
                  option={lineChartOptions} 
                  style={{ height: '350px' }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
            </Tabs.Content>

            <Tabs.Content value="bar" className="animate-fade-in">
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                <ReactECharts 
                  option={barChartOptions} 
                  style={{ height: '350px' }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
            </Tabs.Content>

            <Tabs.Content value="radar" className="animate-fade-in">
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                <ReactECharts 
                  option={radarChartOptions} 
                  style={{ height: '350px' }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
            </Tabs.Content>
          </Tabs.Root>

          {/* Close button */}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 hover:scale-110"
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
