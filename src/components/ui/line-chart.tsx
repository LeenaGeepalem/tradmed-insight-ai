import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
    fill?: boolean;
  }>;
}

interface ChartProps {
  type?: 'line';
  data: ChartData;
  options?: any;
  className?: string;
}

export function Chart({ type = 'line', data, options, className }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'hsl(var(--background))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        padding: 8,
        boxPadding: 4,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'hsl(var(--border) / 0.2)',
        },
        ticks: {
          color: 'hsl(var(--foreground) / 0.7)',
        },
      },
      y: {
        grid: {
          color: 'hsl(var(--border) / 0.2)',
        },
        ticks: {
          color: 'hsl(var(--foreground) / 0.7)',
          callback: (value: number) => `${value}%`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
  };

  return (
    <Line
      data={data}
      options={{
        ...defaultOptions,
        ...options,
      }}
      className={className}
    />
  );
}