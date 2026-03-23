export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'checkbox' | 'radio' | 'select' | 'range';
  options?: FilterOption[];
  defaultValue?: string | number | boolean | string[];
}

export const solutionSpecsFilters: FilterConfig[] = [
  {
    key: 'scope',
    label: 'Scope',
    type: 'checkbox',
    options: [
      { value: 'enterprise', label: 'Enterprise' },
      { value: 'departmental', label: 'Departmental' },
      { value: 'project', label: 'Project' }
    ]
  },
  {
    key: 'maturityLevel',
    label: 'Maturity Level',
    type: 'checkbox',
    options: [
      { value: 'conceptual', label: 'Conceptual' },
      { value: 'proven', label: 'Proven' },
      { value: 'reference', label: 'Reference' }
    ]
  },
  {
    key: 'hasDiagrams',
    label: 'Has Diagrams',
    type: 'checkbox',
    options: [{ value: 'true', label: 'Yes' }]
  },
  {
    key: 'divisionRelevance',
    label: 'Division Relevance',
    type: 'checkbox',
    options: [
      { value: 'Generation', label: 'Generation' },
      { value: 'Transmission', label: 'Transmission' },
      { value: 'Distribution', label: 'Distribution' },
      { value: 'Water Services', label: 'Water Services' },
      { value: 'Customer Services', label: 'Customer Services' },
      { value: 'Digital DEWA & Moro Hub', label: 'Digital DEWA & Moro Hub' },
      { value: 'All Divisions', label: 'All Divisions' }
    ]
  },
  {
    key: 'stream',
    label: 'DBP Stream',
    type: 'checkbox',
    options: [
      { value: 'DBP', label: 'DBP' },
      { value: 'DXP', label: 'DXP' },
      { value: 'DWS', label: 'DWS' },
      { value: 'DIA', label: 'DIA' },
      { value: 'SDO', label: 'SDO' }
    ]
  }
];

export const solutionBuildFilters: FilterConfig[] = [
  {
    key: 'complexity',
    label: 'Complexity',
    type: 'checkbox',
    options: [
      { label: 'Low', value: 'Low' },
      { label: 'Medium', value: 'Medium' },
      { label: 'High', value: 'High' },
    ],
  },
  {
    key: 'divisionRelevance',
    label: 'Division Relevance',
    type: 'checkbox',
    options: [
      { label: 'Generation', value: 'Generation' },
      { label: 'Transmission', value: 'Transmission' },
      { label: 'Distribution', value: 'Distribution' },
      { label: 'Water Services', value: 'Water Services' },
      { label: 'Customer Services', value: 'Customer Services' },
      { label: 'Digital DEWA & Moro Hub', value: 'Digital DEWA & Moro Hub' },
      { label: 'All Divisions', value: 'All Divisions' },
    ],
  },
  {
    key: 'timeline',
    label: 'Timeline',
    type: 'checkbox',
    options: [
      { label: 'Short  (≤ 8 weeks)', value: 'short' },
      { label: 'Medium (9–16 weeks)', value: 'medium' },
      { label: 'Long   (17+ weeks)', value: 'long' },
    ],
  },
];
