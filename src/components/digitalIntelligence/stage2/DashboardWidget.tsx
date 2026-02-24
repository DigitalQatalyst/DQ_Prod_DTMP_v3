import { Card } from '@/components/ui/card';
import { DashboardWidget as WidgetType, DashboardData, DashboardMetric } from '@/data/digitalIntelligence/stage2';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { InsightCard } from './InsightCard';

interface DashboardWidgetProps {
  widget: WidgetType;
  data: DashboardData;
  style?: React.CSSProperties;
}

function MetricWidget({ widget, metrics }: { widget: WidgetType; metrics: DashboardMetric[] }) {
  const metric = metrics.find(m => m.id === widget.id);
  if (!metric) return null;

  const getIconColor = () => {
    switch (metric.severity) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-orange-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-purple-600';
    }
  };

  const getTrendColor = () => {
    if (metric.trend === 'up') return 'text-green-600';
    if (metric.trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  const getTrendText = () => {
    if (!metric.trendValue) return metric.trendLabel;
    const sign = metric.trendValue > 0 ? '+' : '';
    return `${sign}${metric.trendValue}%`;
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center ${getIconColor()}`}>
          {metric.severity === 'success' ? <CheckCircle className="w-5 h-5" /> :
           metric.severity === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
           metric.severity === 'error' ? <AlertCircle className="w-5 h-5" /> :
           <TrendingUp className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{widget.title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {metric.value}
            {metric.unit && <span className="text-lg text-gray-600 ml-1">{metric.unit}</span>}
          </p>
        </div>
      </div>
      {(metric.trendLabel || metric.trendValue) && (
        <p className={`text-sm font-medium ${getTrendColor()}`}>
          {getTrendText()}
        </p>
      )}
    </Card>
  );
}

function ChartWidget({ widget, data }: { widget: WidgetType; data: DashboardData }) {
  const chartData = data.timeSeries.map(point => ({
    name: point.label || point.timestamp,
    value: point.value
  }));

  const COLORS = ['#7C3AED', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-purple-600 font-semibold">
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <h3 className="text-base font-semibold text-gray-900 mb-1">{widget.title}</h3>
      <p className="text-xs text-gray-500 mb-4">{widget.description}</p>
      <ResponsiveContainer width="100%" height={240}>
        {widget.chartType === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#7C3AED" 
              strokeWidth={2.5} 
              dot={{ fill: '#7C3AED', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#7C3AED' }}
            />
          </LineChart>
        ) : widget.chartType === 'bar' ? (
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={true} vertical={false} />
            <XAxis 
              type="number"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#7C3AED" radius={[0, 4, 4, 0]} />
          </BarChart>
        ) : widget.chartType === 'area' ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#7C3AED" 
              strokeWidth={2.5}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        ) : widget.chartType === 'pie' || widget.chartType === 'donut' ? (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={widget.chartType === 'donut' ? 60 : 0}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        ) : widget.chartType === 'radar' ? (
          <RadarChart data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 'auto']}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <Radar 
              name="Value" 
              dataKey="value" 
              stroke="#7C3AED" 
              fill="#7C3AED" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        ) : null}
      </ResponsiveContainer>
    </Card>
  );
}

function TableWidget({ widget, data }: { widget: WidgetType; data: DashboardData }) {
  if (!data.tableData || data.tableData.length === 0) return null;

  const columns = Object.keys(data.tableData[0]);

  const getStatusBadge = (value: string | number) => {
    const strValue = String(value).toLowerCase();
    if (strValue.includes('healthy') || strValue.includes('on track') || strValue.includes('success')) {
      return <span className="text-xs font-medium text-green-600">{value}</span>;
    }
    if (strValue.includes('warning') || strValue.includes('medium') || strValue.includes('monitor')) {
      return <span className="text-xs font-medium text-orange-600">{value}</span>;
    }
    if (strValue.includes('critical') || strValue.includes('high') || strValue.includes('error') || strValue.includes('at risk')) {
      return <span className="text-xs font-medium text-red-600">{value}</span>;
    }
    if (strValue.includes('forecasted') || strValue.includes('maintain') || strValue.includes('low')) {
      return <span className="text-xs font-medium text-purple-600">{value}</span>;
    }
    return value;
  };

  const getCellContent = (value: string | number, colName: string) => {
    if (colName.toLowerCase().includes('status') || colName.toLowerCase().includes('priority') || colName.toLowerCase().includes('risk')) {
      return getStatusBadge(value);
    }
    return value;
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <h3 className="text-base font-semibold text-gray-900 mb-1">{widget.title}</h3>
      <p className="text-xs text-gray-500 mb-4">{widget.description}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map(col => (
                <th key={col} className="text-left py-3 px-3 font-semibold text-gray-700 text-xs uppercase tracking-wide">
                  {col.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.tableData.map((row, idx) => (
              <tr 
                key={idx} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {columns.map(col => (
                  <td key={col} className="py-3 px-3 text-gray-900 text-sm">
                    {getCellContent(row[col], col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function InsightWidget({ data }: { data: DashboardData }) {
  if (!data.insights || data.insights.length === 0) return null;

  return (
    <div className="space-y-3">
      {data.insights.map(insight => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}

export function DashboardWidget({ widget, data, style }: DashboardWidgetProps) {
  switch (widget.type) {
    case 'metric':
      return <MetricWidget widget={widget} metrics={data.metrics} />;
    case 'chart':
      return <ChartWidget widget={widget} data={data} />;
    case 'table':
      return <TableWidget widget={widget} data={data} />;
    case 'insight':
      return <InsightWidget data={data} />;
    case 'heatmap':
      return (
        <Card className="p-6 bg-white border border-gray-200" style={style}>
          <h3 className="text-base font-semibold text-gray-900 mb-1">{widget.title}</h3>
          <p className="text-xs text-gray-500 mb-4">{widget.description}</p>
          <div className="flex items-center justify-center h-48 text-gray-400">
            Heatmap visualization
          </div>
        </Card>
      );
    default:
      return null;
  }
}
