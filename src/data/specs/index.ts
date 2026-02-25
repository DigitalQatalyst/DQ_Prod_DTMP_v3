// Solutions Specs Data Exports
export * from './types';
export * from './blueprints';
export * from './templates';
export * from './patterns';
export * from './userDesigns';

import { architectureBlueprints } from './blueprints';
import { designTemplates } from './templates';
import { designPatterns } from './patterns';
import { userDesigns } from './userDesigns';

// Solutions Specs Statistics
export const specsStats = {
  totalBlueprints: architectureBlueprints.length,
  totalTemplates: designTemplates.length,
  totalPatterns: designPatterns.length,
  totalUserDesigns: userDesigns.length,
  
  blueprintsByCategory: {
    cloud: architectureBlueprints.filter(b => b.category === 'cloud').length,
    microservices: architectureBlueprints.filter(b => b.category === 'microservices').length,
    data: architectureBlueprints.filter(b => b.category === 'data').length,
    integration: architectureBlueprints.filter(b => b.category === 'integration').length,
    security: architectureBlueprints.filter(b => b.category === 'security').length,
    enterprise: architectureBlueprints.filter(b => b.category === 'enterprise').length
  },
  
  templatesByType: {
    document: designTemplates.filter(t => t.templateType === 'document').length,
    diagram: designTemplates.filter(t => t.templateType === 'diagram').length,
    checklist: designTemplates.filter(t => t.templateType === 'checklist').length,
    framework: designTemplates.filter(t => t.templateType === 'framework').length,
    worksheet: designTemplates.filter(t => t.templateType === 'worksheet').length
  },
  
  patternsByType: {
    architectural: designPatterns.filter(p => p.patternType === 'architectural').length,
    integration: designPatterns.filter(p => p.patternType === 'integration').length,
    data: designPatterns.filter(p => p.patternType === 'data').length,
    security: designPatterns.filter(p => p.patternType === 'security').length,
    performance: designPatterns.filter(p => p.patternType === 'performance').length,
    resilience: designPatterns.filter(p => p.patternType === 'resilience').length
  },
  
  userDesignsByStatus: {
    draft: userDesigns.filter(d => d.status === 'draft').length,
    'in-review': userDesigns.filter(d => d.status === 'in-review').length,
    approved: userDesigns.filter(d => d.status === 'approved').length,
    implemented: userDesigns.filter(d => d.status === 'implemented').length,
    archived: userDesigns.filter(d => d.status === 'archived').length
  }
};




