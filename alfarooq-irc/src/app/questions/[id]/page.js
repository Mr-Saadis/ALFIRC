// src/app/questions/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function QuestionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function fetchQuestion() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/questions/${id}`);
        if (!res.ok) {
          throw new Error('Question not found');
        }
        const data = await res.json();
        setQuestion(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchQuestion();
    }
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading…</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error} •{' '}
        <button
          onClick={() => router.back()}
          className="underline hover:text-red-700"
        >
          Go back
        </button>
      </div>
    );
  }

  // Destructure your API response
  const {
    Q_ID,
    Q_Heading,
    Ans_Detailed,
    Ans_Summary,
    Assign_T,
    Published_At,
    Q_User,
    subcatId,
    subcatName,
    Cat_ID,
    Cat_Name
  } = question;

  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4 text-gray-600">
        <Link href="/categories/${Cat_ID}/subcategories/${subcatId}" className="hover:text-[#3333cc]">{subcatName}</Link>{' '} &lt;{' '}
        <Link
          href={`/categories/${Cat_ID}`}
          className="hover:text-[#3333cc]"
        >
          {Cat_Name}
        </Link>{' '} &lt;{' '}
        <Link
          href={`/`}
          className="hover:text-[#3333cc]"
        >
          Home
        </Link>
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{Q_Heading}</h1>

      {/* Metadata */}
      <div className="text-sm text-gray-500 mb-4 space-y-1">
        <div>Published on{' '}
          {new Date(Published_At).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div>Asked by: {Q_User || 'Unknown'}</div>
        {Assign_T && <div>Assigned to: {Assign_T}</div>}
      </div>

      {/* Summary (if any) */}
      {Ans_Summary && (
        <section className="mb-8 prose prose-sm">
          <h2>خلاصہ</h2>
          <p>{Ans_Summary}</p>
        </section>
      )}

      {/* Full Answer */}
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: Ans_Detailed }}
      />
    </article>
  );
}
