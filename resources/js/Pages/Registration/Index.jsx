import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ registrations, total_students, total_registrations, grade_distribution }) {
    // แทนที่การคำนวณ gradeRanges เดิม
    const gradeLabels = {
        'A': 'A (3.5-4.0)',
        'B': 'B (2.5-3.49)',
        'C': 'C (1.5-2.49)',
        'D': 'D (1.0-1.49)',
        'F': 'F (0-0.99)'
    };

    const total = Object.values(grade_distribution).reduce((a, b) => a + b, 0);

    return (
        <AppLayout>
            <Head title="ลงทะเบียนเรียน" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-500 text-sm">นักศึกษาทั้งหมด</div>
                            <div className="text-2xl font-bold">{total_students} คน</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-500 text-sm">การลงทะเบียนทั้งหมด</div>
                            <div className="text-2xl font-bold text-blue-600">{total_registrations} รายการ</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-500 text-sm">เกรดเฉลี่ยรวม</div>
                            <div className="text-2xl font-bold text-green-600">
                                {(registrations.data.reduce((sum, reg) => sum + Number(reg.grade), 0) / registrations.data.length).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Grade Distribution */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-6">การกระจายของเกรด</h2>
                            <div className="space-y-4">
                                {Object.entries(grade_distribution).map(([grade, count]) => (
                                    <div key={grade} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>{gradeLabels[grade]}</span>
                                            <span className="font-semibold">{count} คน</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div 
                                                className={`h-4 rounded-full transition-all duration-500 ${
                                                    grade === 'A' ? 'bg-green-500' :
                                                    grade === 'B' ? 'bg-blue-500' :
                                                    grade === 'C' ? 'bg-yellow-500' :
                                                    grade === 'D' ? 'bg-orange-500' :
                                                    'bg-red-500'
                                                }`}
                                                style={{ width: `${(count / total_registrations * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Registration List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-6">รายการลงทะเบียน</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                รหัสนักศึกษา
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ชื่อ-นามสกุล
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                วิชา
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ภาคการศึกษา
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                เกรด
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {registrations.data.map((registration) => (
                                            <tr key={registration.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {registration.student.student_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {registration.student.first_name} {registration.student.last_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {registration.course.course_code} - {registration.course.course_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {registration.semester}/{registration.academic_year}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        Number(registration.grade) >= 3.5 ? 'bg-green-100 text-green-800' :
                                                        Number(registration.grade) >= 2.5 ? 'bg-blue-100 text-blue-800' :
                                                        Number(registration.grade) >= 1.5 ? 'bg-yellow-100 text-yellow-800' :
                                                        Number(registration.grade) >= 1.0 ? 'bg-orange-100 text-orange-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {Number(registration.grade).toFixed(2)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
