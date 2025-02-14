import React, { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Building, Calculator, Settings, FileText, Plus, Trash2 } from 'lucide-react';

export default function AdminPanel() {
  const { settings, updateSettings, addResource, removeResource } = useAdminStore();
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    category: '',
    url: '',
    type: 'pdf' as const,
  });

  // Ensure we have default values for nested objects
  const locationFactors = settings.assumptions?.locationFactors || {
    urban: 1.2,
    suburban: 1.0,
    rural: 0.8
  };

  const qualityFactors = settings.assumptions?.qualityFactors || {
    standard: 1.0,
    premium: 1.3,
    luxury: 1.6
  };

  // Helper function to ensure numeric values
  const handleNumericInput = (value: string, field: string, parent?: string) => {
    const numValue = value === '' ? 0 : Number(value);
    if (parent === 'assumptions') {
      updateSettings({
        assumptions: {
          ...settings.assumptions,
          [field]: numValue
        }
      });
    } else {
      updateSettings({ [field]: numValue });
    }
  };

  // Helper function to update location factors
  const updateLocationFactor = (type: 'urban' | 'suburban' | 'rural', value: number) => {
    updateSettings({
      assumptions: {
        ...settings.assumptions,
        locationFactors: {
          ...locationFactors,
          [type]: value
        }
      }
    });
  };

  // Helper function to update quality factors
  const updateQualityFactor = (type: 'standard' | 'premium' | 'luxury', value: number) => {
    updateSettings({
      assumptions: {
        ...settings.assumptions,
        qualityFactors: {
          ...qualityFactors,
          [type]: value
        }
      }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddResource = () => {
    if (newResource.title && newResource.url) {
      addResource(newResource);
      setNewResource({
        title: '',
        description: '',
        category: '',
        url: '',
        type: 'pdf',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Branding Settings */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Branding Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => updateSettings({ siteName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Color
            </label>
            <input
              type="color"
              value={settings.brandColor}
              onChange={(e) => updateSettings({ brandColor: e.target.value })}
              className="w-full h-10 px-2 py-1 border rounded-lg"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Header
            </label>
            <input
              type="text"
              value={settings.reportHeader}
              onChange={(e) => updateSettings({ reportHeader: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Base Price Settings */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Base Price Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Price per Sq. Ft (PKR)
            </label>
            <input
              type="number"
              value={settings.pricePerSqFt || 0}
              onChange={(e) => handleNumericInput(e.target.value, 'pricePerSqFt')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Labor Cost per Day (PKR)
            </label>
            <input
              type="number"
              value={settings.laborCostPerDay || 0}
              onChange={(e) => handleNumericInput(e.target.value, 'laborCostPerDay')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foundation Cost per Sq. Ft (PKR)
            </label>
            <input
              type="number"
              value={settings.assumptions.foundationCostPerSqFt || 0}
              onChange={(e) => handleNumericInput(e.target.value, 'foundationCostPerSqFt', 'assumptions')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Material Prices */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Building className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Material Prices</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brick Price (PKR)
            </label>
            <input
              type="number"
              value={settings.brickPrice || 0}
              onChange={(e) => handleNumericInput(e.target.value, 'brickPrice')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cement Price per Bag (PKR)
            </label>
            <input
              type="number"
              value={settings.cementPrice || 0}
              onChange={(e) => handleNumericInput(e.target.value, 'cementPrice')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Steel Price per Ton (PKR)
            </label>
            <input
              type="number"
              value={settings.steelPrice || 0}
              onChange={(e) => handleNumericInput(e.target.value, 'steelPrice')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sand Price per CFT (PKR)
            </label>
            <input
              type="number"
              value={settings.sandPrice || 0}
              onChange={(e) => handleNumericInput(e.target.value, 'sandPrice')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Resources Management */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Resources Management</h2>
        </div>

        <div className="space-y-6">
          {/* Add New Resource */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Add New Resource</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource({ ...newResource, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter resource title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newResource.category}
                  onChange={(e) =>
                    setNewResource({ ...newResource, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Checklists, Formulas, Guidelines"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newResource.description}
                  onChange={(e) =>
                    setNewResource({ ...newResource, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter resource description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF URL
                </label>
                <input
                  type="url"
                  value={newResource.url}
                  onChange={(e) =>
                    setNewResource({ ...newResource, url: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter PDF URL"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={handleAddResource}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Resource</span>
                </button>
              </div>
            </div>
          </div>

          {/* Current Resources */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Current Resources</h3>
            <div className="space-y-4">
              {settings.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                    <p className="text-xs text-gray-500">
                      Category: {resource.category}
                    </p>
                  </div>
                  <button
                    onClick={() => removeResource(resource.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}