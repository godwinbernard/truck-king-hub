import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Use | Truck King Hub',
    description:
      'Terms of Use for Truck King Hub. By accessing this site you agree to these terms, including our intellectual property policy, disclaimer, and governing law.',
  };
}

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-4">
    <span
      style={{
        background: '#F5C518',
        width: 4,
        height: 28,
        display: 'inline-block',
        borderRadius: 2,
        flexShrink: 0,
      }}
    />
    <h2
      className="text-xl font-bold uppercase"
      style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
    >
      {children}
    </h2>
  </div>
);

export default function TermsPage() {
  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl sm:text-5xl mb-4 uppercase"
            style={{ fontFamily: 'Impact, sans-serif', color: '#F5C518' }}
          >
            Terms of Use
          </h1>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Effective Date: June 1, 2025 &nbsp;|&nbsp; Last Updated: June 1, 2025
          </p>
          <p className="mt-4 leading-relaxed" style={{ color: '#d1d5db' }}>
            These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of{' '}
            <span style={{ color: '#F5C518' }}>truckkinghub.com</span> (the &ldquo;Site&rdquo;), operated by Truck
            King Hub (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). Please read these Terms carefully
            before using the Site.
          </p>
        </div>

        <div className="space-y-12">

          {/* 1. Acceptance */}
          <section>
            <SectionHeading>1. Acceptance of Terms</SectionHeading>
            <p className="leading-relaxed mb-3" style={{ color: '#d1d5db' }}>
              By accessing or using the Site, you agree to be bound by these Terms. If you do not agree to these Terms,
              you must not access or use the Site. Your continued use of the Site following the posting of any changes
              to these Terms constitutes your acceptance of those changes.
            </p>
            <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
              These Terms apply to all visitors, readers, and any other users of the Site.
            </p>
          </section>

          {/* 2. Informational Only */}
          <section>
            <SectionHeading>2. Content Is Informational Only</SectionHeading>
            <div
              className="rounded-lg p-5 mb-4"
              style={{ background: '#1a1a1a', border: '1px solid #F5C518' }}
            >
              <p className="text-sm leading-relaxed font-semibold" style={{ color: '#F5C518' }}>
                Important Disclaimer: All content published on Truck King Hub is for general informational and
                educational purposes only. Nothing on this Site constitutes legal advice, financial advice, tax
                advice, insurance advice, or professional consulting of any kind.
              </p>
            </div>
            <p className="leading-relaxed mb-3" style={{ color: '#d1d5db' }}>
              While we strive to keep our content accurate, complete, and current, we make no representations or
              warranties about the accuracy, reliability, completeness, or timeliness of any content on the Site.
              Trucking regulations, insurance requirements, and freight market conditions change frequently. Always
              verify information with qualified professionals or primary sources (such as the FMCSA, your attorney,
              or a licensed insurance broker) before making business or compliance decisions.
            </p>
            <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
              Reliance on any information published on this Site is solely at your own risk.
            </p>
          </section>

          {/* 3. Intellectual Property */}
          <section>
            <SectionHeading>3. Intellectual Property</SectionHeading>
            <p className="leading-relaxed mb-3" style={{ color: '#d1d5db' }}>
              All original content on the Site — including but not limited to articles, guides, analysis, graphics,
              logos, and page layouts — is the intellectual property of Truck King Hub and is protected by United
              States copyright law and applicable international treaties.
            </p>
            <p className="leading-relaxed mb-3" style={{ color: '#d1d5db' }}>
              You are permitted to:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                'Read and access content on the Site for personal, non-commercial use.',
                'Share links to pages on this Site.',
                'Quote brief excerpts (no more than 150 words) with clear attribution and a hyperlink back to the original article.',
              ].map((item) => (
                <li key={item.slice(0, 25)} className="flex gap-3 text-sm" style={{ color: '#d1d5db' }}>
                  <span style={{ color: '#F5C518', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="leading-relaxed mb-3" style={{ color: '#d1d5db' }}>
              You are NOT permitted to:
            </p>
            <ul className="space-y-2">
              {[
                'Reproduce, copy, publish, or republish full articles or substantial portions without written permission.',
                'Scrape, crawl, or systematically harvest content from the Site for any purpose.',
                'Use our content or trademarks in a way that implies endorsement or affiliation with Truck King Hub.',
                'Sell, license, or otherwise commercially exploit any content from this Site.',
              ].map((item) => (
                <li key={item.slice(0, 25)} className="flex gap-3 text-sm" style={{ color: '#d1d5db' }}>
                  <span style={{ color: '#ef4444', flexShrink: 0 }}>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 4. User Conduct */}
          <section>
            <SectionHeading>4. User Conduct</SectionHeading>
            <p className="leading-relaxed mb-3" style={{ color: '#d1d5db' }}>
              You agree not to use the Site for any unlawful purpose or in any manner that could damage, disable,
              overburden, or impair the Site. Prohibited conduct includes:
            </p>
            <ul className="space-y-2">
              {[
                'Attempting to gain unauthorized access to any portion of the Site or related systems.',
                'Transmitting viruses, malware, or other harmful code.',
                'Using automated tools (bots, scrapers, crawlers) to extract content or data.',
                'Misrepresenting your identity or affiliation in communications with us.',
                'Engaging in any activity that interferes with the normal operation of the Site.',
              ].map((item) => (
                <li key={item.slice(0, 25)} className="flex gap-3 text-sm" style={{ color: '#d1d5db' }}>
                  <span style={{ color: '#F5C518', flexShrink: 0 }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5. Third-Party Links */}
          <section>
            <SectionHeading>5. Third-Party Links</SectionHeading>
            <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
              The Site contains links to external websites operated by third parties, including government agencies,
              industry organizations, and commercial services. These links are provided for informational convenience
              only. We do not control those sites, do not endorse their content, and are not responsible for their
              accuracy, privacy practices, or terms of service. Visiting third-party sites is at your own risk and
              subject to those sites&apos; own terms and policies.
            </p>
          </section>

          {/* 6. DMCA */}
          <section>
            <SectionHeading>6. DMCA & Copyright Takedown</SectionHeading>
            <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
              We respect intellectual property rights. If you believe that content on this Site infringes your
              copyright, please submit a takedown request in accordance with the Digital Millennium Copyright Act (DMCA).
              Your request must include:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                'A description of the copyrighted work you claim has been infringed.',
                'The specific URL(s) on our Site where the allegedly infringing material appears.',
                'Your contact information (name, address, telephone number, and email address).',
                'A statement that you have a good faith belief that the use is not authorized.',
                'A statement that the information in your notice is accurate and, under penalty of perjury, that you are the copyright owner or authorized to act on the owner\'s behalf.',
                'Your electronic or physical signature.',
              ].map((item) => (
                <li key={item.slice(0, 25)} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
                  <span style={{ color: '#F5C518', flexShrink: 0, marginTop: 2 }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
              Submit takedown requests via our{' '}
              <Link href="/contact/takedown" style={{ color: '#F5C518', textDecoration: 'underline' }}>
                DMCA Takedown page
              </Link>{' '}
              or email{' '}
              <a href="mailto:info@truckkinghub.com" style={{ color: '#F5C518', textDecoration: 'underline' }}>
                info@truckkinghub.com
              </a>
              . We will review and respond to valid DMCA notices promptly.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <SectionHeading>7. Limitation of Liability</SectionHeading>
            <p className="leading-relaxed mb-3" style={{ color: '#d1d5db' }}>
              To the fullest extent permitted by applicable law, Truck King Hub and its operators, contributors,
              editors, and affiliates shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages arising from:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                'Your use of or inability to use the Site.',
                'Any errors or inaccuracies in the content published on the Site.',
                'Reliance on any information provided on the Site for legal, financial, insurance, or compliance decisions.',
                'Unauthorized access to or alteration of your transmissions or data.',
                'Any conduct of third parties on or through the Site.',
              ].map((item) => (
                <li key={item.slice(0, 25)} className="flex gap-3 text-sm" style={{ color: '#d1d5db' }}>
                  <span style={{ color: '#F5C518', flexShrink: 0 }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
              Our total liability to you for any claim arising from your use of the Site shall not exceed USD $100.00.
              Some jurisdictions do not allow limitation of liability for certain types of damages; in such
              jurisdictions, our liability is limited to the fullest extent permitted by law.
            </p>
          </section>

          {/* 8. Governing Law */}
          <section>
            <SectionHeading>8. Governing Law & Dispute Resolution</SectionHeading>
            <p className="leading-relaxed mb-3" style={{ color: '#d1d5db' }}>
              These Terms shall be governed by and construed in accordance with the laws of the{' '}
              <strong style={{ color: '#ffffff' }}>State of Texas</strong>, without regard to its conflict of law
              provisions.
            </p>
            <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
              Any disputes arising out of or relating to these Terms or your use of the Site shall be resolved
              exclusively in the state or federal courts located in Texas, and you consent to the personal
              jurisdiction of those courts. You waive any right to a jury trial in connection with any dispute
              arising from these Terms.
            </p>
          </section>

          {/* 9. Modifications */}
          <section>
            <SectionHeading>9. Modifications to These Terms</SectionHeading>
            <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
              We reserve the right to modify these Terms at any time. When we make changes, we will update the
              &ldquo;Last Updated&rdquo; date at the top of this page. It is your responsibility to check these
              Terms periodically. Continued use of the Site after any modification constitutes your binding acceptance
              of the updated Terms.
            </p>
          </section>

          {/* 10. Contact */}
          <section>
            <SectionHeading>10. Contact</SectionHeading>
            <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
              For legal inquiries, DMCA notices, or questions about these Terms, contact us at:
            </p>
            <div
              className="rounded-lg p-6"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
            >
              <p className="font-bold mb-1" style={{ color: '#ffffff' }}>Truck King Hub — Legal</p>
              <p className="text-sm mb-1" style={{ color: '#d1d5db' }}>
                Email:{' '}
                <a href="mailto:info@truckkinghub.com" style={{ color: '#F5C518', textDecoration: 'underline' }}>
                  info@truckkinghub.com
                </a>
              </p>
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                We aim to respond to all legal inquiries within 5 business days.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
