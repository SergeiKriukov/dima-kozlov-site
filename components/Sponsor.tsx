import React from 'react';
import { APP_APK_LABEL, APP_APK_URL, SPONSOR_NAME, SPONSOR_URL } from '../constants';

export const Sponsor: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-20 border-t border-gray-300 flex justify-center items-center px-4">
      <div className="text-xs font-mono text-gray-400 text-center flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-x-3 gap-y-2">
        <span>
          <span className="mr-2 opacity-50">При поддержке:</span>
          <a
            href={SPONSOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink hover:underline transition-colors duration-300"
          >
            {SPONSOR_NAME}
          </a>
        </span>
        <span className="hidden sm:inline opacity-30" aria-hidden>
          ·
        </span>
        <a
          href={APP_APK_URL}
          download
          className="hover:text-ink hover:underline transition-colors duration-300"
        >
          {APP_APK_LABEL}
        </a>
      </div>
    </footer>
  );
};