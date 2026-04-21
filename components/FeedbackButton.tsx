'use client';

export function FeedbackButton({ siteName }: { siteName: string }) {
  const subject = encodeURIComponent(`Feedback for ${siteName}`);
  const body = encodeURIComponent('Hi, I have a suggestion:\n\n');
  return (
    <a
      href={`mailto:taeshinkim11@gmail.com?subject=${subject}&body=${body}`}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
      aria-label="Send feedback"
    >
      <span role="img" aria-label="chat">💬</span>
      <span>Feedback</span>
    </a>
  );
}
