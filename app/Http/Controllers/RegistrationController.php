<?php

namespace App\Http\Controllers;

use App\Models\Register;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // ดึงข้อมูลการลงทะเบียนพร้อม relationships สำหรับแสดงในตาราง
        $registrations = Register::with(['student', 'course.teacher'])
            ->latest()
            ->paginate();

        // ดึงข้อมูลทั้งหมดสำหรับคำนวณการกระจายของเกรด
        $allGrades = Register::select('grade')->get();

        // คำนวณการกระจายของเกรด
        $gradeDistribution = [
            'A' => $allGrades->filter(fn($reg) => $reg->grade >= 3.5)->count(),
            'B' => $allGrades->filter(fn($reg) => $reg->grade >= 2.5 && $reg->grade < 3.5)->count(),
            'C' => $allGrades->filter(fn($reg) => $reg->grade >= 1.5 && $reg->grade < 2.5)->count(),
            'D' => $allGrades->filter(fn($reg) => $reg->grade >= 1.0 && $reg->grade < 1.5)->count(),
            'F' => $allGrades->filter(fn($reg) => $reg->grade < 1.0)->count(),
        ];

        // นับจำนวนนักศึกษาที่ไม่ซ้ำกัน
        $total_students = Register::select('student_id')
            ->distinct()
            ->count();

        // นับจำนวนการลงทะเบียนทั้งหมด
        $total_registrations = Register::count();

        // คำนวณเกรดเฉลี่ยรวม
        $average_grade = Register::avg('grade');

        return Inertia::render('Registration/Index', [
            'registrations' => $registrations,
            'total_students' => $total_students,
            'total_registrations' => $total_registrations,
            'average_grade' => round($average_grade, 2),
            'grade_distribution' => $gradeDistribution,
            'filters' => request()->all(['search', 'field', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function stats()
    {
        // สถิติเกรดเฉลี่ยแต่ละวิชา
        $courseStats = Course::select('courses.course_name')
            ->selectRaw('AVG(registers.grade) as average_grade')
            ->selectRaw('COUNT(registers.id) as student_count')
            ->leftJoin('registers', 'courses.id', '=', 'registers.course_id')
            ->groupBy('courses.id', 'courses.course_name')
            ->get();

        // จำนวนนักศึกษาที่ลงทะเบียนในแต่ละเทอม
        $semesterStats = Register::select('semester', 'academic_year')
            ->selectRaw('COUNT(DISTINCT student_id) as student_count')
            ->groupBy('semester', 'academic_year')
            ->orderBy('academic_year')
            ->orderBy('semester')
            ->get();

        return view('registration.stats', compact('courseStats', 'semesterStats'));
    }
}
