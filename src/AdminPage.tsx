import React, { useState } from 'react';
import { Copy, Link as LinkIcon, CheckCircle, MessageCircle } from 'lucide-react';
import { WEDDING } from './config';
import { PREFIXES, Prefix, buildDisplayName, buildInviteLink } from './guest';

const buildMessage = (displayName: string, link: string) =>
  `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${WEDDING.groomName} & ${WEDDING.brideName}`;

export function AdminPage() {
  const [prefix, setPrefix] = useState<Prefix>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<{ displayName: string; link: string; message: string } | null>(null);
  const [toast, setToast] = useState('');

  const handleGenerate = () => {
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) return;
    const link = buildInviteLink(window.location.origin, displayName);
    setGenerated({ displayName, link, message: buildMessage(displayName, link) });
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers without clipboard API permission
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setToast(label);
    setTimeout(() => setToast(''), 2000);
  };

  const fieldCls =
    'w-full px-4 py-3 rounded-lg border border-brand-beige focus:ring-2 focus:ring-brand-beige-deep focus:border-transparent outline-none transition-all bg-white font-sans';
  const copyBtnCls =
    'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-brand-beige-deep text-brand-beige-deep font-sans text-xs tracking-[0.15em] uppercase hover:bg-brand-beige/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen bg-brand-ivory py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_30px_rgba(176,137,104,0.15)] overflow-hidden border border-brand-beige/50">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-2 text-stone-800">
              {WEDDING.groomName} & {WEDDING.brideName}
            </h2>
            <p className="text-stone-500 font-sans text-sm uppercase tracking-[0.2em]">Invitation Link Generator</p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
          >
            <div>
              <label htmlFor="prefix" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Select Prefix
              </label>
              <select id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value as Prefix)} className={fieldCls}>
                {PREFIXES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Guest Name
              </label>
              <input
                type="text"
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Sanjaya"
                className={fieldCls}
              />
            </div>

            <button
              type="submit"
              disabled={!guestName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-beige-deep text-white font-sans text-sm tracking-[0.2em] uppercase shadow-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LinkIcon className="w-5 h-5" />
              Generate Link
            </button>
          </form>

          <div className="flex gap-3 mt-4">
            <button type="button" disabled={!generated} onClick={() => generated && copy(generated.link, 'Link copied!')} className={copyBtnCls}>
              <Copy className="w-4 h-4" />
              Copy Link Only
            </button>
            <button type="button" disabled={!generated} onClick={() => generated && copy(generated.message, 'Message copied!')} className={copyBtnCls}>
              <MessageCircle className="w-4 h-4" />
              Copy Full Message
            </button>
          </div>

          {generated && (
            <div className="mt-8 space-y-4">
              <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-[0.15em]">Website will show</p>
                <p className="font-serif italic text-stone-700">
                  We cordially invite <span className="font-bold not-italic text-brand-beige-deep">{generated.displayName}</span> to celebrate our special day with us.
                </p>
              </div>

              <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                <p className="text-xs text-stone-500 mb-2 uppercase tracking-[0.15em]">Generated Link</p>
                <a href={generated.link} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-beige-deep break-all underline">
                  {generated.link}
                </a>
              </div>

              <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                <p className="text-xs text-stone-500 mb-2 uppercase tracking-[0.15em]">WhatsApp Message Preview</p>
                <pre className="whitespace-pre-wrap break-words font-sans text-sm text-stone-700 leading-relaxed">{generated.message}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-stone-800 text-white text-sm px-5 py-3 rounded-full shadow-lg">
          <CheckCircle className="w-4 h-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
