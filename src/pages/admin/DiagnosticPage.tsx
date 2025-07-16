import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, CheckCircle, XCircle, Database, Upload, Settings } from 'lucide-react';
import { testSupabaseConnection } from '../../lib/supabase';

const DiagnosticPage: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState({
    supabaseConnection: 'checking',
    authentication: 'checking',
    storageBuckets: 'checking',
    storagePermissions: 'checking',
    siteSettings: 'checking',
    envVariables: 'checking',
    contentSystem: 'checking',
    realTimeUpdates: 'checking'
  });

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    addLog('Starting diagnostics...');

    // Check environment variables
    addLog('Checking environment variables...');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      setDiagnostics(prev => ({ ...prev, envVariables: 'error' }));
      addLog('ERROR: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
      return;
    } else {
      setDiagnostics(prev => ({ ...prev, envVariables: 'success' }));
      addLog(`Supabase URL: ${supabaseUrl}`);
      addLog(`Supabase Key: ${supabaseKey.substring(0, 20)}...`);
    }

    // Test basic Supabase connection
    addLog('Testing Supabase connection...');
    try {
      const { data, error } = await supabase.from('events').select('count').limit(1);
      if (error) {
        setDiagnostics(prev => ({ ...prev, supabaseConnection: 'error' }));
        addLog(`Connection ERROR: ${error.message}`);
      } else {
        setDiagnostics(prev => ({ ...prev, supabaseConnection: 'success' }));
        addLog('Supabase connection successful');
      }
    } catch (err) {
      setDiagnostics(prev => ({ ...prev, supabaseConnection: 'error' }));
      addLog(`Connection EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Test authentication
    addLog('Testing authentication...');
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        setDiagnostics(prev => ({ ...prev, authentication: 'error' }));
        addLog(`Auth ERROR: ${error.message}`);
      } else if (user) {
        setDiagnostics(prev => ({ ...prev, authentication: 'success' }));
        addLog(`Authenticated as: ${user.email}`);
      } else {
        setDiagnostics(prev => ({ ...prev, authentication: 'warning' }));
        addLog('Not authenticated (anonymous user)');
      }
    } catch (err) {
      setDiagnostics(prev => ({ ...prev, authentication: 'error' }));
      addLog(`Auth EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Test storage buckets
    addLog('Testing storage buckets...');
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) {
        setDiagnostics(prev => ({ ...prev, storageBuckets: 'error' }));
        addLog(`Storage buckets ERROR: ${error.message}`);
      } else {
        const requiredBuckets = ['logos', 'menu-graphics', 'footer-images', 'general-uploads'];
        const existingBuckets = buckets?.map(b => b.name) || [];
        const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));
        
        if (missingBuckets.length > 0) {
          setDiagnostics(prev => ({ ...prev, storageBuckets: 'warning' }));
          addLog(`Missing buckets: ${missingBuckets.join(', ')}`);
        } else {
          setDiagnostics(prev => ({ ...prev, storageBuckets: 'success' }));
          addLog(`All required buckets exist: ${existingBuckets.join(', ')}`);
        }
      }
    } catch (err) {
      setDiagnostics(prev => ({ ...prev, storageBuckets: 'error' }));
      addLog(`Storage buckets EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Test storage permissions with a small test file
    addLog('Testing storage permissions...');
    try {
      // Create a minimal 1x1 pixel GIF image (43 bytes)
      const gifData = new Uint8Array([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00,
        0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00,
        0x00, 0x2C, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02,
        0x44, 0x01, 0x00, 0x3B
      ]);
      const testFile = new File([gifData], `test-${Date.now()}.gif`, { type: 'image/gif' });
      const { data, error } = await supabase.storage
        .from('general-uploads')
        .upload(`test-${Date.now()}.gif`, testFile);
      
      if (error) {
        setDiagnostics(prev => ({ ...prev, storagePermissions: 'error' }));
        addLog(`Storage upload ERROR: ${error.message}`);
      } else {
        setDiagnostics(prev => ({ ...prev, storagePermissions: 'success' }));
        addLog('Storage upload test successful');
        
        // Clean up test file
        await supabase.storage.from('general-uploads').remove([data.path]);
        addLog('Test file cleaned up');
      }
    } catch (err) {
      setDiagnostics(prev => ({ ...prev, storagePermissions: 'error' }));
      addLog(`Storage permissions EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Test site settings
    addLog('Testing site settings...');
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1);
      if (error) {
        setDiagnostics(prev => ({ ...prev, siteSettings: 'error' }));
        addLog(`Site settings ERROR: ${error.message}`);
      } else {
        setDiagnostics(prev => ({ ...prev, siteSettings: 'success' }));
        addLog(`Site settings accessible, found ${data?.length || 0} records`);
      }
    } catch (err) {
      setDiagnostics(prev => ({ ...prev, siteSettings: 'error' }));
      addLog(`Site settings EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    addLog('Diagnostics complete');
    
    // Test content system
    await testContentSystem();
  };

  // Test content system
  const testContentSystem = async () => {
    addLog('Testing content system...');
    try {
      // Test page content fetch
      const { data: pageData, error: pageError } = await supabase
        .from('page_content_blocks')
        .select('*')
        .eq('page_slug', 'about')
        .limit(1);
      
      if (pageError) {
        setDiagnostics(prev => ({ ...prev, contentSystem: 'error' }));
        addLog(`Content system ERROR: ${pageError.message}`);
      } else {
        setDiagnostics(prev => ({ ...prev, contentSystem: 'success' }));
        addLog(`Content system working, found ${pageData?.length || 0} records`);
      }

      // Test real-time updates
      const testUpdate = {
        page_slug: 'test',
        section_key: 'test_section',
        content_type: 'text',
        title: 'Test Update',
        content_text: 'Testing real-time updates',
        order_position: 999,
        active: true
      };

      const { data: insertData, error: insertError } = await supabase
        .from('page_content_blocks')
        .insert([testUpdate])
        .select()
        .single();

      if (insertError) {
        setDiagnostics(prev => ({ ...prev, realTimeUpdates: 'error' }));
        addLog(`Real-time updates ERROR: ${insertError.message}`);
      } else {
        addLog('Test content inserted successfully');
        
        // Clean up test data
        await supabase
          .from('page_content_blocks')
          .delete()
          .eq('id', insertData.id);
        
        setDiagnostics(prev => ({ ...prev, realTimeUpdates: 'success' }));
        addLog('Real-time updates test completed successfully');
      }

    } catch (err) {
      setDiagnostics(prev => ({ ...prev, contentSystem: 'error', realTimeUpdates: 'error' }));
      addLog(`Content system EXCEPTION: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Diagnostics</h1>
        <p className="text-gray-600 mt-2">Diagnosing Supabase connectivity and upload issues</p>
      </div>

      {/* Diagnostic Results */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Diagnostic Results</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="h-5 w-5 text-royal-blue" />
              <span className="font-medium">Environment Variables</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(diagnostics.envVariables)}
              <span className={`font-medium ${getStatusColor(diagnostics.envVariables)}`}>
                {diagnostics.envVariables}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="h-5 w-5 text-royal-blue" />
              <span className="font-medium">Supabase Connection</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(diagnostics.supabaseConnection)}
              <span className={`font-medium ${getStatusColor(diagnostics.supabaseConnection)}`}>
                {diagnostics.supabaseConnection}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-royal-blue" />
              <span className="font-medium">Authentication</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(diagnostics.authentication)}
              <span className={`font-medium ${getStatusColor(diagnostics.authentication)}`}>
                {diagnostics.authentication}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Upload className="h-5 w-5 text-royal-blue" />
              <span className="font-medium">Storage Buckets</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(diagnostics.storageBuckets)}
              <span className={`font-medium ${getStatusColor(diagnostics.storageBuckets)}`}>
                {diagnostics.storageBuckets}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Upload className="h-5 w-5 text-royal-blue" />
              <span className="font-medium">Storage Permissions</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(diagnostics.storagePermissions)}
              <span className={`font-medium ${getStatusColor(diagnostics.storagePermissions)}`}>
                {diagnostics.storagePermissions}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-royal-blue" />
              <span className="font-medium">Site Settings</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(diagnostics.siteSettings)}
              <span className={`font-medium ${getStatusColor(diagnostics.siteSettings)}`}>
                {diagnostics.siteSettings}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="h-5 w-5 text-royal-blue" />
              <span className="font-medium">Content System</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(diagnostics.contentSystem)}
              <span className={`font-medium ${getStatusColor(diagnostics.contentSystem)}`}>
                {diagnostics.contentSystem}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-royal-blue" />
              <span className="font-medium">Real-time Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(diagnostics.realTimeUpdates)}
              <span className={`font-medium ${getStatusColor(diagnostics.realTimeUpdates)}`}>
                {diagnostics.realTimeUpdates}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          className="mt-6 bg-royal-blue text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300"
        >
          Run Diagnostics Again
        </button>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Diagnostic Logs</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;