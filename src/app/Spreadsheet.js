"use client"
import React, { useEffect, useState } from 'react';
import { 
  FiEye, FiFilter, FiUpload, FiDownload, FiShare2, 
  FiSearch, FiBell, FiUser, FiCalendar, FiLink, 
  FiFlag, FiCheckCircle, FiClock, FiUserCheck, FiPlus,
  FiChevronDown, FiMove, FiMoreHorizontal,FiChevronsRight,FiArrowUpLeft,FiArrowDownRight,
  FiAlertTriangle, FiX,FiCopy
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
const [key,setkey]=useState("");
useEffect(()=>{const data=generateRandomKey();
  setkey(data);
  setExportKey(data)
},[])
 const searchParams = useSearchParams();
   useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
       setLoading(true);
      axios.get(`https://reactspreadsheetnode.onrender.com/api/spreadsheet/${key}`)
        .then(res => {
          if (res.data.success) {
            setData(res.data.data.data);
          } else {
            console.error('No data found');
          }
        })
        .catch(err => {
          console.error('Error fetching data', err);
        }).finally(() => {
          setLoading(false);
        });;
    }
  }, [searchParams]);
  const initializeData = (count) => {
    const sampleData = [
      {
        jobRequest: 'Launch social media campaign for Q3',
        submitted: 'May 15',
        status: 'In-process',
        submitter: 'Annie Christine',
        url: 'example.com',
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
        url: 'example.org',
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
        url: 'example.net',
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
        url: 'example.co',
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
        url: 'example.io',
        assigned: 'Karen White',
        priority: 'Low',
        dueDate: 'Jun 10',
        estValue: '$3,000'
      }
    ];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
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

  const handleCellChange = (rowIndex, field, value) => {
    const updatedData = [...data];
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [field]: value
    };
    setData(updatedData);
  };

  const toggleFieldVisibility = (field) => {
    setHiddenFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field) 
        : [...prev, field]
    );
  };

  const toggleDropdown = (type, rowIndex) => {
    const dropdownId = `${type}-${rowIndex}`;
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const handleOptionSelect = (rowIndex, field, value) => {
    handleCellChange(rowIndex, field, value);
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

  const handleInputFocus = (rowIndex, field) => {
    setActiveInput(`${rowIndex}-${field}`);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  const sortedAndFilteredData = React.useMemo(() => {
    let filteredData = [...data];
    
    
    if (filters.status) {
      filteredData = filteredData.filter(row => row.status === filters.status);
    }
    if (filters.priority) {
      filteredData = filteredData.filter(row => row.priority === filters.priority);
    }
    
   
    if (sortConfig.key) {
      const monthOrder = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
      };
      
      filteredData.sort((a, b) => {
        const getDateValue = (dateStr) => {
          if (!dateStr) return sortConfig.direction === 'asc' ? Infinity : -Infinity;
          const [month, day] = dateStr.split(' ');
          return (monthOrder[month] || 0) * 100 + parseInt(day || 0);
        };
        
        const aValue = sortConfig.key === 'submitted' || sortConfig.key === 'dueDate' 
          ? getDateValue(a[sortConfig.key])
          : a[sortConfig.key];
        const bValue = sortConfig.key === 'submitted' || sortConfig.key === 'dueDate' 
          ? getDateValue(b[sortConfig.key])
          : b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredData;
  }, [data, sortConfig, filters]);

    const handleSave = async () => {
    setIsSaving(true);

    setSaveStatus(null);
    
    try {
      await saveSpreadsheetData(data,key);
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
    console.log(result)
    if (result.data.success) {
      setData(result.data.data.data);
      setkey(importKey);
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

if(loading){
  return <Spinner/>
}
  return (
    <div className="flex flex-col h-screen bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">6 Q3 Financial Overview ()</h1>
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

          <button  onClick={() => setShowImportModal(true)} className="flex items-center px-2 py-2 text-xs text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-50">
            <FiDownload className="mr-1" size={12} />
            Import
          </button>
          <button onClick={handleExport} className="flex items-center px-2 py-2 text-xs text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-50">
            <FiUpload className="mr-1" size={12} />
            Export
          </button>
          <button  onClick={handleShare} className="flex items-center px-2 py-2 text-xs text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-50">
            <FiShare2 className="mr-1" size={12} />
            Share
          </button>
          <button className="flex items-center px-2 py-2 text-xs text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-50">
            <FiAlertTriangle className="mr-1" size={12} />
            New Action
          </button>
             
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
)}{showExportModal && (
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

      </div>

     
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

      <div className="flex-1 overflow-auto ">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <th className="bg-white  bg-white drop-shadow-[0_8px_8px_rgba(209,213,219,1)] "></th>
            <th style={{ borderRight: "1px solid #D1D5DB" }} colSpan="4" className="p-3 bg-[#E2E2E2] drop-shadow-[0_0px_2px_white]">
              <div className="flex items-center text-xs ml-4">Financial Overview</div>
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
            {sortedAndFilteredData.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="p-1 text-xs text-center border border-gray-200">{row.id}</td>

                {!hiddenFields.includes('jobRequest') && (
                  <td className={`p-1 border ${activeInput === `${rowIndex}-jobRequest` ? 'border-green-500' : 'border-gray-200'}`}>
                    <input
                      type="text"
                      style={{fontSize:14}}
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.jobRequest}
                      onChange={(e) => handleCellChange(rowIndex, 'jobRequest', e.target.value)}
                      onFocus={() => handleInputFocus(rowIndex, 'jobRequest')}
                      onBlur={handleInputBlur}
                    />
                  </td>
                )}

                {!hiddenFields.includes('submitted') && (
                  <td className={`p-0 border ${activeInput === `${rowIndex}-submitted` ? 'border-green-500' : 'border-gray-200'}`}>
                    <input
                      type="text"
                      style={{fontSize:14}}
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.submitted}
                      onChange={(e) => handleCellChange(rowIndex, 'submitted', e.target.value)}
                      onFocus={() => handleInputFocus(rowIndex, 'submitted')}
                      onBlur={handleInputBlur}
                    />
                  </td>
                )}

                {!hiddenFields.includes('status') && (
                  <td className="pl-1 pr-1 border border-gray-200 relative">
                    <div 
                      className={`w-full h-6 ${getStatusClass(row.status)} flex items-center justify-center px-1 cursor-pointer truncate overflow-hidden whitespace-nowrap rounded-full text-xs font-semibold`}
                      onClick={() => toggleDropdown('status', rowIndex)}
                    >
                      <span style={{fontSize:14}}>{row.status || ""}</span>
                    </div>
                    {activeDropdown === `status-${rowIndex}` && (
                      <div className="absolute z-20 w-full bg-white border border-gray-300 rounded shadow-lg mt-1">
                        {statusOptions.map(option => (
                          <div
                            key={option}
                            className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleOptionSelect(rowIndex, 'status', option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                )}

                {!hiddenFields.includes('submitter') && (
                  <td className={`p-0 border ${activeInput === `${rowIndex}-submitter` ? 'border-green-500' : 'border-gray-200'}`}>
                    <input style={{fontSize:14}}
                      type="text"
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.submitter}
                      onChange={(e) => handleCellChange(rowIndex, 'submitter', e.target.value)}
                      onFocus={() => handleInputFocus(rowIndex, 'submitter')}
                      onBlur={handleInputBlur}
                    />
                  </td>
                )}

                {!hiddenFields.includes('url') && (
                  <td className={`p-0 border ${activeInput === `${rowIndex}-url` ? 'border-green-500' : 'border-gray-200'}`}>
                    <input style={{fontSize:14}}
                      type="text"
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.url}
                      onChange={(e) => handleCellChange(rowIndex, 'url', e.target.value)}
                      onFocus={() => handleInputFocus(rowIndex, 'url')}
                      onBlur={handleInputBlur}
                    />
                  </td>
                )}

                {!hiddenFields.includes('assigned') && (
                  <td className={`p-0 border ${activeInput === `${rowIndex}-assigned` ? 'border-green-500' : 'border-gray-200'}`}>
                    <input style={{fontSize:14}}
                      type="text"
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.assigned}
                      onChange={(e) => handleCellChange(rowIndex, 'assigned', e.target.value)}
                      onFocus={() => handleInputFocus(rowIndex, 'assigned')}
                      onBlur={handleInputBlur}
                    />
                  </td>
                )}

                {!hiddenFields.includes('priority') && (
                  <td className="p-0 border border-gray-200 relative">
                    <div 
                      className={`w-full h-7 ${getPriorityClass(row.priority)} flex items-center justify-between px-2 cursor-pointer`}
                      onClick={() => toggleDropdown('priority', rowIndex)}
                    >
                      <span>{row.priority || ''}</span>
                    </div>
                    {activeDropdown === `priority-${rowIndex}` && (
                      <div className="absolute z-20 w-full bg-white border border-gray-300 rounded shadow-lg mt-1">
                        {priorityOptions.map(option => (
                          <div
                            key={option}
                            className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleOptionSelect(rowIndex, 'priority', option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                )}

                {!hiddenFields.includes('dueDate') && (
                  <td className={`p-0 border ${activeInput === `${rowIndex}-dueDate` ? 'border-green-500' : 'border-gray-200'}`}>
                    <input style={{fontSize:14}}
                      type="text"
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.dueDate}
                      onChange={(e) => handleCellChange(rowIndex, 'dueDate', e.target.value)}
                      onFocus={() => handleInputFocus(rowIndex, 'dueDate')}
                      onBlur={handleInputBlur}
                    />
                  </td>
                )}

                {!hiddenFields.includes('estValue') && (
                  <td className={`p-0 border ${activeInput === `${rowIndex}-estValue` ? 'border-green-500' : 'border-gray-200'}`}>
                    <input style={{fontSize:14}}
                      type="text"
                      className="w-full p-1 h-7 border-none focus:outline-none bg-transparent text-xs"
                      value={row.estValue}
                      onChange={(e) => handleCellChange(rowIndex, 'estValue', e.target.value)}
                      onFocus={() => handleInputFocus(rowIndex, 'estValue')}
                      onBlur={handleInputBlur}
                    />
                  </td>
                )}
                {!hiddenFields.includes('priority') && (
                  <td className="p-0 border border-gray-300 relative">
                    <div 
                      className={`w-full h-7 ${getPriorityClass(row.priority)} flex items-center justify-between px-2 cursor-pointer`}
                      onClick={() => toggleDropdown('priority', rowIndex)}
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