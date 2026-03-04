import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Search, History } from 'lucide-react';
import { Button, Card, Table } from '../components/ui';
import { attendanceService, employeeService } from '../api';
import { format } from 'date-fns';

export default function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchEmployees();
    }, []);

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

    const handleSelectEmployee = async (emp) => {
        setSelectedEmp(emp);
        setMessage({ type: '', text: '' });
        fetchHistory(emp.employee_id);
    };

    const fetchHistory = async (id) => {
        try {
            const res = await attendanceService.getByEmployee(id);
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const markAttendance = async (status) => {
        if (!selectedEmp) return;
        setMarking(true);
        setMessage({ type: '', text: '' });
        try {
            const today = new Date().toISOString().split('T')[0];
            await attendanceService.mark({
                employee_id: selectedEmp.employee_id,
                date: today,
                status: status
            });
            setMessage({ type: 'success', text: `Marked as ${status} for today!` });
            fetchHistory(selectedEmp.employee_id);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to mark attendance' });
        } finally {
            setMarking(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
                <p className="text-gray-500 dark:text-gray-400">Track daily records for your team.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Employee Selector */}
                <Card className="lg:col-span-1">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center bg-gray-50 dark:bg-gray-800/50">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize">Select Employee</h3>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                            </div>
                        ) : employees.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">No employees found.</div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                {employees.map((emp) => (
                                    <button
                                        key={emp.employee_id}
                                        onClick={() => handleSelectEmployee(emp)}
                                        className={cn(
                                            'w-full p-4 text-left flex items-center transition-colors hover:bg-primary-50/50 dark:hover:bg-primary-900/10',
                                            selectedEmp?.employee_id === emp.employee_id ? 'bg-primary-50 dark:bg-primary-900/20 border-r-4 border-primary-600' : ''
                                        )}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-bold mr-3">
                                            {emp.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{emp.full_name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{emp.employee_id}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Action Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {!selectedEmp ? (
                        <Card className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-400 dark:text-gray-500 border-dashed bg-gray-50/50 dark:bg-gray-800/10 dark:border-gray-700">
                            <CalendarIcon className="w-12 h-12 mb-4 opacity-50" />
                            <p>Select an employee from the list to mark attendance or view history.</p>
                        </Card>
                    ) : (
                        <>
                            <Card className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEmp.full_name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEmp.department} | {selectedEmp.employee_id}</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <Button
                                            onClick={() => markAttendance('Present')}
                                            disabled={marking}
                                            className="bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Present
                                        </Button>
                                        <Button
                                            onClick={() => markAttendance('Absent')}
                                            disabled={marking}
                                            variant="danger"
                                            className="disabled:opacity-50"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Absent
                                        </Button>
                                    </div>
                                </div>
                                {message.text && (
                                    <div className={cn(
                                        'mt-4 p-3 rounded-md text-sm font-medium animate-in slide-in-from-top-2',
                                        message.type === 'success'
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800'
                                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800'
                                    )}>
                                        {message.text}
                                    </div>
                                )}
                            </Card>

                            <Card>
                                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                    <div className="flex items-center text-gray-700 dark:text-gray-200 font-semibold">
                                        <History className="w-4 h-4 mr-2 text-gray-400" />
                                        Attendance History
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500">Total Records: {history.length}</div>
                                </div>
                                {history.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500 dark:text-gray-400 italic">No records found for this employee.</div>
                                ) : (
                                    <Table headers={['Date', 'Status']}>
                                        {history.sort((a, b) => new Date(b.date) - new Date(a.date)).map((rec, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                                                    {format(new Date(rec.date), 'PPPP')}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={cn(
                                                        'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                                                        rec.status === 'Present'
                                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                                                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                    )}>
                                                        {rec.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </Table>
                                )}
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

import { cn } from '../components/ui';
