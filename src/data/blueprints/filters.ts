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
  }
];

export const solutionBuildFilters: FilterConfig[] = [
  {
    key: 'buildComplexity',
    label: 'Build Complexity',
    type: 'checkbox',
    options: [
      { value: 'basic', label: 'Basic' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' }
    ]
  },
  {
    key: 'automationLevel',
    label: 'Automation Level',
    type: 'checkbox',
    options: [
      { value: 'manual', label: 'Manual' },
      { value: 'semi-automated', label: 'Semi-Automated' },
      { value: 'fully-automated', label: 'Fully Automated' }
    ]
  },
  {
    key: 'hasCodeSamples',
    label: 'Has Code Samples',
    type: 'checkbox',
    options: [{ value: 'true', label: 'Yes' }]
  }
];
