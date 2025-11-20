import React, { useState, useEffect, useRef, useMemo } from 'react';

const ApperFileFieldComponent = ({ elementId, config }) => {
  // State for UI-driven values
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs for tracking lifecycle and preventing memory leaks
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementId ref when elementId changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoize existingFiles to prevent unnecessary re-renders
  const memoizedExistingFiles = useMemo(() => {
    if (!config?.existingFiles || !Array.isArray(config.existingFiles)) {
      return [];
    }
    
    // Detect actual changes by comparing length and first file's ID
    if (config.existingFiles.length !== existingFilesRef.current.length) {
      return config.existingFiles;
    }
    
    if (config.existingFiles.length > 0 && existingFilesRef.current.length > 0) {
      const currentId = config.existingFiles[0]?.Id || config.existingFiles[0]?.id;
      const previousId = existingFilesRef.current[0]?.Id || existingFilesRef.current[0]?.id;
      
      if (currentId !== previousId) {
        return config.existingFiles;
      }
    }
    
    return existingFilesRef.current;
  }, [config?.existingFiles]);

  // Initial mount effect
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Wait for ApperSDK to load - max 50 attempts × 100ms = 5 seconds
        let attempts = 0;
        while (!window.ApperSDK && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded. Please ensure the SDK script is included before this component.');
        }

        const { ApperFileUploader } = window.ApperSDK;
        elementIdRef.current = `file-uploader-${elementId}`;
        
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: memoizedExistingFiles
        });

        mountedRef.current = true;
        existingFilesRef.current = memoizedExistingFiles;
        setIsReady(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize file uploader:', err);
        setError(err.message);
        setIsReady(false);
      }
    };

    initializeSDK();

    // Cleanup on component destruction
    return () => {
      try {
        if (mountedRef.current && window.ApperSDK) {
          const { ApperFileUploader } = window.ApperSDK;
          ApperFileUploader.FileField.unmount(elementIdRef.current);
        }
        mountedRef.current = false;
        existingFilesRef.current = [];
      } catch (err) {
        console.error('Error during cleanup:', err);
      }
    };
  }, [elementId, config.fieldName, config.tableName, config.apperProjectId, config.apperPublicKey]);

  // File update effect
  useEffect(() => {
    if (!isReady || !window.ApperSDK || !config?.fieldKey) return;

    // Deep equality check with JSON.stringify
    if (JSON.stringify(memoizedExistingFiles) === JSON.stringify(existingFilesRef.current)) {
      return;
    }

    try {
      const { ApperFileUploader } = window.ApperSDK;
      
      // Format detection - check for .Id vs .id property
      let filesToUpdate = memoizedExistingFiles;
      if (memoizedExistingFiles.length > 0) {
        const firstFile = memoizedExistingFiles[0];
        // If files have .Id property, convert to UI format
        if (firstFile.Id !== undefined) {
          filesToUpdate = ApperFileUploader.toUIFormat(memoizedExistingFiles);
        }
      }

      if (filesToUpdate.length > 0) {
        ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
      } else {
        ApperFileUploader.FileField.clearField(config.fieldKey);
      }
      
      existingFilesRef.current = memoizedExistingFiles;
    } catch (err) {
      console.error('Error updating files:', err);
      setError(err.message);
    }
  }, [memoizedExistingFiles, isReady, config?.fieldKey]);

  // Error UI
  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-md bg-red-50">
        <p className="text-red-600 text-sm">Error loading file uploader: {error}</p>
      </div>
    );
  }

  return (
    <div className="file-uploader-container">
      {!isReady && (
        <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md bg-gray-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-gray-600">Loading file uploader...</span>
        </div>
      )}
      <div id={`file-uploader-${elementId}`} className="file-upload-field"></div>
    </div>
  );
};

export default ApperFileFieldComponent;