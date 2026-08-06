import { useState, useEffect } from 'react';
import { X, Save, User, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';

const PLATFORM_INFO = [
  {
    key: 'cf',
    label: 'Codeforces Handle',
    placeholder: 'e.g. tourist',
    color: '#e8334a',
    link: 'https://codeforces.com/profile/',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
      </svg>
    ),
  },
  {
    key: 'lc',
    label: 'LeetCode Username',
    placeholder: 'e.g. neal_wu',
    color: '#ffa116',
    link: 'https://leetcode.com/',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
  },
  {
    key: 'cc',
    label: 'CodeChef Username',
    placeholder: 'e.g. gennady',
    color: '#5b4638',
    link: 'https://www.codechef.com/users/',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M11.257.004C5.858.086.675 4.315.05 9.768c-.563 4.923 2.168 9.143 6.253 11.114.63.307 1.29.538 1.966.71a.5.5 0 0 0 .61-.49v-1.14a.5.5 0 0 0-.376-.484C5.24 18.65 2.93 15.636 3.05 12c.155-4.65 4.15-8.31 8.793-8.003 4.357.289 7.742 3.997 7.672 8.37-.056 3.55-2.375 6.576-5.596 7.56a.5.5 0 0 0-.375.484v1.14a.5.5 0 0 0 .61.49c4.36-1.09 7.72-4.87 7.846-9.452.162-5.91-4.606-10.67-10.743-10.585z" />
      </svg>
    ),
  },
];

export default function SettingsModal({ isOpen, onClose, handles, onSave }) {
  const [local, setLocal] = useState({ cf: '', lc: '', cc: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocal({ ...handles });
      setSaved(false);
    }
  }, [isOpen, handles]);

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const hasChanges = JSON.stringify(local) !== JSON.stringify(handles);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      id="settings-modal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass rounded-2xl shadow-2xl shadow-black/50 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <User className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-100">Platform Handles</h2>
              <p className="text-xs text-zinc-500">Configure your usernames</p>
            </div>
          </div>
          <button
            id="settings-close"
            onClick={onClose}
            className="btn-ghost !p-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-300/80 leading-relaxed">
              Your handles are stored locally in your browser. Leave any field empty to skip
              that platform.
            </p>
          </div>

          {PLATFORM_INFO.map(({ key, label, placeholder, color, link, icon }) => (
            <div key={key} className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                <span style={{ color }} className="flex items-center gap-1">
                  {icon}
                  {label}
                </span>
                {local[key] && (
                  <a
                    href={`${link}${local[key]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors"
                    title="View profile"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <input
                id={`handle-${key}`}
                type="text"
                value={local[key]}
                onChange={(e) => setLocal((prev) => ({ ...prev, [key]: e.target.value.trim() }))}
                placeholder={placeholder}
                className="input-field"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            id="settings-save"
            onClick={handleSave}
            disabled={!hasChanges && !saved}
            className="btn-primary"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save & Sync
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
