import React, { useState } from 'react';
import { Settings, ToggleLeft, DollarSign, Users, BarChart3, Shield, Brain } from 'lucide-react';
import { DEFAULT_FEATURE_CONFIG, SUBSCRIPTION_TIERS } from './adminConfig';

const AdminSettings = ({ currentConfig = DEFAULT_FEATURE_CONFIG, onConfigChange }) => {
  const [config, setConfig] = useState(currentConfig);
  const [activeTab, setActiveTab] = useState('clinical');

  const handleToggle = (category, feature) => {
    const newConfig = {
      ...config,
      [category]: {
        ...config[category],
        [feature]: !config[category][feature]
      }
    };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const handleDeploymentModeChange = (value) => {
    const newConfig = {
      ...config,
      ai: {
        ...config.ai,
        aiDeploymentMode: value
      }
    };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const tabs = [
    { id: 'clinical', label: 'Clinical Team', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'clientManagement', label: 'Client Management', icon: Settings },
    { id: 'interface', label: 'Interface', icon: ToggleLeft },
    { id: 'ai', label: 'AI & Machine Learning', icon: Brain },
    { id: 'subscription', label: 'Subscription', icon: DollarSign }
  ];

  const renderFeatureToggle = (category, feature, label, description, isPremium = false) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-slate-900 dark:text-white">{label}</h4>
          {isPremium && (
            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
              Premium
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
      </div>
      <button
        onClick={() => handleToggle(category, feature)}
        disabled={isPremium}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          config[category]?.[feature] 
            ? 'bg-blue-600' 
            : 'bg-slate-200 dark:bg-slate-700'
        } ${isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            config[category]?.[feature] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Organization Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Configure features and capabilities for your organization
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'clinical' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Clinical Team Features
            </h2>
            {renderFeatureToggle(
              'clinical', 
              'showClinicalCoaches', 
              'Show Clinical Coaches',
              'Display clinical coach assignments in client tables'
            )}
            {renderFeatureToggle(
              'clinical', 
              'showSpecialties', 
              'Show Therapist Specialties',
              'Display detailed specialty information for therapists'
            )}
            {renderFeatureToggle(
              'clinical', 
              'showExperienceYears', 
              'Show Experience Details',
              'Display years of experience and detailed backgrounds'
            )}
            {renderFeatureToggle(
              'clinical', 
              'enableTeamCollaboration', 
              'Team Collaboration Mode',
              'Allow cross-team visibility and collaboration features'
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Analytics & Reporting
            </h2>
            {renderFeatureToggle(
              'analytics', 
              'showDetailedMetrics', 
              'Detailed Metrics',
              'Show comprehensive analytics and performance metrics'
            )}
            {renderFeatureToggle(
              'analytics', 
              'enableCustomReports', 
              'Custom Reports',
              'Create and save custom report configurations',
              true
            )}
            {renderFeatureToggle(
              'analytics', 
              'enableDataExport', 
              'Data Export',
              'Export data to CSV, Excel, and other formats',
              true
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              AI & Machine Learning Features
            </h2>
            
            {/* AI Deployment Mode */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                AI Deployment Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border">
                  <h4 className="font-medium text-sm mb-2">Disabled</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Rule-based matching only</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-sm mb-2">Edge Device</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">On-premises AI appliance ($15k-100k)</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-sm mb-2">Private Cloud</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Multi-facility AI infrastructure ($500k+)</p>
                </div>
              </div>
              <select 
                value={config.ai?.aiDeploymentMode || 'disabled'}
                onChange={(e) => handleDeploymentModeChange(e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
              >
                <option value="disabled">Disabled - Rule-based only</option>
                <option value="edge-device">Edge Device - On-premises AI</option>
                <option value="private-cloud">Private Cloud - Multi-facility AI</option>
              </select>
            </div>

            {/* AI Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Available AI Features
              </h3>
              
              {renderFeatureToggle(
                'ai', 
                'enableSmartRecommendations', 
                'Smart Program Recommendations',
                'AI-powered matching of clients to optimal treatment programs',
                config.ai?.aiDeploymentMode === 'disabled'
              )}
              
              {renderFeatureToggle(
                'ai', 
                'enableRiskPrediction', 
                'Clinical Risk Assessment',
                'Predict clients at risk of treatment dropout with early intervention suggestions',
                config.ai?.aiDeploymentMode === 'disabled'
              )}
              
              {renderFeatureToggle(
                'ai', 
                'enableDocumentProcessing', 
                'Intelligent Document Processing',
                'Extract structured data from intake forms and clinical documents',
                config.ai?.aiDeploymentMode === 'disabled'
              )}
              
              {renderFeatureToggle(
                'ai', 
                'enableFederatedLearning', 
                'Federated Learning Network',
                'Share anonymized insights across facilities to improve AI models',
                config.ai?.aiDeploymentMode !== 'private-cloud'
              )}
            </div>

            {/* HIPAA Compliance Notice */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                HIPAA Compliance Guarantee
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                All AI processing occurs on-premises or in your private cloud. Patient data never leaves your secure network, 
                ensuring complete HIPAA compliance and data sovereignty.
              </p>
            </div>

            {/* Hardware Requirements */}
            {config.ai?.aiDeploymentMode !== 'disabled' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Hardware Requirements
                </h4>
                {config.ai?.aiDeploymentMode === 'edge-device' && (
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p><strong>Small Clinic:</strong> Custom AI Box - $15,000 + $299/month</p>
                    <p><strong>Medium Facility:</strong> NVIDIA DGX Station - $99,000 + $599/month</p>
                    <p><strong>Network Requirements:</strong> 1Gbps, dedicated VLAN</p>
                  </div>
                )}
                {config.ai?.aiDeploymentMode === 'private-cloud' && (
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p><strong>Infrastructure:</strong> 3-10 GPU compute nodes - $500,000+</p>
                    <p><strong>Monthly Service:</strong> $1,999/month for multi-facility networks</p>
                    <p><strong>Compliance:</strong> HIPAA, HITECH, SOC2 Type II certified</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Subscription Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(SUBSCRIPTION_TIERS).map(([tier, details]) => (
                <div 
                  key={tier} 
                  className={`rounded-lg border p-6 ${
                    tier === 'aiEnterprise' 
                      ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-300 dark:border-purple-600 relative' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {tier === 'aiEnterprise' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        🚀 ENTERPRISE AI
                      </span>
                    </div>
                  )}
                  
                  <h3 className={`text-lg font-semibold mb-2 ${
                    tier === 'aiEnterprise' ? 'text-purple-900 dark:text-purple-100' : 'text-slate-900 dark:text-white'
                  }`}>
                    {details.name}
                  </h3>
                  
                  <p className={`text-2xl font-bold mb-4 ${
                    tier === 'aiEnterprise' ? 'text-purple-600' : 'text-blue-600'
                  }`}>
                    {details.price}
                  </p>
                  
                  {details.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {details.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Features:</p>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {details.features?.slice(0, tier === 'aiEnterprise' ? 8 : 5).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            tier === 'aiEnterprise' ? 'bg-purple-600' : 'bg-blue-600'
                          }`}></div>
                          {feature.split('.').pop()}
                        </li>
                      ))}
                    </ul>
                    
                    {details.requirements && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Requirements:</p>
                        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                          <p>• {details.requirements.hardware}</p>
                          <p>• {details.requirements.network}</p>
                          <p>• {details.requirements.support}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
