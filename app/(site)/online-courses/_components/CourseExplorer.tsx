"use client";

import { useState, useMemo } from "react";
import { Search, RotateCcw, BookOpen, User } from "lucide-react";
import ContentCard from "@/components/cards/ContentCard";
import type { TopLevelCourseSummary } from "@/types/catalog";
import { cardImageUrl } from "@/sanity/lib/image";
import { formatPriceDuration, nestedListCtaLabel } from "@/lib/urls";

interface CourseExplorerProps {
  courses: TopLevelCourseSummary[];
}

export default function CourseExplorer({ courses }: CourseExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");

  // Dynamically derive unique filter lists from course objects
  const subjects = useMemo(() => {
    return Array.from(new Set(courses.map((c) => c.subject).filter(Boolean))) as string[];
  }, [courses]);

  const instructors = useMemo(() => {
    return Array.from(new Set(courses.map((c) => c.instructor).filter(Boolean))) as string[];
  }, [courses]);

  // Compute filtered courses list
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.excerpt && course.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubject =
        selectedSubject === "" ||
        (course.subject && course.subject.toLowerCase() === selectedSubject.toLowerCase());

      const matchesInstructor =
        selectedInstructor === "" ||
        (course.instructor && course.instructor.toLowerCase() === selectedInstructor.toLowerCase());

      return matchesSearch && matchesSubject && matchesInstructor;
    });
  }, [courses, searchQuery, selectedSubject, selectedInstructor]);

  const hasActiveFilters = searchQuery !== "" || selectedSubject !== "" || selectedInstructor !== "";

  function resetFilters() {
    setSearchQuery("");
    setSelectedSubject("");
    setSelectedInstructor("");
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 sm:p-5 shadow-sm md:flex-row md:items-center">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by name or topics..."
            aria-label="Search courses by name or topics"
            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent py-2.5 pr-4 pl-10 text-sm-plus text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
        </div>

        {/* Subject Filter */}
        <div className="relative md:w-48 shrink-0">
          <BookOpen className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label="Filter courses by subject"
            className="w-full appearance-none rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 pr-8 pl-10 text-sm-plus text-slate-700 dark:text-slate-300 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <div className="absolute top-1/2 right-3 size-1.5 -translate-y-1/2 border-b-2 border-r-2 border-gray-400 dark:border-slate-500 rotate-45 pointer-events-none" />
        </div>

        {/* Scholar Filter */}
        <div className="relative md:w-48 shrink-0">
          <User className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
          <select
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            aria-label="Filter courses by scholar"
            className="w-full appearance-none rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 pr-8 pl-10 text-sm-plus text-slate-700 dark:text-slate-300 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
          >
            <option value="">All Scholars</option>
            {instructors.map((scholar) => (
              <option key={scholar} value={scholar}>
                {scholar}
              </option>
            ))}
          </select>
          <div className="absolute top-1/2 right-3 size-1.5 -translate-y-1/2 border-b-2 border-r-2 border-gray-400 dark:border-slate-500 rotate-45 pointer-events-none" />
        </div>

        {/* Reset Action */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-brand-200 dark:hover:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2.5 px-4 text-sm-plus font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Courses List Grid / Empty State */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 py-16 px-4 text-center">
          <p className="text-sm-plus text-slate-600 dark:text-slate-400 max-w-xs">
            No courses match your selected search query or filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 btn-primary py-2 px-5 text-sm-plus"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCourses.map((course) => (
            <ContentCard
              key={course._id}
              href={`/online-courses/${course.slug.current}`}
              image={
                course.featuredImage ? cardImageUrl(course.featuredImage) : null
              }
              title={course.title}
              badge={course.subject}
              description={
                course.excerpt ||
                formatPriceDuration(course.price, course.duration) ||
                null
              }
              ctaLabel={nestedListCtaLabel(course.childCount, {
                parent: "View Courses",
                leaf: "Enroll Now",
              })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
