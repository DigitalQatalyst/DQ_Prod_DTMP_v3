// Solutions Specs Data Structures and Mock Data

export interface BlueprintComponent {
  id: string;
  name: string;
  type: string;
  description: string;
  responsibilities: string[];
  interfaces: string[];
  dependencies: string[];
  technology?: string;
}

export interface ArchitectureBlueprint {
  id: string;
  title: string;
  category: 'cloud' | 'microservices' | 'data' | 'integration' | 'security' | 'enterprise';
  subcategory: string;
  description: string;
  longDescription: string;
  author: {
    name: string;
    role: string;
    organization: string;
  };
  version: string;
  lastUpdated: string;
  p