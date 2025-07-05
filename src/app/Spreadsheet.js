"use client"
import React, { useEffect, useState } from 'react';
import { 
  FiEye, FiFilter, FiUpload, FiDownload, FiShare2, 
  FiSearch, FiBell, FiUser, FiCalendar, FiLink, 
  FiFlag, FiCheckCircle, FiClock, FiUserCheck, FiPlus,
  FiChevronDown, FiMove, FiArrowLeftCircle, FiMoreHorizontal, FiChevronsRight, FiArrowUpLeft, FiArrowDownRight,
  FiAlertTriangle, FiX, FiCopy,
  FiCircle,
  FiXCircle,
  FiRotateCcw
} from 'react-icons/fi';
import { saveSpreadsheetData } from './api';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const generateRandomKey = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 24;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
      <div className="w-12 h-12 border-4 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
    </div>
  );
};

const Spreadsheet = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const statusOptions = ['       ','In-process', 'Need to start', 'Complete', 'Blocked'];
  const priorityOptions = ['High', 'Medium', 'Low',' '];
  const [rowCount, setRowCount] = useState(50);
  const [hiddenFields, setHiddenFields] = useState([]);
  const [showHideFields, setShowHideFields] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCellViewDropdown, setShowCellViewDropdown] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    status: null,
    priority: null
  });
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [importKey, setImportKey] = useState('');
  const [exportKey, setExportKey] = useState("");
  const [shareUrl, setShareUrl] = useState('');
  const [activeInput, setActiveInput] = useState(null);
  const [key, setKey] = useState("");
  const [undo, setUndo] = useState(false);
  const [undoData, setUndodata] = useState([]);
  const searchParams = useSearchParams();
  useEffect(() => {
 const paramKey = searchParams.get("key");
  const finalKey = paramKey || generateRandomKey();
  setKey(finalKey);
  setExportKey(finalKey);
  }, []);


  useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
      setLoading(true);
      axios.get(`https://reactspreadsheetnode.onrender.com/api/spreadsheet/${key}`)
        .then(res => {
          if (res.data.success) {
           
            const dataWithIds = res.data.data.data.map(row => ({
              ...row,
              id: row.id || generateRandomKey()
            }));
            setData(dataWithIds);
          } else {
            console.error('No data found');
          }
        })
        .catch(err => {
          console.error('Error fetching data', err);
        }).finally(() => {
          setLoading(false);
        });
    }
  }, [searchParams]);

  const initializeData = (count) => {
    const sampleData = [
      {
        jobRequest: 'Launch social media campaign for Q3',
        submitted: 'May 15',
        status: 'In-process',
        submitter: 'Annie Christine',
        url: 'https://react-spreadsheet-3f7b.vercel.app/?key=KHOWHZOmc4o2I7p9sKY3QSFf',
        assigned: 'John Doe',
        priority: 'Medium',
        dueDate: 'Jun 30',
        estValue: '$5,000'
      },
      {
        jobRequest: 'Website redesign project',
        submitted: 'Apr 20',
        status: 'Complete',
        submitter: 'Michael Brown',
        url: 'https://react-spreadsheet-3f7b.vercel.app/?key=QxWQIEWSMUDpwANBmT33xNbF',
        assigned: 'Sarah Johnson',
        priority: 'High',
        dueDate: 'May 31',
        estValue: '$15,000'
      },
      {
        jobRequest: 'Product launch preparation',
        submitted: 'Jun 1',
        status: 'Need to start',
        submitter: 'Emily Wilson',
        url: 'https://react-spreadsheet-3f7b.vercel.app/?key=KHOWHZOmc4o2I7p9sKY3QSFf',
        assigned: 'David Lee',
        priority: 'Medium',
        dueDate: 'Jul 15',
        estValue: '$10,000'
      },
      {
        jobRequest: 'Quarterly financial report',
        submitted: 'May 10',
        status: 'In-process',
        submitter: 'Robert Taylor',
        url: 'https://react-spreadsheet-3f7b.vercel.app/?key=QxWQIEWSMUDpwANBmT33xNbF',
        assigned: 'Lisa Chen',
        priority: 'High',
        dueDate: 'Jun 20',
        estValue: '$7,500'
      },
      {
        jobRequest: 'Customer satisfaction survey',
        submitted: 'May 25',
        status: 'Blocked',
        submitter: 'James Miller',
        url: 'https://react-spreadsheet-3f7b.vercel.app/?key=QxWQIEWSMUDpwANBmT33xNbF',
        assigned: 'Karen White',
        priority: 'Low',
        dueDate: 'Jun 10',
        estValue: '$3,000'
      }
    ];
    
    return Array.from({ length: count }, (_, i) => ({
      id: generateRandomKey(), 
      ...(i < sampleData.length ? sampleData[i] : {
        jobRequest: '',
        submitted: '',
        status: '',
        submitter: '',
        url: '',
        assigned: '',
        priority: '',
        dueDate: '',
        estValue: ''
      })
    }));
  };

  const [data, setData] = useState(initializeData(rowCount));

  const handleCellChange = (rowId, field, value) => {
    setData(prevData => 
      prevData.map(row => 
        row.id === rowId 
          ? { ...row, [field]: value } 
          : row
      )
    );
  };

  const toggleFieldVisibility = (field) => {
    setHiddenFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field) 
        : [...prev, field]
    );
  };

  const toggleDropdown = (type, rowId) => {
    const dropdownId = `${type}-${rowId}`;
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const handleOptionSelect = (rowId, field, value) => {
    handleCellChange(rowId, field, value);
    setActiveDropdown(null);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'bg-white text-red-600';
      case 'Medium': return 'bg-white text-orange-400';
      case 'Low': return 'bg-white text-green-400';
      default: return 'bg-white text-gray-800';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'In-process': return 'bg-blue-100 text-blue-800';
      case 'Need to start': return 'bg-gray-100 text-gray-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-white text-gray-800';
    }
  };

  const handleSort = (key) => {
    setSortConfig({ key, direction: 'asc' });
    setShowSortDropdown(false);
  };

  const handleFilterSelect = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setShowFilterDropdown(false);
  };

  const resetFilters = () => {
    setFilters({
      status: null,
      priority: null
    });
    setShowFilterDropdown(false);
  };

  const handleRowCountChange = (count) => {
    setRowCount(count);
    setData(initializeData(count));
    setShowCellViewDropdown(false);
  };

  const handleInputFocus = (rowId, field) => {
    setActiveInput(`${rowId}-${field}`);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  const monthOrder = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
  };

  const sortedAndFilteredData = React.useMemo(() => {
    const parseDateValue = (dateStr) => {
      if (!dateStr) return null;

      if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day).getTime();
      }

      if (/^[A-Za-z]{3} \d{1,2}$/.test(dateStr)) {
        const [monthName, day] = dateStr.split(' ');
        const month = monthOrder[monthName];
        const year = new Date().getFullYear();
        return new Date(year, month - 1, parseInt(day)).getTime();
      }

      return null;
    };

    let filteredData = [...data];

    if (filters.status) {
      filteredData = filteredData.filter(row => row.status === filters.status);
    }
    if (filters.priority) {
      filteredData = filteredData.filter(row => row.priority === filters.priority);
    }

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'submitted' || sortConfig.key === 'dueDate') {
          aValue = parseDateValue(aValue);
          bValue = parseDateValue(bValue);

          if (aValue === null) aValue = sortConfig.direction === 'asc' ? Infinity : -Infinity;
          if (bValue === null) bValue = sortConfig.direction === 'asc' ? Infinity : -Infinity;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [data, filters, sortConfig]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      await saveSpreadsheetData(data, key);
      setSaveStatus({ type: 'success', message: 'Data saved successfully!' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to save data. Please try again.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };
  
  const handleImport = async () => {
  if (!importKey.trim()) {
    alert('Please enter a valid key');
    return;
  }

  try {
    const result = await axios.get(`https://reactspreadsheetnode.onrender.com/api/spreadsheet/${importKey}`);
    if (result.data.success) {
      
      const nonEmptyImportedRows = result.data.data.data.filter(importedRow => {
      
        return Object.entries(importedRow).some(([key, value]) => 
          key !== 'id' && value !== '' && value !== null && value !== undefined
        );
      });

      
      const firstEmptyRowIndex = data.findIndex(row => {
        return Object.entries(row).every(([key, value]) => 
          key === 'id' || value === '' || value === null || value === undefined
        );
      });

      
      let updatedData;
      if (firstEmptyRowIndex === -1) {
        
        updatedData = [...data, ...nonEmptyImportedRows.map(row => ({
          ...row,
          id: row.id || generateRandomKey()
        }))];
      } else {
       
        updatedData = [...data];
        nonEmptyImportedRows.forEach((importedRow, i) => {
          const targetIndex = firstEmptyRowIndex + i;
          if (targetIndex < updatedData.length) {
            updatedData[targetIndex] = {
              ...updatedData[targetIndex], 
              ...importedRow,            
              id: updatedData[targetIndex].id 
            };
          } else {
           
            updatedData.push({
              ...importedRow,
              id: generateRandomKey()
            });
          }
        });
      }

      setData(updatedData);
    
      setSaveStatus({ type: 'success', message: 'Data imported successfully!' });
    } else {
      setSaveStatus({ type: 'error', message: result.message || 'Failed to import data' });
    }
  } catch (error) {
    setSaveStatus({ type: 'error', message: 'Error importing data' });
  } finally {
    setShowImportModal(false);
    setTimeout(() => setSaveStatus(null), 3000);
  }
};

  const handleExport = () => {
    setExportKey(key);
    setShowExportModal(true);
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?key=${key}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSaveStatus({ type: 'success', message: 'Copied to clipboard!' });
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const reset = () => {
    setUndo(true);
    setUndodata(data);
    const clearedData = data.map(item => ({
      id: item.id, 
      jobRequest: "",
      submitted: "",
      status: "",
      submitter: "",
      assigned: "",
      dueDate: "",
      estValue: "",
      priority: "",
      url: ""
    }));
    setData(clearedData);
  };

  const revert = () => {
    setData(undoData);
    setUndo(false);
  };
  useEffect(() => {
  const handleKeyDown = (e) => {
    if (!activeInput) return;

    const [rowId, field] = activeInput.split('-');
    const currentRowIndex = data.findIndex(row => row.id === rowId);
    
    if (currentRowIndex === -1) return;

    const fieldsOrder = [
      'jobRequest', 'submitted', 'status', 'submitter', 
      'url', 'assigned', 'priority', 'dueDate', 'estValue'
    ].filter(f => !hiddenFields.includes(f));

    const currentFieldIndex = fieldsOrder.indexOf(field);
    
    let newRowIndex = currentRowIndex;
    let newFieldIndex = currentFieldIndex;

    switch (e.key) {
      case 'ArrowRight':
        if (currentFieldIndex < fieldsOrder.length - 1) {
          newFieldIndex = currentFieldIndex + 1;
        } else if (currentRowIndex < data.length - 1) {
          newRowIndex = currentRowIndex + 1;
          newFieldIndex = 0;
        }
        break;
      case 'ArrowLeft':
        if (currentFieldIndex > 0) {
          newFieldIndex = currentFieldIndex - 1;
        } else if (currentRowIndex > 0) {
          newRowIndex = currentRowIndex - 1;
          newFieldIndex = fieldsOrder.length - 1;
        }
        break;
      case 'ArrowDown':
        if (currentRowIndex < data.length - 1) {
          newRowIndex = currentRowIndex + 1;
        }
        break;
      case 'ArrowUp':
        if (currentRowIndex > 0) {
          newRowIndex = currentRowIndex - 1;
        }
        break;
      default:
        return;
    }

    if (newRowIndex !== currentRowIndex || newFieldIndex !== currentFieldIndex) {
      e.preventDefault();
      const newRowId = data[newRowIndex].id;
      const newField = fieldsOrder[newFieldIndex];
      setActiveInput(`${newRowId}-${newField}`);
      
      // Focus the new input element
      setTimeout(() => {
        const inputElement = document.querySelector(`input[data-row="${newRowId}"][data-field="${newField}"]`);
        if (inputElement) {
          inputElement.focus();
          
          const value = inputElement.value;
          inputElement.value = '';
          inputElement.value = value;
        }
      }, 0);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [activeInput, data, hiddenFields]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col h-screen bg-white p-4">
      {/* Header and Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">React Spreadsheet</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="p-1 text-gray-600 hover:text-gray-900">
            <FiBell size={18} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <FiUser className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{borderLeft:"0px", borderRight:"0px"}} className="flex items-center justify-between border border-gray-200/90 ">
        <div className="flex items-center space-x-1 mb-1 mt-1 p-1">
          <div className="flex items-center ml-2">
            <span className="mr-2">Tool bar</span>
            <div className="flex items-center border-r border-gray-300 pr-2">
              <FiChevronsRight size={14} />
            </div>
          </div>
          <button 
            onClick={() => setShowHideFields(!showHideFields)}
            className="flex items-center px-2 py-1 text-s text-gray-700 bg-white  hover:bg-gray-50"
          >
            <FiEye className="mr-1" size={12} />
            Hide fields
          </button>
          {showHideFields && (
            <div className="absolute z-100 mt-74 ml-26 bg-white border border-gray-300 rounded shadow-lg p-2">
              {[
                'jobRequest', 'submitted', 'status', 'submitter', 
                'url', 'assigned', 'priority', 'dueDate', 'estValue'
              ].map((field) => (
                <label key={field} className="flex items-center space-x-2 p-1 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={!hiddenFields.includes(field)}
                    onChange={() => toggleFieldVisibility(field)}
                    className="rounded text-blue-500"
                  />
                  <span className="text-xs capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          )}
          <div className="relative">
            <button 
              className="px-2 py-1 text-s text-gray-700 bg-white rounded border-gray-300 hover:bg-gray-50 flex items-center space-x-1"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <FiArrowUpLeft size={14} /> <FiArrowDownRight size={14} />
              <span>Sort</span>
            </button>
            {showSortDropdown && (
              <div className="absolute z-20 mt-1 bg-white border border-gray-300 rounded shadow-lg p-2">
                <div 
                  className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort('submitted')}
                >
                  Submitted (Soon to Later)
                </div>
                <div 
                  className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date (Soon to Later)
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              className="flex items-center px-2 py-1 text-s text-gray-700 bg-white rounded border-gray-300 hover:bg-gray-50"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <FiFilter className="mr-1" size={12} />
              Filter
              {(filters.status || filters.priority) && (
                <span className="ml-1 text-xs text-blue-500">•</span>
              )}
            </button>
            {showFilterDropdown && (
              <div className="absolute z-20 mt-1 bg-white border border-gray-300 rounded shadow-lg p-2 w-48">
                <div className="px-2 py-1 text-xs font-medium text-gray-500">Status</div>
                {statusOptions.filter(opt => opt.trim()).map(option => (
                  <div
                    key={option}
                    className={`px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer ${filters.status === option ? 'bg-blue-50' : ''}`}
                    onClick={() => handleFilterSelect('status', option)}
                  >
                    {option}
                  </div>
                ))}
                <div className="px-2 py-1 text-xs font-medium text-gray-500 mt-2">Priority</div>
                {priorityOptions.filter(opt => opt.trim()).map(option => (
                  <div
                    key={option}
                    className={`px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer ${filters.priority === option ? 'bg-blue-50' : ''}`}
                    onClick={() => handleFilterSelect('priority', option)}
                  >
                    {option}
                  </div>
                ))}
                {(filters.status || filters.priority) && (
                  <div 
                    className="px-2 py-1 text-xs text-blue-500 hover:bg-gray-100 cursor-pointer mt-2 flex items-center"
                    onClick={resetFilters}
                  >
                    <FiX className="mr-1" size={12} />
                    Reset Filters
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              className="px-2 py-1 text-s text-gray-700 bg-white rounded border-gray-300 hover:bg-gray-50"
              onClick={() => setShowCellViewDropdown(!showCellViewDropdown)}
            >
              Cell view
            </button>
            {showCellViewDropdown && (
              <div className="absolute z-20 mt-1 bg-white border border-gray-300 rounded shadow-lg p-2 w-32">
                <div className="px-2 py-1 text-xs font-medium text-gray-500">Number of Rows</div>
                <div 
                  className={`px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer ${rowCount === 50 ? 'bg-green-50 border border-green-300' : ''}`}
                  onClick={() => handleRowCountChange(50)}
                >
                  50 Rows
                </div>
                <div 
                  className={`px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer ${rowCount === 100 ? 'bg-green-50 border border-green-300' : ''}`}
                  onClick={() => handleRowCountChange(100)}
                >
                  100 Rows
                </div>
                <div 
                  className={`px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer ${rowCount === 150 ? 'bg-green-50 border border-green-300' : ''}`}
                  onClick={() => handleRowCountChange(150)}
                >
                  150 Rows
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {saveStatus && (
            <div className={`mb-2 p-2 text-xs rounded ${
              saveStatus.type === 'success' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {saveStatus.message}
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-2 py-2 text-xs text-white bg-green-400 rounded border border-green-700 hover:bg-green-700 disabled:bg-green-300"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <button onClick={() => setShowImportModal(true)} className="flex items-center px-2 py-2 text-xs text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-50">
            <FiDownload className="mr-1" size={12} />
            Import
          </button>
          <button onClick={handleExport} className="flex items-center px-2 py-2 text-xs text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-50">
            <FiUpload className="mr-1" size={12} />
            Export
          </button>
          <button onClick={handleShare} className="flex items-center px-2 py-2 text-xs text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-50">
            <FiShare2 className="mr-1" size={12} />
            Share
          </button>
          <button className="flex items-center px-2 py-2 text-xs text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-50">
            <FiAlertTriangle className="mr-1" size={12} />
            New Action
          </button>
        </div>
      </div>

      
      {showImportModal && (
        <div className="absolute z-30 right-0 mt-10 mr-4 bg-white border border-gray-300 rounded shadow-lg p-4 w-64">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Import Data</h3>
            <button onClick={() => setShowImportModal(false)} className="text-gray-500 hover:text-gray-700">
              <FiX size={16} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Enter spreadsheet key"
            value={importKey}
            onChange={(e) => setImportKey(e.target.value)}
            className="w-full p-2 mb-2 text-xs border border-gray-300 rounded"
          />
          <button
            onClick={handleImport}
            className="w-full py-2 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Import Data
          </button>
        </div>
      )}
      {showExportModal && (
        <div className="absolute z-30 right-0 mt-10 mr-4 bg-white border border-gray-300 rounded shadow-lg p-4 w-64">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Export Data</h3>
            <button onClick={() => setShowExportModal(false)} className="text-gray-500 hover:text-gray-700">
              <FiX size={16} />
            </button>
          </div>
          <p className="text-xs mb-2">Copy this key to access your data anywhere:</p>
          <div className="flex items-center">
            <input
              type="text"
              value={exportKey}
              readOnly
              className="flex-1 p-2 text-xs border border-gray-300 rounded-l"
            />
            <button
              onClick={() => {copyToClipboard(exportKey);handleSave()}}
              className="p-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-r"
            >
              <FiCopy size={14} />
            </button>
          </div>
          <p className="text-xs mt-2 text-gray-500">Use this key to import your data later</p>
        </div>
      )}
      {showShareModal && (
        <div className="absolute z-30 right-0 mt-10 mr-4 bg-white border border-gray-300 rounded shadow-lg p-4 w-72">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Share Spreadsheet</h3>
            <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">
              <FiX size={16} />
            </button>
          </div>
          <p className="text-xs mb-2">Share this URL to collaborate:</p>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 p-2 text-xs border border-gray-300 rounded-l"
            />
            <button
              onClick={() => copyToClipboard(shareUrl)}
              className="p-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-r"
            >
              <FiCopy size={14} />
            </button>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={key}
              readOnly
              className="flex-1 p-2 text-xs border border-gray-300 rounded-l"
            />
            <button
              onClick={() => copyToClipboard(key)}
              className="p-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-r"
            >
              <FiCopy size={14} />
            </button>
          </div>
          <p className="text-xs mt-2 text-gray-500">Or share just the key above</p>
        </div>
      )}

     
      {(filters.status || filters.priority) && (
        <div className="flex items-center space-x-2 mb-2">
          {filters.status && (
            <div className="flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
              Status: {filters.status}
              <button 
                onClick={() => handleFilterSelect('status', null)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <FiX size={12} />
              </button>
            </div>
          )}
          {filters.priority && (
            <div className="flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
              Priority: {filters.priority}
              <button 
                onClick={() => handleFilterSelect('priority', null)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <FiX size={12} />
              </button>
            </div>
          )}
          <button 
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        </div>
      )}

      
      <div className="flex-1 overflow-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <th className="bg-white  bg-white drop-shadow-[0_8px_8px_rgba(209,213,219,1)] "></th>
            <th style={{ borderRight: "1px solid #D1D5DB" }} colSpan="4" className="p-3 bg-[#E2E2E2] drop-shadow-[0_0px_2px_white]">
              <div className="flex items-center text-xs ml-4">Financial Overview <FiXCircle onClick={reset} style={{ marginLeft:12,color:"red",cursor:"pointer"}} size={16}/>{undo && <FiRotateCcw onClick={revert} size={16} style={{ marginLeft:12,color:"red",cursor:"pointer"}}/>}</div>
            </th>
            <th className="bg-gray-50 drop-shadow-[0_1px_1px_white]"></th>
            <th style={{ borderRight: "2px solid rgb(245, 246, 248)", backgroundColor: "#D2E0D4" }} colSpan={1} className="drop-shadow-[0_1px_1px_white] z-10 text-xs font-semibold text-center mb-0">
              <div style={{alignContent:"center",alignItems:"center",justifyContent:"center"}} className="flex items-center">
                <div className="flex items-center space-x-1 text-[#505450]">
                  <FiMove size={12} className="text-gray-500" />
                  <span className="font-semibold ml-1">ABC</span>
                </div>
                <FiMoreHorizontal size={14} className="ml-2 text-gray-500" />
              </div>
            </th>
            <th style={{ borderRight: "2px solid rgb(241, 244, 249)" }} colSpan="2" className="bg-purple-200 text-xs font-semibold text-center border-gray-300 drop-shadow-[0_1px_1px_white]">
              <div style={{alignContent:"center",alignItems:"center",justifyContent:"center"}} className="flex items-center">
                <div className="flex items-center space-x-1">
                  <FiMove size={12} className="text-gray-500" />
                  <span className="font-semibold ml-1 text-[#463E59]">Answer a question</span>
                </div>
                <FiMoreHorizontal size={14} className="ml-2 text-gray-500" />
              </div>
            </th>
            <th style={{ borderRight: "2px solid rgb(238, 240, 244)" }} colSpan={1} className="bg-[#FAC2AF] text-xs font-semibold text-center border-gray-300">
              <div style={{alignContent:"center",alignItems:"center",justifyContent:"center"}} className="flex items-center">
                <div className="flex items-center space-x-1">
                  <FiMove size={12} className="text-gray-500" />
                  <span className="font-semibold ml-1 text-[#695149]">Extract</span>
                </div>
                <FiMoreHorizontal size={14} className="ml-2 text-gray-500" />
              </div>
            </th>
            <th style={{alignContent:"center",justifyContent:"center",alignItems:"center",placeItems:"center"}} className="bg-gray-200 border border-gray-300">
              <button className="flex items-center justify-center w-5 h-5 text-white rounded-full">
                <FiPlus size={12} color='black' />
              </button>
            </th>

            <tr>
              <th className="p-1 text-left text-xs font-medium bg-blue-50 border border-gray-200">#</th>
              {!hiddenFields.includes('jobRequest') && (
                <th className="p-3 text-left text-xs font-medium bg-[#EEEEEE] drop-shadow-[0_0_2px_white] br">
                  <div className="flex justify-between items-center flex-wrap">
                    <div style={{fontSize:13}}className="flex items-center font-semibold text-[#757575]">
                      <FiCheckCircle className="mr-1" size={14} />
                      Job Request
                    </div>
                    <div>
                      <FiChevronDown size={14} />
                    </div>
                  </div>
                </th>
              )}
              {!hiddenFields.includes('submitted') && (
                <th className="p-1 text-left text-xs font-medium bg-[#EEEEEE] drop-shadow-[0_0px_2px_white]">
                  <div className="flex justify-between items-center font-semibold">
                    <div style={{fontSize:13}} className="flex items-center text-[#757575]">
                      <FiCalendar className="mr-1" size={14} />
                      Submitted
                    </div>
                    <div>
                      <FiChevronDown size={14} />
                    </div>
                  </div>
                </th>
              )}
              {!hiddenFields.includes('status') && (
                <th className="p-1 text-left text-xs font-medium bg-[#EEEEEE] drop-shadow-[0_0px_2px_white]">
                  <div className="flex justify-between items-center font-semibold">
                    <div style={{fontSize:13}} className="flex items-center text-[#757575]">
                      <FiClock className="mr-1" size={14} />
                      Status
                    </div>
                    <div>
                      <FiChevronDown size={14} />
                    </div>
                  </div>
                </th>
              )}
              {!hiddenFields.includes('submitter') && (
                <th className="p-1 text-left text-xs font-medium bg-[#EEEEEE] drop-shadow-[0_0px_2px_white]">
                  <div className="flex justify-between items-center font-semibold">
                    <div style={{fontSize:13}} className="flex items-center text-[#757575]">
                      <FiUser className="mr-1" size={14} />
                      Submitter
                    </div>
                    <div>
                      <FiChevronDown size={14} />
                    </div>
                  </div>
                </th>
              )}
              {!hiddenFields.includes('url') && (
                <th className="p-1 text-left text-xs font-medium bg-[#EEEEEE] drop-shadow-[0_0px_2px_white]">
                  <div className="flex justify-between items-center font-semibold">
                    <div style={{fontSize:13}} className="flex items-center text-[#757575]">
                      <FiLink className="mr-1" size={14} />
                      URL
                    </div>
                    <div>
                      <FiChevronDown size={14} />
                    </div>
                  </div>
                </th>
              )}
              {!hiddenFields.includes('assigned') && (
                <th style={{ backgroundColor: "#D2E0D4"}} className="p-1 text-left text-xs font-medium ">
                  <div style={{fontSize:13}} className="flex font-semibold items-center text-[#666C66]">
                    <FiUserCheck className="mr-1" size={14} />
                    Assigned
                  </div>
                </th>
              )}
              {!hiddenFields.includes('priority') && (
                <th style={{ borderRight: "2px solid #D1D5DB" }} className="p-1 text-left text-xs font-medium bg-[#EAE3FC] border-gray-300">
                  <div style={{fontSize:13}} className="flex font-semibold items-center text-[#655C80]">
                    <FiFlag className="mr-1" size={14} />
                    Priority
                  </div>
                </th>
              )}
              {!hiddenFields.includes('dueDate') && (
                <th style={{ borderRight: "1px solid #D1D5DB" }} className="p-1 text-left text-xs font-medium bg-[#EAE3FC] border-gray-300">
                  <div style={{fontSize:13}} className="flex font-semibold items-center text-[#757575]">
                    <FiCalendar className="mr-1" size={14} />
                    Due Date
                  </div>
                </th>
              )}
              {!hiddenFields.includes('estValue') && (
                <th className="p-1 text-left text-xs font-medium bg-[#FFE9E0] border-gray-300">
                  <div style={{fontSize:13}} className="flex font-semibold items-center text-[#8C6C62]">
                    <FiFlag className="mr-1" size={14} />
                    Est. Value
                  </div>
                </th>
              )}
              {!hiddenFields.includes('priority') && (
                <th className="p-1 text-left text-xs font-medium bg-green-50 border border-gray-300">
                  <div className="flex font-semibold min-w-24 items-center">
                    <span>{"\u00A0\u00A0\u00A0\u00A0\u00A0"}</span>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.map((row,i) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="p-1 text-xs text-center border border-gray-200">{i+1}</td>

                {!hiddenFields.includes('jobRequest') && (
                  <td className={`p-1  ${activeInput === `${row.id}-jobRequest` ? 'outline outline-2 outline-green-500' : 'border border-gray-200'}`}>
                    <input
                      type="text"
                      style={{fontSize:14}}
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.jobRequest}
                      onChange={(e) => handleCellChange(row.id, 'jobRequest', e.target.value)}
                      onFocus={() => handleInputFocus(row.id, 'jobRequest')}
                      onBlur={handleInputBlur}
                      data-row={row.id}
  data-field="jobRequest"
                    />
                  </td>
                )}

                {!hiddenFields.includes('submitted') && (
                  <td className={`p-0 ${activeInput === `${row.id}-submitted` ? 'outline outline-2 outline-green-500' : 'border border-gray-200'}`}>
                    <input
                      type="text"
                      style={{fontSize:14}}
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.submitted}
                      onChange={(e) => handleCellChange(row.id, 'submitted', e.target.value)}
                      onFocus={() => handleInputFocus(row.id, 'submitted')}
                      onBlur={handleInputBlur}
                      data-row={row.id}
  data-field="submitted"
                    />
                  </td>
                )}

                {!hiddenFields.includes('status') && (
                  <td className="pl-1 pr-1 border border-gray-200 relative">
                    <div 
                      className={`w-full h-6 ${getStatusClass(row.status)} flex items-center justify-center px-1 cursor-pointer truncate overflow-hidden whitespace-nowrap rounded-full text-xs font-semibold`}
                      onClick={() => toggleDropdown('status', row.id)}
                        >
                      <span style={{fontSize:14}}>{row.status || ""}</span>
                    </div>
                    {activeDropdown === `status-${row.id}` && (
                      <div className="absolute z-20 w-full bg-white border border-gray-300 rounded shadow-lg mt-1">
                        {statusOptions.map(option => (
                          <div
                            key={option}
                            className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleOptionSelect(row.id, 'status', option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                )}

                {!hiddenFields.includes('submitter') && (
                  <td className={`p-0 ${activeInput === `${row.id}-submitter` ? 'outline outline-2 outline-green-500' : 'border border-gray-200'}`}>
                    <input style={{fontSize:14}}
                      type="text"
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.submitter}
                      onChange={(e) => handleCellChange(row.id, 'submitter', e.target.value)}
                      onFocus={() => handleInputFocus(row.id, 'submitter')}
                      onBlur={handleInputBlur}
                      data-row={row.id}
  data-field="submitter"
                    />
                  </td>
                )}

    {!hiddenFields.includes('url') && (
  <td
    className={`p-0 ${activeInput === `${row.id}-url` ? 'outline outline-2 outline-green-500' : 'border border-gray-200'} overflow-hidden max-w-[120px]`} 
    onClick={() => {
      if (activeInput !== `${row.id}-url`) handleInputFocus(row.id, 'url');
    }}
  >
    {activeInput === `${row.id}-url` ? (
      <input
        type="text"
        style={{ fontSize: 14 }}
        className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs overflow-x-auto whitespace-nowrap"
        value={row.url}
        onChange={(e) => handleCellChange(row.id, 'url', e.target.value)}
        onFocus={() => handleInputFocus(row.id, 'url')}
        onBlur={handleInputBlur}
        data-row={row.id}
  data-field="url"
      />
    ) : row.url ? (
      <div className="w-full p-1 text-xs truncate max-w-[180px]">
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-blue-600 underline"
          style={{ fontSize: 14 }}
        >
          {row.url}
        </a>
      </div>
    ) : (
      <div className="w-full h-7 p-1 text-xs">&nbsp;</div>
    )}
  </td>
)}


                {!hiddenFields.includes('assigned') && (
                  <td className={`p-0  ${activeInput === `${row.id}-assigned` ? 'outline outline-2 outline-green-500' : 'border border-gray-200'}`}>
                    <input style={{fontSize:14}}
                      type="text"
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.assigned}
                      onChange={(e) => handleCellChange(row.id, 'assigned', e.target.value)}
                      onFocus={() => handleInputFocus(row.id, 'assigned')}
                      onBlur={handleInputBlur}
                      data-row={row.id}
  data-field="assigned"
                    />
                  </td>
                )}

                {!hiddenFields.includes('priority') && (
                  <td className="p-1 border border-gray-200 relative">
                    <div 
                      className={`w-full h-7 ${getPriorityClass(row.priority)} flex items-center justify-between px-2 cursor-pointer`}
                      onClick={() => toggleDropdown('priority', row.id)}
                      
                    >
                      <span>{row.priority || ''}</span>
                    </div>
                    {activeDropdown === `priority-${row.id}` && (
                      <div className="absolute z-20 w-full bg-white border border-gray-300 rounded shadow-lg mt-1">
                        {priorityOptions.map(option => (
                          <div
                            key={option}
                            className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleOptionSelect(row.id, 'priority', option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                )}

                {!hiddenFields.includes('dueDate') && (
                  <td className={`p-0  ${activeInput === `${row.id}-dueDate` ? 'outline outline-2 outline-green-500' : 'border border-gray-200'}`}>
                    <input style={{fontSize:14}}
                      type="text"
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.dueDate}
                      onChange={(e) => handleCellChange(row.id, 'dueDate', e.target.value)}
                      onFocus={() => handleInputFocus(row.id, 'dueDate')}
                      onBlur={handleInputBlur}
                      data-row={row.id}
  data-field="dueDate"
                    />
                  </td>
                )}

                {!hiddenFields.includes('estValue') && (
                  <td className={`p-0 ${activeInput === `${row.id}-estValue` ? 'outline outline-2 outline-green-500' : 'border border-gray-200'}`}>
                    <input style={{fontSize:14}}
                      type="text"
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.estValue}
                      onChange={(e) => handleCellChange(row.id, 'estValue', e.target.value)}
                      onFocus={() => handleInputFocus(row.id, 'estValue')}
                      onBlur={handleInputBlur}
                      data-row={row.id}
  data-field="estValue"
                    />
                  </td>
                )}
                {!hiddenFields.includes('priority') && (
                  <td className="p-1 border border-gray-300 relative">
                    <div 
                      className={`w-full h-7 ${getPriorityClass(row.priority)} flex items-center justify-between px-2 cursor-pointer`}
                      
                    >
                      <span>{ ''}</span>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Spreadsheet;