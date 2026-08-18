"use client";

import { useState, useMemo } from "react";
import { Search, RotateCcw, BookOpen, User } from "lucide-react";
import ContentCard from "@/components/cards/ContentCard";
import type { TopLevelCourseSummary } from "@/types/catalog";
import { cardImageUrl } from "@/sanity/lib/image";
import { formatPriceDuration, nestedListCtaLabel, COURSE_NESTED_CTA_LABELS } from "@/lib/catalog/formatters";
import {
  formatSubjectLabel,
  normalizePublicTitle,
  COURSE_SUBJECT_LABELS,
} from "@/lib/catalog/subjects";

interface CourseExplorerProps {
  courses: TopLevelCourseSummary[];
}

export default function CourseExplorer({ courses }: CourseExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");

  // Dynamically derive unique filter lists from course objects
  // Use predefined subjects as base, plus any dynamically found ones
  const subjects = useMemo(() => {
    const predefined = Object.keys(COURSE_SUBJECT_LABELS);
    const dynamic = courses.map((c) => c.subject).filter(Boolean) as string[];
    return Array.from(new Set([...predefined, ...dynamic]));
  }, [courses]);

  const instructors = useMemo(() => {
    const dynamic = courses.map((c) => c.instructor).filter(Boolean) as string[];
    // Add dummy scholars as requested
    return Array.from(new Set(["Maulana Ali", "Maulana Hasan", ...dynamic]));
  }, [courses]);

  // Compute filtered courses list
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        normalizePublicTitle(course.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.excerpt && course.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (course.subject && formatSubjectLabel(course.subject).toLowerCase().includes(searchQuery.toLowerCase())) ||
        (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase()));

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
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 sm:p-5 shadow-card md:flex-row md:items-center">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by name or topics..."
            aria-label="Search courses by name or topics"
            className="min-h-11 w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-transparent py-2.5 pr-4 pl-10 text-sm-plus text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
        </div>

        {/* Subject Filter */}
        <div className="relative md:w-48 shrink-0">
          <BookOpen className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label="Filter courses by subject"
            className="select-field appearance-none cursor-pointer py-2.5 pr-8 pl-10"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {formatSubjectLabel(subject)}
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
            className="select-field appearance-none cursor-pointer py-2.5 pr-8 pl-10"
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
            type="button"
            onClick={resetFilters}
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-brand-200 dark:hover:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 text-sm-plus font-medium text-slate-700 dark:text-slate-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 cursor-pointer"
          >
            <RotateCcw size={14} aria-hidden="true" />
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
            type="button"
            onClick={resetFilters}
            className="mt-4 btn-primary px-5 text-sm-plus"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid-catalog-cards">
          {filteredCourses.map((course) => (
              <ContentCard
              key={course._id}
              href={`/online-courses/${course.slug.current}`}
              ctaHref="/contact"
              image={
                course.featuredImage ? cardImageUrl(course.featuredImage) : null
              }
              title={normalizePublicTitle(course.title)}
              badge={
                course.subject ? formatSubjectLabel(course.subject) : null
              }
              description={
                course.excerpt ||
                formatPriceDuration(course.price, course.duration) ||
                null
              }
              ctaLabel={nestedListCtaLabel(
                course.childCount,
                COURSE_NESTED_CTA_LABELS,
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
