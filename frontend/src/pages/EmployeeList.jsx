import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Search, UserPlus } from 'lucide-react';
import { Button, Input, Card, Table } from '../components/ui';
import { employeeService } from '../api';

export default function EmployeeList({ initialShowForm = false, onFormClose }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(initialShowForm);
    const [formData, setFormData] = useState({ employee_id: '', full_name: '', email: '', department: '' });
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (!showForm && onFormClose) {
            onFormClose();
        }
    }, [showForm, onFormClose]);

    const fetchEmployees = async () => {
        try {
            const res = await employeeService.getAll();
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await employeeService.create(formData);
            setFormData({ employee_id: '', full_name: '', email: '', department: '' });
            setShowForm(false);
            fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create employee');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await employeeService.delete(id);
                fetchEmployees();
            } catch (err) {
                alert('Failed to delete employee');
            }
        }
    };

    const [selectedDepartment, setSelectedDepartment] = useState('');

    const filteredEmployees = employees.filter(emp =>
        (emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedDepartment === '' || emp.department === selectedDepartment)
    );

    const exportToCSV = () => {
        const headers = ['Employee ID', 'Full Name', 'Email', 'Department', 'Total Present', 'Total Absent'];
        const csvData = employees.map(emp => [
            emp.employee_id,
            emp.full_name,
            emp.email,
            emp.department,
            emp.total_present || 0,
            emp.total_absent || 0
        ]);

        const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `employees_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employees</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your workforce efficiently.</p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="secondary" onClick={exportToCSV} className="flex items-center">
                        <Plus className="w-4 h-4 mr-2 rotate-45" /> {/* Using Plus rotated as a subtle export icon or just text */}
                        Export CSV
                    </Button>
                    <Button onClick={() => setShowForm(!showForm)} className="flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        {showForm ? 'Cancel' : 'Add Employee'}
                    </Button>
                </div>
            </div>

            {showForm && (
                <Card className="p-6 border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-900/10">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <Input
                            label="Employee ID"
                            placeholder="EMP001"
                            value={formData.employee_id}
                            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                            required
                        />
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-white"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                required
                            >
                                <option value="">Select Dept</option>
                                <option value="HR">HR</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Product">Product</option>
                                <option value="Sales">Sales</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>
                        {error && <p className="col-span-full text-red-500 text-sm font-medium">{error}</p>}
                        <Button type="submit" className="col-span-full md:col-span-1 mt-2">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Save Employee
                        </Button>
                    </form>
                </Card>
            )}

            <Card>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employees by name or ID..."
                            className="w-full pl-10 pr-4 py-2 text-sm border-none bg-transparent focus:ring-0 text-gray-900 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <select
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            <option value="HR">HR</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Product">Product</option>
                            <option value="Sales">Sales</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <p>No employees found.</p>
                    </div>
                ) : (
                    <Table headers={['ID', 'Full Name', 'Department', 'Attendance', 'Actions']}>
                        {filteredEmployees.map((emp) => (
                            <tr key={emp.employee_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    <div className="font-mono text-xs text-gray-400 mb-1">{emp.employee_id}</div>
                                    <div className="text-gray-600 dark:text-gray-300">{emp.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{emp.full_name}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                        {emp.department}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-400 uppercase font-bold">Present</div>
                                            <div className="text-emerald-600 dark:text-emerald-400 font-bold">{emp.total_present || 0}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-gray-400 uppercase font-bold">Absent</div>
                                            <div className="text-red-600 dark:text-red-400 font-bold">{emp.total_absent || 0}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => handleDelete(emp.employee_id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>
        </div>
    );
}
