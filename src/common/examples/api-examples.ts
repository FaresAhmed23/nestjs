export const API_EXAMPLES = {
  auth: {
    register: {
      client: {
        email: 'newclient@example.com',
        password: 'securePassword123',
        role: 'client',
        companyName: 'New Company Inc'
      },
      admin: {
        email: 'newadmin@example.com',
        password: 'adminPassword123',
        role: 'admin'
      }
    },
    login: {
      email: 'admin@expanders360.com',
      password: 'admin123'
    }
  },
  projects: {
    create: {
      country: 'USA',
      servicesNeeded: ['Legal', 'HR', 'Accounting'],
      budget: 50000,
      status: 'active'
    }
  },
  vendors: {
    create: {
      name: 'Global Expansion Partners',
      countriesSupported: ['USA', 'Canada', 'UK'],
      servicesOffered: ['Legal', 'HR', 'Accounting'],
      rating: 4.8,
      responseSlaHours: 24
    }
  },
  documents: {
    create: {
      projectId: '123e4567-e89b-12d3-a456-426614174000',
      title: 'USA Market Entry Strategy',
      content: 'Comprehensive analysis of the US market for software companies...',
      tags: ['usa', 'market-research', 'software', 'legal-requirements'],
      metadata: {
        department: 'Legal',
        version: '1.0',
        confidential: true
      }
    },
    search: {
      tags: ['usa', 'legal'],
      text: 'employment law'
    }
  }
};
